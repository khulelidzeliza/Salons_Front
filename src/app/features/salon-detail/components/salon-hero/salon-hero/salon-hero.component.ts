import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetLevel, GetSalonByIdQuery } from '../../../../../../generated/graphql';
import { env } from '../../../../../../environments/environment';

type Salon = NonNullable<GetSalonByIdQuery['getSalonById']>[number];

const BUDGET_SIGNS: Record<BudgetLevel, string> = {
  CHEAPEST: '$',
  CHEAP: '$$',
  MEDIUM: '$$$',
  EXPENSIVE: '$$$$',
  MOST_EXPENSIVE: '$$$$$',
};

@Component({
  selector: 'app-salon-hero',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './salon-hero.component.html',
  styleUrl: './salon-hero.component.scss'
})
export class SalonHeroComponent {
  @Input({ required: true }) salon!: Salon;
  activeSlide = 0;
  serverUrl = env.SERVER_URL;

  get pictures(): string[] {
    return this.salon.pictures ?? [];
  }

  get budgetSigns(): string {
    return BUDGET_SIGNS[this.salon.price] ?? '$$$';
  }

  setSlide(i: number): void {
    this.activeSlide = i;
  }

  prevSlide(): void {
    this.activeSlide = (this.activeSlide - 1 + this.pictures.length) % this.pictures.length;
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.pictures.length;
  }
}
