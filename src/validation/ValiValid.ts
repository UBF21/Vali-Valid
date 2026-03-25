import {
    REGEX_ONLY_NUMBERS,
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
    validateFileType,
    validateFileSize,
    validateImageDimensions,
    validateImageAspectRatio,
    validateImageMinDimensions,
    validateImageMaxDimensions,
    validateGreaterThan,
    validateLessThan,
    validatePrecision,
    validateDateAfter,
    validateDateBefore,
    validateOneOf,
    validateNotOneOf,
    validateNotMatchField,
    validateRequiredUnless,
    validateArrayMinLength,
    validateArrayMaxLength,
    validateArrayUnique,
    validateArrayContains,
    validateTime,
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
    validateAlphaDash,
    validateNotEmpty,
    validateJWT,
    validateFinite,
    validatePort,
    validateGreaterThanOrEqual,
    validateLessThanOrEqual,
    validateDateAfterField,
    validateDateBeforeField,
    validateArrayExactLength,
    SYNTHETIC_OR,
    SYNTHETIC_NOT,
    SYNTHETIC_IF,
    SYNTHETIC_OPTIONAL,
    SYNTHETIC_NULLABLE,
    SYNTHETIC_BAIL,
} from '../constants/index';
import { getMessage, getMessageForLocale } from '../i18n/index';
import type { Locale } from '../i18n/index';
import { AsyncRule, FieldValidationConfig, FormErrors, SyncRule, ValidationsConfig, ValiValidOptions } from '../types/index';
import { ValidationType } from './Validators';
import type {
    ValidationConfigUUID,
    ValidationConfigNotOneOf,
    ValidationConfigMimeType,
    ValidationConfigDateRange,
    ValidationConfigArrayItems,
    ValidationConfigNot,
    ValidationConfigIf,
    ValidationConfigOr,
} from './Validators';
// v4 ValidationType values are part of the same enum, imported above

/**
 * Races a promise against a per-rule timeout.
 * If `ms` is 0 or negative the promise is returned as-is.
 * On timeout the promise rejects with a '[ValiValid] Async rule timeout' error.
 */
function withEngineTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    if (ms <= 0) return promise;
    let timerId: ReturnType<typeof setTimeout>;
    const timeout = new Promise<T>((_, reject) => {
        timerId = setTimeout(() => reject(new Error('[ValiValid] Async rule timeout')), ms);
    });
    // Cancel the timeout timer when the promise settles (resolve or reject)
    const guarded = promise.then(
        (val) => { clearTimeout(timerId!); return val; },
        (err) => { clearTimeout(timerId!); return Promise.reject(err); }
    );
    return Promise.race([guarded, timeout]);
}

/**
 * Core validation engine for vali-valid.
 * Framework-agnostic — works with React, Angular, Vue, or plain TypeScript.
 *
 * @template T - Shape of the form data object
 * @example
 * const engine = new ValiValid<{ email: string }>([
 *   { field: 'email', validations: [{ type: ValidationType.Email }] },
 * ]);
 * const errors = engine.validateFieldSync('email', 'bad');
 * // errors => ['Invalid email address.']
 */
export class ValiValid<T extends Record<string, any>> {
    private _syncRules: Map<keyof T, SyncRule<T>[]> = new Map();
    private _asyncRules: Map<keyof T, AsyncRule<T>[]> = new Map();
    private _fieldMeta: Map<keyof T, { isNumber?: boolean; isDecimal?: boolean; transform?: (v: any) => any }> = new Map();
    private _watchMap: Map<string, string[]> = new Map();
    private _criteriaMode: 'all' | 'firstError' = 'all';
    private _locale: Locale | undefined;
    private _asyncTimeout: number = 0;

    /**
     * Creates a new ValiValid engine instance.
     * @param configs - Array of field validation configs to register upfront
     * @param options - Engine options
     * @param options.criteriaMode - 'all' (default) returns all errors; 'firstError' stops at the first
     * @param options.locale - Per-instance locale override; safe for SSR (avoids global singleton mutation)
     * @param options.asyncTimeout - Per-async-rule timeout in ms (0 = no timeout, default)
     */
    constructor(configs: FieldValidationConfig<T>[] = [], options?: ValiValidOptions) {
        if (options?.criteriaMode) this._criteriaMode = options.criteriaMode;
        if (options?.locale) this._locale = options.locale as Locale;
        this._asyncTimeout = options?.asyncTimeout ?? 0;
        configs.forEach((config) => this.addValidation(config));
    }

    // ---- Private helpers ----

    private static resolveMsg(msg: string | (() => string)): string {
        return typeof msg === 'function' ? msg() : msg;
    }

    /**
     * Returns a lazy message factory for the given i18n key.
     * Uses the instance locale when set (SSR-safe), otherwise falls back to the global locale.
     */
    private _msg(key: string, ...args: any[]): () => string {
        return this._locale
            ? () => getMessageForLocale(key, this._locale as Locale, ...args)
            : () => getMessage(key, ...args);
    }

    private addRule(field: keyof T, type: string, message: string | (() => string), validate: (value: any, form?: any) => boolean): void {
        if (!this._syncRules.has(field)) this._syncRules.set(field, []);
        this._syncRules.get(field)!.push({ type, field, message, validate });
    }

    private addAsyncRule(
        field: keyof T,
        type: string,
        message: string | (() => string),
        asyncFn: (value: any, form: T) => Promise<boolean>
    ): void {
        if (!this._asyncRules.has(field)) this._asyncRules.set(field, []);
        this._asyncRules.get(field)!.push({ type, field, message, asyncFn });
    }

    private addValidation(config: FieldValidationConfig<T>): void {
        const { field, validations, isNumber, isDecimal, transform, watchFields } = config;

        if (isNumber !== undefined || isDecimal !== undefined || transform !== undefined) {
            this._fieldMeta.set(field, { isNumber, isDecimal, transform });
        }

        // Register explicit watchFields so getWatchedFields() returns them
        if (watchFields) {
            for (const wf of watchFields) {
                const watchers = this._watchMap.get(wf) ?? [];
                if (!watchers.includes(String(field))) {
                    this._watchMap.set(wf, [...watchers, String(field)]);
                }
            }
        }

        validations.forEach((v: ValidationsConfig) => {
            switch (v.type) {
                case ValidationType.Required:
                    this.addRule(field, v.type, v.message ?? this._msg('required'), validateRequired);
                    break;
                case ValidationType.MinLength:
                    this.addRule(field, v.type, v.message ?? this._msg('minLength', v.value),
                        (val) => validateMinLength(val, v.value));
                    break;
                case ValidationType.MaxLength:
                    this.addRule(field, v.type, v.message ?? this._msg('maxLength', v.value),
                        (val) => validateMaxLength(val, v.value));
                    break;
                case ValidationType.ExactLength:
                    this.addRule(field, v.type, v.message ?? this._msg('exactLength', v.value),
                        (val) => validateExactLength(val, v.value));
                    break;
                case ValidationType.Email:
                    this.addRule(field, v.type, v.message ?? this._msg('email'), validateEmail);
                    break;
                case ValidationType.Url:
                    this.addRule(field, v.type, v.message ?? this._msg('url'), validateUrl);
                    break;
                case ValidationType.Alpha:
                    this.addRule(field, v.type, v.message ?? this._msg('alpha'), validateAlpha);
                    break;
                case ValidationType.AlphaNumeric:
                    this.addRule(field, v.type, v.message ?? this._msg('alphaNumeric'), validateAlphaNumeric);
                    break;
                case ValidationType.LowerCase:
                    this.addRule(field, v.type, v.message ?? this._msg('lowerCase'), validateLowerCase);
                    break;
                case ValidationType.UpperCase:
                    this.addRule(field, v.type, v.message ?? this._msg('upperCase'), validateUpperCase);
                    break;
                case ValidationType.NoWhitespace:
                    this.addRule(field, v.type, v.message ?? this._msg('noWhitespace'), validateNoWhitespace);
                    break;
                case ValidationType.Contains:
                    this.addRule(field, v.type, v.message ?? this._msg('contains', v.value),
                        (val) => validateContains(val, v.value));
                    break;
                case ValidationType.StartsWith:
                    this.addRule(field, v.type, v.message ?? this._msg('startsWith', v.value),
                        (val) => validateStartsWith(val, v.value));
                    break;
                case ValidationType.EndsWith:
                    this.addRule(field, v.type, v.message ?? this._msg('endsWith', v.value),
                        (val) => validateEndsWith(val, v.value));
                    break;
                case ValidationType.Slug:
                    this.addRule(field, v.type, v.message ?? this._msg('slug'), validateSlug);
                    break;
                case ValidationType.PasswordStrength:
                    this.addRule(field, v.type, v.message ?? this._msg('passwordStrength'), validatePasswordStrength);
                    break;
                case ValidationType.HexColor:
                    this.addRule(field, v.type, v.message ?? this._msg('hexColor'), validateHexColor);
                    break;
                case ValidationType.IPv4:
                    this.addRule(field, v.type, v.message ?? this._msg('ipv4'), validateIPv4);
                    break;
                case ValidationType.UUID: {
                    const uuidCfg = v as ValidationConfigUUID;
                    this.addRule(field, v.type, v.message ?? this._msg('uuid'),
                        (val) => validateUUID(val, uuidCfg.version));
                    break;
                }
                case ValidationType.Json:
                    this.addRule(field, v.type, v.message ?? this._msg('json'), validateJson);
                    break;
                case ValidationType.Phone:
                    this.addRule(field, v.type, v.message ?? this._msg('phone'), validatePhone);
                    break;
                case ValidationType.CreditCard:
                    this.addRule(field, v.type, v.message ?? this._msg('creditCard'), validateCreditCard);
                    break;
                case ValidationType.Pattern: {
                    const patternPredicate: (value: any, form?: any) => boolean = v.value instanceof RegExp
                        ? (val: any) => (v.value as RegExp).test(String(val))
                        : (v.value as (value: any) => boolean);
                    this.addRule(field, v.type, v.message ?? this._msg('pattern'), patternPredicate);
                    break;
                }
                case ValidationType.DigitsOnly:
                    this.addRule(field, v.type, v.message ?? this._msg('digitsOnly'), validateDigitsOnly);
                    break;
                case ValidationType.NumberRange: {
                    const [min, max] = v.value;
                    this.addRule(field, v.type, v.message ?? this._msg('numberRange', min, max),
                        (val) => validateNumberRange(val, min, max));
                    break;
                }
                case ValidationType.NumberPositive:
                    this.addRule(field, v.type, v.message ?? this._msg('numberPositive'), validateNumberPositive);
                    break;
                case ValidationType.NumberNegative:
                    this.addRule(field, v.type, v.message ?? this._msg('numberNegative'), validateNumberNegative);
                    break;
                case ValidationType.Integer:
                    this.addRule(field, v.type, v.message ?? this._msg('integer'), validateInteger);
                    break;
                case ValidationType.MultipleOf:
                    this.addRule(field, v.type, v.message ?? this._msg('multipleOf', v.value),
                        (val) => validateMultipleOf(val, v.value));
                    break;
                case ValidationType.DateFormat:
                    this.addRule(field, v.type, v.message ?? this._msg('dateFormat', v.format),
                        (val) => validateDateFormat(val, v.format));
                    break;
                case ValidationType.MinDate:
                    this.addRule(field, v.type, v.message ?? this._msg('minDate', v.value),
                        (val) => validateMinDate(val, v.value));
                    break;
                case ValidationType.MaxDate:
                    this.addRule(field, v.type, v.message ?? this._msg('maxDate', v.value),
                        (val) => validateMaxDate(val, v.value));
                    break;
                case ValidationType.FutureDate:
                    this.addRule(field, v.type, v.message ?? this._msg('futureDate'), validateFutureDate);
                    break;
                case ValidationType.PastDate:
                    this.addRule(field, v.type, v.message ?? this._msg('pastDate'), validatePastDate);
                    break;
                case ValidationType.FileType:
                    this.addRule(field, v.type, v.message ?? this._msg('fileType'),
                        (val) => validateFileType(val, v.value));
                    break;
                case ValidationType.FileSize:
                    this.addRule(field, v.type, v.message ?? this._msg('fileSize'),
                        (val) => validateFileSize(val, v.value));
                    break;
                case ValidationType.FileDimensions: {
                    const { width, height } = v.value;
                    this.addAsyncRule(field, v.type, v.message ?? this._msg('fileDimensions', width, height),
                        (val) => validateImageDimensions(val, { width, height }));
                    break;
                }
                case ValidationType.ImageAspectRatio: {
                    const ratio = v.value;
                    const tolerance = v.tolerance;
                    this.addAsyncRule(field, v.type, v.message ?? this._msg('imageAspectRatio', ratio.width, ratio.height),
                        (val) => validateImageAspectRatio(val, ratio, tolerance));
                    break;
                }
                case ValidationType.ImageMinDimensions: {
                    const minDims = v.value;
                    this.addAsyncRule(field, v.type, v.message ?? this._msg('imageMinDimensions', minDims.width, minDims.height),
                        (val) => validateImageMinDimensions(val, minDims));
                    break;
                }
                case ValidationType.ImageMaxDimensions: {
                    const maxDims = v.value;
                    this.addAsyncRule(field, v.type, v.message ?? this._msg('imageMaxDimensions', maxDims.width, maxDims.height),
                        (val) => validateImageMaxDimensions(val, maxDims));
                    break;
                }
                case ValidationType.MatchField: {
                    const targetField = v.field as keyof T;
                    this.addRule(field, v.type, v.message ?? this._msg('matchField'),
                        (val, form) => val === form?.[targetField]);
                    // Track watch: when targetField changes, re-validate field
                    const mfWatchers = this._watchMap.get(String(targetField)) ?? [];
                    if (!mfWatchers.includes(String(field))) {
                        this._watchMap.set(String(targetField), [...mfWatchers, String(field)]);
                    }
                    break;
                }
                case ValidationType.RequiredIf: {
                    const condition = v.condition;
                    this.addRule(field, v.type, v.message ?? this._msg('requiredIf'),
                        (val, form) => {
                            if (!form || !condition(form)) return true;
                            return validateRequired(val);
                        });
                    break;
                }
                case ValidationType.AsyncPattern:
                    this.addAsyncRule(field, v.type, v.message ?? this._msg('asyncPattern'),
                        (val, form) => v.asyncFn(val, form));
                    break;

                // --- v2.1 new cases ---

                case ValidationType.GreaterThan:
                    this.addRule(field, v.type, v.message ?? this._msg('greaterThan', v.value),
                        (val) => validateGreaterThan(val, v.value));
                    break;
                case ValidationType.LessThan:
                    this.addRule(field, v.type, v.message ?? this._msg('lessThan', v.value),
                        (val) => validateLessThan(val, v.value));
                    break;
                case ValidationType.Precision:
                    this.addRule(field, v.type, v.message ?? this._msg('precision', v.value),
                        (val) => validatePrecision(val, v.value));
                    break;
                case ValidationType.DateAfter:
                    this.addRule(field, v.type, v.message ?? this._msg('dateAfter', v.value),
                        (val) => validateDateAfter(val, v.value));
                    break;
                case ValidationType.DateBefore:
                    this.addRule(field, v.type, v.message ?? this._msg('dateBefore', v.value),
                        (val) => validateDateBefore(val, v.value));
                    break;
                case ValidationType.OneOf:
                    this.addRule(field, v.type, v.message ?? this._msg('oneOf', v.value),
                        (val) => validateOneOf(val, v.value));
                    break;
                case ValidationType.NotMatchField: {
                    const notTargetField = v.field as keyof T;
                    this.addRule(field, v.type, v.message ?? this._msg('notMatchField'),
                        (val, form) => validateNotMatchField(val, form?.[notTargetField]));
                    // Track watch: when notTargetField changes, re-validate field
                    const nmfWatchers = this._watchMap.get(String(notTargetField)) ?? [];
                    if (!nmfWatchers.includes(String(field))) {
                        this._watchMap.set(String(notTargetField), [...nmfWatchers, String(field)]);
                    }
                    break;
                }
                case ValidationType.RequiredUnless: {
                    const unlessCondition = v.condition;
                    this.addRule(field, v.type, v.message ?? this._msg('requiredUnless'),
                        (val, form) => {
                            return validateRequiredUnless(val, unlessCondition, form ?? {});
                        });
                    break;
                }
                case ValidationType.ArrayMinLength:
                    this.addRule(field, v.type, v.message ?? this._msg('arrayMinLength', v.value),
                        (val) => validateArrayMinLength(val, v.value));
                    break;
                case ValidationType.ArrayMaxLength:
                    this.addRule(field, v.type, v.message ?? this._msg('arrayMaxLength', v.value),
                        (val) => validateArrayMaxLength(val, v.value));
                    break;
                case ValidationType.ArrayUnique:
                    this.addRule(field, v.type, v.message ?? this._msg('arrayUnique'), validateArrayUnique);
                    break;
                case ValidationType.ArrayContains:
                    this.addRule(field, v.type, v.message ?? this._msg('arrayContains', v.value),
                        (val) => validateArrayContains(val, v.value));
                    break;
                case ValidationType.Time:
                    this.addRule(field, v.type, v.message ?? this._msg('time'),
                        (val) => validateTime(val, v.format));
                    break;
                case ValidationType.NoHTML:
                    this.addRule(field, v.type, v.message ?? this._msg('noHTML'), validateNoHTML);
                    break;
                case ValidationType.IBAN:
                    this.addRule(field, v.type, v.message ?? this._msg('iban'), validateIBAN);
                    break;
                case ValidationType.PostalCode:
                    this.addRule(field, v.type, v.message ?? this._msg('postalCode'),
                        (val) => validatePostalCode(val, v.country));
                    break;
                case ValidationType.Latitude:
                    this.addRule(field, v.type, v.message ?? this._msg('latitude'), validateLatitude);
                    break;
                case ValidationType.Longitude:
                    this.addRule(field, v.type, v.message ?? this._msg('longitude'), validateLongitude);
                    break;
                case ValidationType.SemVer:
                    this.addRule(field, v.type, v.message ?? this._msg('semVer'), validateSemVer);
                    break;
                case ValidationType.Base64:
                    this.addRule(field, v.type, v.message ?? this._msg('base64'), validateBase64);
                    break;

                // --- v3 new cases ---

                case ValidationType.NotOneOf: {
                    const notOneOfCfg = v as ValidationConfigNotOneOf;
                    this.addRule(field, v.type, v.message ?? this._msg('notOneOf', notOneOfCfg.value),
                        (val) => validateNotOneOf(val, notOneOfCfg.value));
                    break;
                }
                case ValidationType.IPv6:
                    this.addRule(field, v.type, v.message ?? this._msg('ipv6'), validateIPv6);
                    break;
                case ValidationType.MACAddress:
                    this.addRule(field, v.type, v.message ?? this._msg('macAddress'), validateMACAddress);
                    break;
                case ValidationType.DataURI:
                    this.addRule(field, v.type, v.message ?? this._msg('dataURI'), validateDataURI);
                    break;
                case ValidationType.MimeType: {
                    const mimeTypeCfg = v as ValidationConfigMimeType;
                    this.addRule(field, v.type, v.message ?? this._msg('mimeType'),
                        (val) => validateMimeType(val, mimeTypeCfg.value));
                    break;
                }
                case ValidationType.DateRange: {
                    const drCfg = v as ValidationConfigDateRange;
                    this.addRule(field, v.type, v.message ?? this._msg('dateRange'),
                        (_val, form) => {
                            if (!form) return true;
                            const start = form[drCfg.startField];
                            const end = form[drCfg.endField];
                            if (!start || !end) return true;
                            return new Date(start) <= new Date(end);
                        });
                    break;
                }
                case ValidationType.ArrayItems: {
                    const arrayItemsCfg = v as ValidationConfigArrayItems;
                    const itemEngine = new ValiValid<Record<'__item__', any>>([
                        { field: '__item__', validations: arrayItemsCfg.validations },
                    ]);
                    this.addRule(field, v.type, v.message ?? this._msg('arrayItems'),
                        (val) => {
                            if (!Array.isArray(val)) return false;
                            return val.every(
                                (item) => itemEngine.validateFieldSync('__item__', item) === null
                            );
                        });
                    break;
                }

                // --- v4 new cases ---

                case ValidationType.AlphaDash:
                    this.addRule(field, v.type, v.message ?? this._msg('alphaDash'), validateAlphaDash);
                    break;
                case ValidationType.NotEmpty:
                    this.addRule(field, v.type, v.message ?? this._msg('notEmpty'), validateNotEmpty);
                    break;
                case ValidationType.JWT:
                    this.addRule(field, v.type, v.message ?? this._msg('jwt'), validateJWT);
                    break;
                case ValidationType.Finite:
                    this.addRule(field, v.type, v.message ?? this._msg('finite'), validateFinite);
                    break;
                case ValidationType.Port:
                    this.addRule(field, v.type, v.message ?? this._msg('port'), validatePort);
                    break;
                case ValidationType.GreaterThanOrEqual:
                    this.addRule(field, v.type, v.message ?? this._msg('greaterThanOrEqual', v.value),
                        (val) => validateGreaterThanOrEqual(val, v.value));
                    break;
                case ValidationType.LessThanOrEqual:
                    this.addRule(field, v.type, v.message ?? this._msg('lessThanOrEqual', v.value),
                        (val) => validateLessThanOrEqual(val, v.value));
                    break;
                case ValidationType.ArrayExactLength:
                    this.addRule(field, v.type, v.message ?? this._msg('arrayExactLength', v.value),
                        (val) => validateArrayExactLength(val, v.value));
                    break;
                case ValidationType.DateAfterField: {
                    const otherField = v.field as keyof T;
                    const dafWatchers = this._watchMap.get(String(otherField)) ?? [];
                    if (!dafWatchers.includes(String(field))) {
                        this._watchMap.set(String(otherField), [...dafWatchers, String(field)]);
                    }
                    this.addRule(field, v.type, v.message ?? this._msg('dateAfterField', v.field),
                        (val, form) => validateDateAfterField(val, form?.[otherField]));
                    break;
                }
                case ValidationType.DateBeforeField: {
                    const otherField = v.field as keyof T;
                    const dbfWatchers = this._watchMap.get(String(otherField)) ?? [];
                    if (!dbfWatchers.includes(String(field))) {
                        this._watchMap.set(String(otherField), [...dbfWatchers, String(field)]);
                    }
                    this.addRule(field, v.type, v.message ?? this._msg('dateBeforeField', v.field),
                        (val, form) => validateDateBeforeField(val, form?.[otherField]));
                    break;
                }

                // __or__ from RuleBuilder.or() — value is a function predicate
                case SYNTHETIC_OR: {
                    const orCfg = v as ValidationConfigOr;
                    this.addRule(field, SYNTHETIC_OR, orCfg.message ?? this._msg('or'), orCfg.value);
                    break;
                }
                case SYNTHETIC_NOT: {
                    const notCfg = v as ValidationConfigNot;
                    this.addRule(field, SYNTHETIC_NOT, notCfg.message ?? this._msg('not'), notCfg.value);
                    break;
                }
                case SYNTHETIC_IF: {
                    const ifCfg = v as ValidationConfigIf;
                    this.addRule(field, SYNTHETIC_IF, ifCfg.message ?? this._msg('if'),
                        (val: any, form: any) => {
                            if (ifCfg.condition(form ?? {})) return ifCfg.thenBranch(val);
                            return typeof ifCfg.elseBranch === 'function' ? ifCfg.elseBranch(val) : true;
                        });
                    break;
                }
                case SYNTHETIC_OPTIONAL: {
                    this.addRule(field, SYNTHETIC_OPTIONAL, () => '', () => true);
                    break;
                }
                case SYNTHETIC_NULLABLE: {
                    this.addRule(field, SYNTHETIC_NULLABLE, () => '', () => true);
                    break;
                }
                case SYNTHETIC_BAIL: {
                    this.addRule(field, SYNTHETIC_BAIL, () => '', () => true);
                    break;
                }

                default:
                    throw new Error(`[ValiValid] Unsupported validation type: "${(v as { type: string }).type}"`);
            }
        });
    }

    // ---- Public: dynamic management ----

    /**
     * Dynamically adds validation rules for a field at runtime.
     * Useful when form fields are added/removed conditionally.
     * @param field - Field key in T
     * @param validations - Array of validation configs to add
     */
    addFieldValidation(field: keyof T, validations: ValidationsConfig[]): void {
        this.addValidation({ field, validations });
    }

    /**
     * Removes a specific validation rule from a field by its type string.
     * @param field - Field key in T
     * @param type - The ValidationType (or synthetic type string) to remove
     */
    removeFieldValidation(field: keyof T, type: string): void {
        const syncRules = this._syncRules.get(field);
        if (syncRules) {
            this._syncRules.set(field, syncRules.filter((r) => r.type !== type));
        }
        const asyncRules = this._asyncRules.get(field);
        if (asyncRules) {
            this._asyncRules.set(field, asyncRules.filter((r) => r.type !== type));
        }
    }

    /**
     * Replaces ALL validation rules for a field with a new set.
     * @param field - Field key in T
     * @param validations - New array of validation configs
     */
    setFieldValidations(field: keyof T, validations: ValidationsConfig[]): void {
        this._syncRules.delete(field);
        this._asyncRules.delete(field);
        this.addValidation({ field, validations });
    }

    /**
     * Removes all validation rules for a field.
     * @param field - Field key in T
     */
    clearFieldValidations(field: keyof T): void {
        this._syncRules.delete(field);
        this._asyncRules.delete(field);
    }

    /**
     * Returns whether a field has any registered async validation rules.
     * @param field - Field key in T
     */
    hasAsyncRules(field: keyof T): boolean {
        return (this._asyncRules.get(field)?.length ?? 0) > 0;
    }

    // ---- Public: execution ----

    private getNestedValue(obj: any, path: string): any {
        if (!path.includes('.')) return obj[path];
        return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
    }

    /**
     * Returns the sanitized/transformed value for a field.
     * Applies numeric sanitization or custom transform if configured for the field.
     * @param field - Field key in T
     * @param value - Raw input value
     * @returns Sanitized value
     */
    getFieldValue(field: keyof T, value: any): any {
        if (typeof value === 'boolean') return value;

        const meta = this._fieldMeta.get(field);
        if (!meta) return value;

        const { isNumber = false, isDecimal = false, transform } = meta;

        // Apply custom transform first if provided
        if (transform) return transform(value);

        if (!isNumber && !isDecimal) return value;
        if (isDecimal) {
            const num = Number(value);
            if (isNaN(num)) return '';
            return num === 0 ? '' : num;
        }

        const num = Number(String(value).replace(REGEX_ONLY_NUMBERS, ''));
        if (isNaN(num)) return '';
        return num === 0 ? '' : num;
    }

    /**
     * Synchronously validates all fields against the full form object.
     * Runs only sync rules — use `validateAsync` for async validators.
     * @param fields - Full form data object
     * @returns `FormErrors<T>` — map of field → null (valid) or string[] (errors)
     */
    validateSync(fields: T): FormErrors<T> {
        const errors: FormErrors<T> = {};

        this._syncRules.forEach((rules, field) => {
            const fieldErrors: string[] = [];
            const rawValue = this.getNestedValue(fields, String(field));
            const sanitized = this.getFieldValue(field, rawValue);
            for (const rule of rules) {
                if (rule.type === SYNTHETIC_OPTIONAL && (sanitized === '' || sanitized == null)) break;
                if (rule.type === SYNTHETIC_NULLABLE && sanitized == null) break;
                if (rule.type === SYNTHETIC_BAIL && fieldErrors.length > 0) break;
                if (!rule.validate(sanitized, fields)) {
                    fieldErrors.push(ValiValid.resolveMsg(rule.message));
                    if (this._criteriaMode === 'firstError') break;
                }
            }
            errors[field] = fieldErrors.length > 0 ? fieldErrors : null;
        });

        return errors;
    }

    /**
     * Synchronously validates a single field value.
     * @param field - Field key in T
     * @param value - Raw field value (sanitization is applied internally)
     * @param form - Full form object (needed for cross-field validators like MatchField)
     * @returns `string[]` with error messages if invalid, `null` if valid
     */
    validateFieldSync(field: keyof T, value: any, form?: T): string[] | null {
        const sanitized = this.getFieldValue(field, value);
        const rules = this._syncRules.get(field) ?? [];
        const fieldErrors: string[] = [];
        for (const rule of rules) {
            if (rule.type === SYNTHETIC_OPTIONAL && (sanitized === '' || sanitized == null)) break;
            if (rule.type === SYNTHETIC_NULLABLE && sanitized == null) break;
            if (rule.type === SYNTHETIC_BAIL && fieldErrors.length > 0) break;
            if (!rule.validate(sanitized, form)) {
                fieldErrors.push(ValiValid.resolveMsg(rule.message));
                if (this._criteriaMode === 'firstError') break;
            }
        }
        return fieldErrors.length > 0 ? fieldErrors : null;
    }

    /**
     * Returns the list of fields that re-validate when the given field changes.
     * @param field - The field being changed
     * @returns Array of field keys that watch this field
     */
    getWatchedFields(field: string): string[] {
        return this._watchMap.get(field) ?? [];
    }

    /**
     * Runs full form validation (sync + async) for all fields.
     * Async rules run in parallel per field.
     * @param fields - Full form data object
     * @returns `FormErrors<T>` — map of field → null (valid) or string[] (errors)
     */
    async validateAsync(fields: T): Promise<FormErrors<T>> {
        const syncErrors = this.validateSync(fields);

        const asyncResults = await Promise.all(
            Array.from(this._asyncRules.entries()).map(async ([field, rules]) => {
                const syncFieldErrors = syncErrors[field] ?? [];
                const asyncErrors: string[] = [];
                const rawFieldValue = this.getNestedValue(fields, String(field));
                const value = this.getFieldValue(field, rawFieldValue);
                for (const rule of rules) {
                    let ok: boolean;
                    try {
                        ok = await withEngineTimeout(rule.asyncFn(value, fields), this._asyncTimeout);
                    } catch (err: unknown) {
                        if (err instanceof Error && err.message === '[ValiValid] Async rule timeout') {
                            // Timeout → treat as passing so a slow network doesn't block the form
                            continue;
                        }
                        // Unexpected rejection (network error, thrown exception, etc.) → treat as failing
                        asyncErrors.push(ValiValid.resolveMsg(rule.message));
                        if (this._criteriaMode === 'firstError') break;
                        continue;
                    }
                    if (!ok) {
                        asyncErrors.push(ValiValid.resolveMsg(rule.message));
                        if (this._criteriaMode === 'firstError') break;
                    }
                }
                const allErrors = [...(Array.isArray(syncFieldErrors) ? syncFieldErrors : []), ...asyncErrors];
                return [field, allErrors.length > 0 ? allErrors : null] as [keyof T, string[] | null];
            })
        );

        const errors: FormErrors<T> = { ...syncErrors };
        asyncResults.forEach(([field, error]) => {
            errors[field] = error;
        });

        return errors;
    }

    /**
     * Validates a single field including its async rules.
     * @param field - Field key in T
     * @param value - Raw field value
     * @param form - Full form object for cross-field context
     * @returns `string[] | null` — null if valid, string[] with error messages if invalid
     */
    async validateFieldAsync(field: keyof T, value: any, form: T): Promise<string[] | null> {
        const syncErrors = this.validateFieldSync(field, value, form);
        const asyncRules = this._asyncRules.get(field) ?? [];
        const asyncErrors: string[] = [];
        const transformed = this.getFieldValue(field, value);
        for (const rule of asyncRules) {
            let ok: boolean;
            try {
                ok = await withEngineTimeout(rule.asyncFn(transformed, form), this._asyncTimeout);
            } catch (err: unknown) {
                if (err instanceof Error && err.message === '[ValiValid] Async rule timeout') {
                    // Timeout → treat as passing so a slow network doesn't block the form
                    continue;
                }
                // Unexpected rejection (network error, thrown exception, etc.) → treat as failing
                asyncErrors.push(ValiValid.resolveMsg(rule.message));
                if (this._criteriaMode === 'firstError') break;
                continue;
            }
            if (!ok) {
                asyncErrors.push(ValiValid.resolveMsg(rule.message));
                if (this._criteriaMode === 'firstError') break;
            }
        }
        const allErrors = [...(syncErrors ?? []), ...asyncErrors];
        return allErrors.length > 0 ? allErrors : null;
    }
}
