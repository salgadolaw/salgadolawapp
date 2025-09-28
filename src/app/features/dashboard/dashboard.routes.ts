import { Routes } from '@angular/router';

// OJO: sin ".component"
import { roleGuard } from '../../core/guards/role-guard';


export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component')
        .then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        canMatch: [roleGuard],
        loadComponent: () =>
          import('./pages/home/home.component')
            .then(m => m.HomeComponent),

      },
      {
        path:'dailymessage',
        canMatch: [roleGuard],
        loadComponent: () =>
          import('./pages/dailymessage/dailymessage.component'),
      },
      {
        path:'users',
        canMatch: [roleGuard],
        //data: { roles: ['admin'] },
        loadComponent: () =>
          import('./pages/users/users.component'),
      },

    ],
  },
  { path: '**', redirectTo: '' },
];
