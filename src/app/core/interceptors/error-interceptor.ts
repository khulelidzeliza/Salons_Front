import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(NzNotificationService);
  const translate = inject(TranslateService);
 
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (req.method.toUpperCase() === 'GET') return throwError(() => err);

      toast.error(err.error?.title || translate.instant('toast.error'), err.error?.detail || translate.instant('toast.serverError'), {
        nzClass: 'error',
      });

      return throwError(() => err);
    })
  );
};