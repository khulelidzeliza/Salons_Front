import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SoonerService } from '../../../../../shared/services/sooner.service';
import { AuthService } from '../../../services/auth.service';

type View = 'form' | 'done' | 'expired';
type ConfirmState = 'none' | 'match' | 'error';

const STRENGTH_KEYS = ['tooShort', 'weak', 'okay', 'good', 'strong'];

/** Reads the (unencrypted) JWT payload — only for showing the email and checking expiry. The server still validates the token. */
function readJwt(token: string): { email?: string; exp?: number } | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export default class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly sooner = inject(SoonerService);

  // Link from the email: /auth/reset-password/<jwt>  (also accepts ?token=...&email=...)
  private readonly snap = this.route.snapshot;
  readonly token = this.snap.paramMap.get('token') ?? this.snap.queryParamMap.get('token') ?? '';
  private readonly claims = readJwt(this.token);
  readonly email = this.snap.queryParamMap.get('email') ?? this.claims?.email ?? '';
  private readonly linkExpired = !!this.claims?.exp && this.claims.exp * 1000 < Date.now();

  readonly view = signal<View>(this.token && !this.linkExpired ? 'form' : 'expired');
  readonly loading = signal(false);
  readonly show = signal(false);
  readonly submitted = signal(false);
  readonly linkSent = signal(false);
  readonly bars = [1, 2, 3, 4];

  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required]],
  });

  private readonly values = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly strength = computed(() => {
    const pw = this.values().password ?? '';
    if (!pw) return { bars: 0, label: '', strong: false };
    const score = +(pw.length >= 8) + +/[A-Z]/.test(pw) + +/\d/.test(pw) + +/[^A-Za-z0-9]/.test(pw);
    const level = pw.length < 8 ? 0 : score;
    return { bars: Math.max(level, 1), label: 'auth.reset.strength.' + STRENGTH_KEYS[level], strong: level >= 3 };
  });

  readonly confirmState = computed<ConfirmState>(() => {
    const { password = '', confirmPassword = '' } = this.values();
    if (!confirmPassword) return this.submitted() ? 'error' : 'none';
    if (confirmPassword === password) return 'match';
    // Only complain while typing once it can no longer become a match
    return this.submitted() || !password.startsWith(confirmPassword) ? 'error' : 'none';
  });

  readonly confirmError = computed(() =>
    this.values().confirmPassword ? 'auth.reset.mismatch' : 'auth.reset.confirmRequired'
  );

  isInvalid(control: 'password' | 'confirmPassword'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  toggleShow(): void {
    this.show.update(v => !v);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid || this.confirmState() !== 'match' || this.loading()) return;

    this.loading.set(true);
    const { password, confirmPassword } = this.form.getRawValue();

    this.auth
      .resetPassword({ token: this.token, newPassword: password, confirmPassword })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.view.set('done');
          this.sooner.success('toast.passwordChanged');
        },
        error: (err: HttpErrorResponse) => {
          // 410 = link expired, already used, or replaced by a newer one
          if (err.status === 410 || err.status === 401) this.view.set('expired');
          // 400 (e.g. "Passwords do not match") is already shown by the error interceptor
        },
      });
  }

  resendLink(): void {
    if (!this.email) {
      this.router.navigate(['/auth/sign-in']);
      return;
    }
    if (this.loading() || this.linkSent()) return;

    this.loading.set(true);
    this.auth
      .sendPasswordReset({ email: this.email })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.linkSent.set(true);
          this.sooner.success('toast.resetLinkSent');
        },
        error: () => this.sooner.error('toast.resetFailed'),
      });
  }
}
