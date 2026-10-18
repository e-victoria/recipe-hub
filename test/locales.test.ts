import { describe, expect, it } from 'vitest'
import en from '../i18n/locales/en.json'
import ru from '../i18n/locales/ru.json'
import pl from '../i18n/locales/pl.json'

function keys(node: unknown, prefix = ''): string[] {
  if (node === null || typeof node !== 'object') {
    return [prefix]
  }
  return Object.entries(node).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
}

function values(node: unknown): unknown[] {
  return node !== null && typeof node === 'object' ? Object.values(node).flatMap(values) : [node]
}

describe('locale files', () => {
  const reference = keys(en).sort()

  it.each([['ru', ru], ['pl', pl]])('%s has exactly the same keys as en', (_lang, messages) => {
    expect(keys(messages).sort()).toEqual(reference)
  })

  it.each([['en', en], ['ru', ru], ['pl', pl]])('%s has no empty strings', (_lang, messages) => {
    expect(values(messages).filter((v) => typeof v !== 'string' || v.trim() === '')).toEqual([])
  })
})
