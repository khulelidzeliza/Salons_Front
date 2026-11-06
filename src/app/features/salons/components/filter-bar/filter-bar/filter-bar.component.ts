import { Component, DestroyRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LucideAngularModule, SlidersHorizontal, X, Search } from 'lucide-angular';
import { BudgetLevel, ProcedureType } from '../../../../../../generated/graphql';

export type Audience = '' | 'WOMEN' | 'MEN';

export interface CatalogFilters {
  search: string;
  price: BudgetLevel | '';
  category: ProcedureType | '';
  audience: Audience;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);

  @Input() resultCount = 0;
  @Output() filtersChange = new EventEmitter<CatalogFilters>();

  readonly FilterIcon = SlidersHorizontal;
  readonly CloseIcon = X;
  readonly SearchIcon = Search;

  filters: CatalogFilters = { search: '', price: '', category: '', audience: '' };
  sheetOpen = false;
  private search$ = new Subject<string>();

  readonly categoryOptions: { label: string; value: ProcedureType | '' }[] = [
    { label: 'All', value: '' },
    { label: 'Hair', value: 'HAIR' },
    { label: 'Nails', value: 'NAIL' },
    { label: 'Barber', value: 'BARBER' },
    { label: 'Cosmetic', value: 'COSMETIC' },
    { label: 'Laser', value: 'LASER' },
    { label: 'Tattoo', value: 'TATTOO' },
  ];

  readonly priceOptions: { label: string; value: BudgetLevel | '' }[] = [
    { label: 'Any price', value: '' },
    { label: 'Cheapest', value: 'CHEAPEST' },
    { label: 'Cheap', value: 'CHEAP' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Expensive', value: 'EXPENSIVE' },
    { label: 'Premium', value: 'MOST_EXPENSIVE' },
  ];

  readonly audienceOptions: { label: string; value: Audience }[] = [
    { label: 'Everyone', value: '' },
    { label: 'Women', value: 'WOMEN' },
    { label: 'Men', value: 'MEN' },
  ];

  get activeCount(): number {
    return (this.filters.price ? 1 : 0) + (this.filters.audience ? 1 : 0);
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const category = (params.get('category') ?? '') as ProcedureType | '';
      if (category !== this.filters.category) this.update({ category });
    });

    this.search$
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(search => this.update({ search }));
  }

  ngOnDestroy(): void {
    this.lockScroll(false);
  }

  onSearch(value: string): void {
    this.filters = { ...this.filters, search: value };
    this.search$.next(value.trim());
  }

  clearSearch(): void {
    this.filters = { ...this.filters, search: '' };
    this.search$.next('');
  }

  setCategory(category: ProcedureType | ''): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  setPrice(price: BudgetLevel | ''): void {
    this.update({ price });
  }

  setAudience(audience: Audience): void {
    this.update({ audience });
  }

  resetFilters(): void {
    this.update({ price: '', audience: '' });
  }

  openSheet(): void {
    this.sheetOpen = true;
    this.lockScroll(true);
  }

  @HostListener('document:keydown.escape')
  closeSheet(): void {
    if (!this.sheetOpen) return;
    this.sheetOpen = false;
    this.lockScroll(false);
  }

  private update(patch: Partial<CatalogFilters>): void {
    this.filters = { ...this.filters, ...patch };
    this.filtersChange.emit({ ...this.filters });
  }

  private lockScroll(lock: boolean): void {
    this.document.body.style.overflow = lock ? 'hidden' : '';
  }
}
