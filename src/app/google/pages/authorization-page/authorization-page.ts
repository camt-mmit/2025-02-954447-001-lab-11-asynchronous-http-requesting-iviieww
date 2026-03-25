import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { OauthClient } from '../../services/oauth.client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization-page',
  imports: [],
  templateUrl: './authorization-page.html',
  styleUrl: './authorization-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPage implements OnInit {
  private readonly client = inject(OauthClient);
  readonly code = input<string>();
  readonly state = input<string>();

  readonly error = input<string>();
  readonly error_description = input<string>();
  readonly errorMessage = signal<string | undefined>(undefined);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    const code = this.code();
    const state = this.state();
    const error = this.error();
    const error_description = this.error_description();

    if (typeof error !== 'undefined') {
      this.errorMessage.set(`${error}: ${error_description ?? error}`);
      return;
    }

    if (typeof code === 'undefined' || typeof state === 'undefined') {
      this.errorMessage.set(`bad_response: no 'code' or 'state'`);
      return;
    }

    const stateData = await this.client.exchangeAuthorizationCode(code, state);
    this.router.navigateByUrl(stateData.intentedUrl, {
      replaceUrl: true,
    });
  }
}
