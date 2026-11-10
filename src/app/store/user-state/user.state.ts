import { Action, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { FetchUser, LoginUser, LogOut, RegisterUser, ResendVerificationCode, VerifyEmail, ResetPassword, ForgetPassword, UpdateUser } from './user.actions';
import { IUserStore } from './user.model';
import { GetUserGQL } from '../../../generated/graphql';
import { AuthService } from '../../features/auth/services/auth.service';
import { SoonerService } from '../../shared/services/sooner.service';
import { AuthTokenService } from '../../shared/services/auth-token.service';
import { SuccessSooner } from '../../core/services/sooner/sooner.actions';
import { UserService } from '../../features/auth/services/user.service';
import { Apollo } from 'apollo-angular';

@State<IUserStore>({
  name: 'user',
  defaults: { error: null, loading: false, user: null },
})
@Injectable({ providedIn: 'root' })
export class UserState {
  private readonly token = inject(AuthTokenService);
  private readonly getUserGql = inject(GetUserGQL);
  private readonly auth = inject(AuthService);
  private readonly user = inject(UserService);
  private readonly router = inject(Router);
  private readonly sooner = inject(SoonerService);
  private readonly apollo = inject(Apollo);

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

        this.sooner.success('toast.registerSuccess');

        this.router.navigate(['/auth/verify-email'], {
          queryParams: { email: payload.email },
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false, error: err });
        this.sooner.error('toast.registerFailed');
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
          this.sooner.warning('toast.emailNotVerified');
          this.router.navigateByUrl(`/auth/verification/${payload.email}`);
        } else {
          this.sooner.success('toast.loginSuccess');
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

        this.sooner.error('toast.loginFailed');
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

        this.sooner.success('toast.verifySuccess');

        this.token.saveTokens(res);
        ctx.dispatch(new FetchUser());
        this.router.navigateByUrl('');
      }),
      catchError((err) => {
        ctx.patchState({ loading: false, error: err });

        if (err.error?.detail?.includes('already verified')) {
          this.sooner.warning('toast.alreadyVerified');
          this.router.navigateByUrl('');
        } else {
          this.sooner.error('toast.verifyFailed');
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
    this.apollo.client.clearStore();

    this.sooner.success('toast.logoutSuccess');
    this.router.navigateByUrl('/');
  }

  @Action(ForgetPassword)
  forgetPassword(ctx: StateContext<IUserStore>, { payload }: ForgetPassword) {
    ctx.patchState({ loading: true, error: null });

    return this.auth.sendPasswordReset(payload).pipe(
      tap(() => {
        ctx.patchState({ loading: false });
        ctx.dispatch(new SuccessSooner('Password reset link has been sent to your email'));
      }),
      catchError((err) => {
        ctx.patchState({
          loading: false,
          error: err?.error?.message ?? 'Could not send reset link.',
        });
        return throwError(() => err);
      })
    );
  }
@Action(UpdateUser)
updateUser(ctx: StateContext<IUserStore>, { payload }: UpdateUser) {
  ctx.patchState({ loading: true, error: null });

  return this.user.UpdateUser(payload).pipe(
    tap(() => {
      const user = ctx.getState().user;
      ctx.patchState({
        user: user ? { ...user, ...payload } : user,
        loading: false,
      });
      ctx.dispatch(new SuccessSooner('Profile updated'));
    }),
    catchError((err) => {
      ctx.patchState({
        loading: false,
        error: err?.error?.message ?? 'Could not update profile.',
      });
      return throwError(() => err);
    })
  );
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

