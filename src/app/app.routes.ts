import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guards/guest.guard';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/salons/routes/salon.routing').then(m => m.CATALOG_ROUTES),
  },

  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/components/sign-up-in/sign-up-in.component'),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./features/auth/components/sign-up-in/auth-panel/auth-panel.component'),
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./features/auth/components/sign-up-in/email-verification/email-verification.component'),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/components/sign-up-in/reset-password/reset-password.component'),
      },
      {
        // Link from the email: /auth/reset-password/<jwt>
        path: 'reset-password/:token',
        loadComponent: () =>
          import('./features/auth/components/sign-up-in/reset-password/reset-password.component'),
      },
    ],
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/user-profile/user-profile.component'),
  },

  {
    path: 'salons',
    loadChildren: () =>
      import('./features/salon-detail/routes/salon-details.routing').then(m => m.SALON_DETAILS_ROUTES),
  },

  { path: '**', redirectTo: '' },
];
