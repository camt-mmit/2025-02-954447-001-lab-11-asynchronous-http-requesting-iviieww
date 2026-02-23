import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { films } from '../../types';
import { RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';

@Component({
  selector: 'app-films-list',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './films-list.html',
  styleUrl: './films-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmsList {
  readonly data = input.required<readonly films[]>();
}
