import { inject, Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateService } from '@ngx-translate/core';

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
  private readonly translate = inject(TranslateService);

  public notify(config: ISoonerConfig): void {
    // title/message may be translation keys (e.g. 'toast.loginSuccess') or plain text
    const title = this.translate.instant(config.title || this.getDefaultTitle(config.type));
    const message = this.translate.instant(config.message);
    
    // Using .create() safely triggers the specific notification type
    this.notification.create(config.type, title, message, {
      nzClass: `sooner-toast sooner-${config.type}`,
    });
  }

  public success(message: string, title: string = 'toast.success'): void {
    this.notify({ type: SOONER_TYPE.SUCCESS, title, message });
  }

  public error(message: string, title: string = 'toast.error'): void {
    this.notify({ type: SOONER_TYPE.ERROR, title, message });
  }

  public warning(message: string, title: string = 'toast.warning'): void {
    this.notify({ type: SOONER_TYPE.WARNING, title, message });
  }

  private getDefaultTitle(type: SOONER_TYPE): string {
    switch (type) {
      case SOONER_TYPE.SUCCESS:
        return 'toast.defaultTitle.success';
      case SOONER_TYPE.ERROR:
        return 'toast.defaultTitle.error';
      case SOONER_TYPE.WARNING:
        return 'toast.defaultTitle.warning';
      default:
        return 'toast.defaultTitle.info';
    }
  }
}