import { DateFormat, FileSize, TypeFile } from '../types/index';
export declare enum ValidationType {
    Required = "Required",
    MinLength = "MinLength",
    MaxLength = "MaxLength",
    ExactLength = "ExactLength",
    Email = "Email",
    Url = "Url",
    Alpha = "Alpha",
    AlphaNumeric = "AlphaNumeric",
    LowerCase = "LowerCase",
    UpperCase = "UpperCase",
    NoWhitespace = "NoWhitespace",
    Contains = "Contains",
    StartsWith = "StartsWith",
    EndsWith = "EndsWith",
    Slug = "Slug",
    PasswordStrength = "PasswordStrength",
    HexColor = "HexColor",
    IPv4 = "IPv4",
    UUID = "UUID",
    Json = "Json",
    Phone = "Phone",
    CreditCard = "CreditCard",
    Pattern = "Pattern",
    DigitsOnly = "DigitsOnly",
    NumberRange = "NumberRange",
    NumberPositive = "NumberPositive",
    NumberNegative = "NumberNegative",
    Integer = "Integer",
    MultipleOf = "MultipleOf",
    DateFormat = "DateFormat",
    MinDate = "MinDate",
    MaxDate = "MaxDate",
    FutureDate = "FutureDate",
    PastDate = "PastDate",
    FileType = "FileType",
    FileSize = "FileSize",
    FileDimensions = "FileDimensions",
    ImageAspectRatio = "ImageAspectRatio",
    ImageMinDimensions = "ImageMinDimensions",
    ImageMaxDimensions = "ImageMaxDimensions",
    MatchField = "MatchField",
    RequiredIf = "RequiredIf",
    AsyncPattern = "AsyncPattern",
    GreaterThan = "GreaterThan",
    LessThan = "LessThan",
    Precision = "Precision",
    DateAfter = "DateAfter",
    DateBefore = "DateBefore",
    OneOf = "OneOf",
    NotMatchField = "NotMatchField",
    RequiredUnless = "RequiredUnless",
    ArrayMinLength = "ArrayMinLength",
    ArrayMaxLength = "ArrayMaxLength",
    ArrayUnique = "ArrayUnique",
    ArrayContains = "ArrayContains",
    Time = "Time",
    NoHTML = "NoHTML",
    IBAN = "IBAN",
    PostalCode = "PostalCode",
    Latitude = "Latitude",
    Longitude = "Longitude",
    SemVer = "SemVer",
    Base64 = "Base64"
}
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
    value: {
        width: number;
        height: number;
    };
    message?: string;
};
export type ValidationConfigPattern = {
    type: ValidationType.Pattern;
    value: (value: any) => boolean;
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
export type ValidationConfigInteger = {
    type: ValidationType.Integer;
    message?: string;
};
export type ValidationConfigMultipleOf = {
    type: ValidationType.MultipleOf;
    value: number;
    message?: string;
};
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
export type ValidationConfigImageAspectRatio = {
    type: ValidationType.ImageAspectRatio;
    value: {
        width: number;
        height: number;
    };
    tolerance?: number;
    message?: string;
};
export type ValidationConfigImageMinDimensions = {
    type: ValidationType.ImageMinDimensions;
    value: {
        width?: number;
        height?: number;
    };
    message?: string;
};
export type ValidationConfigImageMaxDimensions = {
    type: ValidationType.ImageMaxDimensions;
    value: {
        width?: number;
        height?: number;
    };
    message?: string;
};
export type ValidationConfigAsyncPattern = {
    type: ValidationType.AsyncPattern;
    message?: string;
    asyncFn: (value: any, form: Record<string, any>) => Promise<boolean>;
};
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
//# sourceMappingURL=Validators.d.ts.map