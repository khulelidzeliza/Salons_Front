import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserSelectors } from '../user-state/user.selector';
import { PROCEDURE_TYPES, ProcedureDraft, ProcedurePayload, ProcedureStateModel } from './procedure-model';
import { AddProcedureDraft, SetProcedureType, RemoveProcedureDraft, SetMasterDraft, AddMaster, RemoveMaster, SetFinishedWorks, SaveProcedures, ResetProcedureDrafts } from './procedure-actions';
import { ProcedureService } from '../../features/salons/services/procedure.service';

let nextDraftId = 1;

@State<ProcedureStateModel>({
  name: 'procedure',
  defaults: {
    drafts: [],
    saving: false,
    error: null,
  },
})
@Injectable()
export class ProcedureState {
  constructor(
    private procedureService: ProcedureService,
    private store: Store,
  ) {}

  @Action(AddProcedureDraft)
  addDraft(ctx: StateContext<ProcedureStateModel>) {
    const drafts = ctx.getState().drafts;
    const used = new Set(drafts.map(d => d.procedureType));
    const type = PROCEDURE_TYPES.find(t => !used.has(t.value))?.value ?? PROCEDURE_TYPES[0].value;

    ctx.patchState({
      drafts: [...drafts, { id: nextDraftId++, procedureType: type, masters: [], finishedWorks: [], masterDraft: '' }],
    });
  }

  @Action(RemoveProcedureDraft)
  removeDraft(ctx: StateContext<ProcedureStateModel>, { id }: RemoveProcedureDraft) {
    ctx.patchState({ drafts: ctx.getState().drafts.filter(d => d.id !== id) });
  }

  @Action(SetProcedureType)
  setType(ctx: StateContext<ProcedureStateModel>, { id, procedureType }: SetProcedureType) {
    this.updateDraft(ctx, id, d => ({ ...d, procedureType }));
  }

  @Action(SetMasterDraft)
  setMasterDraft(ctx: StateContext<ProcedureStateModel>, { id, value }: SetMasterDraft) {
    this.updateDraft(ctx, id, d => ({ ...d, masterDraft: value }));
  }

  @Action(AddMaster)
  addMaster(ctx: StateContext<ProcedureStateModel>, { id }: AddMaster) {
    this.updateDraft(ctx, id, d => {
      const name = d.masterDraft.trim();
      const masters = name && !d.masters.includes(name) ? [...d.masters, name] : d.masters;
      return { ...d, masters, masterDraft: '' };
    });
  }

  @Action(RemoveMaster)
  removeMaster(ctx: StateContext<ProcedureStateModel>, { id, name }: RemoveMaster) {
    this.updateDraft(ctx, id, d => ({ ...d, masters: d.masters.filter(m => m !== name) }));
  }

  @Action(SetFinishedWorks)
  setFinishedWorks(ctx: StateContext<ProcedureStateModel>, { id, files }: SetFinishedWorks) {
    this.updateDraft(ctx, id, d => ({ ...d, finishedWorks: files }));
  }

  @Action(ResetProcedureDrafts)
  reset(ctx: StateContext<ProcedureStateModel>) {
    ctx.patchState({ drafts: [], error: null });
  }

  // ── Save all drafts to the backend ──
  @Action(SaveProcedures)
  save(ctx: StateContext<ProcedureStateModel>, { salonId }: SaveProcedures) {
    const payloads = ctx.getState().drafts.map(d => ProcedureState.toPayload(d));
    if (!payloads.length) return of(null);

    const userId = Number(this.store.selectSnapshot(UserSelectors.getUser)?.id);
    if (!userId) return throwError(() => new Error('User is not loaded — cannot add procedures'));

    ctx.patchState({ saving: true, error: null });

    return forkJoin(
      payloads.map(p => this.procedureService.addProcedure(salonId, userId, p))
    ).pipe(
      tap(() => ctx.patchState({ saving: false })),
      catchError(err => {
        console.error('[SaveProcedures] failed:', err);
        ctx.patchState({ saving: false, error: 'Failed to save procedures' });
        return throwError(() => err);
      }),
    );
  }

  // ── helpers ──
  private updateDraft(
    ctx: StateContext<ProcedureStateModel>,
    id: number,
    fn: (d: ProcedureDraft) => ProcedureDraft,
  ) {
    ctx.patchState({ drafts: ctx.getState().drafts.map(d => (d.id === id ? fn(d) : d)) });
  }

  /** Strips the UI-only fields and adds a typed-but-not-entered master name */
  private static toPayload({ id, masterDraft, ...d }: ProcedureDraft): ProcedurePayload {
    const pending = masterDraft.trim();
    return {
      ...d,
      masters: pending && !d.masters.includes(pending) ? [...d.masters, pending] : d.masters,
    };
  }
}