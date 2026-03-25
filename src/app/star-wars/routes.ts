import { Routes } from '@angular/router';
import { StarWarsRoot } from './pages/star-wars-root/star-wars-root';
import { PeopleFetchedListPage } from './pages/people-fetched-list-page/people-fetched-list-page';
import { PeopleHttpResourceListPage } from './pages/people-http-resource-list-page/people-http-resource-list-page';
import { PeopleListPage } from './pages/people-list-page/people-list-page';
import { PersonViewPage } from './pages/person-view-page/person-view-page';
import { FilmsListPage } from './pages/films-list-page/films-list-page';
import { FilmViewPage } from './pages/film-view-page/film-view-page';
import { PlanetViewPage } from './pages/planet-view-page/planet-view-page';
import { PlanetsListPage } from './pages/planets-list-page/planets-list-page';

export default [
  {
    path: '',
    component: StarWarsRoot,
    children: [
      { path: '', redirectTo: 'people-fetched', pathMatch: 'full' },

      {
        path: 'people-fetched',
        component: PeopleFetchedListPage,
      },
      {
        path: 'people-http-resource',
        component: PeopleHttpResourceListPage,
      },

      {
        path: 'people',
        children: [
          { path: '', component: PeopleListPage },
          { path: ':id', component: PersonViewPage },
        ],
      },

      {
        path: 'films',
        children: [
          { path: '', component: FilmsListPage },
          { path: ':id', component: FilmViewPage },
        ],
      },

      {
        path: 'planets',
        children: [
          { path: '', component: PlanetsListPage },
          { path: ':id', component: PlanetViewPage },
        ],
      },
    ],
  },
] as Routes;
