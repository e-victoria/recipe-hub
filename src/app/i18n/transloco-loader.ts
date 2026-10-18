import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Language } from './languages';

// Bundled as lazy chunks so the same loader works in the browser and during SSR/prerender,
// without an HTTP round trip to the app's own origin.
const loaders: Record<Language, () => Promise<{ default: Translation }>> = {
  en: () => import('./en.json'),
  ru: () => import('./ru.json'),
  pl: () => import('./pl.json'),
};

@Injectable({ providedIn: 'root' })
export class AppTranslocoLoader implements TranslocoLoader {
  async getTranslation(lang: string): Promise<Translation> {
    const load = loaders[lang as Language] ?? loaders.en;
    return (await load()).default;
  }
}
