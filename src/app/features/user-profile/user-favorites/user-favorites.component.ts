import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { env } from '../../../../environments/environment';
import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserSelectors } from '../../../store/user-state/user.selector';

@Component({
  selector: 'app-user-favorites',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.scss'
})
export default class UserFavoritesComponent {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(UserSelectors.getUser);
  readonly serverUrl = env.SERVER_URL;
  readonly favorites = computed(() => this.user()?.favorites ?? []);
}
