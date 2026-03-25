import { ChangeDetectionStrategy, Component, input, resource } from '@angular/core';
import { films, Person, Planet } from '../../types';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fetchResource } from '../../helpers';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';

@Component({
  selector: 'app-films-view',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './films-view.html',
  styleUrl: './films-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmsView {
  readonly data = input.required<films>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly personResourceData = {
    characters: resource({
      params: () => this.data().characters,
      loader: async ({ params }) =>
        await Promise.all(params.map((item) => fetchResource<Person>(item))),
    }),
  } as const;

  protected readonly planetResourceData = {
    planets: resource({
      params: () => this.data().planets,
      loader: async ({ params }) =>
        await Promise.all(params.map((item) => fetchResource<Planet>(item))),
    }),
  } as const;
}
