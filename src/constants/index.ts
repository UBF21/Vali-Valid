import { DateFormat, DateFormatExpressions, FileSize, TypeFile } from '../types/index';

// --- Default error messages ---
export const DEFAULT_ERROR_REQUIRED_MESSAGE = 'Required field.';
export const DEFAULT_ERROR_MIN_LENGTH_MESSAGE = (value: number) => `The field must have at least ${value} characters.`;
export const DEFAULT_ERROR_MAX_LENGTH_MESSAGE = (value: number) => `The field cannot be more than ${value} characters.`;
export const DEFAULT_ERROR_EXACT_LENGTH_MESSAGE = (value: number) => `The field must be exactly ${value} characters.`;
export const DEFAULT_ERROR_EMAIL_MESSAGE = 'Does not have email format.';
export const DEFAULT_ERROR_URL_MESSAGE = 'Invalid url format.';
export const DEFAULT_ERROR_ALPHA_MESSAGE = 'Only supports letters.';
export const DEFAULT_ERROR_ALPHA_NUMERIC_MESSAGE = 'Only supports letters and numbers.';
export const DEFAULT_ERROR_LOWER_CASE_MESSAGE = 'Only supports lowercase letters.';
export const DEFAULT_ERROR_UPPER_CASE_MESSAGE = 'Only supports uppercase letters.';
export const DEFAULT_ERROR_NO_WHITESPACE_MESSAGE = 'The field must not contain spaces.';
export const DEFAULT_ERROR_CONTAINS_MESSAGE = (value: string) => `The field must contain "${value}".`;
export const DEFAULT_ERROR_STARTS_WITH_MESSAGE = (value: string) => `The field must start with "${value}".`;
export const DEFAULT_ERROR_ENDS_WITH_MESSAGE = (value: string) => `The field must end with "${value}".`;
export const DEFAULT_ERROR_SLUG_MESSAGE = 'Only lowercase letters, numbers, and hyphens are allowed.';
export const DEFAULT_ERROR_PASSWORD_STRENGTH_MESSAGE = 'Password must include uppercase, lowercase, number, and special character.';
export const DEFAULT_ERROR_HEX_COLOR_MESSAGE = 'Invalid hex color format.';
export const DEFAULT_ERROR_IPV4_MESSAGE = 'Invalid IPv4 address.';
export const DEFAULT_ERROR_UUID_MESSAGE = 'Invalid UUID format.';
export const DEFAULT_ERROR_JSON_MESSAGE = 'Invalid JSON format.';
export const DEFAULT_ERROR_PHONE_MESSAGE = 'Invalid phone number format.';
export const DEFAULT_ERROR_CREDIT_CARD_MESSAGE = 'Invalid credit card number.';
export const DEFAULT_ERROR_PATTERN_MESSAGE = 'Does not comply with the required pattern.';
export const DEFAULT_ERROR_DIGITS_ONLY_MESSAGE = 'The field can only contain digits.';
export const DEFAULT_ERROR_NUMBER_RANGE_MESSAGE = (min: number, max: number) => `The value must be between ${min} and ${max}.`;
export const DEFAULT_ERROR_NUMBER_POSITIVE_MESSAGE = 'Only positive numbers are allowed.';
export const DEFAULT_ERROR_NUMBER_NEGATIVE_MESSAGE = 'Only negative numbers are allowed.';
export const DEFAULT_ERROR_INTEGER_MESSAGE = 'The field must be an integer.';
export const DEFAULT_ERROR_MULTIPLE_OF_MESSAGE = (value: number) => `The value must be a multiple of ${value}.`;
export const DEFAULT_ERROR_DATE_FORMAT_MESSAGE = (format: DateFormat) => `The date format is invalid. The expected format is (${format}).`;
export const DEFAULT_ERROR_MIN_DATE_MESSAGE = (value: string | Date) => `The date must be on or after ${value}.`;
export const DEFAULT_ERROR_MAX_DATE_MESSAGE = (value: string | Date) => `The date must be on or before ${value}.`;
export const DEFAULT_ERROR_FUTURE_DATE_MESSAGE = 'The date must be in the future.';
export const DEFAULT_ERROR_PAST_DATE_MESSAGE = 'The date must be in the past.';
export const DEFAULT_ERROR_FILE_TYPE_MESSAGE = 'File type not allowed.';
export const DEFAULT_ERROR_FILE_SIZE_MESSAGE = 'The file size exceeds the allowed limit.';
export const DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE = (width: number, height: number) => `The file dimensions must be ${width}x${height}.`;
export const DEFAULT_ERROR_IMAGE_ASPECT_RATIO_MESSAGE = (w: number, h: number) => `The image aspect ratio must be ${w}:${h}.`;
export const DEFAULT_ERROR_IMAGE_MIN_DIMENSIONS_MESSAGE = (width?: number, height?: number) => {
    const parts = [];
    if (width !== undefined) parts.push(`width >= ${width}px`);
    if (height !== undefined) parts.push(`height >= ${height}px`);
    return `The image dimensions must be at least ${parts.join(' and ')}.`;
};
export const DEFAULT_ERROR_IMAGE_MAX_DIMENSIONS_MESSAGE = (width?: number, height?: number) => {
    const parts = [];
    if (width !== undefined) parts.push(`width <= ${width}px`);
    if (height !== undefined) parts.push(`height <= ${height}px`);
    return `The image dimensions must be at most ${parts.join(' and ')}.`;
};
export const DEFAULT_ERROR_MATCH_FIELD_MESSAGE = 'Fields do not match.';
export const DEFAULT_ERROR_REQUIRED_IF_MESSAGE = 'This field is required.';
export const DEFAULT_ERROR_ASYNC_PATTERN_MESSAGE = 'Validation failed.';

// --- Regex patterns ---
export const REGEX_ONLY_NUMBERS = /[^\d-]|(?!^)-/g;
export const REGEX_ONLY_NUMBERS_STRING = /^[0-9]+$/;
export const REGEX_DECIMALS = /^\d+(\.\d+)?$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._%+\-]{1,64}@[a-zA-Z0-9.\-]{1,253}\.[a-zA-Z]{2,}$/;
export const REGEX_URL = /^(https?|ftp):\/\/[^\s/$.?#][^\s]{0,2048}$/;
export const REGEX_ALPHA = /^[a-zA-Z]+$/;
export const REGEX_ALPHA_NUMERIC = /^[a-zA-Z0-9]+$/;
export const REGEX_LOWER_CASE = /^[a-z]+$/;
export const REGEX_UPPER_CASE = /^[A-Z]+$/;
export const REGEX_NO_WHITESPACE = /^\S+$/;
export const REGEX_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const REGEX_PASSWORD_STRENGTH = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
export const REGEX_HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
export const REGEX_IPV4 = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
export const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const REGEX_PHONE = /^\+?[1-9]\d{6,14}$/;
export const REGEX_ALPHA_DASH = /^[a-zA-Z0-9_-]+$/;
export const REGEX_JWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
export const REGEX_UUID_V1 = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const REGEX_UUID_V3 = /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const REGEX_UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const REGEX_UUID_V5 = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// --- Sync validators ---

export const validateRequired = (value: any): boolean => {
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return true; // 0 is valid
    if (typeof value === 'boolean') return true;
    if (value instanceof File) return value !== null && value !== undefined;
    if (value instanceof Date) return !isNaN(value.getTime());
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, min: number): boolean =>
    typeof value === 'string' && value.length >= min;

export const validateMaxLength = (value: string, max: number): boolean =>
    typeof value === 'string' && value.length <= max;

export const validateExactLength = (value: string, exact: number): boolean =>
    typeof value === 'string' && value.length === exact;

export const validateEmail = (value: string): boolean => REGEX_EMAIL.test(value);

export const validateUrl = (value: string): boolean => REGEX_URL.test(value);

export const validateAlpha = (value: string): boolean => REGEX_ALPHA.test(value);

export const validateAlphaNumeric = (value: string): boolean => REGEX_ALPHA_NUMERIC.test(value);

export const validateLowerCase = (value: string): boolean => REGEX_LOWER_CASE.test(value);

export const validateUpperCase = (value: string): boolean => REGEX_UPPER_CASE.test(value);

export const validateNoWhitespace = (value: string): boolean => REGEX_NO_WHITESPACE.test(value);

export const validateContains = (value: string, substring: string): boolean =>
    typeof value === 'string' && value.includes(substring);

export const validateStartsWith = (value: string, prefix: string): boolean =>
    typeof value === 'string' && value.startsWith(prefix);

export const validateEndsWith = (value: string, suffix: string): boolean =>
    typeof value === 'string' && value.endsWith(suffix);

export const validateSlug = (value: string): boolean => REGEX_SLUG.test(value);

export const validatePasswordStrength = (value: string): boolean => {
    if (typeof value !== 'string' || value.length > 128) return false;
    return REGEX_PASSWORD_STRENGTH.test(value);
};

export const validateHexColor = (value: string): boolean => REGEX_HEX_COLOR.test(value);

export const validateIPv4 = (value: string): boolean => REGEX_IPV4.test(value);

export const validateUUID = (value: string, version?: 1 | 3 | 4 | 5): boolean => {
    if (version === 1) return REGEX_UUID_V1.test(value);
    if (version === 3) return REGEX_UUID_V3.test(value);
    if (version === 5) return REGEX_UUID_V5.test(value);
    return REGEX_UUID_V4.test(value); // default v4
};

export const validateJson = (value: string): boolean => {
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
};

export const validatePhone = (value: string): boolean => REGEX_PHONE.test(value.replace(/\s/g, ''));

export const validateCreditCard = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i], 10);
        if (isEven) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        isEven = !isEven;
    }
    return sum % 10 === 0;
};

export const validateDigitsOnly = (value: any): boolean =>
    typeof value === 'string' && REGEX_ONLY_NUMBERS_STRING.test(value);

export const validateNumberRange = (value: number, min: number, max: number): boolean =>
    typeof value === 'number' && value >= min && value <= max;

export const validateNumberPositive = (value: number): boolean => value > 0;

export const validateNumberNegative = (value: number): boolean => value < 0;

export const validateInteger = (value: number): boolean =>
    typeof value === 'number' && Number.isInteger(value);

// Simple modulo (value % multiple === 0) cannot be used for decimals because of IEEE 754
// floating-point representation errors — e.g. 0.3 % 0.1 evaluates to ~5.55e-17, not 0.
// Rounding to a high (but finite) precision eliminates that noise.
export const validateMultipleOf = (value: number, multiple: number): boolean =>
    typeof value === 'number' && multiple !== 0 &&
    Math.round((value / multiple) * 1e10) % 1e10 === 0;

export const validateDateFormat = (value: string, format: DateFormat): boolean =>
    DateFormatExpressions[format].test(String(value));

export const validateMinDate = (value: string, minDate: string | Date): boolean => {
    const date = new Date(value);
    const min = new Date(minDate);
    if (isNaN(date.getTime()) || isNaN(min.getTime())) return false;
    return date >= min;
};

export const validateMaxDate = (value: string, maxDate: string | Date): boolean => {
    const date = new Date(value);
    const max = new Date(maxDate);
    if (isNaN(date.getTime()) || isNaN(max.getTime())) return false;
    return date <= max;
};

export const validateFutureDate = (value: string): boolean => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date > new Date();
};

export const validatePastDate = (value: string): boolean => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date < new Date();
};

export const validateFileType = (file: File, allowedTypes: TypeFile[] | string[]): boolean => {
    if (!(file instanceof File)) return false;
    return (allowedTypes as string[]).includes(file.type);
};

export const validateFileSize = (file: File, maxSize: number | FileSize): boolean => {
    if (!(file instanceof File)) return false;
    return file.size <= maxSize;
};

// --- Async image validators ---

export const validateImageDimensions = async (
    file: File,
    dimensions: { width: number; height: number }
): Promise<boolean> => {
    let url = '';
    try {
        const img = new Image();
        url = URL.createObjectURL(file);
        img.src = url;
        await img.decode();
        URL.revokeObjectURL(url);
        url = '';
        return img.width === dimensions.width && img.height === dimensions.height;
    } catch {
        if (url) URL.revokeObjectURL(url);
        return false;
    }
};

export const validateImageAspectRatio = async (
    file: File,
    ratio: { width: number; height: number },
    tolerance = 0.01
): Promise<boolean> => {
    let url = '';
    try {
        const img = new Image();
        url = URL.createObjectURL(file);
        img.src = url;
        await img.decode();
        URL.revokeObjectURL(url);
        url = '';
        const expected = ratio.width / ratio.height;
        const actual = img.width / img.height;
        return Math.abs(actual - expected) <= tolerance;
    } catch {
        if (url) URL.revokeObjectURL(url);
        return false;
    }
};

export const validateImageMinDimensions = async (
    file: File,
    min: { width?: number; height?: number }
): Promise<boolean> => {
    let url = '';
    try {
        const img = new Image();
        url = URL.createObjectURL(file);
        img.src = url;
        await img.decode();
        URL.revokeObjectURL(url);
        url = '';
        if (min.width !== undefined && img.width < min.width) return false;
        if (min.height !== undefined && img.height < min.height) return false;
        return true;
    } catch {
        if (url) URL.revokeObjectURL(url);
        return false;
    }
};

export const validateImageMaxDimensions = async (
    file: File,
    max: { width?: number; height?: number }
): Promise<boolean> => {
    let url = '';
    try {
        const img = new Image();
        url = URL.createObjectURL(file);
        img.src = url;
        await img.decode();
        URL.revokeObjectURL(url);
        url = '';
        if (max.width !== undefined && img.width > max.width) return false;
        if (max.height !== undefined && img.height > max.height) return false;
        return true;
    } catch {
        if (url) URL.revokeObjectURL(url);
        return false;
    }
};

// --- Number sanitization ---
export const sanitizeNumber = (value: any): number => {
    const n = Number(String(value).replace(REGEX_ONLY_NUMBERS, ''));
    return isNaN(n) ? 0 : n;
};

// --- v2.1 new validators ---

export const validateGreaterThan = (value: any, n: number): boolean => Number(value) > n;

export const validateLessThan = (value: any, n: number): boolean => Number(value) < n;

export const validatePrecision = (value: any, n: number): boolean => {
    const normalized = typeof value === 'number' ? parseFloat(value.toPrecision(15)) : value;
    const str = String(normalized);
    const dotIndex = str.indexOf('.');
    if (dotIndex === -1) return true;
    return str.length - dotIndex - 1 <= n;
};

export const validateDateAfter = (value: any, ref: string | Date): boolean => {
    const d = new Date(value);
    const r = new Date(ref);
    return !isNaN(d.getTime()) && !isNaN(r.getTime()) && d > r;
};

export const validateDateBefore = (value: any, ref: string | Date): boolean => {
    const d = new Date(value);
    const r = new Date(ref);
    return !isNaN(d.getTime()) && !isNaN(r.getTime()) && d < r;
};

export const validateOneOf = (value: any, options: any[]): boolean => options.includes(value);

export const validateNotMatchField = (value: any, other: any): boolean => value !== other;

export const validateRequiredUnless = (
    value: any,
    condition: (form: Record<string, any>) => boolean,
    form: Record<string, any>
): boolean => {
    if (condition(form)) return true;
    return validateRequired(value);
};

export const validateArrayMinLength = (value: any, n: number): boolean =>
    Array.isArray(value) && value.length >= n;

export const validateArrayMaxLength = (value: any, n: number): boolean =>
    Array.isArray(value) && value.length <= n;

export const validateArrayUnique = (value: any): boolean => {
    if (!Array.isArray(value)) return false;
    const seen: string[] = [];
    for (const item of value) {
        const key = JSON.stringify(item);
        if (seen.includes(key)) return false;
        seen.push(key);
    }
    return true;
};

export const validateArrayContains = (value: any, item: any): boolean =>
    Array.isArray(value) && value.includes(item);

const REGEX_TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/;
const REGEX_TIME_12H = /^(0[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/;

export const validateTime = (value: string, format: '24h' | '12h' = '24h'): boolean =>
    format === '12h' ? REGEX_TIME_12H.test(value) : REGEX_TIME_24H.test(value);

export const validateNoHTML = (value: string): boolean =>
    typeof value === 'string' && !/<[^>]*>/.test(value);

export const validateIBAN = (value: string): boolean => {
    const iban = value.replace(/\s+/g, '').toUpperCase();
    if (iban.length < 15 || iban.length > 34) return false;
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const numeric = rearranged.split('').map((c) => {
        const code = c.charCodeAt(0);
        return code >= 65 && code <= 90 ? String(code - 55) : c;
    }).join('');
    let remainder = 0;
    for (let i = 0; i < numeric.length; i++) {
        remainder = (remainder * 10 + parseInt(numeric[i], 10)) % 97;
    }
    return remainder === 1;
};

const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    ES: /^\d{5}$/,
    IT: /^\d{5}$/,
    AU: /^\d{4}$/,
    NL: /^\d{4} ?[A-Za-z]{2}$/,
    BR: /^\d{5}-?\d{3}$/,
    MX: /^\d{5}$/,
    AR: /^\d{4}$|^[A-Za-z]\d{4}[A-Za-z]{3}$/,
};

export const validatePostalCode = (value: string, country: string): boolean => {
    const pattern = POSTAL_CODE_PATTERNS[country.toUpperCase()];
    if (!pattern) return /^\S+$/.test(value);
    return pattern.test(value);
};

export const validateLatitude = (value: any): boolean => {
    const n = Number(value);
    return !isNaN(n) && n >= -90 && n <= 90;
};

export const validateLongitude = (value: any): boolean => {
    const n = Number(value);
    return !isNaN(n) && n >= -180 && n <= 180;
};

const REGEX_SEMVER = /^\d+\.\d+\.\d+(\-[a-zA-Z0-9._-]+)?(\+[a-zA-Z0-9._-]+)?$/;

export const validateSemVer = (value: string): boolean => REGEX_SEMVER.test(value);

const REGEX_BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;

export const validateBase64 = (value: string): boolean =>
    typeof value === 'string' && value.length > 0 && REGEX_BASE64.test(value) && value.length % 4 === 0;

export const validateNotOneOf = (value: any, options: any[]): boolean => !options.includes(value);

const REGEX_IPV6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}|:(:[0-9a-fA-F]{1,4}){1,7}|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4})?:)?(25[0-5]|(2[0-4]|1?[0-9])?[0-9])(\.(25[0-5]|(2[0-4]|1?[0-9])?[0-9])){3}|([0-9a-fA-F]{1,4}:){1,4}:(25[0-5]|(2[0-4]|1?[0-9])?[0-9])(\.(25[0-5]|(2[0-4]|1?[0-9])?[0-9])){3}|::)$/;

export const validateIPv6 = (value: string): boolean =>
    typeof value === 'string' && value.length <= 45 && REGEX_IPV6.test(value);

const REGEX_MAC = /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/;

export const validateMACAddress = (value: string): boolean => REGEX_MAC.test(value);

const REGEX_DATA_URI = /^data:[a-zA-Z0-9]{1,50}[a-zA-Z0-9!#$&\-^_]{0,50}\/[a-zA-Z0-9]{1,50}[a-zA-Z0-9!#$&\-^_]{0,50};base64,[A-Za-z0-9+/]{4,10485760}={0,2}$/;

export const validateDataURI = (value: string): boolean =>
    typeof value === 'string' && REGEX_DATA_URI.test(value);

export const validateMimeType = (value: any, allowedTypes: string[]): boolean => {
    const mimeType: string =
        typeof value === 'string' ? value :
        value != null && typeof value.type === 'string' ? value.type : '';
    if (!mimeType) return false;
    return allowedTypes.some((pattern) => {
        if (pattern.endsWith('/*')) {
            const prefix = pattern.slice(0, -1); // e.g. "image/"
            return mimeType.startsWith(prefix);
        }
        return mimeType === pattern;
    });
};

// --- v4 new validators ---

export const validateAlphaDash = (v: string): boolean => REGEX_ALPHA_DASH.test(v);
export const validateNotEmpty = (v: any): boolean => typeof v === 'string' && v.trim() !== '';
export const validateJWT = (v: string): boolean => REGEX_JWT.test(v);
export const validateFinite = (v: any): boolean => Number.isFinite(Number(v));
export const validatePort = (v: any): boolean => { const n = Number(v); return Number.isInteger(n) && n >= 0 && n <= 65535; };
export const validateGreaterThanOrEqual = (v: any, n: number): boolean => Number(v) >= n;
export const validateLessThanOrEqual = (v: any, n: number): boolean => Number(v) <= n;
export const validateDateAfterField = (v: any, other: any): boolean => {
    const d = new Date(v), o = new Date(other);
    return !isNaN(d.getTime()) && !isNaN(o.getTime()) && d > o;
};
export const validateDateBeforeField = (v: any, other: any): boolean => {
    const d = new Date(v), o = new Date(other);
    return !isNaN(d.getTime()) && !isNaN(o.getTime()) && d < o;
};
export const validateArrayExactLength = (v: any, n: number): boolean => Array.isArray(v) && v.length === n;

// --- Synthetic rule type identifiers ---
export const SYNTHETIC_OR       = '__or__'       as const;
export const SYNTHETIC_NOT      = '__not__'      as const;
export const SYNTHETIC_IF       = '__if__'       as const;
export const SYNTHETIC_OPTIONAL = '__optional__' as const;
export const SYNTHETIC_NULLABLE = '__nullable__' as const;
export const SYNTHETIC_BAIL     = '__bail__'     as const;
