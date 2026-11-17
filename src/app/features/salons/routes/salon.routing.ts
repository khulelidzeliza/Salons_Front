import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../hero-page/hero-page.component')
      // import('../salon-page/salon-page/salon-page.component')
  }
];