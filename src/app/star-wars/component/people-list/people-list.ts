import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Person } from '../../types';
import { RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';

@Component({
  selector: 'app-people-list',
  imports: [ExtractIdPipe, RouterLink],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  readonly data = input.required<readonly Person[]>();
}
