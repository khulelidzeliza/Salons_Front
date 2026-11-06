import { TranslatePipe } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-tabs',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './service-tabs.component.html',
  styleUrl: './service-tabs.component.scss'
})
export class ServiceTabsComponent {
  @Input({ required: true }) categories: string[] = [];
  @Input() active: string | null = null;
  @Output() categorySelected = new EventEmitter<string>();
}