import { InjectionToken } from '@angular/core';

export interface OauthConfiguration {
  readonly id: string;
  readonly secret?: string;
  readonly redirectUri: string;
  readonly authorizationUrl: string;
  readonly tokenUrl: string;
  readonly codeVerifierLenght?: number;
}

export const OAUTH_CONFIGULATION = new InjectionToken<OauthConfiguration>('oauth-configulation');

export interface AccessTokenData {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly tokenType: string;
  readonly scope: string;
}

export interface AuthorizationHeaders {
  readonly Authorization: string;
}
