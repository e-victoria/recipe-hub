import en from './en.json';
import ru from './ru.json';
import pl from './pl.json';

function keys(node: unknown, prefix = ''): string[] {
  if (node === null || typeof node !== 'object') {
    return [prefix];
  }
  return Object.entries(node).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe('translation files', () => {
  const reference = keys(en).sort();

  it.each([
    ['ru', ru],
    ['pl', pl],
  ])('%s has exactly the same keys as en', (_lang, translation) => {
    expect(keys(translation).sort()).toEqual(reference);
  });

  it.each([
    ['en', en],
    ['ru', ru],
    ['pl', pl],
  ])('%s has no empty strings', (_lang, translation) => {
    const flat = (n: unknown): unknown[] =>
      n !== null && typeof n === 'object' ? Object.values(n).flatMap(flat) : [n];
    expect(flat(translation).filter((v) => typeof v !== 'string' || v.trim() === '')).toEqual([]);
  });
});
