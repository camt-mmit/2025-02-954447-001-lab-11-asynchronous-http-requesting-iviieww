import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PersonResource } from '../../types/google/people';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [],
  template: `
    <ul>
      @for (item of items(); track item.resourceName) {
        <li>
          <div class="person-info">
            <strong>{{ item.names?.[0]?.displayName || 'No Name' }}</strong>
            @if (item.emailAddresses?.[0]; as email) {
              <div class="email">{{ email.value }}</div>
            }
            @if (item.phoneNumbers?.[0]; as phone) {
              <div class="phone">{{ phone.value }}</div>
            }
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    ul { list-style: none; padding: 0; }
    li { padding: 0.5rem; border-bottom: 1px solid #ccc; }
    .person-info { display: flex; flex-direction: column; }
    .email, .phone { font-size: 0.9rem; color: #666; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  readonly items = input.required<readonly PersonResource[]>();
}
