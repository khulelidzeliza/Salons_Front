import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, User, Mail, Phone, MapPin, Calendar, Shield, Cake } from 'lucide-angular';
import { UserSelectors } from '../../../store/user-state/user.selector';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, LucideAngularModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export default class UserDetailsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(UserSelectors.getUser);
  readonly editing = signal(false);

  readonly UserIcon = User;
  readonly MailIcon = Mail;
  readonly PhoneIcon = Phone;
  readonly MapPinIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly ShieldIcon = Shield;
  readonly CakeIcon = Cake;

  readonly completion = computed(() => {
    const u = this.user();
    if (!u) return 0;
    const fields = [u.userName, u.email, u.phoneNumber /*, u.city */];
    const filled = fields.filter((f) => !!f && `${f}`.trim().length).length;
    return Math.round((filled / fields.length) * 100);
  });

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],  
    age: [null as number | null, [Validators.min(1), Validators.max(120)]],
    phoneNumber: [''],
    city: [''],
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.form.patchValue(
          { name: u.userName ?? '', email: u.email ?? '', phoneNumber: u.phoneNumber ?? '' },
          { emitEvent: false }
        );
      }
      if (this.editing()) {
        this.form.enable({ emitEvent: false });
        this.form.get('email')?.disable({ emitEvent: false });
      } else {
        this.form.disable({ emitEvent: false });
      }
    });
  }

  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  startEdit(): void { this.editing.set(true); }

  cancel(): void {
    this.editing.set(false);
    const u = this.user();
    this.form.reset({ name: u?.userName ?? '', email: u?.email ?? '', phoneNumber: u?.phoneNumber ?? '' ,age: u?.age ?? null, city: u?.city ?? ''}, { emitEvent: false });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const values = this.form.getRawValue();
    // this.store.dispatch(new UpdateUser(values));
    console.log('save →', values);
    this.editing.set(false);
  }
}