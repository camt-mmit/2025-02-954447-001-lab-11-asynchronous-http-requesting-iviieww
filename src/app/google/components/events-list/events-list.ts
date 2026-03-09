import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CalendarEvent } from '../../types/google/calendar';

@Component({
  selector: 'app-events-list',
  imports: [],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsList {
  readonly items = input.required<readonly CalendarEvent[]>();
}
