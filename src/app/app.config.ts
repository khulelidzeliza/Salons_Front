import { ApplicationConfig, inject, isDevMode, PLATFORM_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { graphqlProvider } from './core/graphql/apollo.config';
import { provideStore, Store } from '@ngxs/store';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';

import { provideAnimations } from '@angular/platform-browser/animations'; // or provideAnimationsAsync
import { catchError, of } from 'rxjs';
import { AuthTokenService } from './shared/services/auth-token.service';
import { isPlatformBrowser } from '@angular/common';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { apiInterceptor } from './core/interceptors/api-interceptor';
import { FetchUser } from './store/user-state/user.actions';
import { UserState } from './store/user-state/user.state';
import { SalonState } from './store/salon-state/salon.state';
import { ProcedureState } from './store/procedure-state/procedure-state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptor, errorInterceptor, authInterceptor])
    ),
    graphqlProvider,

     provideAppInitializer(() => {
        const platformId = inject(PLATFORM_ID);
        const store = inject(Store);
        const token = inject(AuthTokenService);

        if (!isPlatformBrowser(platformId)) return of(true);
        if (!token.getTokens().access_token) return of(true);

        return store.dispatch(new FetchUser()).pipe(catchError((err) => of(err)));
      }),

     provideStore(
      [UserState , SalonState , ProcedureState, ], 
      withNgxsReduxDevtoolsPlugin({ disabled: !isDevMode() })
    ),
  ],
};


