import { TranslatePipe } from '@ngx-translate/core';
import { Component, ElementRef, ViewChild, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';

import { ILoginRequest } from '../../../models/auth.models';
import { UserSelectors } from '../../../../../store/user-state/user.selector';
import { LoginUser } from '../../../../../store/user-state/user.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  readonly switchToRegister = output<void>();
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  readonly loading = this.store.selectSignal(UserSelectors.isLoading);
  readonly forgotRequested = output<MouseEvent>();
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(500)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    keepSignedIn: [false],
  });

  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const request: ILoginRequest = { email, password };

    this.store.dispatch(new LoginUser(request));
  }

}