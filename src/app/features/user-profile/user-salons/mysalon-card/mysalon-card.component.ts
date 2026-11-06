import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetMySalonsQuery } from '../../../../../generated/graphql';
import { env } from '../../../../../environments/environment';
import { DeleteSalon } from '../../../../store/salon-state/salon-actions';
import { ConfirmModalComponent } from '../../../../shared/confirm-modal/confirm-modal.component';
import { EditSalonModalComponent } from '../../../../shared/edit-salon-modal/edit-salon-modal.component';

type Salon = GetMySalonsQuery['getMySalons'][number];

@Component({
  selector: 'app-mysalon-card',
  standalone: true,
  imports: [TranslatePipe, ConfirmModalComponent, EditSalonModalComponent],
  templateUrl: './mysalon-card.component.html',
  styleUrl: './mysalon-card.component.scss',
})
export class MysalonCardComponent {
  @Input({ required: true }) salon!: Salon;

  private store = inject(Store);
  serverUrl = env.SERVER_URL;

  // Edit
  showEditSalon = false;
  editingSalonId: number | null = null;

  // Delete
  showDeleteConfirm = false;
  deleting = false;

  onEdit(): void {
    this.editingSalonId = this.salon.id;
    this.showEditSalon = true;
  }

  askDelete(): void {
    this.showDeleteConfirm = true;
  }

  onRemove(): void {
    this.deleting = true;
    this.store.dispatch(new DeleteSalon(this.salon.id)).subscribe({
      next: () => {
        this.deleting = false;
        this.showDeleteConfirm = false;
      },
      error: () => {
        this.deleting = false; // modal stays open so the user can retry
      },
    });
  }
}