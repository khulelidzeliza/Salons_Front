import { Component, computed, inject } from '@angular/core';
import UserInfoComponent from "./user-info/user-info.component";
import UserDetailsComponent from "./user-details/user-details.component";
import UserSalonsComponent from "./user-salons/user-salons.component";
import UserFavoritesComponent from "./user-favorites/user-favorites.component";
import UserReviewsComponent from "./user-reviews/user-reviews.component";
import { Store } from '@ngxs/store';
import { UserRole } from '../../store/user-state/user.model';
import { UserSelectors } from '../../store/user-state/user.selector';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-user-profile',
  imports: [UserInfoComponent, UserDetailsComponent, UserSalonsComponent, UserFavoritesComponent, UserReviewsComponent, RevealDirective],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export default class UserProfileComponent {
private readonly store = inject(Store);

  readonly UserRole = UserRole;

  private readonly user = this.store.selectSignal(UserSelectors.getUser);
  readonly displayRole = computed(() => this.user()?.role ?? null);
}
