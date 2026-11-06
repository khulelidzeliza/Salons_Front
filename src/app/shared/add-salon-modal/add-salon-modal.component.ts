import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ProcedureType } from '../../../generated/graphql';
import { AddProcedureDraft, RemoveProcedureDraft, SetProcedureType, SetMasterDraft, AddMaster, RemoveMaster, SetFinishedWorks } from '../../store/procedure-state/procedure-actions';
import { PROCEDURE_TYPES, ProcedureDraft } from '../../store/procedure-state/procedure-model';
import { ProcedureSelectors } from '../../store/procedure-state/procedure-selector';
import { SalonPayload, AddSalon } from '../../store/salon-state/salon-actions';
import { SalonSelectors } from '../../store/salon-state/salon-selector';

@Component({
  selector: 'app-add-salon-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-salon-modal.component.html',
  styleUrl: './add-salon-modal.component.scss',
})
export class AddSalonModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly procedureTypes = PROCEDURE_TYPES;

  loading$ = this.store.select(SalonSelectors.loading);
  error$ = this.store.select(SalonSelectors.error);
  procedures$ = this.store.select(ProcedureSelectors.drafts);

  pictures: File[] = [];

  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  form = this.fb.nonNullable.group({
  englishName: ['', Validators.required],
  georgianName: ['', Validators.required],
      location: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    phoneNumber: [''],
    email: ['', Validators.email],
    facebookLink: [''],
    instagramLink: [''],
    workingHours: [''],
  });

  trackById = (_: number, p: ProcedureDraft) => p.id;

  onFileChange(event: Event): void {
    this.pictures = this.filesFrom(event);
  }

  // ── Procedures (all state lives in ProcedureState) ──
  addProcedure(): void {
    this.store.dispatch(new AddProcedureDraft());
  }

  removeProcedure(id: number): void {
    this.store.dispatch(new RemoveProcedureDraft(id));
  }

  setType(id: number, type: ProcedureType): void {
    this.store.dispatch(new SetProcedureType(id, type));
  }

  onMasterInput(id: number, event: Event): void {
    this.store.dispatch(new SetMasterDraft(id, (event.target as HTMLInputElement).value));
  }

  addMaster(id: number, event?: Event): void {
    event?.preventDefault();
    this.store.dispatch(new AddMaster(id));
  }

  removeMaster(id: number, name: string): void {
    this.store.dispatch(new RemoveMaster(id, name));
  }

  onWorksChange(id: number, event: Event): void {
    this.store.dispatch(new SetFinishedWorks(id, this.filesFrom(event)));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as SalonPayload;

    this.store.dispatch(new AddSalon(payload, this.pictures)).subscribe({
      next: () => {
        this.form.reset();
        this.pictures = [];
        this.created.emit();
        this.close();
      },
      error: err => console.error('Add salon failed', err),
    });
  }

  close(): void {
    this.closed.emit();
  }

  private filesFrom(event: Event): File[] {
    const input = event.target as HTMLInputElement;
    return input.files ? Array.from(input.files) : [];
  }
}