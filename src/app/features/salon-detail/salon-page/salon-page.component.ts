import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Store } from '@ngxs/store';
import { SalonHeroComponent } from '../components/salon-hero/salon-hero/salon-hero.component';
import { SalonServicesComponent } from '../components/salon-services/salon-services/salon-services.component';
import { SalonResultsComponent } from '../components/salon-results/salon-results/salon-results.component';
import { SalonMastersComponent } from '../components/salon-masters/salon-masters/salon-masters.component';
import { SalonContactComponent } from '../components/salon-contact/salon-contact/salon-contact.component';
import { SalonActionBarComponent } from '../components/salon-action-bar/salon-action-bar/salon-action-bar.component';
import { EditSalonModalComponent } from '../../../shared/edit-salon-modal/edit-salon-modal.component';
import { SalonSelectors } from '../../../store/salon-state/salon-selector';
import { UserSelectors } from '../../../store/user-state/user.selector';
import { GetSalonById } from '../../../store/salon-state/salon-actions';
import { SalonDetail } from '../../../store/salon-state/salon-modal';
import { ProcedureType } from '../../../../generated/graphql';
import { ProcedureEditorComponent, EditableProcedure } from '../../../shared/procedure-editor/procedure-editor.component';

type SalonProcedure = NonNullable<SalonDetail['procedures']>[number];

@Component({
  selector: 'app-salon-page',
  standalone: true,
  imports: [
    CommonModule,
    SalonHeroComponent,
    SalonServicesComponent,
    SalonResultsComponent,
    SalonMastersComponent,
    SalonContactComponent,
    SalonActionBarComponent,
    ProcedureEditorComponent,
    EditSalonModalComponent,
  ],
  templateUrl: './salon-page.component.html',
  styleUrl: './salon-page.component.scss'
})
export class SalonPageComponent {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  private selectedType$ = new BehaviorSubject<string | null>(null);
  private salonId = 0;

  private readonly user = this.store.selectSignal(UserSelectors.getUser);

  salon$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id'))),
    tap(id => {
      this.salonId = id;
      this.store.dispatch(new GetSalonById(id));
    }),
    switchMap(() => this.store.select(SalonSelectors.selectedSalon))
  );

  loading$ = this.store.select(SalonSelectors.loading);

  categories$ = this.salon$.pipe(
    map(salon => Array.from(new Set((salon?.procedures ?? []).map(p => p.procedureType))))
  );

  private matchingProcedures$ = combineLatest([this.salon$, this.selectedType$]).pipe(
    map(([salon, selected]) => {
      const procedures = salon?.procedures ?? [];
      if (!procedures.length) return [];
      const type = selected ?? procedures[0].procedureType;
      return procedures.filter(p => p.procedureType === type);
    })
  );

  workingResultProcedures$ = this.matchingProcedures$;

  masters$ = this.matchingProcedures$.pipe(
    map(procedures => Array.from(new Set(procedures.flatMap(p => p.masters ?? []))))
  );

  activeCategory$ = this.selectedType$.asObservable();

  onSelectCategory(type: string): void {
    this.selectedType$.next(type);
  }

  // ── Owner mode ──
  /** Only the salon's owner gets the add / edit controls. Visitors never see them. */
  isOwner(salon: SalonDetail | null): boolean {
    const user = this.user();
    return !!user && !!salon && Number(user.id) === Number(salon.userId);
  }

  editorOpen = false;
  editing: EditableProcedure | null = null;
  editInfoOpen = false;

  usedTypes(salon: SalonDetail): string[] {
    return (salon.procedures ?? []).map(p => p.procedureType);
  }

  openAddProcedure(): void {
    this.editing = null;
    this.editorOpen = true;
  }

  /** Opens the procedure shown in the active tab */
  openEditProcedure(procedures: SalonProcedure[]): void {
    const p = procedures[0];
    if (!p) return this.openAddProcedure();
    this.editing = {
      id: Number(p.id),
      procedureType: p.procedureType,
      masters: [...(p.masters ?? [])],
      finishedWorks: [...(p.finishedWorks ?? [])],
    };
    this.editorOpen = true;
  }

  onProcedureSaved(type: ProcedureType | null): void {
    this.editorOpen = false;
    this.editing = null;
    this.selectedType$.next(type); // null after delete → first tab
    this.store.dispatch(new GetSalonById(this.salonId));
  }

  onInfoClosed(): void {
    this.editInfoOpen = false;
    this.store.dispatch(new GetSalonById(this.salonId));
  }
}
