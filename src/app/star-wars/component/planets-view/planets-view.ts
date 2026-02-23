import { ChangeDetectionStrategy, Component, input, resource } from '@angular/core';
import { films, Person, Planet } from '../../types';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fetchResource } from '../../helpers';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';

@Component({
  selector: 'app-planets-view',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './planets-view.html',
  styleUrl: './planets-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsView {
  readonly data = input.required<Planet>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly personResourceData = {
    residents: resource({
      params: () => this.data().residents,
      loader: async ({ params }) =>
        await Promise.all(params.map((item) => fetchResource<Person>(item))),
    }),
  } as const;

  protected readonly filmResourceData = {
    films: resource({
      params: () => this.data().films,
      loader: async ({ params }) =>
        await Promise.all(params.map((item) => fetchResource<films>(item))),
    }),
  } as const;
}
