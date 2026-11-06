import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { IUser } from '../../../store/user-state/user.model';
import { UserSelectors } from '../../../store/user-state/user.selector';

@Component({
  selector: 'app-user-info',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export default class UserInfoComponent {
 private readonly store = inject(Store);

  readonly user$: Observable<IUser | null> = this.store.select(UserSelectors.getUser);
  readonly user = this.store.selectSignal(UserSelectors.getUser);

  readonly initials = computed(() => {
    const name = this.user()?.userName ?? '';
    return name
      .split(/[._\s-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  });}
