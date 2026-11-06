import { ISoonerConfig } from "../../../shared/services/sooner.service";


interface ISonnerPayload {
  title?: string;
  message: string;
}
export class ShowSooner {
  static readonly type = '[Sooner] show sooner';

  constructor(public config: ISoonerConfig) {}
}

export class SuccessSooner {
  static readonly type = '[Sooner] show success sooner';

  constructor(public message: string) {}
}

export class ErrorSooner {
  static readonly type = '[Sooner] show error sooner';

  constructor(public payload: ISonnerPayload) {}
}

export class WarningSooner {
  static readonly type = '[Sooner] show warning sooner';

  constructor(public payload: ISonnerPayload) {}
}
