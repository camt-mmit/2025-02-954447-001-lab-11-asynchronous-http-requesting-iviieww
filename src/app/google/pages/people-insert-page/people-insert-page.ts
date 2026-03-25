import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PeopleService } from '../../services/people.service';
import { CreateContactRequest } from '../../types/google/people';
import { form, FormRoot, submit } from '@angular/forms/signals';
import { PeopleFieldTree } from '../../components/people-field-tree/people-field-tree';

export interface PeopleInsertModel {
  givenName: string;
  familyName: string;
  emailAddresses: { type: string; value: string }[];
  phoneNumbers: { type: string; value: string }[];
}

@Component({
  selector: 'app-people-insert-page',
  standalone: true,
  imports: [FormRoot, PeopleFieldTree],
  template: `
    <h2>Create Contact</h2>

    <form [formRoot]="form" (submit)="save($event)">
      <app-people-field-tree
        [fieldTree]="form"
        (addEmail)="addEmail()"
        (removeEmail)="removeEmail($event)"
        (addPhone)="addPhone()"
        (removePhone)="removePhone($event)"
      >
      </app-people-field-tree>

      <div class="actions">
        <button type="submit">Save</button>
        <button type="button" (click)="cancel()">Cancel</button>
      </div>
    </form>
  `,
  styles: `
    :host { display: block; padding: 1rem; }
    form { display: flex; flex-direction: column; gap: 1rem; max-width: 600px; }
    .actions { display: flex; gap: 1rem; margin-top: 1rem; }
    button[type="submit"] {
      padding: 0.5rem 1.5rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    button[type="button"] {
      padding: 0.5rem 1.5rem;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleInsertPage {
  private readonly service = inject(PeopleService);

  protected readonly model = signal<PeopleInsertModel>({
    givenName: '',
    familyName: '',
    emailAddresses: [{ type: 'home', value: '' }],
    phoneNumbers: [{ type: 'mobile', value: '' }],
  });

  protected readonly form = form(this.model);

  protected addEmail(): void {
    this.model.update((m) => ({
      ...m,
      emailAddresses: [...m.emailAddresses, { type: 'home', value: '' }],
    }));
  }

  protected removeEmail(index: number): void {
    this.model.update((m) => ({
      ...m,
      emailAddresses: m.emailAddresses.filter((_, i) => i !== index),
    }));
  }

  protected addPhone(): void {
    this.model.update((m) => ({
      ...m,
      phoneNumbers: [...m.phoneNumbers, { type: 'mobile', value: '' }],
    }));
  }

  protected removePhone(index: number): void {
    this.model.update((m) => ({
      ...m,
      phoneNumbers: m.phoneNumbers.filter((_, i) => i !== index),
    }));
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();

    submit(this.form, async (form) => {
      const value = form().value();
      const body: CreateContactRequest = {
        names: [{ givenName: value.givenName, familyName: value.familyName }],
        emailAddresses: value.emailAddresses
          .filter((e) => e.value)
          .map((e) => ({ value: e.value, type: e.type })),
        phoneNumbers: value.phoneNumbers
          .filter((p) => p.value)
          .map((p) => ({ value: p.value, type: p.type })),
      };

      await this.service.createContact(body);
      history.back();
    });
  }

  protected cancel(): void {
    history.back();
  }
}
