import { en } from './en';
import { es } from './es';
import { pt } from './pt';
import { fr } from './fr';
import { de } from './de';

export type Locale = 'en' | 'es' | 'pt' | 'fr' | 'de';

let _locale: Locale = 'en';

const messages: Record<Locale, Record<string, string | ((...args: any[]) => string)>> = { en, es, pt, fr, de };

/**
 * Sets the global default locale for all ValiValid engine instances.
 * Individual engines can override this via `engine.setLocale()`.
 * @param locale - One of the supported locales: 'en', 'es', 'pt', 'fr', 'de'
 */
export function setLocale(locale: Locale): void {
    _locale = locale;
}

export function getLocale(): Locale {
    return _locale;
}

/**
 * Retrieves the error message for the given validation key in the active locale.
 * @param key - Message key (e.g. 'required', 'email', 'minLength')
 * @param args - Optional arguments passed to the message function (e.g. min/max values)
 * @returns Formatted error message string
 */
export function getMessage(key: string, ...args: any[]): string {
    const localeMessages = messages[_locale];
    const msg = localeMessages[key];
    if (typeof msg === 'function') return msg(...args);
    if (typeof msg === 'string') return msg;
    // Fallback to English
    const enMsg = en[key];
    if (typeof enMsg === 'function') return enMsg(...args);
    if (typeof enMsg === 'string') return enMsg;
    return key;
}

/**
 * Retrieves the error message for the given key in a SPECIFIC locale,
 * without touching the global singleton. Safe for SSR/per-request usage.
 * @param key - Message key (e.g. 'required', 'email', 'minLength')
 * @param locale - The locale to use
 * @param args - Optional arguments passed to the message function
 * @returns Formatted error message string
 */
export function getMessageForLocale(key: string, locale: Locale, ...args: any[]): string {
    const localeMessages = messages[locale] ?? messages['en'];
    const msg = (localeMessages as Record<string, string | ((...a: any[]) => string)>)[key];
    if (typeof msg === 'function') return msg(...args);
    if (typeof msg === 'string') return msg;
    // Fallback to English
    const enMsg = en[key];
    if (typeof enMsg === 'function') return enMsg(...args);
    if (typeof enMsg === 'string') return enMsg;
    return key;
}

/** Read-only array of all supported locale codes. */
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es', 'pt', 'fr', 'de'] as const;
