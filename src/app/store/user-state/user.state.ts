import { Action, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { FetchUser, LoginUser, LogOut, RegisterUser, ResendVerificationCode, VerifyEmail } from './user.actions';
import { IUserStore } from './user.model';
import { AuthTokenService } from '../../shared/services/auth-token.service';
import { GetUserGQL } from '../../../generated/graphql';
import { AuthService } from '../../features/auth/services/auth.service';
import { SoonerService } from '../../shared/services/sooner.service';

@State<IUserStore>({
  name: 'user',
  defaults: { error: null, loading: false, user: null },
})
@Injectable({ providedIn: 'root' })
export class UserState {
  private readonly token = inject(AuthTokenService);
  private readonly getUserGql = inject(GetUserGQL);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sooner = inject(SoonerService);

  ngxsOnInit(ctx: StateContext<IUserStore>) {
    const tokens = this.token.getTokens();
    if (tokens.access_token) {
      ctx.dispatch(new FetchUser());
    }
  }

  @Action(RegisterUser)
  register(ctx: StateContext<IUserStore>, { payload }: RegisterUser) {
    ctx.patchState({ loading: true, error: null });

    return this.auth.register(payload).pipe(
      tap(() => {
        ctx.patchState({ loading: false, error: null });

        this.sooner.success('You registered successfully. Check your email :)');

        this.router.navigate(['/auth/verify-email'], {
          queryParams: { email: payload.email },
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false, error: err });
        this.sooner.error('Registration failed. Please try again.');
        return throwError(() => err);
      })
    );
  }

  @Action(LoginUser)
  login(ctx: StateContext<IUserStore>, { payload }: LoginUser) {
    ctx.patchState({ loading: true, error: null });

    return this.auth.login(payload).pipe(
      tap((res) => {
        ctx.patchState({ error: null, loading: false });

        if (res.accessToken.includes('Verification')) {
          this.sooner.warning('Your email is not verified. Check your email :)');
          this.router.navigateByUrl(`/auth/verification/${payload.email}`);
        } else {
          this.sooner.success('You logged in successfully.');
          this.token.saveTokens(res);

          ctx.dispatch(new FetchUser()).subscribe(() => {
            this.router.navigate(['/']);
          });
        }
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error,
        });

        this.sooner.error('Login failed. Please check your credentials.');
        return throwError(() => error);
      })
    );
  }

  @Action(VerifyEmail)
  verifyEmail(ctx: StateContext<IUserStore>, { payload }: VerifyEmail) {
    ctx.patchState({ loading: true, error: null });

    return this.auth.verifyEmail(payload).pipe(
      tap((res) => {
        ctx.patchState({ loading: false, error: null });

        this.sooner.success('Your email has been verified successfully');

        this.token.saveTokens(res);
        ctx.dispatch(new FetchUser());
        this.router.navigateByUrl('');
      }),
      catchError((err) => {
        ctx.patchState({ loading: false, error: err });
        
        if (err.error?.detail?.includes('already verified')) {
          this.sooner.warning('Email is already verified');
          this.router.navigateByUrl('');
        } else {
          this.sooner.error('Verification failed. Invalid or expired code.');
        }

        return throwError(() => err);
      })
    );
  }

  @Action(FetchUser)
  fetchUser(ctx: StateContext<IUserStore>) {
    ctx.patchState({ loading: true, error: null });
    return this.getUserGql.fetch().pipe(
      tap((res) => {
        const user = res.data?.me?.[0] ?? null;
        ctx.patchState({ user: user || null, loading: false, error: null });
      }),
      catchError((error) => {
        ctx.patchState({ loading: false, error, user: null });
        return throwError(() => error);
      })
    );
  }

  @Action(LogOut)
  logOut(ctx: StateContext<IUserStore>) {
    ctx.patchState({
      user: null,
      loading: false,
      error: null,
    });

    this.token.deleteTokens();
    this.sooner.success('You logged out successfully');
    this.router.navigateByUrl('/');
  }
}

  //   @Action(ResendVerificationCode)
  //   resendVerificationCode(
  //     ctx: StateContext<IUserStore>,
  //     { payload }: ResendVerificationCode
  //   ) {
  //     ctx.patchState({ loading: true, error: null });
  //     return this.auth.resendCode(payload).pipe(
  //       tap(() => {
  //         ctx.patchState({ loading: false, error: null });

  //         this.store.dispatch(
  //           new SuccessSooner('Verification code has been resent to your email')
  //         );
  //       }),
  //       catchError((err) => {
  //         ctx.patchState({ loading: false, error: err });

  //         if (err.error?.detail.includes('already verified')) {
  //           this.router.navigateByUrl('');
  //           localStorage.removeItem('verificationCountdownEnd');
  //         }

  //         return throwError(() => err);
  //       })
  //     );
  //   }

  // @Action(ForgetPassword)
  // sendPasswordReset(ctx: StateContext<IUserStore>, { payload }: ForgetPassword) {
  //   ctx.patchState({ loading: true, error: null });
  //   return this.auth.forgetPassword(payload).pipe(
  //     tap(() => {
  //       ctx.patchState({ loading: false, error: null });

  //       this.store.dispatch(new SuccessSooner('Password reset link has been sent to your email'));
  //     }),
  //     catchError((err) => {
  //       ctx.patchState({ loading: false, error: err });
  //       return throwError(() => err);
  //     })
  //   );
  // }

  // @Action(ResetPassword)
  // changePassword(ctx: StateContext<IUserStore>, { payload, token }: ResetPassword) {
  //   ctx.patchState({ loading: true, error: null });

  //   return this.auth.resetPassword(payload, token).pipe(
  //     tap(() => {
  //       ctx.patchState({ loading: false, error: null });

  //       this.store.dispatch(new SuccessSooner('Your password has been changed successfully'));

  //       this.router.navigateByUrl('/auth');
  //     }),
  //     catchError((err) => {
  //       ctx.patchState({ loading: false, error: err });
  //       return throwError(() => err);
  //     })
  //   );
  // }

