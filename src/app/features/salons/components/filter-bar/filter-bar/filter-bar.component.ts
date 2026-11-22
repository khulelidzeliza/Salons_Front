import { TranslatePipe } from '@ngx-translate/core';
import { AfterViewChecked, Component, DestroyRef, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
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
  imports: [TranslatePipe, LucideAngularModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent implements OnInit, OnDestroy, AfterViewChecked {
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

  @ViewChild('chips', { static: true }) chipsRef!: ElementRef<HTMLElement>;
  @ViewChild('ind', { static: true }) indRef!: ElementRef<HTMLElement>;
  private lastCategory: string | null = null;

  ngAfterViewChecked(): void {
    this.moveIndicator();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.lastCategory = null;
  }

  private moveIndicator(): void {
    if (this.lastCategory === this.filters.category) return;

    const active = this.chipsRef.nativeElement.querySelector<HTMLElement>('.filters__chip.is-active');
    if (!active) return;
    this.lastCategory = this.filters.category;

    const ind = this.indRef.nativeElement;
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.height = `${active.offsetHeight}px`;
    ind.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
  }

  readonly categoryOptions: { label: string; value: ProcedureType | '' }[] = [
    { label: 'procedure.ALL', value: '' },
    { label: 'procedure.HAIR', value: 'HAIR' },
    { label: 'procedure.NAIL', value: 'NAIL' },
    { label: 'procedure.BARBER', value: 'BARBER' },
    { label: 'procedure.COSMETIC', value: 'COSMETIC' },
    { label: 'procedure.LASER', value: 'LASER' },
    { label: 'procedure.TATTOO', value: 'TATTOO' },
  ];

  readonly priceOptions: { label: string; value: BudgetLevel | '' }[] = [
    { label: 'budget.ANY', value: '' },
    { label: 'budget.CHEAPEST', value: 'CHEAPEST' },
    { label: 'budget.CHEAP', value: 'CHEAP' },
    { label: 'budget.MEDIUM', value: 'MEDIUM' },
    { label: 'budget.EXPENSIVE', value: 'EXPENSIVE' },
    { label: 'budget.MOST_EXPENSIVE', value: 'MOST_EXPENSIVE' },
  ];

  readonly audienceOptions: { label: string; value: Audience }[] = [
    { label: 'audience.ALL', value: '' },
    { label: 'audience.WOMEN', value: 'WOMEN' },
    { label: 'audience.MEN', value: 'MEN' },
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
