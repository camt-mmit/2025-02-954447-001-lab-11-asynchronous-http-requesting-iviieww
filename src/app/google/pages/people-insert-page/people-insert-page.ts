import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PeopleService } from '../../services/people.service';
import { CreateContactRequest } from '../../types/google/people';

@Component({
  selector: 'app-people-insert-page',
  standalone: true,
  imports: [],
  template: `
    <h2>Create Contact</h2>

    <form (submit)="save($event)">
      <div>
        <label>
          Given Name*
          <input name="givenName" type="text" required />
        </label>
      </div>
      <div>
        <label>
          Family Name
          <input name="familyName" type="text" />
        </label>
      </div>
      <div>
        <label>
          Email
          <input name="email" type="email" />
        </label>
      </div>
      <div>
        <label>
          Phone
          <input name="phone" type="tel" />
        </label>
      </div>

      <div class="actions">
        <button type="submit">Save</button>
        <button type="button" (click)="cancel()">Cancel</button>
      </div>
    </form>
  `,
  styles: `
    :host { display: block; padding: 1rem; }
    form { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
    label { display: flex; flex-direction: column; gap: 0.25rem; }
    input { padding: 0.5rem; }
    .actions { display: flex; gap: 1rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleInsertPage {
  private readonly service = inject(PeopleService);

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const body: CreateContactRequest = {
      names: [{ givenName: (formData.get('givenName') as string) || '' }],
      emailAddresses: [{ value: (formData.get('email') as string) || '' }],
      phoneNumbers: [{ value: (formData.get('phone') as string) || '' }],
    };
    
    await this.service.createContact(body);
    history.back();
  }

  protected cancel(): void {
    history.back();
  }
}
