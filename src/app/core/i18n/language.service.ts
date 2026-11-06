import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'ka' | 'en';
const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly lang = signal<Lang>('ka');

  init(): void {
    const saved = this.isBrowser ? localStorage.getItem(STORAGE_KEY) : null;
    this.use(saved === 'en' || saved === 'ka' ? saved : 'ka');
  }

  use(lang: Lang): void {
    this.lang.set(lang);
    this.translate.use(lang);
    this.document.documentElement.lang = lang;
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, lang);
  }

  toggle(): void {
    this.use(this.lang() === 'ka' ? 'en' : 'ka');
  }
}
