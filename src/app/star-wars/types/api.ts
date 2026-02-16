export interface ResourceItem {
  readonly created: string;
  readonly edited: string;
  readonly url: string;
}

export interface ResultsList<T> {
  readonly count: number;
  readonly previous: string | null;
  readonly next: string | null;
  readonly results: readonly T[];
}

export interface ResultsListParams {
  readonly search?: string;
  readonly page?: string;
}

export interface Person extends ResourceItem {
  readonly name: string; // The name of this person.
  readonly birth_year: string; // The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is a battle that occurs at the end of Star Wars episode IV: A New Hope.
  readonly eye_color: string; // The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.
  readonly gender: string; // The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.
  readonly hair_color: string; // The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.
  readonly height: string; // The height of the person in centimeters.
  readonly mass: string; // The mass of the person in kilograms.
  readonly skin_color: string; // The skin color of this person.
  readonly homeworld: string; // The URL of a planet resource, a planet that this person was born on or inhabits.
  readonly films: readonly string[]; // An array of film resource URLs that this person has been in.
  readonly species: readonly string[]; // An array of species resource URLs that this person belongs to.
  readonly starships: readonly string[]; // An array of starship resource URLs that this person has piloted.
  readonly vehicles: readonly string[]; // An array of vehicle resource URLs that this person has piloted.
}

// export interface films extends ResourceItem {
//   title: string; // The title of this film
//   episode_id: number; // The episode number of this film.
//   opening_crawl: string; // The opening paragraphs at the beginning of this film.
//   director: string; // The name of the director of this film.
//   producer: string; // The name(s) of the producer(s) of this film. Comma separated.
//   release_date: string; // The ISO 8601 date format of film release at original creator country.
//   species: array; // An array of species resource URLs that are in this film.
//   starships: array; // An array of starship resource URLs that are in this film.
//   vehicles: array; // An array of vehicle resource URLs that are in this film.
//   characters: array; // An array of people resource URLs that are in this film.
//   planets: array; // An array of planet resource URLs that are in this film.
// }
