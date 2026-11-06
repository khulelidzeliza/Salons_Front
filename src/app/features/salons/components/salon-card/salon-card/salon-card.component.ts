import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BudgetLevel, GetSalonsQuery } from '../../../../../../generated/graphql';
import { env } from '../../../../../../environments/environment';

type Salon = GetSalonsQuery['getSalons'][number];

const BUDGET_SIGNS: Record<BudgetLevel, string> = {
  CHEAPEST: '$',
  CHEAP: '$$',
  MEDIUM: '$$$',
  EXPENSIVE: '$$$$',
  MOST_EXPENSIVE: '$$$$$',
};

@Component({
  selector: 'app-salon-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './salon-card.component.html',
  styleUrl: './salon-card.component.scss'
})
export class SalonCardComponent {
    serverUrl = env.SERVER_URL;


  @Input({ required: true }) salon!: Salon;
  @Output() toggleFavorite = new EventEmitter<number>();

  get coverImage(): string | null {
    return this.salon.pictures?.[0] ?? null;
  }

  get budgetSigns(): string {
    return BUDGET_SIGNS[this.salon.price] ?? '$$$';
  }

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit(this.salon.id);
  }

  truncate(text: string, limit = 40): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }
}