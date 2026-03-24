import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { form, FormRoot } from '@angular/forms/signals';
import { EventsFieldTree } from '../../components/events-field-tree/events-field-tree';
import { CalendarEventsInsertRequestBody } from '../../types/google/calendar';

export interface CalendarEventInsertModel {
  summary: string;
  description: string;
  allDay: boolean;
  start: string;
  end: string;
}

export function toCalendarEventInsertModel(): CalendarEventInsertModel {
  return { summary: '', description: '', allDay: false, start: '', end: '' };
}

export const calendarEventInsertSchema = () => null; // Adjust based on your validation library

export function toCalendarEventInsertBody(model: CalendarEventInsertModel): any {
  return {
    summary: model.summary,
    description: model.description,
    start: model.allDay ? { date: model.start } : { dateTime: new Date(model.start).toISOString() },
    end: model.allDay ? { date: model.end } : { dateTime: new Date(model.end).toISOString() },
  };
}

@Component({
  selector: 'app-events-insert-page',
  imports: [EventsFieldTree, FormRoot],
  templateUrl: './events-insert-page.html',
  styleUrl: './events-insert-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsInsertPage {
  private readonly service = inject(CalendarService);

  protected fieldTree = form(signal(toCalendarEventInsertModel()), calendarEventInsertSchema as any, {
    submission: {
      action: async (fieldTree) => {
        await this.service.insertEvent(
          {
            calendarId: 'primary',
            sendNotifications: true,
          },
          toCalendarEventInsertBody(fieldTree().value() as any),
        );

        history.back();
      },

      onInvalid: (fieldTree) => {
        fieldTree().errorSummary()[0]?.fieldTree().focusBoundControl();
      },
    },
  });

  protected cancel(): void {
    history.back();
  }
}
