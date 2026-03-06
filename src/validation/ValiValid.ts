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
} from '../constants/index';
import { getMessage } from '../i18n/index';
import { AsyncRule, FieldValidationConfig, FormErrors, SyncRule, ValidationsConfig } from '../types/index';
import { ValidationType } from './Validators';

export class ValiValid<T extends Record<string, any>> {
    private _syncRules: Map<keyof T, SyncRule<T>[]> = new Map();
    private _asyncRules: Map<keyof T, AsyncRule<T>[]> = new Map();
    private _fieldMeta: Map<keyof T, { isNumber?: boolean; isDecimal?: boolean }> = new Map();

    constructor(configs: FieldValidationConfig<T>[] = []) {
        configs.forEach((config) => this.addValidation(config));
    }

    // ---- Private helpers ----

    private addRule(field: keyof T, type: string, message: string, validate: (value: any) => boolean): void {
        if (!this._syncRules.has(field)) this._syncRules.set(field, []);
        this._syncRules.get(field)!.push({ type, field, message, validate });
    }

    private addAsyncRule(
        field: keyof T,
        type: string,
        message: string,
        asyncFn: (value: any, form: T) => Promise<boolean>
    ): void {
        if (!this._asyncRules.has(field)) this._asyncRules.set(field, []);
        this._asyncRules.get(field)!.push({ type, field, message, asyncFn });
    }

    private addValidation(config: FieldValidationConfig<T>): void {
        const { field, validations, isNumber, isDecimal } = config;

        if (isNumber !== undefined || isDecimal !== undefined) {
            this._fieldMeta.set(field, { isNumber, isDecimal });
        }

        validations.forEach((v: ValidationsConfig) => {
            switch (v.type) {
                case ValidationType.Required:
                    this.addRule(field, v.type, v.message || getMessage('required'), validateRequired);
                    break;
                case ValidationType.MinLength:
                    this.addRule(field, v.type, v.message || getMessage('minLength', v.value),
                        (val) => validateMinLength(val, v.value));
                    break;
                case ValidationType.MaxLength:
                    this.addRule(field, v.type, v.message || getMessage('maxLength', v.value),
                        (val) => validateMaxLength(val, v.value));
                    break;
                case ValidationType.ExactLength:
                    this.addRule(field, v.type, v.message || getMessage('exactLength', v.value),
                        (val) => validateExactLength(val, v.value));
                    break;
                case ValidationType.Email:
                    this.addRule(field, v.type, v.message || getMessage('email'), validateEmail);
                    break;
                case ValidationType.Url:
                    this.addRule(field, v.type, v.message || getMessage('url'), validateUrl);
                    break;
                case ValidationType.Alpha:
                    this.addRule(field, v.type, v.message || getMessage('alpha'), validateAlpha);
                    break;
                case ValidationType.AlphaNumeric:
                    this.addRule(field, v.type, v.message || getMessage('alphaNumeric'), validateAlphaNumeric);
                    break;
                case ValidationType.LowerCase:
                    this.addRule(field, v.type, v.message || getMessage('lowerCase'), validateLowerCase);
                    break;
                case ValidationType.UpperCase:
                    this.addRule(field, v.type, v.message || getMessage('upperCase'), validateUpperCase);
                    break;
                case ValidationType.NoWhitespace:
                    this.addRule(field, v.type, v.message || getMessage('noWhitespace'), validateNoWhitespace);
                    break;
                case ValidationType.Contains:
                    this.addRule(field, v.type, v.message || getMessage('contains', v.value),
                        (val) => validateContains(val, v.value));
                    break;
                case ValidationType.StartsWith:
                    this.addRule(field, v.type, v.message || getMessage('startsWith', v.value),
                        (val) => validateStartsWith(val, v.value));
                    break;
                case ValidationType.EndsWith:
                    this.addRule(field, v.type, v.message || getMessage('endsWith', v.value),
                        (val) => validateEndsWith(val, v.value));
                    break;
                case ValidationType.Slug:
                    this.addRule(field, v.type, v.message || getMessage('slug'), validateSlug);
                    break;
                case ValidationType.PasswordStrength:
                    this.addRule(field, v.type, v.message || getMessage('passwordStrength'), validatePasswordStrength);
                    break;
                case ValidationType.HexColor:
                    this.addRule(field, v.type, v.message || getMessage('hexColor'), validateHexColor);
                    break;
                case ValidationType.IPv4:
                    this.addRule(field, v.type, v.message || getMessage('ipv4'), validateIPv4);
                    break;
                case ValidationType.UUID:
                    this.addRule(field, v.type, v.message || getMessage('uuid'), validateUUID);
                    break;
                case ValidationType.Json:
                    this.addRule(field, v.type, v.message || getMessage('json'), validateJson);
                    break;
                case ValidationType.Phone:
                    this.addRule(field, v.type, v.message || getMessage('phone'), validatePhone);
                    break;
                case ValidationType.CreditCard:
                    this.addRule(field, v.type, v.message || getMessage('creditCard'), validateCreditCard);
                    break;
                case ValidationType.Pattern:
                    this.addRule(field, v.type, v.message || getMessage('pattern'), v.value);
                    break;
                case ValidationType.DigitsOnly:
                    this.addRule(field, v.type, v.message || getMessage('digitsOnly'), validateDigitsOnly);
                    break;
                case ValidationType.NumberRange: {
                    const [min, max] = v.value;
                    this.addRule(field, v.type, v.message || getMessage('numberRange', min, max),
                        (val) => validateNumberRange(val, min, max));
                    break;
                }
                case ValidationType.NumberPositive:
                    this.addRule(field, v.type, v.message || getMessage('numberPositive'), validateNumberPositive);
                    break;
                case ValidationType.NumberNegative:
                    this.addRule(field, v.type, v.message || getMessage('numberNegative'), validateNumberNegative);
                    break;
                case ValidationType.Integer:
                    this.addRule(field, v.type, v.message || getMessage('integer'), validateInteger);
                    break;
                case ValidationType.MultipleOf:
                    this.addRule(field, v.type, v.message || getMessage('multipleOf', v.value),
                        (val) => validateMultipleOf(val, v.value));
                    break;
                case ValidationType.DateFormat:
                    this.addRule(field, v.type, v.message || getMessage('dateFormat', v.format),
                        (val) => validateDateFormat(val, v.format));
                    break;
                case ValidationType.MinDate:
                    this.addRule(field, v.type, v.message || getMessage('minDate', v.value),
                        (val) => validateMinDate(val, v.value));
                    break;
                case ValidationType.MaxDate:
                    this.addRule(field, v.type, v.message || getMessage('maxDate', v.value),
                        (val) => validateMaxDate(val, v.value));
                    break;
                case ValidationType.FutureDate:
                    this.addRule(field, v.type, v.message || getMessage('futureDate'), validateFutureDate);
                    break;
                case ValidationType.PastDate:
                    this.addRule(field, v.type, v.message || getMessage('pastDate'), validatePastDate);
                    break;
                case ValidationType.FileType:
                    this.addRule(field, v.type, v.message || getMessage('fileType'),
                        (val) => validateFileType(val, v.value));
                    break;
                case ValidationType.FileSize:
                    this.addRule(field, v.type, v.message || getMessage('fileSize'),
                        (val) => validateFileSize(val, v.value));
                    break;
                case ValidationType.FileDimensions: {
                    const { width, height } = v.value;
                    this.addAsyncRule(field, v.type, v.message || getMessage('fileDimensions', width, height),
                        (val) => validateImageDimensions(val, { width, height }));
                    break;
                }
                case ValidationType.ImageAspectRatio: {
                    const ratio = v.value;
                    const tolerance = v.tolerance;
                    this.addAsyncRule(field, v.type, v.message || getMessage('imageAspectRatio', ratio.width, ratio.height),
                        (val) => validateImageAspectRatio(val, ratio, tolerance));
                    break;
                }
                case ValidationType.ImageMinDimensions: {
                    const minDims = v.value;
                    this.addAsyncRule(field, v.type, v.message || getMessage('imageMinDimensions', minDims.width, minDims.height),
                        (val) => validateImageMinDimensions(val, minDims));
                    break;
                }
                case ValidationType.ImageMaxDimensions: {
                    const maxDims = v.value;
                    this.addAsyncRule(field, v.type, v.message || getMessage('imageMaxDimensions', maxDims.width, maxDims.height),
                        (val) => validateImageMaxDimensions(val, maxDims));
                    break;
                }
                case ValidationType.MatchField: {
                    const targetField = v.field as keyof T;
                    this.addRule(field, v.type, v.message || getMessage('matchField'),
                        (val) => val === (this as any)._currentForm?.[targetField]);
                    break;
                }
                case ValidationType.RequiredIf: {
                    const condition = v.condition;
                    this.addRule(field, v.type, v.message || getMessage('requiredIf'),
                        (val) => {
                            const form = (this as any)._currentForm;
                            if (!form || !condition(form)) return true;
                            return validateRequired(val);
                        });
                    break;
                }
                case ValidationType.AsyncPattern:
                    this.addAsyncRule(field, v.type, v.message || getMessage('asyncPattern'),
                        (val, form) => v.asyncFn(val, form));
                    break;

                // --- v2.1 new cases ---

                case ValidationType.GreaterThan:
                    this.addRule(field, v.type, v.message || getMessage('greaterThan', v.value),
                        (val) => validateGreaterThan(val, v.value));
                    break;
                case ValidationType.LessThan:
                    this.addRule(field, v.type, v.message || getMessage('lessThan', v.value),
                        (val) => validateLessThan(val, v.value));
                    break;
                case ValidationType.Precision:
                    this.addRule(field, v.type, v.message || getMessage('precision', v.value),
                        (val) => validatePrecision(val, v.value));
                    break;
                case ValidationType.DateAfter:
                    this.addRule(field, v.type, v.message || getMessage('dateAfter', v.value),
                        (val) => validateDateAfter(val, v.value));
                    break;
                case ValidationType.DateBefore:
                    this.addRule(field, v.type, v.message || getMessage('dateBefore', v.value),
                        (val) => validateDateBefore(val, v.value));
                    break;
                case ValidationType.OneOf:
                    this.addRule(field, v.type, v.message || getMessage('oneOf', v.value),
                        (val) => validateOneOf(val, v.value));
                    break;
                case ValidationType.NotMatchField: {
                    const notTargetField = v.field as keyof T;
                    this.addRule(field, v.type, v.message || getMessage('notMatchField'),
                        (val) => validateNotMatchField(val, (this as any)._currentForm?.[notTargetField]));
                    break;
                }
                case ValidationType.RequiredUnless: {
                    const unlessCondition = v.condition;
                    this.addRule(field, v.type, v.message || getMessage('requiredUnless'),
                        (val) => {
                            const form = (this as any)._currentForm;
                            return validateRequiredUnless(val, unlessCondition, form ?? {});
                        });
                    break;
                }
                case ValidationType.ArrayMinLength:
                    this.addRule(field, v.type, v.message || getMessage('arrayMinLength', v.value),
                        (val) => validateArrayMinLength(val, v.value));
                    break;
                case ValidationType.ArrayMaxLength:
                    this.addRule(field, v.type, v.message || getMessage('arrayMaxLength', v.value),
                        (val) => validateArrayMaxLength(val, v.value));
                    break;
                case ValidationType.ArrayUnique:
                    this.addRule(field, v.type, v.message || getMessage('arrayUnique'), validateArrayUnique);
                    break;
                case ValidationType.ArrayContains:
                    this.addRule(field, v.type, v.message || getMessage('arrayContains', v.value),
                        (val) => validateArrayContains(val, v.value));
                    break;
                case ValidationType.Time:
                    this.addRule(field, v.type, v.message || getMessage('time'),
                        (val) => validateTime(val, v.format));
                    break;
                case ValidationType.NoHTML:
                    this.addRule(field, v.type, v.message || getMessage('noHTML'), validateNoHTML);
                    break;
                case ValidationType.IBAN:
                    this.addRule(field, v.type, v.message || getMessage('iban'), validateIBAN);
                    break;
                case ValidationType.PostalCode:
                    this.addRule(field, v.type, v.message || getMessage('postalCode'),
                        (val) => validatePostalCode(val, v.country));
                    break;
                case ValidationType.Latitude:
                    this.addRule(field, v.type, v.message || getMessage('latitude'), validateLatitude);
                    break;
                case ValidationType.Longitude:
                    this.addRule(field, v.type, v.message || getMessage('longitude'), validateLongitude);
                    break;
                case ValidationType.SemVer:
                    this.addRule(field, v.type, v.message || getMessage('semVer'), validateSemVer);
                    break;
                case ValidationType.Base64:
                    this.addRule(field, v.type, v.message || getMessage('base64'), validateBase64);
                    break;

                default:
                    throw new Error(`Unsupported validation type.`);
            }
        });
    }

    // ---- Public: dynamic management ----

    addFieldValidation(field: keyof T, validations: ValidationsConfig[]): void {
        this.addValidation({ field, validations });
    }

    removeFieldValidation(field: keyof T, type: ValidationType): void {
        const syncRules = this._syncRules.get(field);
        if (syncRules) {
            this._syncRules.set(field, syncRules.filter((r) => r.type !== type));
        }
        const asyncRules = this._asyncRules.get(field);
        if (asyncRules) {
            this._asyncRules.set(field, asyncRules.filter((r) => r.type !== type));
        }
    }

    setFieldValidations(field: keyof T, validations: ValidationsConfig[]): void {
        this._syncRules.delete(field);
        this._asyncRules.delete(field);
        this.addValidation({ field, validations });
    }

    clearFieldValidations(field: keyof T): void {
        this._syncRules.delete(field);
        this._asyncRules.delete(field);
    }

    hasAsyncRules(field: keyof T): boolean {
        return (this._asyncRules.get(field)?.length ?? 0) > 0;
    }

    // ---- Public: execution ----

    getFieldValue(field: keyof T, value: any): any {
        if (typeof value === 'boolean') return value;

        const meta = this._fieldMeta.get(field);
        if (!meta) return value;

        const { isNumber = false, isDecimal = false } = meta;
        if (!isNumber) return value;
        if (isDecimal) return Number(value);

        return Number(String(value).replace(REGEX_ONLY_NUMBERS, ''));
    }

    validateSync(fields: T): FormErrors<T> {
        (this as any)._currentForm = fields;
        const errors: FormErrors<T> = {};

        this._syncRules.forEach((rules, field) => {
            for (const rule of rules) {
                if (!rule.validate(fields[field])) {
                    errors[field] = rule.message;
                    break;
                }
            }
        });

        return errors;
    }

    validateFieldSync(field: keyof T, value: any): string | null {
        const rules = this._syncRules.get(field) ?? [];
        for (const rule of rules) {
            if (!rule.validate(value)) return rule.message;
        }
        return null;
    }

    async validateAsync(fields: T): Promise<FormErrors<T>> {
        (this as any)._currentForm = fields;
        const syncErrors = this.validateSync(fields);

        const asyncResults = await Promise.all(
            Array.from(this._asyncRules.entries()).map(async ([field, rules]) => {
                // Skip if already has sync error for this field
                if (syncErrors[field]) return [field, syncErrors[field]] as [keyof T, string | null];
                for (const rule of rules) {
                    const ok = await rule.asyncFn(fields[field], fields);
                    if (!ok) return [field, rule.message] as [keyof T, string | null];
                }
                return [field, null] as [keyof T, string | null];
            })
        );

        const errors: FormErrors<T> = { ...syncErrors };
        asyncResults.forEach(([field, error]) => {
            if (error !== null) errors[field] = error;
            else if (!syncErrors[field]) errors[field] = null;
        });

        return errors;
    }

    async validateFieldAsync(field: keyof T, value: any, form: T): Promise<string | null> {
        (this as any)._currentForm = form;
        const syncError = this.validateFieldSync(field, value);
        if (syncError) return syncError;

        const asyncRules = this._asyncRules.get(field) ?? [];
        for (const rule of asyncRules) {
            const ok = await rule.asyncFn(value, form);
            if (!ok) return rule.message;
        }
        return null;
    }
}
