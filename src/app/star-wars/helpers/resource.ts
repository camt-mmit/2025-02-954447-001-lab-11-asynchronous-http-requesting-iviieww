import { httpResource } from '@angular/common/http';
import { Person, ResultsList, ResultsListParams } from '../types';

export async function fetchResource<T>(url: string, abortSignal?: AbortSignal | null): Promise<T>;
export async function fetchResource<T>(
  url: string | null,
  abortSignal?: AbortSignal | null,
): Promise<T | null>;
export async function fetchResource<T>(
  url: string | null,
  abortSignal: AbortSignal | null = null,
): Promise<T | null> {
  if (url === null) {
    return null;
  }
  const res = await fetch(url, { signal: abortSignal });
  return await res.json();
}
const entryPointURL = 'https://swapi.dev/api';
export function peopleListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<Person>>(() =>
    params()
      ? {
          url: `${entryPointURL}/people`,
          params: { ...params()! },
        }
      : undefined,
  );
}
export function personResource(id: () => string | undefined) {
  return httpResource<Person>(() => (id() ? `${entryPointURL}/people/${id()!}` : undefined));
}
