import { Injectable } from '@angular/core';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SalonStateModel } from './salon-modal';
import { AddSalon, DeleteSalon, GetMySalons, GetSalonById, GetSalons, UpdateSalon } from './salon-actions';
import { GetMySalonsGQL, GetSalonByIdGQL, GetSalonsGQL } from '../../../generated/graphql';
import { UserSelectors } from '../user-state/user.selector';
import { ResetProcedureDrafts, SaveProcedures } from '../procedure-state/procedure-actions';
import { SalonService } from '../../features/salons/services/salon.service';

type Ctx = StateContext<SalonStateModel>;

@State<SalonStateModel>({
  name: 'salon',
  defaults: {
    items: [],
    mysalons: [],
    activeFilter: null,
    selectedSalon: null,
    loading: false,
    saving: false,
    deleting: false,
    error: null,
  },
})
@Injectable()
export class SalonState {
  constructor(
    private salonService: SalonService,
    private getSalonsGQL: GetSalonsGQL,
    private getSalonByIdGQL: GetSalonByIdGQL,
    private getMySalonsGQL: GetMySalonsGQL,
    private store: Store,
  ) {}

  // ------------------------------------------------------------------ add

  @Action(AddSalon)
  addSalon(ctx: Ctx, { payload, pictures }: AddSalon) {
    ctx.patchState({ saving: true, error: null });

    return this.salonService.addSalon(payload, pictures).pipe(
      switchMap(res => this.resolveSalonId(res)),
      switchMap(salonId => ctx.dispatch(new SaveProcedures(salonId))),
      switchMap(() => ctx.dispatch([
        new ResetProcedureDrafts(),
        new GetSalons(ctx.getState().activeFilter),
        new GetMySalons(),
      ])),
      tap(() => ctx.patchState({ saving: false })),
      catchError(err => this.fail(ctx, err, 'Failed to create salon')),
    );
  }

  // ------------------------------------------------------------------ update

  @Action(UpdateSalon)
  updateSalon(ctx: Ctx, { payload }: UpdateSalon) {
    if (ctx.getState().saving) return;
    ctx.patchState({ saving: true, error: null });

    return this.salonService.updateSalon(payload).pipe(
      switchMap(() => {
        const refresh: object[] = [
          new GetSalons(ctx.getState().activeFilter),
          new GetMySalons(),
        ];
        // Refetch the detail only if a page is showing this exact salon
        if (ctx.getState().selectedSalon?.id === payload.salonId) {
          refresh.push(new GetSalonById(payload.salonId));
        }
        return ctx.dispatch(refresh);
      }),
      tap(() => ctx.patchState({ saving: false })),
      catchError(err => this.fail(ctx, err, 'Failed to update salon')),
    );
  }

  // ------------------------------------------------------------------ delete

  @Action(DeleteSalon)
  deleteSalon(ctx: Ctx, { salonId }: DeleteSalon) {
    if (ctx.getState().deleting) return;

    const user = this.store.selectSnapshot(UserSelectors.getUser);
    if (!user?.id) {
      ctx.patchState({ error: 'You need to be logged in.' });
      return throwError(() => new Error('Not logged in'));
    }

    ctx.patchState({ deleting: true, error: null });

    return this.salonService.deleteSalon(Number(user.id), salonId).pipe(
      tap(() => {
        // Remove it locally right away — no extra request needed
        const s = ctx.getState();
        ctx.patchState({
          items: s.items.filter(x => x.id !== salonId),
          mysalons: s.mysalons.filter(x => x.id !== salonId),
          selectedSalon: s.selectedSalon?.id === salonId ? null : s.selectedSalon,
          deleting: false,
        });
      }),
      catchError(err => this.fail(ctx, err, 'Failed to delete salon')),
    );
  }

  // ------------------------------------------------------------------ queries

  @Action(GetSalons)
  getSalons(ctx: Ctx, action: GetSalons) {
    ctx.patchState({ loading: true });
    return this.getSalonsGQL
      .fetch({ where: action.where }, { fetchPolicy: 'network-only' })
      .pipe(
        tap(result => ctx.patchState({
          items: result.data?.getSalons ?? [],
          activeFilter: action.where ?? null,
          loading: false,
        })),
      );
  }

  @Action(GetSalonById)
  getSalonById(ctx: Ctx, action: GetSalonById) {
    ctx.patchState({ loading: true, error: null });
    return this.getSalonByIdGQL
      .fetch({ id: action.salonid }, { fetchPolicy: 'network-only' })
      .pipe(
        tap(result => {
          const salon = result.data?.getSalonById?.[0] ?? null;
          ctx.patchState({
            selectedSalon: salon,
            loading: false,
            error: salon ? null : 'salon not found',
          });
        }),
      );
  }

  @Action(GetMySalons)
  getMySalons(ctx: Ctx) {
    const user = this.store.selectSnapshot(UserSelectors.getUser);
    if (!user?.id) return;

    ctx.patchState({ loading: true, error: null });
    return this.getMySalonsGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      tap(result => {
        ctx.patchState({
          mysalons: result.data?.getMySalons ?? [],
          loading: false,
          error: null,
        });
      }),
    );
  }

  // ------------------------------------------------------------------ helpers

  /** Resets the busy flags, stores a readable error, and rethrows so the component can react (keep modal open). */
  private fail(ctx: Ctx, err: any, fallback: string) {
    ctx.patchState({
      loading: false,
      saving: false,
      deleting: false,
      error: err?.error?.title ?? fallback,
    });
    return throwError(() => err);
  }

  /** Reads the id from the add-salon response; if missing, takes the newest of "my salons" */
  private resolveSalonId(res: any): Observable<number> {
    const id = Number(res?.id ?? res?.salonId ?? res?.data?.id ?? res);
    if (id) return of(id);

    return this.getMySalonsGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      map(r => {
        const ids = (r.data?.getMySalons ?? []).map((s: any) => Number(s.id)).filter(Boolean);
        if (!ids.length) throw new Error('Could not determine the new salon id');
        return Math.max(...ids);
      }),
    );
  }
}