import { httpResource } from '@angular/common/http';
import { films, Person, Planet, ResultsList, ResultsListParams } from '../types';

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
  const res = await fetch(url, { signal: abortSignal, cache: 'force-cache' });
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

export function filmListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<films>>(() =>
    params()
      ? {
          url: `${entryPointURL}/films`,
          params: { ...params()! },
        }
      : undefined,
  );
}

export function filmResource(id: () => string | undefined) {
  return httpResource<films>(() => (id() ? `${entryPointURL}/films/${id()!}` : undefined));
}

export function planetsListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<Planet>>(() =>
    params()
      ? {
          url: `${entryPointURL}/planets`,
          params: { ...params()! },
        }
      : undefined,
  );
}

export function planetsResource(id: () => string | undefined) {
  return httpResource<Planet>(() => (id() ? `${entryPointURL}/planets/${id()!}` : undefined));
}
