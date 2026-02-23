import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  Resource,
  resource,
} from '@angular/core';
import { films, Person, Planet } from '../../types';
import { fetchResource } from '../../helpers';
import { AsyncPipe, DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  applyEach,
  createManagedMetadataKey,
  form,
  metadata,
  FormField,
} from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';

@Component({
  selector: 'app-person-view',
  imports: [AsyncPipe, FormField, DatePipe, RouterLink, ExtractIdPipe],
  templateUrl: './person-view.html',
  styleUrl: './person-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonView {
  readonly data = input.required<Person>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly homeworld$ = computed(() => fetchResource<Planet>(this.data().homeworld));

  protected readonly homeworldResource = resource({
    params: () => this.data().homeworld,
    loader: async ({ params }) => fetchResource<Planet>(params),
  });

  protected readonly homeworldHttpResource = httpResource<Planet>(() =>
    this.data().homeworld
      ? {
          url: this.data().homeworld!,
          cache: 'force-cache',
        }
      : undefined,
  );

  protected readonly asyncData = computed(() => ({
    films$: this.data().films.map((item) => fetchResource<films>(item)),
  }));

  protected readonly resourceData = {
    films: resource({
      params: () => this.data().films,
      loader: async ({ params }) =>
        await Promise.all(params.map((item) => fetchResource<films>(item))),
    }),
  } as const;

  protected readonly filmResourceKey = createManagedMetadataKey<
    Resource<films | undefined>,
    string
  >((url) => httpResource<films>(url));

  protected readonly form = form(
    linkedSignal(
      () =>
        ({
          films: this.data().films,
        }) as const,
    ),
    (path) => {
      applyEach(path.films, (eachPath) => {
        metadata(eachPath, this.filmResourceKey, ({ value }) => value());
      });
    },
  );
}
