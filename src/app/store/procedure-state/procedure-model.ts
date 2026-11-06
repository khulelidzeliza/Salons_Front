import { ProcedureType } from '../../../generated/graphql';

export const PROCEDURE_TYPES: { value: ProcedureType; label: string }[] = [
  { value: 'HAIR', label: 'procedure.HAIR' },
  { value: 'NAIL', label: 'procedure.NAIL' },
  { value: 'BARBER', label: 'procedure.BARBER' },
  { value: 'COSMETIC', label: 'procedure.COSMETIC' },
  { value: 'LASER', label: 'procedure.LASER' },
  { value: 'TATTOO', label: 'procedure.TATTOO' },
];

// Must match the order of the C# ProcedureType enum
export const PROCEDURE_TYPE_ID: Record<ProcedureType, number> = {
  HAIR: 0, NAIL: 1, BARBER: 2, COSMETIC: 3, LASER: 4, TATTOO: 5,
};

export interface ProcedurePayload {
  procedureType: ProcedureType;
  masters: string[];
  finishedWorks: File[];
}

export interface ProcedureDraft extends ProcedurePayload {
  id: number;
  masterDraft: string;
}

export interface ProcedureStateModel {
  drafts: ProcedureDraft[];
  saving: boolean;
  error: string | null;
}