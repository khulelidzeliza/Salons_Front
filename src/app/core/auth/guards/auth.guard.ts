import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AuthTokenService } from '../../../shared/services/auth-token.service';
import { Store } from '@ngxs/store';
import { filter, map, switchMap, take } from 'rxjs';
import { UserSelectors } from '../../../store/user-state/user.selector';


export const authGuard: CanActivateFn = (route, state) => {
   const store = inject(Store);
  const router = inject(Router);
  const tokenService = inject(AuthTokenService);

  const tokens = tokenService.getTokens();
  
  const authState = store.selectSnapshot(UserSelectors.getUser);
  
  const isAuth = store.selectSnapshot(UserSelectors.isAuthorized);

  if (!tokens.access_token) {
    router.navigate(['/auth/login']);
    return false;
  }

  return store.select(UserSelectors.isLoading).pipe(
    filter(isLoading => !isLoading),
    take(1),
    switchMap(() => store.select(UserSelectors.isAuthorized).pipe(take(1))),
    map((isAuthorized) => {
      if (isAuthorized) {
        return true;
      }
      
      router.navigate(['/auth/login']);
      return false;
    })
  );
};
