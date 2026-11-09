import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';

import { UserSelectors } from '../../../../../store/user-state/user.selector'; // same path as in register
import { ForgetPassword } from '../../../../../store/user-state/user.actions';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export default class ForgotPasswordComponent {
  readonly backToLogin = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(UserSelectors.isLoading);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isInvalid(): boolean {
    const c = this.form.controls.email;
    return c.invalid && (c.touched || c.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.getRawValue();

    this.store.dispatch(new ForgetPassword({ email })).subscribe({
      next: () => {
        this.form.reset();
        this.backToLogin.emit();
      },
    });
  }
}