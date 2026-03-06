import { ValidationConfigRequired, ValidationConfigMinLength, ValidationConfigMaxLength, ValidationConfigDigitsOnly, ValidationConfigNumberRange, ValidationConfigEmail, ValidationConfigUrl, ValidationConfigFileSize, ValidationConfigFileType, ValidationConfigFileDimensions, ValidationConfigPattern, ValidationConfigDateFormat, ValidationConfigNumberPositive, ValidationConfigNumberNegative, ValidationConfigAlpha, ValidationConfigAlphaNumeric, ValidationConfigLowerCase, ValidationConfigUpperCase, ValidationConfigAsyncPattern, ValidationConfigExactLength, ValidationConfigNoWhitespace, ValidationConfigContains, ValidationConfigStartsWith, ValidationConfigEndsWith, ValidationConfigSlug, ValidationConfigPasswordStrength, ValidationConfigHexColor, ValidationConfigIPv4, ValidationConfigUUID, ValidationConfigJson, ValidationConfigPhone, ValidationConfigCreditCard, ValidationConfigInteger, ValidationConfigMultipleOf, ValidationConfigMinDate, ValidationConfigMaxDate, ValidationConfigFutureDate, ValidationConfigPastDate, ValidationConfigMatchField, ValidationConfigRequiredIf, ValidationConfigImageAspectRatio, ValidationConfigImageMinDimensions, ValidationConfigImageMaxDimensions, ValidationConfigGreaterThan, ValidationConfigLessThan, ValidationConfigPrecision, ValidationConfigDateAfter, ValidationConfigDateBefore, ValidationConfigOneOf, ValidationConfigNotMatchField, ValidationConfigRequiredUnless, ValidationConfigArrayMinLength, ValidationConfigArrayMaxLength, ValidationConfigArrayUnique, ValidationConfigArrayContains, ValidationConfigTime, ValidationConfigNoHTML, ValidationConfigIBAN, ValidationConfigPostalCode, ValidationConfigLatitude, ValidationConfigLongitude, ValidationConfigSemVer, ValidationConfigBase64 } from '../validation/Validators';
export type SetState<T> = (value: T | ((prevState: T) => T)) => void;
export type ValidationsConfig = ValidationConfigRequired | ValidationConfigMinLength | ValidationConfigMaxLength | ValidationConfigDigitsOnly | ValidationConfigNumberRange | ValidationConfigEmail | ValidationConfigUrl | ValidationConfigFileSize | ValidationConfigFileType | ValidationConfigFileDimensions | ValidationConfigPattern | ValidationConfigDateFormat | ValidationConfigNumberPositive | ValidationConfigNumberNegative | ValidationConfigAlpha | ValidationConfigAlphaNumeric | ValidationConfigLowerCase | ValidationConfigUpperCase | ValidationConfigAsyncPattern | ValidationConfigExactLength | ValidationConfigNoWhitespace | ValidationConfigContains | ValidationConfigStartsWith | ValidationConfigEndsWith | ValidationConfigSlug | ValidationConfigPasswordStrength | ValidationConfigHexColor | ValidationConfigIPv4 | ValidationConfigUUID | ValidationConfigJson | ValidationConfigPhone | ValidationConfigCreditCard | ValidationConfigInteger | ValidationConfigMultipleOf | ValidationConfigMinDate | ValidationConfigMaxDate | ValidationConfigFutureDate | ValidationConfigPastDate | ValidationConfigMatchField | ValidationConfigRequiredIf | ValidationConfigImageAspectRatio | ValidationConfigImageMinDimensions | ValidationConfigImageMaxDimensions | ValidationConfigGreaterThan | ValidationConfigLessThan | ValidationConfigPrecision | ValidationConfigDateAfter | ValidationConfigDateBefore | ValidationConfigOneOf | ValidationConfigNotMatchField | ValidationConfigRequiredUnless | ValidationConfigArrayMinLength | ValidationConfigArrayMaxLength | ValidationConfigArrayUnique | ValidationConfigArrayContains | ValidationConfigTime | ValidationConfigNoHTML | ValidationConfigIBAN | ValidationConfigPostalCode | ValidationConfigLatitude | ValidationConfigLongitude | ValidationConfigSemVer | ValidationConfigBase64;
export type FieldValidationConfig<T> = {
    field: keyof T;
    validations: ValidationsConfig[];
    isNumber?: boolean;
    isDecimal?: boolean;
};
export type BuilderValidationConfig<T> = FieldValidationConfig<T>[];
export type SyncRule<T> = {
    type: string;
    field: keyof T;
    message: string;
    validate: (value: any) => boolean;
};
export type AsyncRule<T> = {
    type: string;
    field: keyof T;
    message: string;
    asyncFn: (value: any, form: T) => Promise<boolean>;
};
export type FormErrors<T> = {
    [key in keyof T]?: string | null;
};
export declare enum TypeFile {
    JPG = "image/jpeg",
    PNG = "image/png",
    PDF = "application/pdf",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    MP3 = "audio/mpeg",
    MP4 = "video/mp4"
}
export declare enum DateFormat {
    'YYYY-MM-DD' = "YYYY-MM-DD",
    'DD-MM-YYYY' = "DD-MM-YYYY",
    'YYYY/MM/DD' = "YYYY/MM/DD",
    'DD/MM/YYYY' = "DD/MM/YYYY"
}
export declare const DateFormatExpressions: Record<DateFormat, RegExp>;
export declare enum FileSize {
    '100KB' = 102400,
    '150KB' = 153600,
    '200KB' = 204800,
    '250KB' = 256000,
    '300KB' = 307200,
    '350KB' = 358400,
    '400KB' = 409600,
    '450KB' = 460800,
    '500KB' = 512000,
    '550KB' = 563200,
    '600KB' = 614400,
    '650KB' = 665600,
    '700KB' = 716800,
    '750KB' = 768000,
    '800KB' = 819200,
    '850KB' = 870400,
    '900KB' = 921600,
    '950KB' = 972800,
    '1MB' = 1048576,
    '2MB' = 2097152,
    '3MB' = 3145728,
    '4MB' = 4194304,
    '5MB' = 5242880,
    '6MB' = 6291456,
    '7MB' = 7340032,
    '8MB' = 8388608,
    '9MB' = 9437184,
    '10MB' = 10485760,
    '15MB' = 15728640,
    '20MB' = 20971520,
    '25MB' = 26214400,
    '30MB' = 31457280,
    '35MB' = 36700160,
    '40MB' = 41943040,
    '45MB' = 47185920,
    '50MB' = 52428800,
    '100MB' = 104857600,
    '150MB' = 157286400,
    '200MB' = 209715200,
    '250MB' = 262144000,
    '300MB' = 314572800,
    '350MB' = 367001600,
    '400MB' = 419430400,
    '450MB' = 471859200,
    '500MB' = 524288000,
    '550MB' = 576716800,
    '600MB' = 629145600,
    '650MB' = 681574400,
    '700MB' = 734003200,
    '750MB' = 786432000,
    '800MB' = 838860800,
    '850MB' = 891289600,
    '900MB' = 943718400,
    '950MB' = 996147200,
    '1000MB' = 1048576000
}
//# sourceMappingURL=index.d.ts.map