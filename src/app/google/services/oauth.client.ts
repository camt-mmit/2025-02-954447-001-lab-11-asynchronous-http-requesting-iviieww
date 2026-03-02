import {
  APP_ID,
  computed,
  inject,
  Injectable,
  resource,
  ResourceRef,
  signal,
  untracked,
} from '@angular/core';
import { AccessTokenData, AuthorizationHeaders, OAUTH_CONFIGULATION } from '../types/services';
import { arrayBufferToBase64, randomString, sha256 } from '../helpers/encryption';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const KEY_PREFIX = 'oauth';

const defaultCodeVerifierLenght = 64;
const stateCodeLenght = 16;
const stateTtl = 10 * 60 * 1_000;
const latency = 10;

interface AccessTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
  readonly id_token: string;
  readonly refresh_token: string;
  readonly scope: string;
  readonly token_type: string;
}

interface StateData {
  readonly expireAt: number;
  readonly data: {
    readonly codeVerifier: string;
    readonly intentedUrl: string;
  };
}

interface StoredAccessTokenData {
  readonly expireAt: number;
  readonly data: AccessTokenData;
}

@Injectable({
  providedIn: 'root',
})
export class OauthClient {
  private config = inject(OAUTH_CONFIGULATION);

  private keyPrefix = `${inject(APP_ID)}-${KEY_PREFIX}-${this.config.id}`;

  private stateKey(statCode: string) {
    return `${this.keyPrefix}-state-${statCode}` as const;
  }

  // --------------------- state Storage ---------------------
  private storeState(stateCode: string, data: StateData['data']): void {
    localStorage.setItem(
      this.stateKey(stateCode),
      JSON.stringify({
        expireAt: new Date().getTime() + stateTtl,
        data,
      } satisfies StateData),
    );
  }

  private getState(stateCode: string): StateData['data'] | null {
    const statePrefix = this.stateKey('');
    const now = new Date().getTime();

    Array.from({ length: localStorage.length })
      .map((_, i) => localStorage.key(i))
      .filter((key): key is string => key?.startsWith(statePrefix) ?? false)
      .forEach((key) => {
        const item =
          (JSON.parse(localStorage.getItem(this.stateKey(stateCode)) ?? 'null') as StateData) ||
          null;

        if (item !== null) {
          if (item?.expireAt < now) {
            localStorage.removeItem(key);
          }
        }
      });

    const result =
      (JSON.parse(localStorage.getItem(this.stateKey(stateCode)) ?? 'null') as StateData) || null;

    return result?.data || null;
  }

  private removeState(stateCode: string): void {
    localStorage.removeItem(this.stateKey(stateCode));
  }

  // --------------------- END ---------------------

  // --------------------- AccessTokenData Storage ---------------------

  private readonly accessTokenDataKey = `${this.keyPrefix}-access_token_data` as const;

  private storeAccessTokenData(data: AccessTokenData): void {
    localStorage.setItem(
      this.accessTokenDataKey,
      JSON.stringify({
        expireAt: new Date().getTime() + (data.expiresIn + 1_000 - latency),
        data,
      } satisfies StoredAccessTokenData),
    );
  }

  private getAccessTokenData(): AccessTokenData | null {
    const stordAccessTokenData: StoredAccessTokenData = JSON.parse(
      localStorage.getItem(this.accessTokenDataKey) ?? 'null',
    );

    if (stordAccessTokenData === null) {
      return null;
    }

    if (stordAccessTokenData.expireAt < new Date().getTime()) {
      localStorage.removeItem(this.accessTokenDataKey);
      return null;
    }

    return stordAccessTokenData.data;
  }

  private removeAccessTokenData(): void {
    localStorage.removeItem(this.accessTokenDataKey);
  }

  // --------------------- END ---------------------

  // --------------------- refreshToken Storage ---------------------
  private readonly refreshTokenKey = `${this.keyPrefix}-refresh_token` as const;

  private storeRefreshToken(data: string): void {
    localStorage.setItem(this.refreshTokenKey, data);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.accessTokenDataKey);
  }

  private removeRefreshToken() {
    localStorage.removeItem(this.accessTokenDataKey);
  }

  // --------------------- END ---------------------

  private readonly router = inject(Router);

  async getAithorizationCodeUrl(
    scope: readonly string[],
    params: Readonly<Record<string, string>> = {},
  ): Promise<URL> {
    const url = new URL(this.config.authorizationUrl);

    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    const codeVerifier = randomString(this.config.codeVerifierLenght ?? defaultCodeVerifierLenght);
    const codeChallenge = arrayBufferToBase64(await sha256(codeVerifier), true);

    url.searchParams.set('client_id', this.config.id);
    url.searchParams.set('redirect_uri', this.config.redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scope.join(' '));
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');

    const statCode = randomString(stateCodeLenght);
    url.searchParams.set('state', statCode);

    this.storeState(statCode, {
      codeVerifier,
      intentedUrl: this.router.url,
    });

    return url;
  }

  private readonly http = inject(HttpClient);

  private async requestToken(formData: FormData): Promise<AccessTokenData> {
    const res = await firstValueFrom(
      this.http.post<AccessTokenResponse>(this.config.tokenUrl, formData),
    );

    const accessTokenData = {
      accessToken: res.access_token,
      tokenType: res.token_type,
      scope: res.scope,
      expiresIn: res.expires_in,
    } satisfies AccessTokenData;

    return accessTokenData;
  }

  async exchangeAuthorizationCode(code: string, stateCode: string): Promise<StateData['data']> {
    const state = this.getState(stateCode);

    if (state === null) {
      throw new Error(`state ${stateCode} not found`);
    }

    const formData = new FormData();

    formData.set('client_id', this.config.id);
    if (typeof this.config.secret !== 'undefined') {
      formData.set('client_secret', this.config.secret);
    }
    formData.set('code', code);
    formData.set('code_verifier', state.codeVerifier);
    formData.set('grant_type', 'authorization_code');
    formData.set('redirect_uri', this.config.redirectUri);

    await this.requestToken(formData);

    return state;
  }

  readonly #accessTokenData = signal<AccessTokenData | null>(null, {
    equal: (oldValue, newValue) => oldValue?.accessToken === newValue?.accessToken,
  });

  private updateAccessTokenData(data: AccessTokenData | null): AccessTokenData | null {
    return untracked(() => {
      this.#accessTokenData.set(data);

      return data;
    });
  }

  private readonly lockKey = `${this.keyPrefix}-lock` as const;

  async getAccessToken(): Promise<AccessTokenData | null> {
    return await navigator.locks.request(this.lockKey, async () => {
      const accessTokenData = this.getAccessTokenData();

      if (accessTokenData === null) {
        const refreshToken = this.getRefreshToken();

        if (refreshToken !== null) {
          const formData = new FormData();

          formData.set('client_id', this.config.id);
          if (typeof this.config.secret !== 'undefined') {
            formData.set('client_secret', this.config.secret);
          }
          formData.set('grant_type', 'refresh_token');
          formData.set('refresh_token', refreshToken);

          return this.updateAccessTokenData(await this.requestToken(formData));
        } else {
          return this.updateAccessTokenData(null);
        }
      } else {
        return this.updateAccessTokenData(accessTokenData);
      }
    });
  }

  async getAuthorizationHeaders(): Promise<AuthorizationHeaders> {
    const accessTokenData = await this.getAccessToken();

    if (accessTokenData === null) {
      throw new Error(`access token not found`);
    }

    return {
      Authorization: `${accessTokenData?.tokenType} ${accessTokenData?.accessToken}`,
    };
  }

  async clearToken(): Promise<void> {
    this.removeAccessTokenData();
    this.removeRefreshToken();
  }

  accessTokenDataResource(): ResourceRef<AccessTokenData | undefined> {
    return resource({
      stream: async () => {
        await this.getAccessToken();

        return computed(() => {
          const accessTokenData = this.#accessTokenData();

          if (accessTokenData !== null) {
            return { value: accessTokenData };
          } else {
            return { error: new Error(`access token not found`) };
          }
        });
      },
    });
  }
}
