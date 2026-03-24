import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { CalendarEventInsertModel } from '../../pages/events-insert-page/events-insert-page';

@Component({
  selector: 'app-events-field-tree',
  imports: [FormField],
  templateUrl: './events-field-tree.html',
  styleUrl: './events-field-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsFieldTree {
  readonly fieldTree = input.required<FieldTree<CalendarEventInsertModel>>();
}
