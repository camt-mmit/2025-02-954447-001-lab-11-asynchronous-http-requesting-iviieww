import { inject, Injectable, ResourceRef } from '@angular/core';
import { OauthClient } from './oauth.client';
import { HttpClient } from '@angular/common/http';
import {
  CalendarEvent,
  CalendarEventCreateParams,
  CalendarEventsInsertRequestBody,
  CalendarEventsListRequest,
  CalendarEventsListResponse,
} from '../types/google/calendar';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, firstValueFrom, switchMap } from 'rxjs';

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
      stream: (arg: any) => {
        const options = arg.params;
        const { calendarId, ...restParams } = options;
        return defer(async () => await this.client.getAuthorizationHeaders()).pipe(
          switchMap((headers) =>
            this.http.get<CalendarEventsListResponse>(`${baseUrl}/${calendarId}/events`, {
              headers: { ...headers },
              params: restParams as any,
            }),
          ),
        );
      },
    });
  }

  insertEvent(
    params: CalendarEventCreateParams,
    body: CalendarEventsInsertRequestBody,
  ): Promise<CalendarEvent> {
    const { calendarId, ...restParams } = params;

    return firstValueFrom(
      defer(async () => await this.client.getAuthorizationHeaders()).pipe(
        switchMap((headers) =>
          this.http.post<CalendarEvent>(`${baseUrl}/${calendarId}/events`, body, {
            headers: { ...headers },
            params: restParams as any,
          }),
        ),
      ),
    );
  }
}
