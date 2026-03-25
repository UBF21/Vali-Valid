import { DateFormat, FileSize, TypeFile } from '../types/index';

export enum ValidationType {
    // String
    Required = 'Required',
    MinLength = 'MinLength',
    MaxLength = 'MaxLength',
    ExactLength = 'ExactLength',
    Email = 'Email',
    Url = 'Url',
    Alpha = 'Alpha',
    AlphaNumeric = 'AlphaNumeric',
    LowerCase = 'LowerCase',
    UpperCase = 'UpperCase',
    NoWhitespace = 'NoWhitespace',
    Contains = 'Contains',
    StartsWith = 'StartsWith',
    EndsWith = 'EndsWith',
    Slug = 'Slug',
    PasswordStrength = 'PasswordStrength',
    HexColor = 'HexColor',
    IPv4 = 'IPv4',
    UUID = 'UUID',
    Json = 'Json',
    Phone = 'Phone',
    CreditCard = 'CreditCard',
    Pattern = 'Pattern',

    // Numeric
    DigitsOnly = 'DigitsOnly',
    NumberRange = 'NumberRange',
    NumberPositive = 'NumberPositive',
    NumberNegative = 'NumberNegative',
    Integer = 'Integer',
    MultipleOf = 'MultipleOf',

    // Date
    DateFormat = 'DateFormat',
    MinDate = 'MinDate',
    MaxDate = 'MaxDate',
    FutureDate = 'FutureDate',
    PastDate = 'PastDate',

    // File
    FileType = 'FileType',
    FileSize = 'FileSize',
    FileDimensions = 'FileDimensions',
    ImageAspectRatio = 'ImageAspectRatio',
    ImageMinDimensions = 'ImageMinDimensions',
    ImageMaxDimensions = 'ImageMaxDimensions',

    // Cross-field
    MatchField = 'MatchField',
    RequiredIf = 'RequiredIf',

    // Async
    AsyncPattern = 'AsyncPattern',

    // v2.1 — Numeric
    GreaterThan = 'GreaterThan',
    LessThan = 'LessThan',
    Precision = 'Precision',

    // v2.1 — Date
    DateAfter = 'DateAfter',
    DateBefore = 'DateBefore',

    // v2.1 — Enum / set
    OneOf = 'OneOf',

    // v2.1 — Cross-field
    NotMatchField = 'NotMatchField',
    RequiredUnless = 'RequiredUnless',

    // v2.1 — Array
    ArrayMinLength = 'ArrayMinLength',
    ArrayMaxLength = 'ArrayMaxLength',
    ArrayUnique = 'ArrayUnique',
    ArrayContains = 'ArrayContains',

    // v2.1 — Format
    Time = 'Time',
    NoHTML = 'NoHTML',

    // v2.1 — Finance / geo / other
    IBAN = 'IBAN',
    PostalCode = 'PostalCode',
    Latitude = 'Latitude',
    Longitude = 'Longitude',
    SemVer = 'SemVer',
    Base64 = 'Base64',

    // v3 — new types
    NotOneOf = 'NotOneOf',
    IPv6 = 'IPv6',
    MACAddress = 'MACAddress',
    DataURI = 'DataURI',
    MimeType = 'MimeType',
    DateRange = 'DateRange',
    ArrayItems = 'ArrayItems',

    // v4 — new types
    AlphaDash = 'AlphaDash',
    NotEmpty = 'NotEmpty',
    JWT = 'JWT',
    Finite = 'Finite',
    Port = 'Port',
    GreaterThanOrEqual = 'GreaterThanOrEqual',
    LessThanOrEqual = 'LessThanOrEqual',
    DateAfterField = 'DateAfterField',
    DateBeforeField = 'DateBeforeField',
    ArrayExactLength = 'ArrayExactLength',
}

// --- Existing types ---

export type ValidationConfigRequired = {
    type: ValidationType.Required;
    message?: string;
};

export type ValidationConfigMinLength = {
    type: ValidationType.MinLength;
    value: number;
    message?: string;
};

export type ValidationConfigMaxLength = {
    type: ValidationType.MaxLength;
    value: number;
    message?: string;
};

export type ValidationConfigExactLength = {
    type: ValidationType.ExactLength;
    value: number;
    message?: string;
};

export type ValidationConfigDigitsOnly = {
    type: ValidationType.DigitsOnly;
    message?: string;
};

export type ValidationConfigNumberRange = {
    type: ValidationType.NumberRange;
    value: [number, number];
    message?: string;
};

export type ValidationConfigEmail = {
    type: ValidationType.Email;
    message?: string;
};

export type ValidationConfigUrl = {
    type: ValidationType.Url;
    message?: string;
};

export type ValidationConfigFileType = {
    type: ValidationType.FileType;
    value: TypeFile[] | string[];
    message?: string;
};

export type ValidationConfigFileSize = {
    type: ValidationType.FileSize;
    value: number | FileSize;
    message?: string;
};

export type ValidationConfigFileDimensions = {
    type: ValidationType.FileDimensions;
    value: { width: number; height: number };
    message?: string;
};

export type ValidationConfigPattern = {
    type: ValidationType.Pattern;
    value: RegExp | ((value: any) => boolean);
    message?: string;
};

export type ValidationConfigDateFormat = {
    type: ValidationType.DateFormat;
    format: DateFormat;
    message?: string;
};

export type ValidationConfigNumberPositive = {
    type: ValidationType.NumberPositive;
    message?: string;
};

export type ValidationConfigNumberNegative = {
    type: ValidationType.NumberNegative;
    message?: string;
};

export type ValidationConfigAlpha = {
    type: ValidationType.Alpha;
    message?: string;
};

export type ValidationConfigAlphaNumeric = {
    type: ValidationType.AlphaNumeric;
    message?: string;
};

export type ValidationConfigLowerCase = {
    type: ValidationType.LowerCase;
    message?: string;
};

export type ValidationConfigUpperCase = {
    type: ValidationType.UpperCase;
    message?: string;
};

// --- New string types ---

export type ValidationConfigNoWhitespace = {
    type: ValidationType.NoWhitespace;
    message?: string;
};

export type ValidationConfigContains = {
    type: ValidationType.Contains;
    value: string;
    message?: string;
};

export type ValidationConfigStartsWith = {
    type: ValidationType.StartsWith;
    value: string;
    message?: string;
};

export type ValidationConfigEndsWith = {
    type: ValidationType.EndsWith;
    value: string;
    message?: string;
};

export type ValidationConfigSlug = {
    type: ValidationType.Slug;
    message?: string;
};

export type ValidationConfigPasswordStrength = {
    type: ValidationType.PasswordStrength;
    message?: string;
};

export type ValidationConfigHexColor = {
    type: ValidationType.HexColor;
    message?: string;
};

export type ValidationConfigIPv4 = {
    type: ValidationType.IPv4;
    message?: string;
};

export type ValidationConfigUUID = {
    type: ValidationType.UUID;
    version?: 1 | 3 | 4 | 5;   // NEW — optional, defaults to v4
    message?: string;
};

export type ValidationConfigJson = {
    type: ValidationType.Json;
    message?: string;
};

export type ValidationConfigPhone = {
    type: ValidationType.Phone;
    message?: string;
};

export type ValidationConfigCreditCard = {
    type: ValidationType.CreditCard;
    message?: string;
};

// --- New numeric types ---

export type ValidationConfigInteger = {
    type: ValidationType.Integer;
    message?: string;
};

export type ValidationConfigMultipleOf = {
    type: ValidationType.MultipleOf;
    value: number;
    message?: string;
};

// --- New date types ---

export type ValidationConfigMinDate = {
    type: ValidationType.MinDate;
    value: string | Date;
    message?: string;
};

export type ValidationConfigMaxDate = {
    type: ValidationType.MaxDate;
    value: string | Date;
    message?: string;
};

export type ValidationConfigFutureDate = {
    type: ValidationType.FutureDate;
    message?: string;
};

export type ValidationConfigPastDate = {
    type: ValidationType.PastDate;
    message?: string;
};

// --- Cross-field types ---

export type ValidationConfigMatchField = {
    type: ValidationType.MatchField;
    field: string;
    message?: string;
};

export type ValidationConfigRequiredIf = {
    type: ValidationType.RequiredIf;
    condition: (form: Record<string, any>) => boolean;
    message?: string;
};

// --- New file types ---

export type ValidationConfigImageAspectRatio = {
    type: ValidationType.ImageAspectRatio;
    value: { width: number; height: number };
    tolerance?: number;
    message?: string;
};

export type ValidationConfigImageMinDimensions = {
    type: ValidationType.ImageMinDimensions;
    value: { width?: number; height?: number };
    message?: string;
};

export type ValidationConfigImageMaxDimensions = {
    type: ValidationType.ImageMaxDimensions;
    value: { width?: number; height?: number };
    message?: string;
};

// --- Async ---

export type ValidationConfigAsyncPattern = {
    type: ValidationType.AsyncPattern;
    message?: string;
    asyncFn: (value: any, form: Record<string, any>) => Promise<boolean>;
};

// --- v2.1 new config types ---

export type ValidationConfigGreaterThan = {
    type: ValidationType.GreaterThan;
    value: number;
    message?: string;
};

export type ValidationConfigLessThan = {
    type: ValidationType.LessThan;
    value: number;
    message?: string;
};

export type ValidationConfigPrecision = {
    type: ValidationType.Precision;
    value: number;
    message?: string;
};

export type ValidationConfigDateAfter = {
    type: ValidationType.DateAfter;
    value: string | Date;
    message?: string;
};

export type ValidationConfigDateBefore = {
    type: ValidationType.DateBefore;
    value: string | Date;
    message?: string;
};

export type ValidationConfigOneOf = {
    type: ValidationType.OneOf;
    value: any[];
    message?: string;
};

export type ValidationConfigNotMatchField = {
    type: ValidationType.NotMatchField;
    field: string;
    message?: string;
};

export type ValidationConfigRequiredUnless = {
    type: ValidationType.RequiredUnless;
    condition: (form: Record<string, any>) => boolean;
    message?: string;
};

export type ValidationConfigArrayMinLength = {
    type: ValidationType.ArrayMinLength;
    value: number;
    message?: string;
};

export type ValidationConfigArrayMaxLength = {
    type: ValidationType.ArrayMaxLength;
    value: number;
    message?: string;
};

export type ValidationConfigArrayUnique = {
    type: ValidationType.ArrayUnique;
    message?: string;
};

export type ValidationConfigArrayContains = {
    type: ValidationType.ArrayContains;
    value: any;
    message?: string;
};

export type ValidationConfigTime = {
    type: ValidationType.Time;
    format?: '24h' | '12h';
    message?: string;
};

export type ValidationConfigNoHTML = {
    type: ValidationType.NoHTML;
    message?: string;
};

export type ValidationConfigIBAN = {
    type: ValidationType.IBAN;
    message?: string;
};

export type ValidationConfigPostalCode = {
    type: ValidationType.PostalCode;
    country: string;
    message?: string;
};

export type ValidationConfigLatitude = {
    type: ValidationType.Latitude;
    message?: string;
};

export type ValidationConfigLongitude = {
    type: ValidationType.Longitude;
    message?: string;
};

export type ValidationConfigSemVer = {
    type: ValidationType.SemVer;
    message?: string;
};

export type ValidationConfigBase64 = {
    type: ValidationType.Base64;
    message?: string;
};

// --- v3 new config types ---

export type ValidationConfigNotOneOf = {
    type: ValidationType.NotOneOf;
    value: any[];
    message?: string;
};

export type ValidationConfigIPv6 = {
    type: ValidationType.IPv6;
    message?: string;
};

export type ValidationConfigMACAddress = {
    type: ValidationType.MACAddress;
    message?: string;
};

export type ValidationConfigDataURI = {
    type: ValidationType.DataURI;
    message?: string;
};

export type ValidationConfigMimeType = {
    type: ValidationType.MimeType;
    value: string[];
    message?: string;
};

export type ValidationConfigDateRange = {
    type: ValidationType.DateRange;
    startField: string;
    endField: string;
    message?: string;
};

export type ValidationConfigArrayItems = {
    type: ValidationType.ArrayItems;
    validations: ValidationsConfig[];
    message?: string;
};

// --- v4 new config types ---

export type ValidationConfigAlphaDash = { type: ValidationType.AlphaDash; message?: string; };
export type ValidationConfigNotEmpty = { type: ValidationType.NotEmpty; message?: string; };
export type ValidationConfigJWT = { type: ValidationType.JWT; message?: string; };
export type ValidationConfigFinite = { type: ValidationType.Finite; message?: string; };
export type ValidationConfigPort = { type: ValidationType.Port; message?: string; };
export type ValidationConfigGreaterThanOrEqual = { type: ValidationType.GreaterThanOrEqual; value: number; message?: string; };
export type ValidationConfigLessThanOrEqual = { type: ValidationType.LessThanOrEqual; value: number; message?: string; };
export type ValidationConfigDateAfterField = { type: ValidationType.DateAfterField; field: string; message?: string; };
export type ValidationConfigDateBeforeField = { type: ValidationType.DateBeforeField; field: string; message?: string; };
export type ValidationConfigArrayExactLength = { type: ValidationType.ArrayExactLength; value: number; message?: string; };

// --- Synthetic builder types ---
export type ValidationConfigNot = {
  type: '__not__';
  message?: string;
  value: (value: any) => boolean;
};
export type ValidationConfigIf = {
  type: '__if__';
  message?: string;
  condition: (form: any) => boolean;
  thenBranch: (value: any) => boolean;
  elseBranch?: (value: any) => boolean;
};
export type ValidationConfigOptional = {
  type: '__optional__';
};
export type ValidationConfigNullable = {
  type: '__nullable__';
};
export type ValidationConfigBail = {
  type: '__bail__';
};

export type ValidationConfigOr = {
  type: '__or__';
  message?: string;
  value: (val: any) => boolean;
};

/**
 * Type-safe discriminant guard for ValidationsConfig.
 * @example
 *   if (isValidationConfig(cfg, ValidationType.UUID)) {
 *       // cfg.version is safely accessible here
 *   }
 */
export function isValidationConfig<T extends string>(
    cfg: { type: string },
    type: T
): cfg is { type: T } & Record<string, unknown> {
    return cfg.type === type;
}

/**
 * Discriminated union of all supported validation rule configs.
 * Pass an array of these to `FieldValidationConfig.validations`.
 */
export type ValidationsConfig =
    | ValidationConfigRequired
    | ValidationConfigMinLength
    | ValidationConfigMaxLength
    | ValidationConfigDigitsOnly
    | ValidationConfigNumberRange
    | ValidationConfigEmail
    | ValidationConfigUrl
    | ValidationConfigFileSize
    | ValidationConfigFileType
    | ValidationConfigFileDimensions
    | ValidationConfigPattern
    | ValidationConfigDateFormat
    | ValidationConfigNumberPositive
    | ValidationConfigNumberNegative
    | ValidationConfigAlpha
    | ValidationConfigAlphaNumeric
    | ValidationConfigLowerCase
    | ValidationConfigUpperCase
    | ValidationConfigAsyncPattern
    | ValidationConfigExactLength
    | ValidationConfigNoWhitespace
    | ValidationConfigContains
    | ValidationConfigStartsWith
    | ValidationConfigEndsWith
    | ValidationConfigSlug
    | ValidationConfigPasswordStrength
    | ValidationConfigHexColor
    | ValidationConfigIPv4
    | ValidationConfigUUID
    | ValidationConfigJson
    | ValidationConfigPhone
    | ValidationConfigCreditCard
    | ValidationConfigInteger
    | ValidationConfigMultipleOf
    | ValidationConfigMinDate
    | ValidationConfigMaxDate
    | ValidationConfigFutureDate
    | ValidationConfigPastDate
    | ValidationConfigMatchField
    | ValidationConfigRequiredIf
    | ValidationConfigImageAspectRatio
    | ValidationConfigImageMinDimensions
    | ValidationConfigImageMaxDimensions
    | ValidationConfigGreaterThan
    | ValidationConfigLessThan
    | ValidationConfigPrecision
    | ValidationConfigDateAfter
    | ValidationConfigDateBefore
    | ValidationConfigOneOf
    | ValidationConfigNotMatchField
    | ValidationConfigRequiredUnless
    | ValidationConfigArrayMinLength
    | ValidationConfigArrayMaxLength
    | ValidationConfigArrayUnique
    | ValidationConfigArrayContains
    | ValidationConfigTime
    | ValidationConfigNoHTML
    | ValidationConfigIBAN
    | ValidationConfigPostalCode
    | ValidationConfigLatitude
    | ValidationConfigLongitude
    | ValidationConfigSemVer
    | ValidationConfigBase64
    | ValidationConfigNotOneOf
    | ValidationConfigIPv6
    | ValidationConfigMACAddress
    | ValidationConfigDataURI
    | ValidationConfigMimeType
    | ValidationConfigDateRange
    | ValidationConfigArrayItems
    | ValidationConfigAlphaDash
    | ValidationConfigNotEmpty
    | ValidationConfigJWT
    | ValidationConfigFinite
    | ValidationConfigPort
    | ValidationConfigGreaterThanOrEqual
    | ValidationConfigLessThanOrEqual
    | ValidationConfigDateAfterField
    | ValidationConfigDateBeforeField
    | ValidationConfigArrayExactLength
    | ValidationConfigOr
    | ValidationConfigNot
    | ValidationConfigIf
    | ValidationConfigOptional
    | ValidationConfigNullable
    | ValidationConfigBail;
