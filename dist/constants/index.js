"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX_ALPHA_NUMERIC = exports.REGEX_ALPHA = exports.REGEX_URL = exports.REGEX_EMAIL = exports.REGEX_DECIMALS = exports.REGEX_ONLY_NUMBERS_STRING = exports.REGEX_ONLY_NUMBERS = exports.DEFAULT_ERROR_ASYNC_PATTERN_MESSAGE = exports.DEFAULT_ERROR_REQUIRED_IF_MESSAGE = exports.DEFAULT_ERROR_MATCH_FIELD_MESSAGE = exports.DEFAULT_ERROR_IMAGE_MAX_DIMENSIONS_MESSAGE = exports.DEFAULT_ERROR_IMAGE_MIN_DIMENSIONS_MESSAGE = exports.DEFAULT_ERROR_IMAGE_ASPECT_RATIO_MESSAGE = exports.DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE = exports.DEFAULT_ERROR_FILE_SIZE_MESSAGE = exports.DEFAULT_ERROR_FILE_TYPE_MESSAGE = exports.DEFAULT_ERROR_PAST_DATE_MESSAGE = exports.DEFAULT_ERROR_FUTURE_DATE_MESSAGE = exports.DEFAULT_ERROR_MAX_DATE_MESSAGE = exports.DEFAULT_ERROR_MIN_DATE_MESSAGE = exports.DEFAULT_ERROR_DATE_FORMAT_MESSAGE = exports.DEFAULT_ERROR_MULTIPLE_OF_MESSAGE = exports.DEFAULT_ERROR_INTEGER_MESSAGE = exports.DEFAULT_ERROR_NUMBER_NEGATIVE_MESSAGE = exports.DEFAULT_ERROR_NUMBER_POSITIVE_MESSAGE = exports.DEFAULT_ERROR_NUMBER_RANGE_MESSAGE = exports.DEFAULT_ERROR_DIGITS_ONLY_MESSAGE = exports.DEFAULT_ERROR_PATTERN_MESSAGE = exports.DEFAULT_ERROR_CREDIT_CARD_MESSAGE = exports.DEFAULT_ERROR_PHONE_MESSAGE = exports.DEFAULT_ERROR_JSON_MESSAGE = exports.DEFAULT_ERROR_UUID_MESSAGE = exports.DEFAULT_ERROR_IPV4_MESSAGE = exports.DEFAULT_ERROR_HEX_COLOR_MESSAGE = exports.DEFAULT_ERROR_PASSWORD_STRENGTH_MESSAGE = exports.DEFAULT_ERROR_SLUG_MESSAGE = exports.DEFAULT_ERROR_ENDS_WITH_MESSAGE = exports.DEFAULT_ERROR_STARTS_WITH_MESSAGE = exports.DEFAULT_ERROR_CONTAINS_MESSAGE = exports.DEFAULT_ERROR_NO_WHITESPACE_MESSAGE = exports.DEFAULT_ERROR_UPPER_CASE_MESSAGE = exports.DEFAULT_ERROR_LOWER_CASE_MESSAGE = exports.DEFAULT_ERROR_ALPHA_NUMERIC_MESSAGE = exports.DEFAULT_ERROR_ALPHA_MESSAGE = exports.DEFAULT_ERROR_URL_MESSAGE = exports.DEFAULT_ERROR_EMAIL_MESSAGE = exports.DEFAULT_ERROR_EXACT_LENGTH_MESSAGE = exports.DEFAULT_ERROR_MAX_LENGTH_MESSAGE = exports.DEFAULT_ERROR_MIN_LENGTH_MESSAGE = exports.DEFAULT_ERROR_REQUIRED_MESSAGE = void 0;
exports.validateGreaterThan = exports.sanitizeNumber = exports.validateImageMaxDimensions = exports.validateImageMinDimensions = exports.validateImageAspectRatio = exports.validateImageDimensions = exports.validateFileSize = exports.validateFileType = exports.validatePastDate = exports.validateFutureDate = exports.validateMaxDate = exports.validateMinDate = exports.validateDateFormat = exports.validateMultipleOf = exports.validateInteger = exports.validateNumberNegative = exports.validateNumberPositive = exports.validateNumberRange = exports.validateDigitsOnly = exports.validateCreditCard = exports.validatePhone = exports.validateJson = exports.validateUUID = exports.validateIPv4 = exports.validateHexColor = exports.validatePasswordStrength = exports.validateSlug = exports.validateEndsWith = exports.validateStartsWith = exports.validateContains = exports.validateNoWhitespace = exports.validateUpperCase = exports.validateLowerCase = exports.validateAlphaNumeric = exports.validateAlpha = exports.validateUrl = exports.validateEmail = exports.validateExactLength = exports.validateMaxLength = exports.validateMinLength = exports.validateRequired = exports.REGEX_PHONE = exports.REGEX_UUID = exports.REGEX_IPV4 = exports.REGEX_HEX_COLOR = exports.REGEX_PASSWORD_STRENGTH = exports.REGEX_SLUG = exports.REGEX_NO_WHITESPACE = exports.REGEX_UPPER_CASE = exports.REGEX_LOWER_CASE = void 0;
exports.validateBase64 = exports.validateSemVer = exports.validateLongitude = exports.validateLatitude = exports.validatePostalCode = exports.validateIBAN = exports.validateNoHTML = exports.validateTime = exports.validateArrayContains = exports.validateArrayUnique = exports.validateArrayMaxLength = exports.validateArrayMinLength = exports.validateRequiredUnless = exports.validateNotMatchField = exports.validateOneOf = exports.validateDateBefore = exports.validateDateAfter = exports.validatePrecision = exports.validateLessThan = void 0;
const index_1 = require("../types/index");
// --- Default error messages ---
exports.DEFAULT_ERROR_REQUIRED_MESSAGE = 'Required field.';
const DEFAULT_ERROR_MIN_LENGTH_MESSAGE = (value) => `The field must have at least ${value} characters.`;
exports.DEFAULT_ERROR_MIN_LENGTH_MESSAGE = DEFAULT_ERROR_MIN_LENGTH_MESSAGE;
const DEFAULT_ERROR_MAX_LENGTH_MESSAGE = (value) => `The field cannot be more than ${value} characters.`;
exports.DEFAULT_ERROR_MAX_LENGTH_MESSAGE = DEFAULT_ERROR_MAX_LENGTH_MESSAGE;
const DEFAULT_ERROR_EXACT_LENGTH_MESSAGE = (value) => `The field must be exactly ${value} characters.`;
exports.DEFAULT_ERROR_EXACT_LENGTH_MESSAGE = DEFAULT_ERROR_EXACT_LENGTH_MESSAGE;
exports.DEFAULT_ERROR_EMAIL_MESSAGE = 'Does not have email format.';
exports.DEFAULT_ERROR_URL_MESSAGE = 'Invalid url format.';
exports.DEFAULT_ERROR_ALPHA_MESSAGE = 'Only supports letters.';
exports.DEFAULT_ERROR_ALPHA_NUMERIC_MESSAGE = 'Only supports letters and numbers.';
exports.DEFAULT_ERROR_LOWER_CASE_MESSAGE = 'Only supports lowercase letters.';
exports.DEFAULT_ERROR_UPPER_CASE_MESSAGE = 'Only supports uppercase letters.';
exports.DEFAULT_ERROR_NO_WHITESPACE_MESSAGE = 'The field must not contain spaces.';
const DEFAULT_ERROR_CONTAINS_MESSAGE = (value) => `The field must contain "${value}".`;
exports.DEFAULT_ERROR_CONTAINS_MESSAGE = DEFAULT_ERROR_CONTAINS_MESSAGE;
const DEFAULT_ERROR_STARTS_WITH_MESSAGE = (value) => `The field must start with "${value}".`;
exports.DEFAULT_ERROR_STARTS_WITH_MESSAGE = DEFAULT_ERROR_STARTS_WITH_MESSAGE;
const DEFAULT_ERROR_ENDS_WITH_MESSAGE = (value) => `The field must end with "${value}".`;
exports.DEFAULT_ERROR_ENDS_WITH_MESSAGE = DEFAULT_ERROR_ENDS_WITH_MESSAGE;
exports.DEFAULT_ERROR_SLUG_MESSAGE = 'Only lowercase letters, numbers, and hyphens are allowed.';
exports.DEFAULT_ERROR_PASSWORD_STRENGTH_MESSAGE = 'Password must include uppercase, lowercase, number, and special character.';
exports.DEFAULT_ERROR_HEX_COLOR_MESSAGE = 'Invalid hex color format.';
exports.DEFAULT_ERROR_IPV4_MESSAGE = 'Invalid IPv4 address.';
exports.DEFAULT_ERROR_UUID_MESSAGE = 'Invalid UUID format.';
exports.DEFAULT_ERROR_JSON_MESSAGE = 'Invalid JSON format.';
exports.DEFAULT_ERROR_PHONE_MESSAGE = 'Invalid phone number format.';
exports.DEFAULT_ERROR_CREDIT_CARD_MESSAGE = 'Invalid credit card number.';
exports.DEFAULT_ERROR_PATTERN_MESSAGE = 'Does not comply with the required pattern.';
exports.DEFAULT_ERROR_DIGITS_ONLY_MESSAGE = 'The field can only contain digits.';
const DEFAULT_ERROR_NUMBER_RANGE_MESSAGE = (min, max) => `The value must be between ${min} and ${max}.`;
exports.DEFAULT_ERROR_NUMBER_RANGE_MESSAGE = DEFAULT_ERROR_NUMBER_RANGE_MESSAGE;
exports.DEFAULT_ERROR_NUMBER_POSITIVE_MESSAGE = 'Only positive numbers are allowed.';
exports.DEFAULT_ERROR_NUMBER_NEGATIVE_MESSAGE = 'Only negative numbers are allowed.';
exports.DEFAULT_ERROR_INTEGER_MESSAGE = 'The field must be an integer.';
const DEFAULT_ERROR_MULTIPLE_OF_MESSAGE = (value) => `The value must be a multiple of ${value}.`;
exports.DEFAULT_ERROR_MULTIPLE_OF_MESSAGE = DEFAULT_ERROR_MULTIPLE_OF_MESSAGE;
const DEFAULT_ERROR_DATE_FORMAT_MESSAGE = (format) => `The date format is invalid. The expected format is (${format}).`;
exports.DEFAULT_ERROR_DATE_FORMAT_MESSAGE = DEFAULT_ERROR_DATE_FORMAT_MESSAGE;
const DEFAULT_ERROR_MIN_DATE_MESSAGE = (value) => `The date must be on or after ${value}.`;
exports.DEFAULT_ERROR_MIN_DATE_MESSAGE = DEFAULT_ERROR_MIN_DATE_MESSAGE;
const DEFAULT_ERROR_MAX_DATE_MESSAGE = (value) => `The date must be on or before ${value}.`;
exports.DEFAULT_ERROR_MAX_DATE_MESSAGE = DEFAULT_ERROR_MAX_DATE_MESSAGE;
exports.DEFAULT_ERROR_FUTURE_DATE_MESSAGE = 'The date must be in the future.';
exports.DEFAULT_ERROR_PAST_DATE_MESSAGE = 'The date must be in the past.';
exports.DEFAULT_ERROR_FILE_TYPE_MESSAGE = 'File type not allowed.';
exports.DEFAULT_ERROR_FILE_SIZE_MESSAGE = 'The file size exceeds the allowed limit.';
const DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE = (width, height) => `The file dimensions must be ${width}x${height}.`;
exports.DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE = DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE;
const DEFAULT_ERROR_IMAGE_ASPECT_RATIO_MESSAGE = (w, h) => `The image aspect ratio must be ${w}:${h}.`;
exports.DEFAULT_ERROR_IMAGE_ASPECT_RATIO_MESSAGE = DEFAULT_ERROR_IMAGE_ASPECT_RATIO_MESSAGE;
const DEFAULT_ERROR_IMAGE_MIN_DIMENSIONS_MESSAGE = (width, height) => {
    const parts = [];
    if (width !== undefined)
        parts.push(`width >= ${width}px`);
    if (height !== undefined)
        parts.push(`height >= ${height}px`);
    return `The image dimensions must be at least ${parts.join(' and ')}.`;
};
exports.DEFAULT_ERROR_IMAGE_MIN_DIMENSIONS_MESSAGE = DEFAULT_ERROR_IMAGE_MIN_DIMENSIONS_MESSAGE;
const DEFAULT_ERROR_IMAGE_MAX_DIMENSIONS_MESSAGE = (width, height) => {
    const parts = [];
    if (width !== undefined)
        parts.push(`width <= ${width}px`);
    if (height !== undefined)
        parts.push(`height <= ${height}px`);
    return `The image dimensions must be at most ${parts.join(' and ')}.`;
};
exports.DEFAULT_ERROR_IMAGE_MAX_DIMENSIONS_MESSAGE = DEFAULT_ERROR_IMAGE_MAX_DIMENSIONS_MESSAGE;
exports.DEFAULT_ERROR_MATCH_FIELD_MESSAGE = 'Fields do not match.';
exports.DEFAULT_ERROR_REQUIRED_IF_MESSAGE = 'This field is required.';
exports.DEFAULT_ERROR_ASYNC_PATTERN_MESSAGE = 'Validation failed.';
// --- Regex patterns ---
exports.REGEX_ONLY_NUMBERS = /[^\d-]|(?!^)-/g;
exports.REGEX_ONLY_NUMBERS_STRING = /^[0-9]+$/;
exports.REGEX_DECIMALS = /^\d+(\.\d+)?$/;
exports.REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
exports.REGEX_URL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
exports.REGEX_ALPHA = /^[a-zA-Z]+$/;
exports.REGEX_ALPHA_NUMERIC = /^[a-zA-Z0-9]+$/;
exports.REGEX_LOWER_CASE = /^[a-z]+$/;
exports.REGEX_UPPER_CASE = /^[A-Z]+$/;
exports.REGEX_NO_WHITESPACE = /^\S+$/;
exports.REGEX_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
exports.REGEX_PASSWORD_STRENGTH = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
exports.REGEX_HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
exports.REGEX_IPV4 = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
exports.REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
exports.REGEX_PHONE = /^\+?[1-9]\d{6,14}$/;
// --- Sync validators ---
const validateRequired = (value) => {
    if (typeof value === 'string')
        return value.trim() !== '';
    if (typeof value === 'number')
        return true; // 0 is valid
    if (typeof value === 'boolean')
        return true;
    if (value instanceof File)
        return value !== null && value !== undefined;
    if (value instanceof Date)
        return value !== null;
    if (Array.isArray(value))
        return value.length > 0;
    return value !== null && value !== undefined;
};
exports.validateRequired = validateRequired;
const validateMinLength = (value, min) => typeof value === 'string' && value.length >= min;
exports.validateMinLength = validateMinLength;
const validateMaxLength = (value, max) => typeof value === 'string' && value.length <= max;
exports.validateMaxLength = validateMaxLength;
const validateExactLength = (value, exact) => typeof value === 'string' && value.length === exact;
exports.validateExactLength = validateExactLength;
const validateEmail = (value) => exports.REGEX_EMAIL.test(value);
exports.validateEmail = validateEmail;
const validateUrl = (value) => exports.REGEX_URL.test(value);
exports.validateUrl = validateUrl;
const validateAlpha = (value) => exports.REGEX_ALPHA.test(value);
exports.validateAlpha = validateAlpha;
const validateAlphaNumeric = (value) => exports.REGEX_ALPHA_NUMERIC.test(value);
exports.validateAlphaNumeric = validateAlphaNumeric;
const validateLowerCase = (value) => exports.REGEX_LOWER_CASE.test(value);
exports.validateLowerCase = validateLowerCase;
const validateUpperCase = (value) => exports.REGEX_UPPER_CASE.test(value);
exports.validateUpperCase = validateUpperCase;
const validateNoWhitespace = (value) => exports.REGEX_NO_WHITESPACE.test(value);
exports.validateNoWhitespace = validateNoWhitespace;
const validateContains = (value, substring) => typeof value === 'string' && value.includes(substring);
exports.validateContains = validateContains;
const validateStartsWith = (value, prefix) => typeof value === 'string' && value.startsWith(prefix);
exports.validateStartsWith = validateStartsWith;
const validateEndsWith = (value, suffix) => typeof value === 'string' && value.endsWith(suffix);
exports.validateEndsWith = validateEndsWith;
const validateSlug = (value) => exports.REGEX_SLUG.test(value);
exports.validateSlug = validateSlug;
const validatePasswordStrength = (value) => exports.REGEX_PASSWORD_STRENGTH.test(value);
exports.validatePasswordStrength = validatePasswordStrength;
const validateHexColor = (value) => exports.REGEX_HEX_COLOR.test(value);
exports.validateHexColor = validateHexColor;
const validateIPv4 = (value) => exports.REGEX_IPV4.test(value);
exports.validateIPv4 = validateIPv4;
const validateUUID = (value) => exports.REGEX_UUID.test(value);
exports.validateUUID = validateUUID;
const validateJson = (value) => {
    try {
        JSON.parse(value);
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.validateJson = validateJson;
const validatePhone = (value) => exports.REGEX_PHONE.test(value.replace(/\s/g, ''));
exports.validatePhone = validatePhone;
const validateCreditCard = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19)
        return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i], 10);
        if (isEven) {
            d *= 2;
            if (d > 9)
                d -= 9;
        }
        sum += d;
        isEven = !isEven;
    }
    return sum % 10 === 0;
};
exports.validateCreditCard = validateCreditCard;
const validateDigitsOnly = (value) => exports.REGEX_ONLY_NUMBERS_STRING.test(value);
exports.validateDigitsOnly = validateDigitsOnly;
const validateNumberRange = (value, min, max) => typeof value === 'number' && value >= min && value <= max;
exports.validateNumberRange = validateNumberRange;
const validateNumberPositive = (value) => value > 0;
exports.validateNumberPositive = validateNumberPositive;
const validateNumberNegative = (value) => value < 0;
exports.validateNumberNegative = validateNumberNegative;
const validateInteger = (value) => typeof value === 'number' && Number.isInteger(value);
exports.validateInteger = validateInteger;
const validateMultipleOf = (value, multiple) => typeof value === 'number' && multiple !== 0 && value % multiple === 0;
exports.validateMultipleOf = validateMultipleOf;
const validateDateFormat = (value, format) => index_1.DateFormatExpressions[format].test(String(value));
exports.validateDateFormat = validateDateFormat;
const validateMinDate = (value, minDate) => {
    const date = new Date(value);
    const min = new Date(minDate);
    return !isNaN(date.getTime()) && date >= min;
};
exports.validateMinDate = validateMinDate;
const validateMaxDate = (value, maxDate) => {
    const date = new Date(value);
    const max = new Date(maxDate);
    return !isNaN(date.getTime()) && date <= max;
};
exports.validateMaxDate = validateMaxDate;
const validateFutureDate = (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date > new Date();
};
exports.validateFutureDate = validateFutureDate;
const validatePastDate = (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date < new Date();
};
exports.validatePastDate = validatePastDate;
const validateFileType = (file, allowedTypes) => allowedTypes.toString().includes(file.type);
exports.validateFileType = validateFileType;
const validateFileSize = (file, maxSize) => file.size <= maxSize;
exports.validateFileSize = validateFileSize;
// --- Async image validators ---
const validateImageDimensions = async (file, dimensions) => {
    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        URL.revokeObjectURL(img.src);
        return img.width === dimensions.width && img.height === dimensions.height;
    }
    catch (_a) {
        return false;
    }
};
exports.validateImageDimensions = validateImageDimensions;
const validateImageAspectRatio = async (file, ratio, tolerance = 0.01) => {
    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        URL.revokeObjectURL(img.src);
        const expected = ratio.width / ratio.height;
        const actual = img.width / img.height;
        return Math.abs(actual - expected) <= tolerance;
    }
    catch (_a) {
        return false;
    }
};
exports.validateImageAspectRatio = validateImageAspectRatio;
const validateImageMinDimensions = async (file, min) => {
    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        URL.revokeObjectURL(img.src);
        if (min.width !== undefined && img.width < min.width)
            return false;
        if (min.height !== undefined && img.height < min.height)
            return false;
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.validateImageMinDimensions = validateImageMinDimensions;
const validateImageMaxDimensions = async (file, max) => {
    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        URL.revokeObjectURL(img.src);
        if (max.width !== undefined && img.width > max.width)
            return false;
        if (max.height !== undefined && img.height > max.height)
            return false;
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.validateImageMaxDimensions = validateImageMaxDimensions;
// --- Number sanitization ---
const sanitizeNumber = (value) => {
    return Number(String(value).replace(exports.REGEX_ONLY_NUMBERS, ''));
};
exports.sanitizeNumber = sanitizeNumber;
// --- v2.1 new validators ---
const validateGreaterThan = (value, n) => Number(value) > n;
exports.validateGreaterThan = validateGreaterThan;
const validateLessThan = (value, n) => Number(value) < n;
exports.validateLessThan = validateLessThan;
const validatePrecision = (value, n) => {
    const str = String(value);
    const dotIndex = str.indexOf('.');
    if (dotIndex === -1)
        return true;
    return str.length - dotIndex - 1 <= n;
};
exports.validatePrecision = validatePrecision;
const validateDateAfter = (value, ref) => {
    const d = new Date(value);
    const r = new Date(ref);
    return !isNaN(d.getTime()) && !isNaN(r.getTime()) && d > r;
};
exports.validateDateAfter = validateDateAfter;
const validateDateBefore = (value, ref) => {
    const d = new Date(value);
    const r = new Date(ref);
    return !isNaN(d.getTime()) && !isNaN(r.getTime()) && d < r;
};
exports.validateDateBefore = validateDateBefore;
const validateOneOf = (value, options) => options.includes(value);
exports.validateOneOf = validateOneOf;
const validateNotMatchField = (value, other) => value !== other;
exports.validateNotMatchField = validateNotMatchField;
const validateRequiredUnless = (value, condition, form) => {
    if (condition(form))
        return true;
    return (0, exports.validateRequired)(value);
};
exports.validateRequiredUnless = validateRequiredUnless;
const validateArrayMinLength = (value, n) => Array.isArray(value) && value.length >= n;
exports.validateArrayMinLength = validateArrayMinLength;
const validateArrayMaxLength = (value, n) => Array.isArray(value) && value.length <= n;
exports.validateArrayMaxLength = validateArrayMaxLength;
const validateArrayUnique = (value) => {
    if (!Array.isArray(value))
        return false;
    return new Set(value).size === value.length;
};
exports.validateArrayUnique = validateArrayUnique;
const validateArrayContains = (value, item) => Array.isArray(value) && value.includes(item);
exports.validateArrayContains = validateArrayContains;
const REGEX_TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/;
const REGEX_TIME_12H = /^(0[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/;
const validateTime = (value, format = '24h') => format === '12h' ? REGEX_TIME_12H.test(value) : REGEX_TIME_24H.test(value);
exports.validateTime = validateTime;
const validateNoHTML = (value) => typeof value === 'string' && !/<[^>]*>/.test(value);
exports.validateNoHTML = validateNoHTML;
const validateIBAN = (value) => {
    const iban = value.replace(/\s+/g, '').toUpperCase();
    if (iban.length < 15 || iban.length > 34)
        return false;
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
exports.validateIBAN = validateIBAN;
const POSTAL_CODE_PATTERNS = {
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
const validatePostalCode = (value, country) => {
    const pattern = POSTAL_CODE_PATTERNS[country.toUpperCase()];
    if (!pattern)
        return /^\S+$/.test(value);
    return pattern.test(value);
};
exports.validatePostalCode = validatePostalCode;
const validateLatitude = (value) => {
    const n = Number(value);
    return !isNaN(n) && n >= -90 && n <= 90;
};
exports.validateLatitude = validateLatitude;
const validateLongitude = (value) => {
    const n = Number(value);
    return !isNaN(n) && n >= -180 && n <= 180;
};
exports.validateLongitude = validateLongitude;
const REGEX_SEMVER = /^\d+\.\d+\.\d+(\-[a-zA-Z0-9._-]+)?(\+[a-zA-Z0-9._-]+)?$/;
const validateSemVer = (value) => REGEX_SEMVER.test(value);
exports.validateSemVer = validateSemVer;
const REGEX_BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;
const validateBase64 = (value) => typeof value === 'string' && REGEX_BASE64.test(value) && value.length % 4 === 0;
exports.validateBase64 = validateBase64;
