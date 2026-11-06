import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';

import { IRegisterRequest, Roles } from '../../../models/auth.models';
import { UserSelectors } from '../../../../../store/user-state/user.selector';
import { RegisterUser } from '../../../../../store/user-state/user.actions';

const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent {
  readonly switchToLogin = output<void>();

  protected readonly Roles = Roles;

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(UserSelectors.isLoading);

  readonly form = this.fb.group(
    {
      userName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(500)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required]],
      role: [Roles.User, [Validators.required]],
      agree: [false, [Validators.requiredTrue]],
    },
    { validators: passwordsMatch }
  );

  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  isConfirmInvalid(): boolean {
    const c = this.form.get('confirmPassword');
    if (!c || !(c.touched || c.dirty)) return false;
    return c.invalid || this.form.hasError('passwordMismatch');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const request: IRegisterRequest = {
      userName: v.userName!,
      email: v.email!,
      password: v.password!,
      role: v.role!,
    };

    this.store.dispatch(new RegisterUser(request));
  }
}