import { inject, Injectable, ResourceRef } from '@angular/core';
import { OauthClient } from './oauth.client';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, firstValueFrom, switchMap } from 'rxjs';
import {
  CreateContactRequest,
  ListConnectionsResponse,
  PersonResource,
} from '../types/google/people';

const baseUrl = 'https://people.googleapis.com/v1';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly client = inject(OauthClient);
  private readonly http = inject(HttpClient);

  connectionsResource(): ResourceRef<ListConnectionsResponse | undefined> {
    return rxResource({
      stream: () => {
        return defer(async () => await this.client.getAuthorizationHeaders()).pipe(
          switchMap((headers) =>
            this.http.get<ListConnectionsResponse>(`${baseUrl}/people/me/connections`, {
              headers: { ...headers },
              params: {
                personFields: 'names,emailAddresses,phoneNumbers',
                sortOrder: 'FIRST_NAME_ASCENDING',
              },
            }),
          ),
        );
      },
    });
  }

  createContact(body: CreateContactRequest): Promise<PersonResource> {
    return firstValueFrom(
      defer(async () => await this.client.getAuthorizationHeaders()).pipe(
        switchMap((headers) =>
          this.http.post<PersonResource>(`${baseUrl}/people:createContact`, body, {
            headers: { ...headers },
          }),
        ),
      ),
    );
  }
}
