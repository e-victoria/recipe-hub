import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { App } from './app';
import en from './i18n/en.json';
import ru from './i18n/ru.json';
import pl from './i18n/pl.json';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslocoTestingModule.forRoot({
          langs: { en, ru, pl },
          translocoConfig: { availableLangs: ['en', 'ru', 'pl'], defaultLang: 'en' },
          preloadLangs: true,
        }),
      ],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the translated brand and a language option per locale', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.brand')?.textContent?.trim()).toBe(en.app.name);
    expect(el.querySelectorAll('select option').length).toBe(3);
  });
});
