import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { disabled, form, FormField, submit } from '@angular/forms/signals';
import { Person, ResultsList } from '../../types';
import { Router } from '@angular/router';
import { purnEmptyProperties } from '../../helpers';

@Component({
  selector: 'app-people-http-resource-list-page',
  imports: [FormField],
  templateUrl: './people-http-resource-list-page.html',
  styleUrl: './people-http-resource-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleHttpResourceListPage {
  readonly search = input<string>();

  protected readonly resource = httpResource<ResultsList<Person>>(() => ({
    url: 'https://swapi.dev/api/people',
    params: this.search() ? { search: this.search()! } : {},
  })).asReadonly();

  protected readonly form = form(
    linkedSignal(() => ({ search: this.search() ?? '' })),
    (path) => {
      disabled(path, () => this.resource.isLoading());
    },
  );

  private readonly router = inject(Router);
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
