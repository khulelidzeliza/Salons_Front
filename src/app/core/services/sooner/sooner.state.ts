
import { Action, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';

import { ErrorSooner, ShowSooner, SuccessSooner, WarningSooner } from './sooner.actions';
import { SoonerService } from '../../../shared/services/sooner.service';

export interface ISoonerModel {
  type: string;
  title?: string;
  message: string;
}
@State<ISoonerModel | null>({ name: 'sooner', defaults: null })
@Injectable({ providedIn: 'root' })
export class SoonerState {
  private readonly sooner = inject(SoonerService);

  @Action(ShowSooner)
  ShowSooner(ctx: StateContext<ISoonerModel>, { config }: ShowSooner) {
    ctx.patchState({ type: config.type, message: config.message, title: config.title });

    this.sooner.notify(config);
  }

  @Action(SuccessSooner)
  ShowSuccess(ctx: StateContext<ISoonerModel>, { message }: SuccessSooner) {
    ctx.patchState({ type: 'success', message });

    this.sooner.success(message);
  }

  @Action(ErrorSooner)
  ShowError(ctx: StateContext<ISoonerModel>, { payload }: ErrorSooner) {
    ctx.patchState({ type: 'error', message: payload.message, title: payload.title });

    this.sooner.error(payload);
  }

  @Action(WarningSooner)
  ShowWarning(ctx: StateContext<ISoonerModel>, { payload }: WarningSooner) {
    ctx.patchState({ type: 'warning', message: payload.message, title: payload.title });

    this.sooner.warning(payload);
  }
}
