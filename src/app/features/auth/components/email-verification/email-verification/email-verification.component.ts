import { TranslatePipe } from '@ngx-translate/core';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserSelectors } from '../../../../../store/user-state/user.selector';
import { ResendVerificationCode, VerifyEmail } from '../../../../../store/user-state/user.actions';


@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export default class EmailVerificationComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  @ViewChildren('codeInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly email = signal<string>('');
  readonly digits = signal<string[]>(['', '', '', '', '', '']);

  readonly loading = this.store.selectSignal(UserSelectors.isLoading);


  readonly code = computed(() => this.digits().join(''));
  readonly canSubmit = computed(() => this.code().length === 6);

  readonly secondsLeft = signal(30);
  readonly countdownLabel = computed(() => {
    const s = this.secondsLeft();
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  });

  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.email.set(this.route.snapshot.queryParamMap.get('email') ?? '');

    if (!this.email()) {
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  // ---- countdown ----------------------------------------------------------

  private startCountdown(): void {
    this.secondsLeft.set(30);
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      const n = this.secondsLeft() - 1;
      this.secondsLeft.set(n);
      if (n <= 0 && this.timer) clearInterval(this.timer);
    }, 1000);
  }

  // ---- code inputs --------------------------------------------------------

  onInput(event: Event, index: number): void {
    const el = event.target as HTMLInputElement;
    const value = el.value.replace(/\D/g, '');
    const next = [...this.digits()];
    next[index] = value.slice(-1) ?? '';
    this.digits.set(next);
    el.value = next[index];

    if (value && index < 5) {
      this.focusInput(index + 1);
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      this.focusInput(index - 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!text) return;

    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    this.digits.set(next);
    this.inputs.forEach((ref, i) => (ref.nativeElement.value = next[i] ?? ''));
    this.focusInput(Math.min(text.length, 5));
  }

  private focusInput(index: number): void {
    const el = this.inputs.get(index)?.nativeElement;
    el?.focus();
    el?.select();
  }

  // ---- submit / verify ----------------------------------------------------

  onSubmit(): void {
    const code = this.code();
    if (code.length !== 6) return;

    this.store.dispatch(new VerifyEmail({ email: this.email(), code }));
  }

  resend(): void {
    if (this.secondsLeft() > 0) return;

    this.store.dispatch(new ResendVerificationCode({ email: this.email() }));
    this.startCountdown();
  }

  // ---- navigation ---------------------------------------------------------

  onChangeEmail(): void {
    this.router.navigate(['/auth/sign-in']);
  }
}