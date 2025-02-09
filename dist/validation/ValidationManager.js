"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValiValid = void 0;
const Constants_1 = require("../constants/Constants");
const Validators_1 = require("./Validators");
class ValiValid {
    constructor(setFormValid, builderValidations = []) {
        this._rules = new Map();
        this._AllfieldValidationConfig = [];
        this._isFormValid = setFormValid;
        builderValidations.map((fieldValidation) => this.addValidation(fieldValidation));
    }
    addRule(field, message, validate) {
        if (!this._rules.has(field)) {
            this._rules.set(field, []);
        }
        this._rules.get(field).push({ field, message, validate });
    }
    addValidation(fieldValidationConfig) {
        this._AllfieldValidationConfig.push(fieldValidationConfig);
        const { field, validations = [], isNumber = false, isDecimal = false } = fieldValidationConfig;
        if (!field)
            return;
        validations.forEach((validationConfig) => {
            switch (validationConfig.type) {
                case Validators_1.ValidationType.Required:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_REQUIRED_MESSAGE, (value) => (0, Constants_1.expressionRequiredValidator)(value));
                    break;
                case Validators_1.ValidationType.MinLength:
                    this.addRule(field, validationConfig.message || (0, Constants_1.defaultErrorMinLengthMessage)(validationConfig.value), (value) => (0, Constants_1.expressionMinLengthValidator)(value, validationConfig.value));
                    break;
                case Validators_1.ValidationType.MaxLength:
                    this.addRule(field, validationConfig.message || (0, Constants_1.defaultErrorMaxLengthMessage)(validationConfig.value), (value) => (0, Constants_1.expressionMaxLengthValidator)(value, validationConfig.value));
                    break;
                case Validators_1.ValidationType.DigitsOnly:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_DIGITS_ONLY_MESSAGE, (value) => (0, Constants_1.expressionDigitsOnlyValidator)(value));
                    break;
                case Validators_1.ValidationType.NumberRange:
                    const [min, max] = validationConfig.value;
                    this.addRule(field, validationConfig.message || (0, Constants_1.defaultErrorNumberRangeMessage)(min, max), (value) => (0, Constants_1.expressionNumberRangeValidator)(value, min, max));
                    break;
                case Validators_1.ValidationType.Email:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_EMAIL_MESSAGE, (value) => (0, Constants_1.expressionEmailValidator)(value));
                    break;
                case Validators_1.ValidationType.Url:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_URL_MESSAGE, (value) => (0, Constants_1.expressionUrlValidator)(value));
                    break;
                case Validators_1.ValidationType.FileSize:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_FILE_SIZE_MESSAGE, (file) => (0, Constants_1.expressionFileSizeValidator)(file, validationConfig.value));
                    break;
                case Validators_1.ValidationType.FileType:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_FILE_TYPE_MESSAGE, (file) => (0, Constants_1.expressionFileTypeValidator)(file, validationConfig.value));
                    break;
                case Validators_1.ValidationType.FileDimensions:
                    const { width, height } = validationConfig.value;
                    this.addRule(field, validationConfig.message || (0, Constants_1.defaultErrorFileDimensionsMessage)(width, height), (file) => (0, Constants_1.expressionImageDimensionsValidator)(file, { width, height }));
                    break;
                case Validators_1.ValidationType.Pattern:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_PATTERN_MESSAGE, validationConfig.value);
                    break;
                case Validators_1.ValidationType.DateFormat:
                    this.addRule(field, validationConfig.message || (0, Constants_1.defaultErrorFormatDateMessage)(validationConfig.format), (value) => (0, Constants_1.expressionDateFormatValidator)(value, validationConfig.format));
                    break;
                case Validators_1.ValidationType.NumberPositive:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_NUMBER_POSITIVE, (value) => (0, Constants_1.expressionNumberPositive)(value));
                    break;
                case Validators_1.ValidationType.NumberNegative:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_NUMBER_NEGATIVE, (value) => (0, Constants_1.expressionNumberNegative)(value));
                    break;
                case Validators_1.ValidationType.Alpha:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_ALPHA, (value) => (0, Constants_1.expressionAlpha)(value));
                    break;
                case Validators_1.ValidationType.AlphaNumeric:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_ALPHA_NUMERIC, (value) => (0, Constants_1.expressionAlphaNumeric)(value));
                    break;
                case Validators_1.ValidationType.LowerCase:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_UPPER_CASE, (value) => (0, Constants_1.expressionLowerCase)(value));
                    break;
                case Validators_1.ValidationType.UpperCase:
                    this.addRule(field, validationConfig.message || Constants_1.DEFAULT_ERROR_UPPER_CASE, (value) => (0, Constants_1.expressionUpperCase)(value));
                    break;
                default:
                    throw new Error(`Unsupported validation type.`);
            }
        });
    }
    validate(fields) {
        const errors = {};
        this._rules.forEach((rules, field) => {
            for (const rule of rules) {
                if (!rule.validate(fields[field])) {
                    errors[field] = rule.message;
                    break;
                }
            }
        });
        const isFormValid = Object.values(errors).every(error => error === null);
        this._isFormValid(isFormValid);
        return errors;
    }
    validateField(field, value) {
        const rules = this._rules.get(field) || [];
        for (const rule of rules) {
            if (rule && !rule.validate(value)) {
                return rule.message;
            }
        }
        return null;
    }
    getFieldValue(name, value) {
        const fieldValidation = this._AllfieldValidationConfig.find(item => item.field === name);
        if (!fieldValidation) {
            return value;
        }
        if (typeof value === "boolean") {
            return value;
        }
        const { isNumber = false, isDecimal = false } = fieldValidation; // Asignamos valores por defecto
        if (isNumber) {
            if (isDecimal)
                return Number(value);
            if (value === '0')
                return '';
            return Number(value.toString().replace(Constants_1.EXPRESSION_REGULAR_ONLY_NUMBERS, ''));
        }
        return value;
    }
    handleChange(name, value, setForm, setErrors) {
        const fieldValue = this.getFieldValue(name, value);
        setForm((prevForm) => (Object.assign(Object.assign({}, prevForm), { [name]: fieldValue })));
        const fieldError = this.validateField(name, fieldValue);
        setErrors((prevErrors) => {
            const errors = Object.assign(Object.assign({}, prevErrors), { [name]: fieldError });
            const totalFields = Object.keys(errors).length;
            const validFields = Object.values(errors).filter(error => error === null).length;
            this._isFormValid(totalFields === validFields);
            return errors;
        });
    }
}
exports.ValiValid = ValiValid;
