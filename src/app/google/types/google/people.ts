export interface PersonName {
  givenName?: string;
  familyName?: string;
  displayName?: string;
}

export interface PersonEmail {
  value: string;
  type?: string;
}

export interface PersonPhone {
  value: string;
  type?: string;
}

export interface PersonResource {
  resourceName: string;
  etag: string;
  names?: readonly PersonName[];
  emailAddresses?: readonly PersonEmail[];
  phoneNumbers?: readonly PersonPhone[];
}

export interface ListConnectionsResponse {
  connections?: readonly PersonResource[];
  nextPageToken?: string;
  nextSyncToken?: string;
  totalPeople?: number;
  totalItems?: number;
}

export interface CreateContactRequest {
  names?: readonly PersonName[];
  emailAddresses?: readonly PersonEmail[];
  phoneNumbers?: readonly PersonPhone[];
}
