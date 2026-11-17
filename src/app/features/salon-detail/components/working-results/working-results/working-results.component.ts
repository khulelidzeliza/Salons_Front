import { TranslatePipe } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { env } from '../../../../../../environments/environment';

export interface WorkingResultProcedure {
  id: number | string;
  procedureType: string;
  finishedWorks: string[];
}

@Component({
  selector: 'app-working-results',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './working-results.component.html',
  styleUrl: './working-results.component.scss'
})
export class WorkingResultsComponent {
  @Input({ required: true }) procedures: WorkingResultProcedure[] = [];
  /** Owner only: shows the dashed "Add photos" tile */
  @Input() canAdd = false;
  @Output() add = new EventEmitter<void>();
  serverUrl = env.SERVER_URL;
}
