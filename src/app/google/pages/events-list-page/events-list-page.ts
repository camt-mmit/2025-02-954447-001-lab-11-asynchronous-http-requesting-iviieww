import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEventsListRequest } from '../../types/google/calendar';
import { form } from '@angular/forms/signals';

const defaultRequestParams: CalendarEventsListRequest = {
  calendarId: 'primary',
  maxResults: 25,
  singleEvents: true,
  eventTypes: ['default'],
  orderBy: 'startTime',
};

@Component({
  selector: 'app-events-list-page',
  imports: [],
  templateUrl: './events-list-page.html',
  styleUrl: './events-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListPage {
  private readonly service = inject(CalendarService);

  readonly q = input<string>();

  private readonly params = linkedSignal(() => ({
    ...defaultRequestParams,
    ...(this.q() ? { q: this.q()! } : {}),
  }));
  protected resource = this.service.eventsResource(this.params);

  protected readonly form = form(linkedSignal(() => ({ q: this.q() ?? '' }) as const));
}
