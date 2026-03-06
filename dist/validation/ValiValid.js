"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValiValid = void 0;
const index_1 = require("../constants/index");
const index_2 = require("../i18n/index");
const Validators_1 = require("./Validators");
class ValiValid {
    constructor(configs = []) {
        this._syncRules = new Map();
        this._asyncRules = new Map();
        this._fieldMeta = new Map();
        configs.forEach((config) => this.addValidation(config));
    }
    // ---- Private helpers ----
    addRule(field, type, message, validate) {
        if (!this._syncRules.has(field))
            this._syncRules.set(field, []);
        this._syncRules.get(field).push({ type, field, message, validate });
    }
    addAsyncRule(field, type, message, asyncFn) {
        if (!this._asyncRules.has(field))
            this._asyncRules.set(field, []);
        this._asyncRules.get(field).push({ type, field, message, asyncFn });
    }
    addValidation(config) {
        const { field, validations, isNumber, isDecimal } = config;
        if (isNumber !== undefined || isDecimal !== undefined) {
            this._fieldMeta.set(field, { isNumber, isDecimal });
        }
        validations.forEach((v) => {
            switch (v.type) {
                case Validators_1.ValidationType.Required:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('required'), index_1.validateRequired);
                    break;
                case Validators_1.ValidationType.MinLength:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('minLength', v.value), (val) => (0, index_1.validateMinLength)(val, v.value));
                    break;
                case Validators_1.ValidationType.MaxLength:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('maxLength', v.value), (val) => (0, index_1.validateMaxLength)(val, v.value));
                    break;
                case Validators_1.ValidationType.ExactLength:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('exactLength', v.value), (val) => (0, index_1.validateExactLength)(val, v.value));
                    break;
                case Validators_1.ValidationType.Email:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('email'), index_1.validateEmail);
                    break;
                case Validators_1.ValidationType.Url:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('url'), index_1.validateUrl);
                    break;
                case Validators_1.ValidationType.Alpha:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('alpha'), index_1.validateAlpha);
                    break;
                case Validators_1.ValidationType.AlphaNumeric:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('alphaNumeric'), index_1.validateAlphaNumeric);
                    break;
                case Validators_1.ValidationType.LowerCase:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('lowerCase'), index_1.validateLowerCase);
                    break;
                case Validators_1.ValidationType.UpperCase:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('upperCase'), index_1.validateUpperCase);
                    break;
                case Validators_1.ValidationType.NoWhitespace:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('noWhitespace'), index_1.validateNoWhitespace);
                    break;
                case Validators_1.ValidationType.Contains:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('contains', v.value), (val) => (0, index_1.validateContains)(val, v.value));
                    break;
                case Validators_1.ValidationType.StartsWith:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('startsWith', v.value), (val) => (0, index_1.validateStartsWith)(val, v.value));
                    break;
                case Validators_1.ValidationType.EndsWith:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('endsWith', v.value), (val) => (0, index_1.validateEndsWith)(val, v.value));
                    break;
                case Validators_1.ValidationType.Slug:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('slug'), index_1.validateSlug);
                    break;
                case Validators_1.ValidationType.PasswordStrength:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('passwordStrength'), index_1.validatePasswordStrength);
                    break;
                case Validators_1.ValidationType.HexColor:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('hexColor'), index_1.validateHexColor);
                    break;
                case Validators_1.ValidationType.IPv4:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('ipv4'), index_1.validateIPv4);
                    break;
                case Validators_1.ValidationType.UUID:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('uuid'), index_1.validateUUID);
                    break;
                case Validators_1.ValidationType.Json:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('json'), index_1.validateJson);
                    break;
                case Validators_1.ValidationType.Phone:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('phone'), index_1.validatePhone);
                    break;
                case Validators_1.ValidationType.CreditCard:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('creditCard'), index_1.validateCreditCard);
                    break;
                case Validators_1.ValidationType.Pattern:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('pattern'), v.value);
                    break;
                case Validators_1.ValidationType.DigitsOnly:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('digitsOnly'), index_1.validateDigitsOnly);
                    break;
                case Validators_1.ValidationType.NumberRange: {
                    const [min, max] = v.value;
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('numberRange', min, max), (val) => (0, index_1.validateNumberRange)(val, min, max));
                    break;
                }
                case Validators_1.ValidationType.NumberPositive:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('numberPositive'), index_1.validateNumberPositive);
                    break;
                case Validators_1.ValidationType.NumberNegative:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('numberNegative'), index_1.validateNumberNegative);
                    break;
                case Validators_1.ValidationType.Integer:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('integer'), index_1.validateInteger);
                    break;
                case Validators_1.ValidationType.MultipleOf:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('multipleOf', v.value), (val) => (0, index_1.validateMultipleOf)(val, v.value));
                    break;
                case Validators_1.ValidationType.DateFormat:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('dateFormat', v.format), (val) => (0, index_1.validateDateFormat)(val, v.format));
                    break;
                case Validators_1.ValidationType.MinDate:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('minDate', v.value), (val) => (0, index_1.validateMinDate)(val, v.value));
                    break;
                case Validators_1.ValidationType.MaxDate:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('maxDate', v.value), (val) => (0, index_1.validateMaxDate)(val, v.value));
                    break;
                case Validators_1.ValidationType.FutureDate:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('futureDate'), index_1.validateFutureDate);
                    break;
                case Validators_1.ValidationType.PastDate:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('pastDate'), index_1.validatePastDate);
                    break;
                case Validators_1.ValidationType.FileType:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('fileType'), (val) => (0, index_1.validateFileType)(val, v.value));
                    break;
                case Validators_1.ValidationType.FileSize:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('fileSize'), (val) => (0, index_1.validateFileSize)(val, v.value));
                    break;
                case Validators_1.ValidationType.FileDimensions: {
                    const { width, height } = v.value;
                    this.addAsyncRule(field, v.type, v.message || (0, index_2.getMessage)('fileDimensions', width, height), (val) => (0, index_1.validateImageDimensions)(val, { width, height }));
                    break;
                }
                case Validators_1.ValidationType.ImageAspectRatio: {
                    const ratio = v.value;
                    const tolerance = v.tolerance;
                    this.addAsyncRule(field, v.type, v.message || (0, index_2.getMessage)('imageAspectRatio', ratio.width, ratio.height), (val) => (0, index_1.validateImageAspectRatio)(val, ratio, tolerance));
                    break;
                }
                case Validators_1.ValidationType.ImageMinDimensions: {
                    const minDims = v.value;
                    this.addAsyncRule(field, v.type, v.message || (0, index_2.getMessage)('imageMinDimensions', minDims.width, minDims.height), (val) => (0, index_1.validateImageMinDimensions)(val, minDims));
                    break;
                }
                case Validators_1.ValidationType.ImageMaxDimensions: {
                    const maxDims = v.value;
                    this.addAsyncRule(field, v.type, v.message || (0, index_2.getMessage)('imageMaxDimensions', maxDims.width, maxDims.height), (val) => (0, index_1.validateImageMaxDimensions)(val, maxDims));
                    break;
                }
                case Validators_1.ValidationType.MatchField: {
                    const targetField = v.field;
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('matchField'), (val) => { var _a; return val === ((_a = this._currentForm) === null || _a === void 0 ? void 0 : _a[targetField]); });
                    break;
                }
                case Validators_1.ValidationType.RequiredIf: {
                    const condition = v.condition;
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('requiredIf'), (val) => {
                        const form = this._currentForm;
                        if (!form || !condition(form))
                            return true;
                        return (0, index_1.validateRequired)(val);
                    });
                    break;
                }
                case Validators_1.ValidationType.AsyncPattern:
                    this.addAsyncRule(field, v.type, v.message || (0, index_2.getMessage)('asyncPattern'), (val, form) => v.asyncFn(val, form));
                    break;
                // --- v2.1 new cases ---
                case Validators_1.ValidationType.GreaterThan:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('greaterThan', v.value), (val) => (0, index_1.validateGreaterThan)(val, v.value));
                    break;
                case Validators_1.ValidationType.LessThan:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('lessThan', v.value), (val) => (0, index_1.validateLessThan)(val, v.value));
                    break;
                case Validators_1.ValidationType.Precision:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('precision', v.value), (val) => (0, index_1.validatePrecision)(val, v.value));
                    break;
                case Validators_1.ValidationType.DateAfter:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('dateAfter', v.value), (val) => (0, index_1.validateDateAfter)(val, v.value));
                    break;
                case Validators_1.ValidationType.DateBefore:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('dateBefore', v.value), (val) => (0, index_1.validateDateBefore)(val, v.value));
                    break;
                case Validators_1.ValidationType.OneOf:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('oneOf', v.value), (val) => (0, index_1.validateOneOf)(val, v.value));
                    break;
                case Validators_1.ValidationType.NotMatchField: {
                    const notTargetField = v.field;
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('notMatchField'), (val) => { var _a; return (0, index_1.validateNotMatchField)(val, (_a = this._currentForm) === null || _a === void 0 ? void 0 : _a[notTargetField]); });
                    break;
                }
                case Validators_1.ValidationType.RequiredUnless: {
                    const unlessCondition = v.condition;
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('requiredUnless'), (val) => {
                        const form = this._currentForm;
                        return (0, index_1.validateRequiredUnless)(val, unlessCondition, form !== null && form !== void 0 ? form : {});
                    });
                    break;
                }
                case Validators_1.ValidationType.ArrayMinLength:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('arrayMinLength', v.value), (val) => (0, index_1.validateArrayMinLength)(val, v.value));
                    break;
                case Validators_1.ValidationType.ArrayMaxLength:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('arrayMaxLength', v.value), (val) => (0, index_1.validateArrayMaxLength)(val, v.value));
                    break;
                case Validators_1.ValidationType.ArrayUnique:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('arrayUnique'), index_1.validateArrayUnique);
                    break;
                case Validators_1.ValidationType.ArrayContains:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('arrayContains', v.value), (val) => (0, index_1.validateArrayContains)(val, v.value));
                    break;
                case Validators_1.ValidationType.Time:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('time'), (val) => (0, index_1.validateTime)(val, v.format));
                    break;
                case Validators_1.ValidationType.NoHTML:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('noHTML'), index_1.validateNoHTML);
                    break;
                case Validators_1.ValidationType.IBAN:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('iban'), index_1.validateIBAN);
                    break;
                case Validators_1.ValidationType.PostalCode:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('postalCode'), (val) => (0, index_1.validatePostalCode)(val, v.country));
                    break;
                case Validators_1.ValidationType.Latitude:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('latitude'), index_1.validateLatitude);
                    break;
                case Validators_1.ValidationType.Longitude:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('longitude'), index_1.validateLongitude);
                    break;
                case Validators_1.ValidationType.SemVer:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('semVer'), index_1.validateSemVer);
                    break;
                case Validators_1.ValidationType.Base64:
                    this.addRule(field, v.type, v.message || (0, index_2.getMessage)('base64'), index_1.validateBase64);
                    break;
                default:
                    throw new Error(`Unsupported validation type.`);
            }
        });
    }
    // ---- Public: dynamic management ----
    addFieldValidation(field, validations) {
        this.addValidation({ field, validations });
    }
    removeFieldValidation(field, type) {
        const syncRules = this._syncRules.get(field);
        if (syncRules) {
            this._syncRules.set(field, syncRules.filter((r) => r.type !== type));
        }
        const asyncRules = this._asyncRules.get(field);
        if (asyncRules) {
            this._asyncRules.set(field, asyncRules.filter((r) => r.type !== type));
        }
    }
    setFieldValidations(field, validations) {
        this._syncRules.delete(field);
        this._asyncRules.delete(field);
        this.addValidation({ field, validations });
    }
    clearFieldValidations(field) {
        this._syncRules.delete(field);
        this._asyncRules.delete(field);
    }
    hasAsyncRules(field) {
        var _a, _b;
        return ((_b = (_a = this._asyncRules.get(field)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0;
    }
    // ---- Public: execution ----
    getFieldValue(field, value) {
        if (typeof value === 'boolean')
            return value;
        const meta = this._fieldMeta.get(field);
        if (!meta)
            return value;
        const { isNumber = false, isDecimal = false } = meta;
        if (!isNumber)
            return value;
        if (isDecimal)
            return Number(value);
        return Number(String(value).replace(index_1.REGEX_ONLY_NUMBERS, ''));
    }
    validateSync(fields) {
        this._currentForm = fields;
        const errors = {};
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
    validateFieldSync(field, value) {
        var _a;
        const rules = (_a = this._syncRules.get(field)) !== null && _a !== void 0 ? _a : [];
        for (const rule of rules) {
            if (!rule.validate(value))
                return rule.message;
        }
        return null;
    }
    async validateAsync(fields) {
        this._currentForm = fields;
        const syncErrors = this.validateSync(fields);
        const asyncResults = await Promise.all(Array.from(this._asyncRules.entries()).map(async ([field, rules]) => {
            // Skip if already has sync error for this field
            if (syncErrors[field])
                return [field, syncErrors[field]];
            for (const rule of rules) {
                const ok = await rule.asyncFn(fields[field], fields);
                if (!ok)
                    return [field, rule.message];
            }
            return [field, null];
        }));
        const errors = Object.assign({}, syncErrors);
        asyncResults.forEach(([field, error]) => {
            if (error !== null)
                errors[field] = error;
            else if (!syncErrors[field])
                errors[field] = null;
        });
        return errors;
    }
    async validateFieldAsync(field, value, form) {
        var _a;
        this._currentForm = form;
        const syncError = this.validateFieldSync(field, value);
        if (syncError)
            return syncError;
        const asyncRules = (_a = this._asyncRules.get(field)) !== null && _a !== void 0 ? _a : [];
        for (const rule of asyncRules) {
            const ok = await rule.asyncFn(value, form);
            if (!ok)
                return rule.message;
        }
        return null;
    }
}
exports.ValiValid = ValiValid;
