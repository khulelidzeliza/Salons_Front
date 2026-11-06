import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import en from '../../../assets/i18n/en.json';
import ka from '../../../assets/i18n/ka.json';

/** Translations are bundled with the app: no HTTP request, works the same on the server (SSR) and in the browser. */
export class JsonTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of((lang === 'en' ? en : ka) as TranslationObject);
  }
}
