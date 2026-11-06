import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MysalonCardComponent } from "./mysalon-card/mysalon-card.component";
import { Store } from '@ngxs/store';
import { SalonSelectors } from '../../../store/salon-state/salon-selector';
import { GetMySalons } from '../../../store/salon-state/salon-actions';
import { Observable } from 'rxjs';
import { MySalons, SalonType } from '../../../store/salon-state/salon-modal';
import { AddSalonModalComponent } from '../../../shared/add-salon-modal/add-salon-modal.component';
import { CatalogFilters } from '../../salons/components/filter-bar/filter-bar/filter-bar.component';
@Component({
  selector: 'app-user-salons',
  imports: [TranslatePipe, CommonModule, MysalonCardComponent, AddSalonModalComponent],
  templateUrl: './user-salons.component.html',
  styleUrl: './user-salons.component.scss'
})
export default class UserSalonsComponent {
  private store = inject(Store);
    showAddSalon = false;
  salons: SalonType[] = [];

  salons$ : Observable<MySalons[]> = this.store.select(SalonSelectors.mySalons);
  loading$ = this.store.select(SalonSelectors.loading);

  ngOnInit(): void {
    this.store.dispatch(new GetMySalons());
  }


  openAddSalonModal(): void {
    this.showAddSalon = true;
  }
  onSalonCreated(): void {
    this.salons = [ ...this.salons];
  }
  onFiltersChange(filters: CatalogFilters): void {
    console.log('filters changed', filters);
  }

  onToggleFavorite(salonId: number): void {
    console.log('toggle favorite', salonId);
  }
}
