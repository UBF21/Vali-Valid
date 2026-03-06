"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.en = void 0;
exports.en = {
    // String
    required: 'Required field.',
    minLength: (n) => `The field must have at least ${n} characters.`,
    maxLength: (n) => `The field cannot be more than ${n} characters.`,
    exactLength: (n) => `The field must be exactly ${n} characters.`,
    email: 'Does not have email format.',
    url: 'Invalid url format.',
    alpha: 'Only supports letters.',
    alphaNumeric: 'Only supports letters and numbers.',
    lowerCase: 'Only supports lowercase letters.',
    upperCase: 'Only supports uppercase letters.',
    noWhitespace: 'The field must not contain spaces.',
    contains: (v) => `The field must contain "${v}".`,
    startsWith: (v) => `The field must start with "${v}".`,
    endsWith: (v) => `The field must end with "${v}".`,
    slug: 'Only lowercase letters, numbers, and hyphens are allowed.',
    passwordStrength: 'Password must include uppercase, lowercase, number, and special character.',
    hexColor: 'Invalid hex color format.',
    ipv4: 'Invalid IPv4 address.',
    uuid: 'Invalid UUID format.',
    json: 'Invalid JSON format.',
    phone: 'Invalid phone number format.',
    creditCard: 'Invalid credit card number.',
    pattern: 'Does not comply with the required pattern.',
    // Numeric
    digitsOnly: 'The field can only contain digits.',
    numberRange: (min, max) => `The value must be between ${min} and ${max}.`,
    numberPositive: 'Only positive numbers are allowed.',
    numberNegative: 'Only negative numbers are allowed.',
    integer: 'The field must be an integer.',
    multipleOf: (n) => `The value must be a multiple of ${n}.`,
    // Date
    dateFormat: (format) => `The date format is invalid. The expected format is (${format}).`,
    minDate: (v) => `The date must be on or after ${v}.`,
    maxDate: (v) => `The date must be on or before ${v}.`,
    futureDate: 'The date must be in the future.',
    pastDate: 'The date must be in the past.',
    // File
    fileType: 'File type not allowed.',
    fileSize: 'The file size exceeds the allowed limit.',
    fileDimensions: (w, h) => `The file dimensions must be ${w}x${h}.`,
    imageAspectRatio: (w, h) => `The image aspect ratio must be ${w}:${h}.`,
    imageMinDimensions: (w, h) => {
        const parts = [];
        if (w !== undefined)
            parts.push(`width >= ${w}px`);
        if (h !== undefined)
            parts.push(`height >= ${h}px`);
        return `The image dimensions must be at least ${parts.join(' and ')}.`;
    },
    imageMaxDimensions: (w, h) => {
        const parts = [];
        if (w !== undefined)
            parts.push(`width <= ${w}px`);
        if (h !== undefined)
            parts.push(`height <= ${h}px`);
        return `The image dimensions must be at most ${parts.join(' and ')}.`;
    },
    // Cross-field
    matchField: 'Fields do not match.',
    requiredIf: 'This field is required.',
    // Async
    asyncPattern: 'Validation failed.',
    // --- New v2.1 ---
    // Numeric
    greaterThan: (n) => `The value must be greater than ${n}.`,
    lessThan: (n) => `The value must be less than ${n}.`,
    precision: (n) => `The value must have at most ${n} decimal places.`,
    // Date
    dateAfter: (v) => `The date must be after ${v}.`,
    dateBefore: (v) => `The date must be before ${v}.`,
    // Enum / set
    oneOf: (values) => `The value must be one of: ${values.join(', ')}.`,
    // Cross-field
    notMatchField: 'Fields must not match.',
    requiredUnless: 'This field is required.',
    // Array
    arrayMinLength: (n) => `The array must have at least ${n} elements.`,
    arrayMaxLength: (n) => `The array must have at most ${n} elements.`,
    arrayUnique: 'The array must not contain duplicate values.',
    arrayContains: (v) => `The array must contain "${v}".`,
    // Format
    time: 'Invalid time format.',
    noHTML: 'HTML tags are not allowed.',
    // Finance / geo / other
    iban: 'Invalid IBAN.',
    postalCode: 'Invalid postal code.',
    latitude: 'The value must be a valid latitude (-90 to 90).',
    longitude: 'The value must be a valid longitude (-180 to 180).',
    semVer: 'Invalid semantic version (expected X.Y.Z).',
    base64: 'Invalid Base64 string.',
};
