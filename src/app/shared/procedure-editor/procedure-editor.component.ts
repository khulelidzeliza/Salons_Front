import { TranslatePipe } from '@ngx-translate/core';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { finalize } from 'rxjs';

import { ProcedureType } from '../../../generated/graphql';
import { PROCEDURE_TYPES } from '../../store/procedure-state/procedure-model';
import { ProcedureService } from '../../features/salons/services/procedure.service';
import { UserSelectors } from '../../store/user-state/user.selector';
import { SoonerService } from '../services/sooner.service';
import { env } from '../../../environments/environment';

/** Shape of a procedure coming from getSalonById */
export interface EditableProcedure {
  id: number;
  procedureType: ProcedureType;
  masters: string[];
  finishedWorks: string[];
}

interface NewPhoto { file: File; url: string; }

@Component({
  selector: 'app-procedure-editor',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './procedure-editor.component.html',
  styleUrls: ['../add-salon-modal/add-salon-modal.component.scss', './procedure-editor.component.scss'],
})
export class ProcedureEditorComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input({ required: true }) salonId!: number;
  @Input() salonName = '';
  /** null = add a new procedure */
  @Input() procedure: EditableProcedure | null = null;
  /** Types this salon already has (disabled for new procedures) */
  @Input() usedTypes: string[] = [];

  @Output() closed = new EventEmitter<void>();
  /** Emits the saved type, or null when the procedure was deleted */
  @Output() saved = new EventEmitter<ProcedureType | null>();

  private readonly service = inject(ProcedureService);
  private readonly store = inject(Store);
  private readonly sooner = inject(SoonerService);

  readonly serverUrl = env.SERVER_URL;
  readonly types = PROCEDURE_TYPES;

  readonly type = signal<ProcedureType | null>(null);
  readonly masters = signal<string[]>([]);
  readonly kept = signal<string[]>([]);
  readonly added = signal<NewPhoto[]>([]);
  readonly saving = signal(false);
  readonly askingDelete = signal(false);
  readonly error = signal<string | null>(null);
  masterDraft = '';

  get isEdit(): boolean { return !!this.procedure; }
  readonly photoCount = computed(() => this.kept().length + this.added().length);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) this.reset();
  }

  ngOnDestroy(): void {
    this.revokeAll();
  }

  private reset(): void {
    this.revokeAll();
    const p = this.procedure;
    this.type.set(p?.procedureType ?? this.firstFreeType());
    this.masters.set([...(p?.masters ?? [])]);
    this.kept.set([...(p?.finishedWorks ?? [])]);
    this.added.set([]);
    this.masterDraft = '';
    this.saving.set(false);
    this.askingDelete.set(false);
    this.error.set(null);
  }

  private firstFreeType(): ProcedureType | null {
    return this.types.find(t => !this.usedTypes.includes(t.value))?.value ?? null;
  }

  isTaken(t: ProcedureType): boolean {
    return this.usedTypes.includes(t) && t !== this.procedure?.procedureType;
  }

  // ── Masters ──
  addMaster(): void {
    const name = this.masterDraft.trim();
    if (name && !this.masters().includes(name)) this.masters.update(m => [...m, name]);
    this.masterDraft = '';
  }

  removeMaster(name: string): void {
    this.masters.update(m => m.filter(x => x !== name));
  }

  onMasterKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      this.addMaster();
    } else if (e.key === 'Backspace' && !this.masterDraft && this.masters().length) {
      this.masters.update(m => m.slice(0, -1));
    }
  }

  // ── Photos ──
  onFiles(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []).filter(f => f.type.startsWith('image/'));
    this.added.update(list => [...list, ...files.map(file => ({ file, url: URL.createObjectURL(file) }))]);
    input.value = '';
  }

  removeKept(path: string): void {
    this.kept.update(list => list.filter(p => p !== path));
  }

  removeAdded(i: number): void {
    const item = this.added()[i];
    if (item) URL.revokeObjectURL(item.url);
    this.added.update(list => list.filter((_, idx) => idx !== i));
  }

  private revokeAll(): void {
    this.added().forEach(p => URL.revokeObjectURL(p.url));
  }

  // ── Save / delete ──
  save(): void {
    const type = this.type();
    if (!type || this.saving()) return;

    this.addMaster(); // include a typed-but-not-entered name
    this.saving.set(true);
    this.error.set(null);

    const newFiles = this.added().map(p => p.file);
    const request$ = this.procedure
      ? this.service.updateProcedure({
          procedureId: this.procedure.id,
          procedureType: type,
          masters: this.masters(),
          keepFinishedWorks: this.kept(),
          newFinishedWorks: newFiles,
        })
      : this.service.addProcedure(this.salonId, Number(this.store.selectSnapshot(UserSelectors.getUser)?.id), {
          procedureType: type,
          masters: this.masters(),
          finishedWorks: newFiles,
        });

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.sooner.success(this.procedure ? 'procedureEditor.updated' : 'procedureEditor.created');
        this.saved.emit(type);
      },
      error: () => this.error.set('errors.saveProcedures'),
    });
  }

  remove(): void {
    if (!this.procedure || this.saving()) return;
    this.saving.set(true);
    this.service
      .deleteProcedure(this.procedure.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.sooner.success('procedureEditor.deleted');
          this.saved.emit(null);
        },
        error: () => {
          this.askingDelete.set(false);
          this.error.set('procedureEditor.deleteFailed');
        },
      });
  }

  @HostListener('document:keydown.escape')
  close(): void {
    if (!this.open || this.saving()) return;
    this.closed.emit();
  }
}
