import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Review, Star } from '../../../../generated/graphql';
import { UserSelectors } from '../../../store/user-state/user.selector';

@Component({
  selector: 'app-user-reviews',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.scss'
})
export default class UserReviewsComponent {
 private readonly store = inject(Store);

  readonly user = this.store.selectSignal(UserSelectors.getUser);
  readonly reviews = computed(() => this.user()?.reviews ?? []);

  // Star enum → number of filled stars
  starCount(star: Star): number {
    return { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }[star] ?? 0;
  }

  readonly stars = [1, 2, 3, 4, 5];

  onEdit(review: Review): void {
    console.log('edit review', review.id);
  }

  onDelete(review: Review): void {
    console.log('delete review', review.id);
  }
}
