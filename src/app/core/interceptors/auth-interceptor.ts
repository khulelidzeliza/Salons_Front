import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenService } from '../../shared/services/auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authTokenService = inject(AuthTokenService);
  const tokens = authTokenService.getTokens();

  if (req.url.includes('/auth/')) {
    return next(req);
  }

  if (tokens.access_token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
  }

  return next(req);
};