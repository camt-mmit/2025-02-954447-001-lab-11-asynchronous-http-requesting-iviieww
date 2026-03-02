import { Routes } from '@angular/router';
import { AuthorizationPage } from './pages/authorization-page/authorization-page';
import { GoogleRoot } from './pages/google-root/google-root';

export default [
  {
    path: '',
    providers: [], // module services will be added here
    children: [
      { path: 'authorization', component: AuthorizationPage },
      {
        path: '',
        component: GoogleRoot,
        children: [
          // ... other google routs
        ],
      },
    ],
  },
] as Routes;
