import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcedureType } from '../../../../generated/graphql';
import { ProcedurePayload } from '../../../store/procedure-state/procedure-model';

export interface UpdateProcedurePayload {
  procedureId: number;
  procedureType: ProcedureType;
  masters: string[];
  /** Existing photo paths to keep (anything not listed is deleted) */
  keepFinishedWorks: string[];
  /** New photos to upload */
  newFinishedWorks: File[];
}

@Injectable({ providedIn: 'root' })
export class ProcedureService {
  private readonly base = `/Procedure`;

  constructor(private http: HttpClient) {}

  addProcedure(salonId: number, userId: number, p: ProcedurePayload): Observable<unknown> {
    const fd = new FormData();
    fd.append('userid', String(userId));
    fd.append('SalonId', String(salonId));
    fd.append('ProcedureType', p.procedureType);
    p.masters.forEach(m => fd.append('Masters', m));
    p.finishedWorks.forEach(file => fd.append('FinishedWorks', file));

    return this.http.post(`${this.base}/add-procedure`, fd);
  }

  updateProcedure(p: UpdateProcedurePayload): Observable<unknown> {
    const fd = new FormData();
    fd.append('ProcedureId', String(p.procedureId));
    fd.append('ProcedureType', p.procedureType);
    p.masters.forEach(m => fd.append('Masters', m));
    p.keepFinishedWorks.forEach(path => fd.append('KeepFinishedWorks', path));
    p.newFinishedWorks.forEach(file => fd.append('NewFinishedWorks', file));

    return this.http.put(`${this.base}/update-procedure`, fd);
  }

  deleteProcedure(procedureId: number): Observable<unknown> {
    return this.http.delete(`${this.base}/delete-procedure/${procedureId}`);
  }
}
