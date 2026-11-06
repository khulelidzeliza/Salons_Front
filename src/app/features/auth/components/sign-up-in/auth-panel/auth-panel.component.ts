import { TranslatePipe } from '@ngx-translate/core';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import LoginComponent from '../login/login.component';
import RegisterComponent from '../register/register.component';
import ForgotPasswordComponent from '../forgot-password/forgot-password.component';

type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [TranslatePipe, LoginComponent, RegisterComponent,ForgotPasswordComponent],
  templateUrl: './auth-panel.component.html',
  styleUrl: './auth-panel.component.scss',
})
export default class AuthPanelComponent {
  readonly activeTab = signal<AuthTab>('login');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly showForgot = signal(false);
  
  select(tab: AuthTab): void {
    this.activeTab.set(tab);
  }
  
  @ViewChild('overlay') overlay!: ElementRef<HTMLElement>;
openForgot(event: MouseEvent): void {
  const card = this.host.nativeElement.querySelector('.auth-card')!.getBoundingClientRect();
  const btn = (event.currentTarget as HTMLElement).getBoundingClientRect();

  const x = btn.left + btn.width / 2 - card.left;
  const y = btn.top + btn.height / 2 - card.top;

  const el = this.overlay.nativeElement;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);

  this.showForgot.set(true);
}

closeForgot(): void {
  this.showForgot.set(false);
}
}






