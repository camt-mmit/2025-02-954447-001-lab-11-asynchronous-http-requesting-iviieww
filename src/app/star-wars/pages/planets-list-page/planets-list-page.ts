import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { ResultsListParams } from '../../types';
import { Router, RouterLink } from '@angular/router';
import { planetsListResource, purnEmptyProperties } from '../../helpers';
import { disabled, form, FormField, submit } from '@angular/forms/signals';
import { DecimalPipe } from '@angular/common';
import { PlanetsList } from '../../component/planets-list/planets-list';

@Component({
  selector: 'app-planets-list-page',
  imports: [FormField, DecimalPipe, RouterLink, PlanetsList],
  templateUrl: './planets-list-page.html',
  styleUrl: './planets-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsListPage {
  readonly search = input<string>();
  readonly page = input<string>();
  private readonly params = computed<Required<ResultsListParams>>(() => ({
    search: this.search() ?? '',
    page: this.page() ?? '',
  }));

  protected readonly currentPage = computed(() => Number(this.page() ?? 1));

  protected readonly previousPage = computed(() => {
    if (this.resource.hasValue()) {
      const urlText = this.resource.value().previous;

      if (urlText === null) {
        return null;
      }

      const url = new URL(urlText);
      return url.searchParams.get('page');
    } else {
      return null;
    }
  });

  protected readonly nextPage = computed(() =>
    this.resource.hasValue() && this.resource.value().next
      ? new URL(this.resource.value().next!).searchParams.get('page')
      : null,
  );
  private readonly router = inject(Router);

  protected readonly resource = planetsListResource(() => purnEmptyProperties(this.params()));
  protected readonly form = form(
    linkedSignal(() => ({ search: this.search() ?? '' })),
    (path) => {
      disabled(path, () => this.resource.isLoading());
    },
  );

  protected onSearch(): void {
    submit(
      this.form,
      async (form) =>
        void this.router.navigate([], {
          queryParams: purnEmptyProperties(form().value()),
          replaceUrl: true,
        }),
    );
  }

  protected clearSearch(): void {
    this.form.search().value.set('');
    this.onSearch();
  }
}
