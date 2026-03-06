import { en } from './en';
import { es } from './es';

export type Locale = 'en' | 'es';

let _locale: Locale = 'en';

const messages: Record<Locale, Record<string, string | ((...args: any[]) => string)>> = { en, es };

export function setLocale(locale: Locale): void {
    _locale = locale;
}

export function getLocale(): Locale {
    return _locale;
}

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
