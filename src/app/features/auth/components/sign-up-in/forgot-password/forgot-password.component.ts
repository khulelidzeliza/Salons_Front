import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
    console.log('Reset requested for', email);
  }
}