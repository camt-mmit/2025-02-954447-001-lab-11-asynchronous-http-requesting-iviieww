import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { PeopleInsertModel } from '../../pages/people-insert-page/people-insert-page';

@Component({
  selector: 'app-people-field-tree',
  standalone: true,
  imports: [FormField],
  templateUrl: './people-field-tree.html',
  styleUrl: './people-field-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleFieldTree {
  readonly fieldTree = input.required<FieldTree<PeopleInsertModel>>();

  readonly addEmail = output<void>();
  readonly removeEmail = output<number>();
  readonly addPhone = output<void>();
  readonly removePhone = output<number>();
}
