"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocale = setLocale;
exports.getLocale = getLocale;
exports.getMessage = getMessage;
const en_1 = require("./en");
const es_1 = require("./es");
let _locale = 'en';
const messages = { en: en_1.en, es: es_1.es };
function setLocale(locale) {
    _locale = locale;
}
function getLocale() {
    return _locale;
}
function getMessage(key, ...args) {
    const localeMessages = messages[_locale];
    const msg = localeMessages[key];
    if (typeof msg === 'function')
        return msg(...args);
    if (typeof msg === 'string')
        return msg;
    // Fallback to English
    const enMsg = en_1.en[key];
    if (typeof enMsg === 'function')
        return enMsg(...args);
    if (typeof enMsg === 'string')
        return enMsg;
    return key;
}
