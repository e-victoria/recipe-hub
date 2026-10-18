import { Component, afterNextRender, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LanguageService } from './i18n/language.service';
import { LANGUAGES, LANGUAGE_LABELS } from './i18n/languages';

@Component({
  imports: [RouterOutlet, RouterLink, TranslocoDirective],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly language = inject(LanguageService);
  protected readonly languages = LANGUAGES;
  protected readonly labels = LANGUAGE_LABELS;

  constructor() {
    // Prerendered HTML is in the default language; switch after hydration so markup matches.
    afterNextRender(() => this.language.restore());
  }
}
