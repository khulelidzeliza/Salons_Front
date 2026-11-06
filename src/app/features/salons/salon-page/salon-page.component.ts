import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SalonSelectors } from '../../../store/salon-state/salon-selector';
import { map } from 'rxjs';
import { SalonFilterInput } from '../../../../generated/graphql';
import { GetSalons, GetMySalons } from '../../../store/salon-state/salon-actions';
import { CatalogFilters, FilterBarComponent } from '../components/filter-bar/filter-bar/filter-bar.component';
import { SalonCardComponent } from '../components/salon-card/salon-card/salon-card.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-salon-page',
  imports: [SalonCardComponent, FilterBarComponent , AsyncPipe],
  templateUrl: './salon-page.component.html',
  styleUrl: './salon-page.component.scss'
})
export default class SalonPageComponent {

  private readonly store = inject(Store);

  salons$ = this.store.select(SalonSelectors.items);
  loading$ = this.store.select(SalonSelectors.loading);
  totalCount$ = this.salons$.pipe(map(s => s.length));

  ngOnInit() {
    this.store.dispatch([new GetSalons(), new GetMySalons()]);

  }
  onFiltersChange(filters: CatalogFilters): void {
    this.store.dispatch(new GetSalons(this.buildWhere(filters)));
  }


  private buildWhere(filters: CatalogFilters): SalonFilterInput | null {
    const conditions: SalonFilterInput[] = [];

    if (filters.search.trim()) {
      const term = filters.search.trim();
      conditions.push({
        or: [
          { englishName: { contains: term } },
          { location: { contains: term } },
        ]
      });
    }

    if (filters.price) {
      conditions.push({ price: { eq: filters.price } });
    }

    if (filters.category) {
      conditions.push({
        procedures: {
          some: { procedureType: { eq: filters.category } }
        }
      });
    }

    if (conditions.length === 0) return null;
    if (conditions.length === 1) return conditions[0];
    return { and: conditions };
  }

  onToggleFavorite(salonId: number): void {
    // TODO: REST call to favorite/unfavorite endpoint
    console.log('toggle favorite', salonId);
  }

}
