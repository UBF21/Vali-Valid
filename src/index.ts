// Hook — primary public API
export { useValiValid } from './hooks/useValiValid';
export type { UseValiValidOptions, UseValiValidReturn } from './hooks/useValiValid';

// Engine (for advanced usage)
export { ValiValid } from './validation/ValiValid';

// i18n
export { setLocale, getLocale } from './i18n/index';
export type { Locale } from './i18n/index';

// Types
export type {
    FieldValidationConfig,
    BuilderValidationConfig,
    FormErrors,
    SetState,
    ValidationsConfig,
    SyncRule,
    AsyncRule,
} from './types/index';

export {
    TypeFile,
    FileSize,
    DateFormat,
    DateFormatExpressions,
} from './types/index';

// Validation types & configs
export { ValidationType } from './validation/Validators';
export type {
    ValidationConfigRequired,
    ValidationConfigMinLength,
    ValidationConfigMaxLength,
    ValidationConfigExactLength,
    ValidationConfigEmail,
    ValidationConfigUrl,
    ValidationConfigAlpha,
    ValidationConfigAlphaNumeric,
    ValidationConfigLowerCase,
    ValidationConfigUpperCase,
    ValidationConfigNoWhitespace,
    ValidationConfigContains,
    ValidationConfigStartsWith,
    ValidationConfigEndsWith,
    ValidationConfigSlug,
    ValidationConfigPasswordStrength,
    ValidationConfigHexColor,
    ValidationConfigIPv4,
    ValidationConfigUUID,
    ValidationConfigJson,
    ValidationConfigPhone,
    ValidationConfigCreditCard,
    ValidationConfigPattern,
    ValidationConfigDigitsOnly,
    ValidationConfigNumberRange,
    ValidationConfigNumberPositive,
    ValidationConfigNumberNegative,
    ValidationConfigInteger,
    ValidationConfigMultipleOf,
    ValidationConfigDateFormat,
    ValidationConfigMinDate,
    ValidationConfigMaxDate,
    ValidationConfigFutureDate,
    ValidationConfigPastDate,
    ValidationConfigFileType,
    ValidationConfigFileSize,
    ValidationConfigFileDimensions,
    ValidationConfigImageAspectRatio,
    ValidationConfigImageMinDimensions,
    ValidationConfigImageMaxDimensions,
    ValidationConfigMatchField,
    ValidationConfigRequiredIf,
    ValidationConfigAsyncPattern,
    // v2.1
    ValidationConfigGreaterThan,
    ValidationConfigLessThan,
    ValidationConfigPrecision,
    ValidationConfigDateAfter,
    ValidationConfigDateBefore,
    ValidationConfigOneOf,
    ValidationConfigNotMatchField,
    ValidationConfigRequiredUnless,
    ValidationConfigArrayMinLength,
    ValidationConfigArrayMaxLength,
    ValidationConfigArrayUnique,
    ValidationConfigArrayContains,
    ValidationConfigTime,
    ValidationConfigNoHTML,
    ValidationConfigIBAN,
    ValidationConfigPostalCode,
    ValidationConfigLatitude,
    ValidationConfigLongitude,
    ValidationConfigSemVer,
    ValidationConfigBase64,
} from './validation/Validators';
