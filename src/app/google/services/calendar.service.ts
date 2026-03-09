import { inject, Injectable, ResourceRef } from '@angular/core';
import { OauthClient } from './oauth.client';
import { HttpClient } from '@angular/common/http';
import { CalendarEventsListRequest, CalendarEventsListResponse } from '../types/google/calendar';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, switchMap } from 'rxjs';

const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly client = inject(OauthClient);

  private readonly http = inject(HttpClient);

  eventsResource(
    params: () => CalendarEventsListRequest,
  ): ResourceRef<CalendarEventsListResponse | undefined> {
    return rxResource({
      params,
      stream: ({ params: options }) => {
        const { calendarId, ...params } = options;
        return defer(async () => await this.client.getAuthorizationHeaders()).pipe(
          switchMap((headers) =>
            this.http.get<CalendarEventsListResponse>(`${baseUrl}/${calendarId}/events`, {
              headers: { ...headers },
              params,
            }),
          ),
        );
      },
    });
  }
}
