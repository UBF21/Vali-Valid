import { describe, it, expect } from 'vitest';
import {
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateExactLength,
    validateEmail,
    validateUrl,
    validateAlpha,
    validateAlphaNumeric,
    validateLowerCase,
    validateUpperCase,
    validateNoWhitespace,
    validateContains,
    validateStartsWith,
    validateEndsWith,
    validateSlug,
    validatePasswordStrength,
    validateHexColor,
    validateIPv4,
    validateUUID,
    validateJson,
    validatePhone,
    validateCreditCard,
    validateDigitsOnly,
    validateNumberRange,
    validateNumberPositive,
    validateNumberNegative,
    validateInteger,
    validateMultipleOf,
    validateDateFormat,
    validateMinDate,
    validateMaxDate,
    validateFutureDate,
    validatePastDate,
    validateDateAfter,
    validateDateBefore,
    validateGreaterThan,
    validateLessThan,
    validatePrecision,
    validateOneOf,
    validateNotOneOf,
    validateArrayMinLength,
    validateArrayMaxLength,
    validateArrayUnique,
    validateArrayContains,
    validateNoHTML,
    validateIBAN,
    validatePostalCode,
    validateLatitude,
    validateLongitude,
    validateSemVer,
    validateBase64,
    validateIPv6,
    validateMACAddress,
    validateDataURI,
    validateMimeType,
    validateTime,
    validateFileType,
    validateFileSize,
    sanitizeNumber,
} from '../constants/index';
import { DateFormat, TypeFile } from '../types/index';

describe('String Validators', () => {
    describe('validateRequired', () => {
        it('returns true for non-empty string', () => expect(validateRequired('hello')).toBe(true));
        it('returns false for empty string', () => expect(validateRequired('')).toBe(false));
        it('returns false for null', () => expect(validateRequired(null)).toBe(false));
        it('returns false for undefined', () => expect(validateRequired(undefined)).toBe(false));
        it('returns false for whitespace only', () => expect(validateRequired('   ')).toBe(false));
        it('returns true for zero number', () => expect(validateRequired(0)).toBe(true));
        it('returns true for false boolean', () => expect(validateRequired(false)).toBe(true));
    });

    describe('validateMinLength', () => {
        it('returns true when length >= min', () => expect(validateMinLength('hello', 3)).toBe(true));
        it('returns false when length < min', () => expect(validateMinLength('hi', 3)).toBe(false));
        it('returns true when length equals min', () => expect(validateMinLength('abc', 3)).toBe(true));
        it('returns false for empty string (minLength checks length)', () => expect(validateMinLength('', 3)).toBe(false));
    });

    describe('validateMaxLength', () => {
        it('returns true when length <= max', () => expect(validateMaxLength('hi', 5)).toBe(true));
        it('returns false when length > max', () => expect(validateMaxLength('toolong', 5)).toBe(false));
        it('returns true when length equals max', () => expect(validateMaxLength('hello', 5)).toBe(true));
    });

    describe('validateExactLength', () => {
        it('returns true when length equals exact', () => expect(validateExactLength('abc', 3)).toBe(true));
        it('returns false when length differs', () => expect(validateExactLength('ab', 3)).toBe(false));
    });

    describe('validateEmail', () => {
        it('returns true for valid email', () => expect(validateEmail('user@example.com')).toBe(true));
        it('returns false for missing @', () => expect(validateEmail('userexample.com')).toBe(false));
        it('returns false for missing domain', () => expect(validateEmail('user@')).toBe(false));
        it('returns false for empty string', () => expect(validateEmail('')).toBe(false));
    });

    describe('validateUrl', () => {
        it('returns true for valid https URL', () => expect(validateUrl('https://example.com')).toBe(true));
        it('returns true for valid http URL', () => expect(validateUrl('http://example.com')).toBe(true));
        it('returns false for invalid URL', () => expect(validateUrl('not-a-url')).toBe(false));
        it('returns false for empty string', () => expect(validateUrl('')).toBe(false));
    });

    describe('validateAlpha', () => {
        it('returns true for letters only', () => expect(validateAlpha('hello')).toBe(true));
        it('returns false for letters with numbers', () => expect(validateAlpha('hello1')).toBe(false));
        it('returns false for empty string', () => expect(validateAlpha('')).toBe(false));
    });

    describe('validateSlug', () => {
        it('returns true for valid slug', () => expect(validateSlug('my-slug-123')).toBe(true));
        it('returns false for slug with spaces', () => expect(validateSlug('my slug')).toBe(false));
        it('returns false for slug with uppercase', () => expect(validateSlug('MySlug')).toBe(false));
    });

    describe('validatePasswordStrength', () => {
        it('returns true for strong password', () => expect(validatePasswordStrength('Passw0rd!')).toBe(true));
        it('returns false for weak password', () => expect(validatePasswordStrength('password')).toBe(false));
        it('returns false for too short', () => expect(validatePasswordStrength('P1!')).toBe(false));
    });

    describe('validateHexColor', () => {
        it('returns true for valid 6-char hex', () => expect(validateHexColor('#FF5733')).toBe(true));
        it('returns true for valid 3-char hex', () => expect(validateHexColor('#FFF')).toBe(true));
        it('returns false for missing #', () => expect(validateHexColor('FF5733')).toBe(false));
        it('returns false for invalid chars', () => expect(validateHexColor('#GGGGGG')).toBe(false));
    });

    describe('validateIPv4', () => {
        it('returns true for valid IPv4', () => expect(validateIPv4('192.168.1.1')).toBe(true));
        it('returns false for out of range', () => expect(validateIPv4('256.0.0.1')).toBe(false));
        it('returns false for incomplete', () => expect(validateIPv4('192.168.1')).toBe(false));
    });

    describe('validateUUID', () => {
        it('returns true for valid UUID v4', () => expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true));
        it('returns false for invalid UUID', () => expect(validateUUID('not-a-uuid')).toBe(false));
    });

    describe('validateJson', () => {
        it('returns true for valid JSON object', () => expect(validateJson('{"key":"value"}')).toBe(true));
        it('returns true for valid JSON array', () => expect(validateJson('[1,2,3]')).toBe(true));
        it('returns false for invalid JSON', () => expect(validateJson('{invalid}')).toBe(false));
        it('returns true for JSON null primitive (parseable JSON)', () => expect(validateJson('null')).toBe(true));
        it('returns true for JSON boolean primitive (parseable JSON)', () => expect(validateJson('true')).toBe(true));
        it('returns true for JSON number primitive (parseable JSON)', () => expect(validateJson('0')).toBe(true));
        it('returns true for JSON string primitive (parseable JSON)', () => expect(validateJson('"hello"')).toBe(true));
        it('returns true for number coerced to string (JSON.parse coerces)', () => expect(validateJson(42 as any)).toBe(true));
    });

    describe('validateNoHTML', () => {
        it('returns true for plain text', () => expect(validateNoHTML('hello world')).toBe(true));
        it('returns false for string with HTML tags', () => expect(validateNoHTML('<script>alert(1)</script>')).toBe(false));
        it('returns false for string with anchor tag', () => expect(validateNoHTML('<a href="x">link</a>')).toBe(false));
    });
});

describe('Numeric Validators', () => {
    describe('validateDigitsOnly', () => {
        it('returns true for digit string', () => expect(validateDigitsOnly('12345')).toBe(true));
        it('returns false for alphanumeric', () => expect(validateDigitsOnly('123abc')).toBe(false));
        it('returns false for number input (typeof guard)', () => expect(validateDigitsOnly(12345 as any)).toBe(false));
        it('returns false for null input (typeof guard)', () => expect(validateDigitsOnly(null as any)).toBe(false));
    });

    describe('validateNumberRange', () => {
        it('returns true when within range', () => expect(validateNumberRange(5, 1, 10)).toBe(true));
        it('returns false when below range', () => expect(validateNumberRange(0, 1, 10)).toBe(false));
        it('returns false when above range', () => expect(validateNumberRange(11, 1, 10)).toBe(false));
        it('returns true for boundary values', () => {
            expect(validateNumberRange(1, 1, 10)).toBe(true);
            expect(validateNumberRange(10, 1, 10)).toBe(true);
        });
    });

    describe('validateNumberPositive', () => {
        it('returns true for positive number', () => expect(validateNumberPositive(5)).toBe(true));
        it('returns false for zero', () => expect(validateNumberPositive(0)).toBe(false));
        it('returns false for negative', () => expect(validateNumberPositive(-1)).toBe(false));
        it('returns false for non-numeric string', () => expect(validateNumberPositive('abc' as any)).toBe(false));
        it('returns false for empty string (Number(\'\') === 0, not positive)', () => expect(validateNumberPositive('' as any)).toBe(false));
    });

    describe('validateNumberNegative', () => {
        it('returns true for negative number', () => expect(validateNumberNegative(-1)).toBe(true));
        it('returns false for zero', () => expect(validateNumberNegative(0)).toBe(false));
        it('returns false for positive', () => expect(validateNumberNegative(1)).toBe(false));
        it('returns false for non-numeric string', () => expect(validateNumberNegative('abc' as any)).toBe(false));
        it('returns false for empty string (Number(\'\') === 0, not negative)', () => expect(validateNumberNegative('' as any)).toBe(false));
    });

    describe('validateInteger', () => {
        it('returns true for integer', () => expect(validateInteger(5)).toBe(true));
        it('returns false for decimal', () => expect(validateInteger(5.5)).toBe(false));
    });

    describe('validateMultipleOf', () => {
        it('returns true when value is multiple', () => expect(validateMultipleOf(10, 5)).toBe(true));
        it('returns false when not multiple', () => expect(validateMultipleOf(11, 5)).toBe(false));
    });

    describe('validateGreaterThan', () => {
        it('returns true when value > threshold', () => expect(validateGreaterThan(5, 3)).toBe(true));
        it('returns false when value == threshold', () => expect(validateGreaterThan(3, 3)).toBe(false));
        it('returns false when value < threshold', () => expect(validateGreaterThan(2, 3)).toBe(false));
        it('returns false for non-numeric string (NaN > n === false)', () => expect(validateGreaterThan('abc', 3)).toBe(false));
        it('returns false for empty string (Number(\'\') === 0, 0 > 3 === false)', () => expect(validateGreaterThan('', 3)).toBe(false));
    });

    describe('validateLessThan', () => {
        it('returns true when value < threshold', () => expect(validateLessThan(2, 5)).toBe(true));
        it('returns false when value == threshold', () => expect(validateLessThan(5, 5)).toBe(false));
        it('returns false for non-numeric string (NaN < n === false)', () => expect(validateLessThan('abc', 5)).toBe(false));
        it('returns true for empty string (Number(\'\') === 0, 0 < 5 === true)', () => expect(validateLessThan('', 5)).toBe(true));
    });

    describe('validatePrecision', () => {
        it('returns true when decimals <= precision', () => expect(validatePrecision(1.23, 2)).toBe(true));
        it('returns false when decimals > precision', () => expect(validatePrecision(1.234, 2)).toBe(false));
        it('returns true for non-numeric string without dot (no decimal part)', () => expect(validatePrecision('abc', 2)).toBe(true));
        it('returns true for empty string (no decimal part)', () => expect(validatePrecision('', 2)).toBe(true));
    });

    describe('validateOneOf', () => {
        it('returns true when value is in list', () => expect(validateOneOf('a', ['a', 'b', 'c'])).toBe(true));
        it('returns false when value is not in list', () => expect(validateOneOf('d', ['a', 'b', 'c'])).toBe(false));
    });

    describe('validateNotOneOf', () => {
        it('returns true when value is NOT in list', () => expect(validateNotOneOf('d', ['a', 'b', 'c'])).toBe(true));
        it('returns false when value IS in list', () => expect(validateNotOneOf('a', ['a', 'b', 'c'])).toBe(false));
    });
});

describe('Date Validators', () => {
    describe('validateDateFormat', () => {
        it('validates DD/MM/YYYY format', () => {
            expect(validateDateFormat('25/12/2023', DateFormat['DD/MM/YYYY'])).toBe(true);
            expect(validateDateFormat('2023-12-25', DateFormat['DD/MM/YYYY'])).toBe(false);
        });
        it('validates YYYY-MM-DD format', () => {
            expect(validateDateFormat('2023-12-25', DateFormat['YYYY-MM-DD'])).toBe(true);
        });
    });

    describe('validateFutureDate', () => {
        it('returns true for future date', () => {
            const future = new Date();
            future.setFullYear(future.getFullYear() + 1);
            expect(validateFutureDate(future.toISOString().split('T')[0])).toBe(true);
        });
        it('returns false for past date', () => {
            expect(validateFutureDate('2000-01-01')).toBe(false);
        });
    });

    describe('validatePastDate', () => {
        it('returns true for past date', () => {
            expect(validatePastDate('2000-01-01')).toBe(true);
        });
        it('returns false for future date', () => {
            const future = new Date();
            future.setFullYear(future.getFullYear() + 1);
            expect(validatePastDate(future.toISOString().split('T')[0])).toBe(false);
        });
    });
});

describe('Array Validators', () => {
    describe('validateArrayMinLength', () => {
        it('returns true when array length >= min', () => expect(validateArrayMinLength([1, 2, 3], 2)).toBe(true));
        it('returns false when array length < min', () => expect(validateArrayMinLength([1], 2)).toBe(false));
        it('returns false for non-array', () => expect(validateArrayMinLength('not array', 1)).toBe(false));
    });

    describe('validateArrayMaxLength', () => {
        it('returns true when array length <= max', () => expect(validateArrayMaxLength([1, 2], 3)).toBe(true));
        it('returns false when array length > max', () => expect(validateArrayMaxLength([1, 2, 3, 4], 3)).toBe(false));
    });

    describe('validateArrayUnique', () => {
        it('returns true for unique array', () => expect(validateArrayUnique([1, 2, 3])).toBe(true));
        it('returns false for array with duplicates', () => expect(validateArrayUnique([1, 2, 2])).toBe(false));
        it('returns false for array with duplicate NaN values', () => expect(validateArrayUnique([NaN, NaN])).toBe(false));
        it('returns true for array with NaN and null (different values)', () => expect(validateArrayUnique([NaN, null])).toBe(true));
    });

    describe('validateArrayContains', () => {
        it('returns true when array contains value', () => expect(validateArrayContains([1, 2, 3], 2)).toBe(true));
        it('returns false when array does not contain value', () => expect(validateArrayContains([1, 2, 3], 4)).toBe(false));
        it('returns true when array contains NaN and searching for NaN', () => expect(validateArrayContains([1, NaN, 3], NaN)).toBe(true));
        it('returns false when array does not contain NaN (has null instead)', () => expect(validateArrayContains([1, null, 3], NaN)).toBe(false));
    });
});

describe('Network/Format Validators', () => {
    describe('validateIPv6', () => {
        it('returns true for valid IPv6', () => expect(validateIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true));
        it('returns true for abbreviated IPv6', () => expect(validateIPv6('::1')).toBe(true));
        it('returns false for invalid IPv6', () => expect(validateIPv6('not-ipv6')).toBe(false));
        it('returns false for IPv4', () => expect(validateIPv6('192.168.1.1')).toBe(false));
    });

    describe('validateMACAddress', () => {
        it('returns true for valid MAC with colons', () => expect(validateMACAddress('00:1B:44:11:3A:B7')).toBe(true));
        it('returns true for valid MAC with hyphens', () => expect(validateMACAddress('00-1B-44-11-3A-B7')).toBe(true));
        it('returns false for invalid MAC', () => expect(validateMACAddress('00:1B:44:11:3A')).toBe(false));
    });

    describe('validateDataURI', () => {
        it('returns true for valid data URI', () => expect(validateDataURI('data:image/png;base64,abc123==')).toBe(true));
        it('returns false for plain string', () => expect(validateDataURI('hello world')).toBe(false));
        it('returns false for URL', () => expect(validateDataURI('https://example.com')).toBe(false));
    });

    describe('validateMimeType', () => {
        const mockFile = (type: string) => ({ type } as File);
        it('returns true for exact MIME match', () => expect(validateMimeType(mockFile('image/png'), ['image/png'])).toBe(true));
        it('returns true for wildcard MIME match', () => expect(validateMimeType(mockFile('image/jpeg'), ['image/*'])).toBe(true));
        it('returns false for non-matching MIME', () => expect(validateMimeType(mockFile('application/pdf'), ['image/*'])).toBe(false));
        it('returns true when one of multiple patterns matches', () => expect(validateMimeType(mockFile('video/mp4'), ['image/*', 'video/*'])).toBe(true));
    });

    describe('validateIBAN', () => {
        it('returns true for valid IBAN', () => expect(validateIBAN('GB29NWBK60161331926819')).toBe(true));
        it('returns false for invalid IBAN', () => expect(validateIBAN('INVALID')).toBe(false));
    });

    describe('validateSemVer', () => {
        it('returns true for valid semver', () => expect(validateSemVer('1.2.3')).toBe(true));
        it('returns true for semver with pre-release', () => expect(validateSemVer('1.0.0-alpha.1')).toBe(true));
        it('returns false for invalid semver', () => expect(validateSemVer('1.2')).toBe(false));
        it('returns true for leading zeros (regex uses \\d+ which allows leading zeros)', () => expect(validateSemVer('01.2.3')).toBe(true));
        it('returns true for leading zeros in minor (regex uses \\d+ which allows leading zeros)', () => expect(validateSemVer('1.02.3')).toBe(true));
    });

    describe('validateBase64', () => {
        it('returns true for valid base64', () => expect(validateBase64('SGVsbG8gV29ybGQ=')).toBe(true));
        it('returns false for invalid base64', () => expect(validateBase64('not base64!')).toBe(false));
        it('returns false for empty string', () => expect(validateBase64('')).toBe(false));
    });

    describe('validateLatitude', () => {
        it('returns true for valid latitude', () => expect(validateLatitude(45.0)).toBe(true));
        it('returns false for latitude > 90', () => expect(validateLatitude(91.0)).toBe(false));
        it('returns false for latitude < -90', () => expect(validateLatitude(-91.0)).toBe(false));
    });

    describe('validateLongitude', () => {
        it('returns true for valid longitude', () => expect(validateLongitude(90.0)).toBe(true));
        it('returns false for longitude > 180', () => expect(validateLongitude(181.0)).toBe(false));
    });
});

describe('Time Validators', () => {
    describe('validateTime', () => {
        it('returns true for valid 24h time', () => expect(validateTime('14:30')).toBe(true));
        it('returns false for 24h time with seconds (seconds not supported in current regex)', () => expect(validateTime('14:30:59')).toBe(false));
        it('returns false for invalid hours in 24h format', () => expect(validateTime('25:00')).toBe(false));
        it('returns false for invalid minutes in 24h format', () => expect(validateTime('14:60')).toBe(false));
        it('returns true for valid 12h time with AM', () => expect(validateTime('12:30 AM', '12h')).toBe(true));
        it('returns false for 12h time with seconds (seconds not supported in current regex)', () => expect(validateTime('12:30:45 PM', '12h')).toBe(false));
        it('returns false for 12h time missing AM/PM', () => expect(validateTime('12:30', '12h')).toBe(false));
    });
});

// ---------------------------------------------------------------------------
// NEW TESTS — appended to reach 60+ additional cases
// ---------------------------------------------------------------------------

describe('String Validators — Edge Cases', () => {
    describe('validateRequired — additional types', () => {
        it('returns false for empty array', () => expect(validateRequired([])).toBe(false));
        it('returns true for non-empty array', () => expect(validateRequired([1])).toBe(true));
        it('returns true for a File object', () => {
            const f = new File(['content'], 'test.txt', { type: 'text/plain' });
            expect(validateRequired(f)).toBe(true);
        });
        it('returns false for null', () => expect(validateRequired(null)).toBe(false));
        it('returns false for undefined', () => expect(validateRequired(undefined)).toBe(false));
        it('returns true for number 0', () => expect(validateRequired(0)).toBe(true));
        it('returns true for boolean false', () => expect(validateRequired(false)).toBe(true));
    });

    describe('validateEmail — edge cases', () => {
        it('returns false when TLD is missing', () => expect(validateEmail('user@example')).toBe(false));
        it('returns false for multiple @ symbols', () => expect(validateEmail('a@@b.com')).toBe(false));
        it('returns false for local-part only (no @)', () => expect(validateEmail('useronly')).toBe(false));
        it('returns true for subdomain address', () => expect(validateEmail('user@mail.sub.example.com')).toBe(true));
        it('returns true for plus-addressing', () => expect(validateEmail('user+tag@example.com')).toBe(true));
    });

    describe('validateUrl — edge cases', () => {
        it('returns true for ftp:// URL', () => expect(validateUrl('ftp://files.example.com/resource')).toBe(true));
        it('returns false for URL without protocol', () => expect(validateUrl('example.com')).toBe(false));
        it('returns true for localhost with port', () => expect(validateUrl('http://localhost:3000')).toBe(true));
    });

    describe('validateAlpha — accented characters', () => {
        // REGEX_ALPHA = /^[a-zA-Z]+$/ — accented letters are NOT in that range
        it('returns false for string with accented letter é', () => expect(validateAlpha('héllo')).toBe(false));
        it('returns false for string with ñ', () => expect(validateAlpha('mañana')).toBe(false));
        it('returns true for plain ASCII letters', () => expect(validateAlpha('Hello')).toBe(true));
    });

    describe('validateAlphaNumeric — edge cases', () => {
        it('returns true for mixed letters and digits', () => expect(validateAlphaNumeric('abc123')).toBe(true));
        it('returns false for underscore', () => expect(validateAlphaNumeric('abc_123')).toBe(false));
        it('returns false for empty string', () => expect(validateAlphaNumeric('')).toBe(false));
    });

    describe('validateLowerCase — edge cases', () => {
        it('returns true for all lowercase', () => expect(validateLowerCase('hello')).toBe(true));
        it('returns false for mixed case', () => expect(validateLowerCase('Hello')).toBe(false));
        it('returns false for empty string', () => expect(validateLowerCase('')).toBe(false));
    });

    describe('validateUpperCase — edge cases', () => {
        it('returns true for all uppercase', () => expect(validateUpperCase('HELLO')).toBe(true));
        it('returns false for mixed case', () => expect(validateUpperCase('Hello')).toBe(false));
        it('returns false for empty string', () => expect(validateUpperCase('')).toBe(false));
    });

    describe('validateNoWhitespace — edge cases', () => {
        it('returns true for string without spaces', () => expect(validateNoWhitespace('nospaces')).toBe(true));
        it('returns false for string with internal space', () => expect(validateNoWhitespace('has space')).toBe(false));
        it('returns false for tab character', () => expect(validateNoWhitespace('tab\there')).toBe(false));
    });

    describe('validateContains — case sensitivity', () => {
        it('returns true when substring is present', () => expect(validateContains('hello world', 'world')).toBe(true));
        it('returns false when case does not match (case-sensitive)', () => expect(validateContains('hello world', 'WORLD')).toBe(false));
        it('returns false when substring is absent', () => expect(validateContains('hello', 'xyz')).toBe(false));
    });

    describe('validateStartsWith — edge cases', () => {
        it('returns true when string starts with prefix', () => expect(validateStartsWith('hello world', 'hello')).toBe(true));
        it('returns true for empty prefix (every string starts with "")', () => expect(validateStartsWith('anything', '')).toBe(true));
        it('returns false when prefix does not match', () => expect(validateStartsWith('hello', 'world')).toBe(false));
    });

    describe('validateEndsWith — edge cases', () => {
        it('returns true when string ends with suffix', () => expect(validateEndsWith('hello world', 'world')).toBe(true));
        it('returns true for empty suffix (every string ends with "")', () => expect(validateEndsWith('anything', '')).toBe(true));
        it('returns false when suffix does not match', () => expect(validateEndsWith('hello', 'xyz')).toBe(false));
    });

    describe('validateSlug — edge cases', () => {
        it('returns true for slug with numbers', () => expect(validateSlug('my-slug-123')).toBe(true));
        it('returns false for slug starting with hyphen', () => expect(validateSlug('-bad-slug')).toBe(false));
        it('returns false for slug ending with hyphen', () => expect(validateSlug('bad-slug-')).toBe(false));
        it('returns false for consecutive hyphens', () => expect(validateSlug('bad--slug')).toBe(false));
        it('returns true for numbers-only slug', () => expect(validateSlug('123')).toBe(true));
    });

    describe('validatePasswordStrength — edge cases', () => {
        it('returns true for exactly 8 chars with uppercase, lowercase, digit, and special char', () =>
            expect(validatePasswordStrength('Passw0r!')).toBe(true));
        it('returns false for 7 chars even with all character types', () =>
            expect(validatePasswordStrength('Pas0r!x')).toBe(false));
        it('returns false when no special character is present', () =>
            expect(validatePasswordStrength('Password1')).toBe(false));
        it('returns false when no digit is present', () =>
            expect(validatePasswordStrength('Password!')).toBe(false));
        it('returns false when no uppercase letter is present', () =>
            expect(validatePasswordStrength('passw0rd!')).toBe(false));
    });

    describe('validateHexColor — edge cases', () => {
        it('returns false for 4-character hex (not 3 or 6)', () => expect(validateHexColor('#FFFF')).toBe(false));
        it('returns false for 6-character hex without #', () => expect(validateHexColor('FF5733')).toBe(false));
        it('returns true for uppercase 6-character hex', () => expect(validateHexColor('#AABBCC')).toBe(true));
        it('returns true for lowercase 6-character hex', () => expect(validateHexColor('#aabbcc')).toBe(true));
    });

    describe('validateUUID — edge cases', () => {
        it('returns true for valid v4 UUID', () =>
            expect(validateUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(true));
        it('returns false when version digit is not 4', () =>
            expect(validateUUID('550e8400-e29b-31d4-a716-446655440000')).toBe(false));
        it('returns false for random non-UUID string', () =>
            expect(validateUUID('random-string-here')).toBe(false));
    });

    describe('validatePhone — edge cases', () => {
        it('returns true for E.164 format +15555555555', () => expect(validatePhone('+15555555555')).toBe(true));
        it('returns false for too-short number', () => expect(validatePhone('+123')).toBe(false));
        it('returns true for number with spaces (spaces are stripped)', () =>
            expect(validatePhone('+1 555 555 5555')).toBe(true));
        it('returns false for number with dashes that produce invalid sequence', () =>
            expect(validatePhone('555-1234')).toBe(false));
    });

    describe('validateCreditCard — Luhn algorithm', () => {
        // Visa test card — Luhn valid
        it('returns true for a Luhn-valid card number', () =>
            expect(validateCreditCard('4111111111111111')).toBe(true));
        // One digit off → Luhn invalid
        it('returns false for a Luhn-invalid card number', () =>
            expect(validateCreditCard('4111111111111112')).toBe(false));
        it('returns false for a number that is too short (< 13 digits)', () =>
            expect(validateCreditCard('41111')).toBe(false));
        it('returns true for Mastercard test number', () =>
            expect(validateCreditCard('5500005555555559')).toBe(true));
    });
});

describe('Numeric Validators — Edge Cases', () => {
    describe('validateNumberRange — boundary and float', () => {
        it('returns true at exact minimum boundary', () => expect(validateNumberRange(1, 1, 10)).toBe(true));
        it('returns true at exact maximum boundary', () => expect(validateNumberRange(10, 1, 10)).toBe(true));
        it('returns true for float within range', () => expect(validateNumberRange(5.5, 1, 10)).toBe(true));
        it('returns false for float below range', () => expect(validateNumberRange(0.9, 1, 10)).toBe(false));
        it('returns false for non-number string (typeof guard)', () =>
            expect(validateNumberRange('5' as any, 1, 10)).toBe(false));
    });

    describe('validateInteger — edge cases', () => {
        it('returns false for float value', () => expect(validateInteger(5.5)).toBe(false));
        it('returns true for 0 (integer)', () => expect(validateInteger(0)).toBe(true));
        it('returns true for negative integer', () => expect(validateInteger(-7)).toBe(true));
        it('returns false for non-number string', () => expect(validateInteger('5' as any)).toBe(false));
    });

    describe('validateMultipleOf — edge cases', () => {
        it('returns true for 0 value (0 % any non-zero === 0)', () => expect(validateMultipleOf(0, 5)).toBe(true));
        it('returns false when multiple is 0 (guard prevents division by zero)', () =>
            expect(validateMultipleOf(10, 0)).toBe(false));
        it('returns true for negative multiple', () => expect(validateMultipleOf(-10, 5)).toBe(true));
        it('returns false for non-multiple', () => expect(validateMultipleOf(7, 3)).toBe(false));
    });

    describe('validateGreaterThan — boundary cases', () => {
        it('returns false at exact boundary (strictly greater)', () => expect(validateGreaterThan(3, 3)).toBe(false));
        it('returns true just above float boundary', () => expect(validateGreaterThan(3.01, 3)).toBe(true));
        it('returns false just below float boundary', () => expect(validateGreaterThan(2.99, 3)).toBe(false));
    });

    describe('validateLessThan — boundary cases', () => {
        it('returns false at exact boundary (strictly less)', () => expect(validateLessThan(5, 5)).toBe(false));
        it('returns true just below float boundary', () => expect(validateLessThan(4.99, 5)).toBe(true));
        it('returns true for negative values below threshold', () => expect(validateLessThan(-10, 0)).toBe(true));
    });

    describe('validatePrecision — edge cases', () => {
        it('returns true for 1 decimal when precision is 2', () => expect(validatePrecision(1.5, 2)).toBe(true));
        it('returns false for 3 decimals when precision is 2', () => expect(validatePrecision(1.555, 2)).toBe(false));
        it('returns true for integer value (no decimal part)', () => expect(validatePrecision(42, 2)).toBe(true));
        it('returns true for scientific notation 1e-5 string (no "." found via indexOf)', () =>
            // String(1e-5) === "0.00001" which has 5 decimal places
            expect(validatePrecision(1e-5, 6)).toBe(true));
        it('returns false when scientific notation exceeds precision', () =>
            expect(validatePrecision(1e-5, 4)).toBe(false));
        it('returns true for floating-point noise (0.1 + 0.2 with precision 2)', () =>
            expect(validatePrecision(0.1 + 0.2, 2)).toBe(true));
    });
});

describe('Date Validators — Edge Cases', () => {
    describe('validateMinDate — boundary', () => {
        it('returns true when date equals minDate (inclusive)', () =>
            expect(validateMinDate('2023-06-15', '2023-06-15')).toBe(true));
        it('returns false when date is one day before minDate', () =>
            expect(validateMinDate('2023-06-14', '2023-06-15')).toBe(false));
        it('returns true when date is after minDate', () =>
            expect(validateMinDate('2023-06-16', '2023-06-15')).toBe(true));
    });

    describe('validateMaxDate — boundary', () => {
        it('returns true when date equals maxDate (inclusive)', () =>
            expect(validateMaxDate('2023-06-15', '2023-06-15')).toBe(true));
        it('returns false when date is one day after maxDate', () =>
            expect(validateMaxDate('2023-06-16', '2023-06-15')).toBe(false));
        it('returns true when date is before maxDate', () =>
            expect(validateMaxDate('2023-06-14', '2023-06-15')).toBe(true));
    });

    describe('validateFutureDate — additional cases', () => {
        it('returns true for a far-future date', () =>
            expect(validateFutureDate('2999-12-31')).toBe(true));
        it('returns false for a past date', () =>
            expect(validateFutureDate('2000-01-01')).toBe(false));
        it('returns false for an invalid date string', () =>
            expect(validateFutureDate('not-a-date')).toBe(false));
    });

    describe('validatePastDate — additional cases', () => {
        it('returns true for a far-past date', () =>
            expect(validatePastDate('1900-01-01')).toBe(true));
        it('returns false for a far-future date', () =>
            expect(validatePastDate('2999-12-31')).toBe(false));
        it('returns false for an invalid date string', () =>
            expect(validatePastDate('not-a-date')).toBe(false));
    });

    describe('validateDateAfter — strictly after', () => {
        it('returns false when value equals reference date (strictly after required)', () =>
            expect(validateDateAfter('2023-06-15', '2023-06-15')).toBe(false));
        it('returns true when value is one day after reference', () =>
            expect(validateDateAfter('2023-06-16', '2023-06-15')).toBe(true));
        it('returns false when value is before reference', () =>
            expect(validateDateAfter('2023-06-14', '2023-06-15')).toBe(false));
    });

    describe('validateDateBefore — strictly before', () => {
        it('returns false when value equals reference date (strictly before required)', () =>
            expect(validateDateBefore('2023-06-15', '2023-06-15')).toBe(false));
        it('returns true when value is one day before reference', () =>
            expect(validateDateBefore('2023-06-14', '2023-06-15')).toBe(true));
        it('returns false when value is after reference', () =>
            expect(validateDateBefore('2023-06-16', '2023-06-15')).toBe(false));
    });

    describe('validateDateFormat — all four formats', () => {
        it('DD/MM/YYYY: valid date passes', () =>
            expect(validateDateFormat('25/12/2023', DateFormat['DD/MM/YYYY'])).toBe(true));
        it('DD/MM/YYYY: wrong separator fails', () =>
            expect(validateDateFormat('25-12-2023', DateFormat['DD/MM/YYYY'])).toBe(false));
        it('YYYY-MM-DD: valid date passes', () =>
            expect(validateDateFormat('2023-12-25', DateFormat['YYYY-MM-DD'])).toBe(true));
        it('YYYY-MM-DD: wrong separator fails', () =>
            expect(validateDateFormat('2023/12/25', DateFormat['YYYY-MM-DD'])).toBe(false));
        it('DD-MM-YYYY: valid date passes', () =>
            expect(validateDateFormat('25-12-2023', DateFormat['DD-MM-YYYY'])).toBe(true));
        it('DD-MM-YYYY: wrong format fails', () =>
            expect(validateDateFormat('2023-12-25', DateFormat['DD-MM-YYYY'])).toBe(false));
        it('YYYY/MM/DD: valid date passes', () =>
            expect(validateDateFormat('2023/12/25', DateFormat['YYYY/MM/DD'])).toBe(true));
        it('YYYY/MM/DD: wrong separator fails', () =>
            expect(validateDateFormat('2023-12-25', DateFormat['YYYY/MM/DD'])).toBe(false));
    });
});

describe('Array Validators — Edge Cases', () => {
    describe('validateArrayMinLength — boundary', () => {
        it('returns true for empty array when min is 0', () =>
            expect(validateArrayMinLength([], 0)).toBe(true));
        it('returns false for empty array when min is 1', () =>
            expect(validateArrayMinLength([], 1)).toBe(false));
        it('returns true when array length equals min exactly', () =>
            expect(validateArrayMinLength([1, 2], 2)).toBe(true));
    });

    describe('validateArrayMaxLength — boundary', () => {
        it('returns true when array length equals max exactly', () =>
            expect(validateArrayMaxLength([1, 2, 3], 3)).toBe(true));
        it('returns false when array length is one over max', () =>
            expect(validateArrayMaxLength([1, 2, 3, 4], 3)).toBe(false));
        it('returns true for empty array with any positive max', () =>
            expect(validateArrayMaxLength([], 5)).toBe(true));
    });

    describe('validateArrayUnique — object references and mixed types', () => {
        it('returns true for unique primitives', () =>
            expect(validateArrayUnique([1, 'a', true])).toBe(true));
        it('returns false for two different object references with the same shape (deep equality)', () => {
            const obj1 = { x: 1 };
            const obj2 = { x: 1 };
            expect(validateArrayUnique([obj1, obj2])).toBe(false);
        });
        it('returns false for two objects with same shape using shorthand ({a:1},{a:1})', () =>
            expect(validateArrayUnique([{ a: 1 }, { a: 1 }])).toBe(false));
        it('returns false for two identical object references', () => {
            const obj = { x: 1 };
            expect(validateArrayUnique([obj, obj])).toBe(false);
        });
        it('returns true for mixed types that are all unique', () =>
            expect(validateArrayUnique([0, '', false, null, undefined])).toBe(true));
        it('returns false for duplicate strings', () =>
            expect(validateArrayUnique(['a', 'b', 'a'])).toBe(false));
    });

    describe('validateArrayContains — edge cases', () => {
        it('returns true for undefined when array contains undefined', () =>
            expect(validateArrayContains([1, undefined, 3], undefined)).toBe(true));
        it('returns false for undefined when array does not contain undefined', () =>
            expect(validateArrayContains([1, 2, 3], undefined)).toBe(false));
        it('returns false for non-array value', () =>
            expect(validateArrayContains('not-array' as any, 'n')).toBe(false));
    });
});

describe('validateNotOneOf — Edge Cases', () => {
    it('returns true when value is not in list', () =>
        expect(validateNotOneOf('x', ['a', 'b', 'c'])).toBe(true));
    it('returns false when value is in list', () =>
        expect(validateNotOneOf('a', ['a', 'b', 'c'])).toBe(false));
    it('returns true for empty list (nothing to exclude)', () =>
        expect(validateNotOneOf('anything', [])).toBe(true));
    it('returns true for null when list does not contain null', () =>
        expect(validateNotOneOf(null, ['a', 'b'])).toBe(true));
    it('returns false for null when list contains null', () =>
        expect(validateNotOneOf(null, [null, 'b'])).toBe(false));
    it('returns true for undefined when list does not contain undefined', () =>
        expect(validateNotOneOf(undefined, ['a', 'b'])).toBe(true));
});

describe('Network/Format Validators — Extended', () => {
    describe('validateIPv6 — extended cases', () => {
        it('returns true for full 8-group address', () =>
            expect(validateIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true));
        it('returns true for loopback ::1', () =>
            expect(validateIPv6('::1')).toBe(true));
        it('returns true for shortened address 2001:db8::1', () =>
            expect(validateIPv6('2001:db8::1')).toBe(true));
        it('returns true for IPv4-mapped address ::ffff:192.168.1.1', () =>
            expect(validateIPv6('::ffff:192.168.1.1')).toBe(true));
        it('returns false for too many groups', () =>
            expect(validateIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334:EXTRA')).toBe(false));
    });

    describe('validateMACAddress — extended cases', () => {
        it('returns true for uppercase colon-separated MAC', () =>
            expect(validateMACAddress('AA:BB:CC:DD:EE:FF')).toBe(true));
        it('returns true for uppercase hyphen-separated MAC', () =>
            expect(validateMACAddress('AA-BB-CC-DD-EE-FF')).toBe(true));
        it('returns false for only 5 groups', () =>
            expect(validateMACAddress('AA:BB:CC:DD:EE')).toBe(false));
        it('returns false for extra characters after valid MAC', () =>
            expect(validateMACAddress('AA:BB:CC:DD:EE:FF:00')).toBe(false));
        it('returns false for invalid hex chars', () =>
            expect(validateMACAddress('GG:HH:II:JJ:KK:LL')).toBe(false));
    });

    describe('validateDataURI — extended cases', () => {
        it('returns true for valid PNG base64 data URI', () =>
            expect(validateDataURI('data:image/png;base64,SGVsbG8=')).toBe(true));
        it('returns false when base64 label is missing', () =>
            expect(validateDataURI('data:image/png,SGVsbG8=')).toBe(false));
        it('returns false for data URI with no data after comma', () =>
            expect(validateDataURI('data:image/png;base64,')).toBe(false));
        it('returns false for completely missing data portion', () =>
            expect(validateDataURI('data:image/png;base64')).toBe(false));
    });

    describe('validateMimeType — extended cases', () => {
        const mockFile = (type: string) => ({ type } as File);
        it('returns true for video/mp4 against video/* wildcard', () =>
            expect(validateMimeType(mockFile('video/mp4'), ['video/*'])).toBe(true));
        it('returns false for text/html against application/* wildcard', () =>
            expect(validateMimeType(mockFile('text/html'), ['application/*'])).toBe(false));
        it('returns false when allowedTypes is empty', () =>
            expect(validateMimeType(mockFile('image/png'), [])).toBe(false));
        it('returns true for string MIME type argument', () =>
            expect(validateMimeType('image/png', ['image/*'])).toBe(true));
        it('returns false when file has empty type string', () =>
            expect(validateMimeType(mockFile(''), ['image/*'])).toBe(false));
    });

    describe('validateIBAN — extended cases', () => {
        it('returns true for valid GB IBAN', () =>
            expect(validateIBAN('GB29NWBK60161331926819')).toBe(true));
        it('returns true for valid DE IBAN', () =>
            expect(validateIBAN('DE89370400440532013000')).toBe(true));
        it('returns false for IBAN with wrong checksum', () =>
            expect(validateIBAN('GB00NWBK60161331926819')).toBe(false));
        it('returns false for too-short string', () =>
            expect(validateIBAN('GB00')).toBe(false));
    });

    describe('validatePostalCode', () => {
        it('returns true for US 5-digit code', () =>
            expect(validatePostalCode('90210', 'US')).toBe(true));
        it('returns true for US ZIP+4 code', () =>
            expect(validatePostalCode('90210-1234', 'US')).toBe(true));
        it('returns false for US code with wrong format', () =>
            expect(validatePostalCode('9021', 'US')).toBe(false));
        it('returns true for Canadian postal code A1A 1A1', () =>
            expect(validatePostalCode('A1A 1A1', 'CA')).toBe(true));
        it('returns true for German 5-digit code', () =>
            expect(validatePostalCode('12345', 'DE')).toBe(true));
        it('returns false for German code with letters', () =>
            expect(validatePostalCode('1234A', 'DE')).toBe(false));
        it('returns true for unknown country with non-whitespace code (fallback)', () =>
            expect(validatePostalCode('XYZ123', 'ZZ')).toBe(true));
        it('returns false for unknown country with whitespace-only value', () =>
            expect(validatePostalCode('   ', 'ZZ')).toBe(false));
    });

    describe('validateLatitude — extended cases', () => {
        it('returns true for -90 (minimum valid)', () => expect(validateLatitude(-90)).toBe(true));
        it('returns true for 90 (maximum valid)', () => expect(validateLatitude(90)).toBe(true));
        it('returns false for -90.1 (below minimum)', () => expect(validateLatitude(-90.1)).toBe(false));
        it('returns false for 91 (above maximum)', () => expect(validateLatitude(91)).toBe(false));
        it('returns true for string "45.5" (Number coercion)', () => expect(validateLatitude('45.5')).toBe(true));
    });

    describe('validateLongitude — extended cases', () => {
        it('returns true for -180 (minimum valid)', () => expect(validateLongitude(-180)).toBe(true));
        it('returns true for 180 (maximum valid)', () => expect(validateLongitude(180)).toBe(true));
        it('returns false for 181 (above maximum)', () => expect(validateLongitude(181)).toBe(false));
        it('returns false for -181 (below minimum)', () => expect(validateLongitude(-181)).toBe(false));
    });

    describe('validateSemVer — extended cases', () => {
        it('returns true for version with build metadata', () =>
            expect(validateSemVer('1.0.0+build.1')).toBe(true));
        it('returns true for version with pre-release and build metadata', () =>
            expect(validateSemVer('1.0.0-alpha+001')).toBe(true));
        it('returns false for missing patch segment', () =>
            expect(validateSemVer('1.0')).toBe(false));
        it('returns false for empty string', () =>
            expect(validateSemVer('')).toBe(false));
    });

    describe('validateBase64 — extended cases', () => {
        it('returns true for "SGVsbG8=" (valid base64, length divisible by 4)', () =>
            expect(validateBase64('SGVsbG8=')).toBe(true));
        it('returns false for string with non-base64 chars', () =>
            expect(validateBase64('SGVs!G8=')).toBe(false));
        it('returns false for string whose length is not divisible by 4', () =>
            expect(validateBase64('SGVsb')).toBe(false));
        it('returns false for non-string input', () =>
            expect(validateBase64(12345 as any)).toBe(false));
    });
});

describe('File Validators', () => {
    const mockFile = (name: string, type: string, size: number): File => {
        const blob = new Blob(['x'.repeat(size)], { type });
        return new File([blob], name, { type });
    };

    describe('validateFileType', () => {
        it('returns true when file MIME type is in allowed list', () => {
            const file = mockFile('image.png', 'image/png', 100);
            expect(validateFileType(file, ['image/png', 'image/jpeg'])).toBe(true);
        });
        it('returns false when file MIME type is not in allowed list', () => {
            const file = mockFile('doc.pdf', 'application/pdf', 100);
            expect(validateFileType(file, ['image/png', 'image/jpeg'])).toBe(false);
        });
        it('returns true for single allowed type matching the file', () => {
            const file = mockFile('video.mp4', 'video/mp4', 1000);
            expect(validateFileType(file, ['video/mp4'])).toBe(true);
        });
    });

    describe('validateFileSize', () => {
        it('returns true when file size is exactly at the limit', () => {
            const file = mockFile('test.txt', 'text/plain', 1024);
            expect(validateFileSize(file, 1024)).toBe(true);
        });
        it('returns false when file size exceeds the limit', () => {
            const file = mockFile('test.txt', 'text/plain', 2048);
            expect(validateFileSize(file, 1024)).toBe(false);
        });
        it('returns true when file size is well under the limit', () => {
            const file = mockFile('small.png', 'image/png', 500);
            expect(validateFileSize(file, 1024 * 1024)).toBe(true);
        });
    });
});

import { validateAlphaDash, validateNotEmpty, validateJWT, validateFinite, validatePort,
    validateGreaterThanOrEqual, validateLessThanOrEqual, validateDateAfterField,
    validateDateBeforeField, validateArrayExactLength } from '../constants/index';

describe('v4 validators', () => {
    // alphaDash
    it('alphaDash passes valid slug', () => expect(validateAlphaDash('hello_world-123')).toBe(true));
    it('alphaDash fails with space', () => expect(validateAlphaDash('hello world')).toBe(false));
    it('alphaDash fails with special char', () => expect(validateAlphaDash('hello!')).toBe(false));

    // notEmpty
    it('notEmpty passes non-empty string', () => expect(validateNotEmpty('hello')).toBe(true));
    it('notEmpty fails empty string', () => expect(validateNotEmpty('')).toBe(false));
    it('notEmpty fails whitespace-only', () => expect(validateNotEmpty('   ')).toBe(false));
    it('notEmpty fails non-string', () => expect(validateNotEmpty(42)).toBe(false));

    // uuid versions
    it('validateUUID no-arg accepts v4 UUID', () => expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true));
    it('validateUUID version:4 accepts v4 UUID', () => expect(validateUUID('550e8400-e29b-41d4-a716-446655440000', 4)).toBe(true));
    it('validateUUID version:1 accepts v1 UUID', () => expect(validateUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 1)).toBe(true));
    it('validateUUID version:1 rejects v4 UUID', () => expect(validateUUID('550e8400-e29b-41d4-a716-446655440000', 1)).toBe(false));

    // jwt
    it('jwt passes three-part token', () => expect(validateJWT('a.b.c')).toBe(true));
    it('jwt passes empty signature', () => expect(validateJWT('a.b.')).toBe(true));
    it('jwt fails two-part', () => expect(validateJWT('only.two')).toBe(false));
    it('jwt fails no dots', () => expect(validateJWT('nodots')).toBe(false));

    // finite
    it('finite passes integer', () => expect(validateFinite(42)).toBe(true));
    it('finite passes zero string', () => expect(validateFinite('0')).toBe(true));
    it('finite fails Infinity string', () => expect(validateFinite('Infinity')).toBe(false));
    it('finite fails NaN', () => expect(validateFinite(NaN)).toBe(false));

    // port
    it('port passes 0', () => expect(validatePort(0)).toBe(true));
    it('port passes 80', () => expect(validatePort(80)).toBe(true));
    it('port passes 65535', () => expect(validatePort(65535)).toBe(true));
    it('port fails -1', () => expect(validatePort(-1)).toBe(false));
    it('port fails 65536', () => expect(validatePort(65536)).toBe(false));
    it('port fails decimal', () => expect(validatePort(3.14)).toBe(false));

    // greaterThanOrEqual
    it('gte passes equal', () => expect(validateGreaterThanOrEqual(5, 5)).toBe(true));
    it('gte passes greater', () => expect(validateGreaterThanOrEqual(6, 5)).toBe(true));
    it('gte fails less', () => expect(validateGreaterThanOrEqual(4, 5)).toBe(false));

    // lessThanOrEqual
    it('lte passes equal', () => expect(validateLessThanOrEqual(5, 5)).toBe(true));
    it('lte passes less', () => expect(validateLessThanOrEqual(4, 5)).toBe(true));
    it('lte fails greater', () => expect(validateLessThanOrEqual(6, 5)).toBe(false));

    // dateAfterField
    it('dateAfterField passes later date', () => expect(validateDateAfterField('2025-01-02', '2025-01-01')).toBe(true));
    it('dateAfterField fails equal dates', () => expect(validateDateAfterField('2025-01-01', '2025-01-01')).toBe(false));
    it('dateAfterField fails earlier date', () => expect(validateDateAfterField('2025-01-01', '2025-01-02')).toBe(false));

    // dateBeforeField
    it('dateBeforeField passes earlier date', () => expect(validateDateBeforeField('2025-01-01', '2025-01-02')).toBe(true));
    it('dateBeforeField fails later date', () => expect(validateDateBeforeField('2025-01-02', '2025-01-01')).toBe(false));

    // arrayExactLength
    it('arrayExactLength passes exact length', () => expect(validateArrayExactLength([1,2,3], 3)).toBe(true));
    it('arrayExactLength fails shorter', () => expect(validateArrayExactLength([1,2], 3)).toBe(false));
    it('arrayExactLength fails longer', () => expect(validateArrayExactLength([1,2,3,4], 3)).toBe(false));
});

describe('Security & edge case fixes', () => {

    describe('validateFileType — instanceof File guard', () => {
        it('returns false when passed a plain object (not a File)', () => {
            expect(validateFileType({ type: 'image/jpeg' } as any, [TypeFile.JPG])).toBe(false);
        });
        it('returns false when passed null', () => {
            expect(validateFileType(null as any, [TypeFile.JPG])).toBe(false);
        });
        it('returns true for a real File with matching type', () => {
            const f = new File([''], 'test.jpg', { type: 'image/jpeg' });
            expect(validateFileType(f, [TypeFile.JPG])).toBe(true);
        });
    });

    describe('validateFileSize — instanceof File guard', () => {
        it('returns false when passed a plain object (not a File)', () => {
            expect(validateFileSize({ size: 100 } as any, 1000)).toBe(false);
        });
        it('returns false when passed null', () => {
            expect(validateFileSize(null as any, 1000)).toBe(false);
        });
        it('returns true for a real File within size limit', () => {
            const f = new File([new Uint8Array(100)], 'test.txt');
            expect(validateFileSize(f, 1000)).toBe(true);
        });
    });

    describe('sanitizeNumber — NaN → 0', () => {
        it('returns 0 for a lone dash "-"', () => {
            expect(sanitizeNumber('-')).toBe(0);
        });
        it('returns 0 for non-numeric string "abc"', () => {
            expect(sanitizeNumber('abc')).toBe(0);
        });
        it('returns 0 for empty string', () => {
            expect(sanitizeNumber('')).toBe(0);
        });
        it('returns correct number for valid numeric string "123"', () => {
            expect(sanitizeNumber('123')).toBe(123);
        });
        it('returns correct negative number for "-456"', () => {
            expect(sanitizeNumber('-456')).toBe(-456);
        });
    });

    describe('validateMinDate — NaN guard on both operands', () => {
        it('returns false when value is invalid date string', () => {
            expect(validateMinDate('not-a-date', '2024-01-01')).toBe(false);
        });
        it('returns false when minDate is invalid', () => {
            expect(validateMinDate('2024-01-01', 'not-a-date')).toBe(false);
        });
        it('returns false when BOTH are invalid (C3 fix)', () => {
            expect(validateMinDate('invalid', 'invalid')).toBe(false);
        });
        it('returns true when value is on or after minDate', () => {
            expect(validateMinDate('2024-06-01', '2024-01-01')).toBe(true);
        });
    });

    describe('validateMaxDate — NaN guard on both operands', () => {
        it('returns false when value is invalid date string', () => {
            expect(validateMaxDate('not-a-date', '2024-12-31')).toBe(false);
        });
        it('returns false when maxDate is invalid', () => {
            expect(validateMaxDate('2024-01-01', 'not-a-date')).toBe(false);
        });
        it('returns false when BOTH are invalid', () => {
            expect(validateMaxDate('invalid', 'invalid')).toBe(false);
        });
        it('returns true when value is on or before maxDate', () => {
            expect(validateMaxDate('2024-01-01', '2024-12-31')).toBe(true);
        });
    });

    describe('REGEX_EMAIL — safe against ReDoS and stricter TLD', () => {
        it('rejects single-char TLD like "a@b.x"', () => {
            expect(validateEmail('a@b.x')).toBe(false);
        });
        it('accepts valid email with 2-char TLD', () => {
            expect(validateEmail('test@example.io')).toBe(true);
        });
        it('accepts standard email', () => {
            expect(validateEmail('user@domain.com')).toBe(true);
        });
        it('rejects email without @', () => {
            expect(validateEmail('notanemail')).toBe(false);
        });
        it('completes quickly on a 200-char string without @', () => {
            const longStr = 'a'.repeat(200);
            const start = Date.now();
            validateEmail(longStr);
            expect(Date.now() - start).toBeLessThan(50);
        });
    });

    describe('REGEX_URL — safe against ReDoS', () => {
        it('accepts a valid https URL', () => {
            expect(validateUrl('https://example.com/path')).toBe(true);
        });
        it('rejects a non-http string', () => {
            expect(validateUrl('not-a-url')).toBe(false);
        });
        it('completes quickly on a 5000-char URL-like string', () => {
            const longStr = 'https://example.com/' + 'a'.repeat(4980);
            const start = Date.now();
            validateUrl(longStr);
            expect(Date.now() - start).toBeLessThan(50);
        });
    });

});

describe('v4 Validators — Structured', () => {
    describe('validateAlphaDash', () => {
        it('passes letters only', () => expect(validateAlphaDash('hello')).toBe(true));
        it('passes digits only', () => expect(validateAlphaDash('123')).toBe(true));
        it('passes hyphens and underscores', () => expect(validateAlphaDash('hello_world-123')).toBe(true));
        it('fails on space', () => expect(validateAlphaDash('hello world')).toBe(false));
        it('fails on symbol @', () => expect(validateAlphaDash('user@name')).toBe(false));
        it('fails on dot', () => expect(validateAlphaDash('file.name')).toBe(false));
    });

    describe('validateNotEmpty', () => {
        it('passes a regular non-empty string', () => expect(validateNotEmpty('hello')).toBe(true));
        it('passes a single character', () => expect(validateNotEmpty('x')).toBe(true));
        it('fails on empty string', () => expect(validateNotEmpty('')).toBe(false));
        it('fails on whitespace-only string', () => expect(validateNotEmpty('   ')).toBe(false));
        it('fails on tab-only string', () => expect(validateNotEmpty('\t')).toBe(false));
        it('fails on non-string (number)', () => expect(validateNotEmpty(42)).toBe(false));
    });

    describe('validateJWT', () => {
        it('passes a valid three-part JWT header.payload.signature', () =>
            expect(validateJWT('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')).toBe(true));
        it('passes a minimal a.b.c token', () => expect(validateJWT('a.b.c')).toBe(true));
        it('passes a token with empty signature a.b.', () => expect(validateJWT('a.b.')).toBe(true));
        it('fails on a plain string with no dots', () => expect(validateJWT('notajwt')).toBe(false));
        it('fails on a two-part string only.two', () => expect(validateJWT('only.two')).toBe(false));
        it('fails on a string with invalid characters like spaces', () => expect(validateJWT('a b.c.d')).toBe(false));
    });

    describe('validateFinite', () => {
        it('passes a finite integer', () => expect(validateFinite(42)).toBe(true));
        it('passes a finite float', () => expect(validateFinite(3.14)).toBe(true));
        it('passes zero', () => expect(validateFinite(0)).toBe(true));
        it('passes a numeric string "99"', () => expect(validateFinite('99')).toBe(true));
        it('fails Infinity', () => expect(validateFinite(Infinity)).toBe(false));
        it('fails -Infinity', () => expect(validateFinite(-Infinity)).toBe(false));
        it('fails NaN', () => expect(validateFinite(NaN)).toBe(false));
        it('fails the string "Infinity"', () => expect(validateFinite('Infinity')).toBe(false));
    });

    describe('validatePort', () => {
        it('passes port 80', () => expect(validatePort(80)).toBe(true));
        it('passes port 443', () => expect(validatePort(443)).toBe(true));
        it('passes port 65535', () => expect(validatePort(65535)).toBe(true));
        it('fails port 65536 (above max)', () => expect(validatePort(65536)).toBe(false));
        it('fails negative port -1', () => expect(validatePort(-1)).toBe(false));
        it('fails non-integer 3.14', () => expect(validatePort(3.14)).toBe(false));
        it('fails non-numeric string', () => expect(validatePort('abc')).toBe(false));
    });

    describe('validateGreaterThanOrEqual', () => {
        it('passes when value equals min', () => expect(validateGreaterThanOrEqual(5, 5)).toBe(true));
        it('passes when value is greater than min', () => expect(validateGreaterThanOrEqual(10, 5)).toBe(true));
        it('passes for floats: 5.1 >= 5', () => expect(validateGreaterThanOrEqual(5.1, 5)).toBe(true));
        it('fails when value is less than min', () => expect(validateGreaterThanOrEqual(4, 5)).toBe(false));
        it('fails for floats: 4.99 < 5', () => expect(validateGreaterThanOrEqual(4.99, 5)).toBe(false));
    });

    describe('validateLessThanOrEqual', () => {
        it('passes when value equals max', () => expect(validateLessThanOrEqual(5, 5)).toBe(true));
        it('passes when value is less than max', () => expect(validateLessThanOrEqual(3, 5)).toBe(true));
        it('passes for floats: 4.9 <= 5', () => expect(validateLessThanOrEqual(4.9, 5)).toBe(true));
        it('fails when value is greater than max', () => expect(validateLessThanOrEqual(6, 5)).toBe(false));
        it('fails for floats: 5.01 > 5', () => expect(validateLessThanOrEqual(5.01, 5)).toBe(false));
    });

    describe('validateDateAfterField', () => {
        it('passes when value date is after reference field', () =>
            expect(validateDateAfterField('2025-06-15', '2025-06-14')).toBe(true));
        it('passes when dates are far apart', () =>
            expect(validateDateAfterField('2030-01-01', '2020-01-01')).toBe(true));
        it('fails when value date equals reference field (strictly after)', () =>
            expect(validateDateAfterField('2025-06-15', '2025-06-15')).toBe(false));
        it('fails when value date is before reference field', () =>
            expect(validateDateAfterField('2025-06-13', '2025-06-15')).toBe(false));
        it('fails on invalid date string', () =>
            expect(validateDateAfterField('not-a-date', '2025-06-15')).toBe(false));
    });

    describe('validateDateBeforeField', () => {
        it('passes when value date is before reference field', () =>
            expect(validateDateBeforeField('2025-06-14', '2025-06-15')).toBe(true));
        it('passes when dates are far apart', () =>
            expect(validateDateBeforeField('2000-01-01', '2025-01-01')).toBe(true));
        it('fails when value date equals reference field (strictly before)', () =>
            expect(validateDateBeforeField('2025-06-15', '2025-06-15')).toBe(false));
        it('fails when value date is after reference field', () =>
            expect(validateDateBeforeField('2025-06-16', '2025-06-15')).toBe(false));
        it('fails on invalid date string', () =>
            expect(validateDateBeforeField('not-a-date', '2025-06-15')).toBe(false));
    });

    describe('validateArrayExactLength', () => {
        it('passes when array length equals exact count', () =>
            expect(validateArrayExactLength([1, 2, 3], 3)).toBe(true));
        it('passes for empty array with exact count 0', () =>
            expect(validateArrayExactLength([], 0)).toBe(true));
        it('fails when array is shorter than required', () =>
            expect(validateArrayExactLength([1, 2], 3)).toBe(false));
        it('fails when array is longer than required', () =>
            expect(validateArrayExactLength([1, 2, 3, 4], 3)).toBe(false));
        it('fails for non-array input', () =>
            expect(validateArrayExactLength('hello' as any, 5)).toBe(false));
    });
});
