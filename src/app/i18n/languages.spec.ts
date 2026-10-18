import { DEFAULT_LANGUAGE, pickLanguage } from './languages';

describe('pickLanguage', () => {
  it('prefers a saved supported language', () => {
    expect(pickLanguage('pl', ['ru-RU'])).toBe('pl');
  });

  it('ignores an unsupported saved value and uses the browser language', () => {
    expect(pickLanguage('de', ['ru-RU', 'en-US'])).toBe('ru');
  });

  it('takes the first supported browser language, matching on the base tag', () => {
    expect(pickLanguage(null, ['de-DE', 'pl-PL', 'en'])).toBe('pl');
  });

  it('falls back to the default language', () => {
    expect(pickLanguage(null, ['de', 'fr'])).toBe(DEFAULT_LANGUAGE);
    expect(pickLanguage(null, [])).toBe(DEFAULT_LANGUAGE);
  });
});
