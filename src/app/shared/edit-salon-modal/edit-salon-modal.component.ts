import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { combineLatest } from 'rxjs';
import { BudgetLevel } from '../../../generated/graphql';
import { GetSalonById, UpdateSalonPayload, UpdateSalon, DeleteSalon } from '../../store/salon-state/salon-actions';
import { SalonDetail } from '../../store/salon-state/salon-modal';
import { SalonSelectors } from '../../store/salon-state/salon-selector';
import { UserSelectors } from '../../store/user-state/user.selector';

type BudgetOption = { value: BudgetLevel; label: string; name: string; num: number };

export const BUDGET_LEVELS: BudgetOption[] = [
  { value: 'CHEAPEST',       label: '₾',     name: 'Cheapest',       num: 0 },
  { value: 'CHEAP',          label: '₾₾',    name: 'Cheap',          num: 1 },
  { value: 'MEDIUM',         label: '₾₾₾',   name: 'Medium',         num: 2 },
  { value: 'EXPENSIVE',      label: '₾₾₾₾',  name: 'Expensive',      num: 3 },
  { value: 'MOST_EXPENSIVE', label: '₾₾₾₾₾', name: 'Most expensive', num: 4 },
];

const budgetToNumber = (level: BudgetLevel): number =>
  BUDGET_LEVELS.find(b => b.value === level)?.num ?? 0;

const required = [Validators.required, Validators.pattern(/\S/)];

@Component({
  selector: 'app-edit-salon-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-salon-modal.component.html',
  styleUrls: ['../add-salon-modal/add-salon-modal.component.scss'],
  styles: [`
    .danger-zone { margin-right: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .danger-zone__q { font-size: var(--fs-sm); color: var(--color-danger); font-weight: var(--fw-medium); }
    .modal-loading { color: var(--color-text-muted); margin: var(--space-lg) 0; }
  `],
})
export class EditSalonModalComponent implements OnChanges {
  @Input() open = false;
  @Input() salonId: number | null = null;
  @Output() closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private store = inject(Store);

  readonly budgetLevels = BUDGET_LEVELS;

  vm$ = combineLatest({
    saving:   this.store.select(SalonSelectors.saving),
    deleting: this.store.select(SalonSelectors.deleting),
    error:    this.store.select(SalonSelectors.error),
  });

  original: SalonDetail | null = null;
  loadingSalon = false;
  askingDelete = false;

  form = this.fb.group({
    englishName:   ['', required],
    georgianName:  ['', required],
    location:      ['', required],
    price:         this.fb.control<BudgetLevel | null>(null, Validators.required),
    phoneNumber:   [''],
    email:         ['', Validators.email],
    workingHours:  [''],
    facebookLink:  [''],
    instagramLink: [''],
    description:   [''],
  });

  private get busy(): boolean {
    return this.store.selectSnapshot(SalonSelectors.saving) ||
           this.store.selectSnapshot(SalonSelectors.deleting);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['open'] || changes['salonId']) && this.open && this.salonId) {
      this.load(this.salonId);
    }
  }

  private load(id: number): void {
    this.original = null;
    this.askingDelete = false;
    this.loadingSalon = true;

    this.store.dispatch(new GetSalonById(id)).subscribe({
      next: () => {
        this.loadingSalon = false;
        const s = this.store.selectSnapshot(SalonSelectors.selectedSalon);
        if (!s || s.id !== id) return; 
        this.original = s;
        this.form.reset({
          englishName:   s.englishName,
          georgianName:  s.georgianName,
          location:      s.location,
          price:         s.price,
          phoneNumber:   s.phoneNumber ?? '',
          description:   s.description ?? '',
          email:         s.email ?? '',
          workingHours:  s.workingHours ?? '',
          facebookLink:  s.facebookLink ?? '',
          instagramLink: s.instagramLink ?? '',
        });
      },
      error: () => (this.loadingSalon = false),
    });
  }

  setPrice(level: BudgetLevel): void {
    const ctrl = this.form.controls.price;
    if (ctrl.value === level) return;
    ctrl.setValue(level);
    ctrl.markAsDirty();
  }

  submit(): void {
    const o = this.original;
    if (!o || this.busy) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    if (!this.form.dirty) {
      this.close(); 
      return;
    }

    const user = this.store.selectSnapshot(UserSelectors.getUser);
    const c = this.form.controls;

    const pick = (ctrl: AbstractControl<string | null>, current: string | null): string | null =>
      ctrl.dirty ? (ctrl.value?.trim() || null) : current;

    const payload: UpdateSalonPayload = {
      salonId:       o.id,
      userId:        Number(user?.id),
      englishName:   pick(c.englishName, o.englishName) ?? o.englishName,
      georgianName:  pick(c.georgianName, o.georgianName) ?? o.georgianName,
      location:      pick(c.location, o.location) ?? o.location,
      email:         pick(c.email, o.email),
      description:   pick(c.description, o.description),
      phoneNumber:   pick(c.phoneNumber, o.phoneNumber),
      workingHours:  pick(c.workingHours, o.workingHours),
      facebookLink:  pick(c.facebookLink, o.facebookLink),
      instagramLink: pick(c.instagramLink, o.instagramLink),
      price:         budgetToNumber(c.price.dirty && c.price.value ? c.price.value : o.price),
    };

    this.store.dispatch(new UpdateSalon(payload)).subscribe({
      next: () => this.closed.emit(),
      error: () => {},
    });
  }

  askDelete(): void    { if (!this.busy) this.askingDelete = true; }
  cancelDelete(): void { if (!this.busy) this.askingDelete = false; }

  remove(): void {
    if (!this.original || this.busy) return;
    this.store.dispatch(new DeleteSalon(this.original.id)).subscribe({
      next: () => {
        this.askingDelete = false;
        this.closed.emit();
      },
      error: () => (this.askingDelete = false),
    });
  }

  close(): void {
    if (this.busy) return;
    this.askingDelete = false;
    this.closed.emit();
  }
}