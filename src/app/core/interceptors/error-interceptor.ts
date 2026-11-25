import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { SoonerService } from '../../shared/services/sooner.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const sooner = inject(SoonerService);
 
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (req.method.toUpperCase() === 'GET') return throwError(() => err);

      sooner.error(err.error?.detail || 'toast.serverError', err.error?.title || 'toast.error');

      return throwError(() => err);
    })
  );
};