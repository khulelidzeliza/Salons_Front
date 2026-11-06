import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetSalonByIdQuery } from '../../../../../../generated/graphql';

type Salon = NonNullable<GetSalonByIdQuery['getSalonById']>[number];

@Component({
  selector: 'app-salon-contact',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './salon-contact.component.html',
  styleUrl: './salon-contact.component.scss'
})
export class SalonContactComponent {
  @Input({ required: true }) salon!: Salon;
}
