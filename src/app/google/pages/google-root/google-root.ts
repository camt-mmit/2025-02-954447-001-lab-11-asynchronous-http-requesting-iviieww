import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OauthClient } from '../../services/oauth.client';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-google-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './google-root.html',
  styleUrl: './google-root.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleRoot {
  private readonly client = inject(OauthClient);

  protected readonly accessTokenResource = this.client.accessTokenDataResource();

  protected async login(): Promise<void> {
    const url = await this.client.getAithorizationCodeUrl(
      [
        'profile',
        'email',
        'openid',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/contacts',
      ],
      {
        prompt: 'consent',
        access_type: 'offline',
      },
    );

    location.href = `${url}`;
  }

  protected async logout(): Promise<void> {
    await this.client.clearToken();
  }
}
