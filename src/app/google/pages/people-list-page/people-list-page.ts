import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PeopleService } from '../../services/people.service';
import { Router, RouterLink } from '@angular/router';
import { PeopleList } from '../../components/people-list/people-list';

@Component({
  selector: 'app-people-list-page',
  standalone: true,
  imports: [RouterLink, PeopleList],
  template: `
    <div>
      <a routerLink="insert">Create Contact</a>
    </div>

    <div>
      <input type="text" [value]="q() ?? ''" (input)="updateSearch($any($event).target.value)" placeholder="Search contacts..." />
    </div>

    @if (resource.hasValue()) {
      @if (filteredItems(); as items) {
        @if (items.length > 0) {
          <app-people-list [items]="items"></app-people-list>
        } @else {
          <p>No contacts found.</p>
        }
      }
    } @else if (resource.error(); as error) {
      <p>Error loading contacts.</p>
    } @else if (resource.isLoading()) {
      <p>Loading contacts...</p>
    }
  `,
  styles: `
    :host { display: block; padding: 1rem; }
    input { width: 100%; padding: 0.5rem; margin: 1rem 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleListPage {
  private readonly service = inject(PeopleService);
  private readonly router = inject(Router);

  readonly q = input<string>('');

  protected readonly resource = this.service.connectionsResource();

  protected readonly filteredItems = computed(() => {
    const connections = this.resource.value()?.connections ?? [];
    const searchTerm = this.q()?.toLowerCase() ?? '';
    if (!searchTerm) {
      return connections;
    }
    return connections.filter((person) => {
      const name = person.names?.[0]?.displayName?.toLowerCase() || '';
      const email =
        person.emailAddresses?.some((e) => e.value?.toLowerCase()?.includes(searchTerm)) || false;
      const phone =
        person.phoneNumbers?.some((p) => p.value?.toLowerCase()?.includes(searchTerm)) || false;
      return name.includes(searchTerm) || email || phone;
    });
  });

  protected updateSearch(q: string): void {
    this.router.navigate([], { queryParams: { q }, replaceUrl: true });
  }
}
