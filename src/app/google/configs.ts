import { isDevMode } from '@angular/core';
import { OauthConfiguration } from './types/services';

export const googleOauthConfig: OauthConfiguration = {
  id: '209689905225-dj1bo29m0c7or5926cv4bb1nu5aru0cv.apps.googleusercontent.com',
  secret: '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',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  redirectUri: isDevMode()
    ? 'http://localhost:4200/google/authorization'
    : 'https://camt-mmit.github.io/2025-02-954447-001-lab-11-asynchronous-http-requesting-iviieww/google/authorization',
};
