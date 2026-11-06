import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffCardComponent } from '../../staff-card/staff-card/staff-card.component';

@Component({
  selector: 'app-salon-masters',
  standalone: true,
  imports: [TranslatePipe, CommonModule, StaffCardComponent],
  templateUrl: './salon-masters.component.html',
  styleUrl: './salon-masters.component.scss'
})
export class SalonMastersComponent {
  @Input() category: string | null = null;
  @Input() masters: string[] = [];
}
