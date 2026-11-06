import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetSalonByIdQuery } from '../../../../../../generated/graphql';

type Salon = NonNullable<GetSalonByIdQuery['getSalonById']>[number];

@Component({
  selector: 'app-salon-action-bar',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './salon-action-bar.component.html',
  styleUrl: './salon-action-bar.component.scss'
})
export class SalonActionBarComponent {
  @Input({ required: true }) salon!: Salon;
}
