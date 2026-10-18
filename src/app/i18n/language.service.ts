import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { Language, isLanguage, pickLanguage } from './languages';

const STORAGE_KEY = 'recipe-hub.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    this.transloco.langChanges$.subscribe((lang) => {
      this.document.documentElement.lang = lang;
    });
  }

  /** Browser only: restores the saved or browser-preferred language. */
  restore(): void {
    if (!this.isBrowser) {
      return;
    }
    const nav = this.document.defaultView?.navigator;
    this.transloco.setActiveLang(pickLanguage(this.readSaved(), nav?.languages ?? []));
  }

  set(lang: string): void {
    if (!isLanguage(lang)) {
      return;
    }
    this.transloco.setActiveLang(lang);
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Storage can be unavailable (private mode); the choice just won't persist.
      }
    }
  }

  get active(): Language {
    const lang = this.transloco.getActiveLang();
    return isLanguage(lang) ? lang : 'en';
  }

  private readSaved(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
