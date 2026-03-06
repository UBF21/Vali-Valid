export const en: Record<string, string | ((...args: any[]) => string)> = {
    // String
    required: 'Required field.',
    minLength: (n: number) => `The field must have at least ${n} characters.`,
    maxLength: (n: number) => `The field cannot be more than ${n} characters.`,
    exactLength: (n: number) => `The field must be exactly ${n} characters.`,
    email: 'Does not have email format.',
    url: 'Invalid url format.',
    alpha: 'Only supports letters.',
    alphaNumeric: 'Only supports letters and numbers.',
    lowerCase: 'Only supports lowercase letters.',
    upperCase: 'Only supports uppercase letters.',
    noWhitespace: 'The field must not contain spaces.',
    contains: (v: string) => `The field must contain "${v}".`,
    startsWith: (v: string) => `The field must start with "${v}".`,
    endsWith: (v: string) => `The field must end with "${v}".`,
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
    numberRange: (min: number, max: number) => `The value must be between ${min} and ${max}.`,
    numberPositive: 'Only positive numbers are allowed.',
    numberNegative: 'Only negative numbers are allowed.',
    integer: 'The field must be an integer.',
    multipleOf: (n: number) => `The value must be a multiple of ${n}.`,
    // Date
    dateFormat: (format: string) => `The date format is invalid. The expected format is (${format}).`,
    minDate: (v: string | Date) => `The date must be on or after ${v}.`,
    maxDate: (v: string | Date) => `The date must be on or before ${v}.`,
    futureDate: 'The date must be in the future.',
    pastDate: 'The date must be in the past.',
    // File
    fileType: 'File type not allowed.',
    fileSize: 'The file size exceeds the allowed limit.',
    fileDimensions: (w: number, h: number) => `The file dimensions must be ${w}x${h}.`,
    imageAspectRatio: (w: number, h: number) => `The image aspect ratio must be ${w}:${h}.`,
    imageMinDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`width >= ${w}px`);
        if (h !== undefined) parts.push(`height >= ${h}px`);
        return `The image dimensions must be at least ${parts.join(' and ')}.`;
    },
    imageMaxDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`width <= ${w}px`);
        if (h !== undefined) parts.push(`height <= ${h}px`);
        return `The image dimensions must be at most ${parts.join(' and ')}.`;
    },
    // Cross-field
    matchField: 'Fields do not match.',
    requiredIf: 'This field is required.',
    // Async
    asyncPattern: 'Validation failed.',
    // --- New v2.1 ---
    // Numeric
    greaterThan: (n: number) => `The value must be greater than ${n}.`,
    lessThan: (n: number) => `The value must be less than ${n}.`,
    precision: (n: number) => `The value must have at most ${n} decimal places.`,
    // Date
    dateAfter: (v: string | Date) => `The date must be after ${v}.`,
    dateBefore: (v: string | Date) => `The date must be before ${v}.`,
    // Enum / set
    oneOf: (values: any[]) => `The value must be one of: ${values.join(', ')}.`,
    // Cross-field
    notMatchField: 'Fields must not match.',
    requiredUnless: 'This field is required.',
    // Array
    arrayMinLength: (n: number) => `The array must have at least ${n} elements.`,
    arrayMaxLength: (n: number) => `The array must have at most ${n} elements.`,
    arrayUnique: 'The array must not contain duplicate values.',
    arrayContains: (v: any) => `The array must contain "${v}".`,
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
