import { TranslatePipe } from '@ngx-translate/core';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { LucideAngularModule, Heart, User, Plus, LogOut, House } from 'lucide-angular';
import { Store } from '@ngxs/store';

import { LogOut as LogOutAction } from '../../store/user-state/user.actions';
import { AddSalonModalComponent } from '../../shared/add-salon-modal/add-salon-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { SalonType } from '../../store/salon-state/salon-modal';
import { UserSelectors } from '../../store/user-state/user.selector';
import { LanguageService } from '../../core/i18n/language.service';

const HERO_ROUTES = ['/', '/profile', '/salons'];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe, CommonModule, RouterLink, LucideAngularModule, AddSalonModalComponent, ConfirmModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private store = inject(Store);
  private router = inject(Router);
  private language = inject(LanguageService);

  readonly lang = this.language.lang;
  toggleLang(): void {
    this.language.toggle();
  }

  readonly HeartIcon = Heart;
  readonly UserIcon = User;
  readonly PlusIcon = Plus;
  readonly LogOutIcon = LogOut;
  readonly HomeIcon = House;

  readonly user = this.store.selectSignal(UserSelectors.getUser);
  readonly isOrganizer = computed(() => this.user()?.role === 'ORGANIZATOR');
  readonly initials = computed(() =>
    (this.user()?.userName ?? '')
      .split(/[._\s-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('')
  );

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );
  private readonly path = computed(() => this.url().split(/[?#]/)[0]);

  readonly isHome = computed(() => this.path() === '/');
  readonly isProfile = computed(() => this.path().startsWith('/profile'));
  readonly overlay = computed(() =>
    HERO_ROUTES.some(r => (r === '/' ? this.path() === '/' : this.path().startsWith(r)))
  );
  readonly activeCategory = computed(
    () => new URLSearchParams(this.url().split('?')[1] ?? '').get('category') ?? ''
  );

  readonly scrolled = signal(false);
  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  showAddSalon = false;
  showLogoutConfirm = false;
  showLoginRequired = false;
  salons: SalonType[] = [];

  goFavorites(): void {
    if (!this.user()) {
      this.showLoginRequired = true;
      return;
    }
    this.router.navigate(['/profile'], { fragment: 'favorites' });
  }

  login(): void {
    this.showLoginRequired = false;
    this.router.navigate(['/auth/sign-in']);
  }

  logout(): void {
    this.showLogoutConfirm = false;
    this.store.dispatch(new LogOutAction());
    this.router.navigate(['/']);
  }

  onSalonCreated(): void {
    this.salons = [ ...this.salons];
  }
}
