import { inject, Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export enum SOONER_TYPE {
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export interface ISoonerConfig {
  type: SOONER_TYPE;
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SoonerService {
  private readonly notification = inject(NzNotificationService);

  public notify(config: ISoonerConfig): void {
    const title = config.title || this.getDefaultTitle(config.type);
    
    // Using .create() safely triggers the specific notification type
    this.notification.create(config.type, title, config.message, {
      nzClass: `sooner-toast sooner-${config.type}`,
    });
  }

  public success(message: string, title: string = 'Success'): void {
    this.notify({ type: SOONER_TYPE.SUCCESS, title, message });
  }

  public error(message: string, title: string = 'Error'): void {
    this.notify({ type: SOONER_TYPE.ERROR, title, message });
  }

  public warning(message: string, title: string = 'Warning'): void {
    this.notify({ type: SOONER_TYPE.WARNING, title, message });
  }

  private getDefaultTitle(type: SOONER_TYPE): string {
    switch (type) {
      case SOONER_TYPE.SUCCESS:
        return 'Success!';
      case SOONER_TYPE.ERROR:
        return 'Error!';
      case SOONER_TYPE.WARNING:
        return 'Warning!';
      default:
        return 'Notification';
    }
  }
}