"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionDateFormatValidator = exports.expressionUpperCase = exports.expressionLowerCase = exports.expressionAlphaNumeric = exports.expressionAlpha = exports.expressionUrlValidator = exports.expressionEmailValidator = exports.expressionDigitsOnlyValidator = exports.expressionMaxLengthValidator = exports.expressionMinLengthValidator = exports.expressionRequiredValidator = exports.expressionImageDimensionsValidator = exports.expressionFileTypeValidator = exports.expressionFileSizeValidator = exports.expressionNumberNegative = exports.expressionNumberPositive = exports.expressionNumberRangeValidator = exports.EXPRESSION_UPPER_CASE = exports.EXPRESSION_LOWER_CASE = exports.EXPRESSION_ALPHA_NUMERIC = exports.EXPRESSION_ALPHA = exports.EXPRESSION_URL = exports.EXPRESSION_EMAIL = exports.EXPRESSION_REGULAR_DECIMALS = exports.EXPRESSION_REGULAR_ONLY_NUMBERS_STRING = exports.EXPRESSION_REGULAR_ONLY_NUMBERS = exports.defaultErrorFormatDateMessage = exports.defaultErrorFileDimensionsMessage = exports.defaultErrorNumberRangeMessage = exports.defaultErrorMaxLengthMessage = exports.defaultErrorMinLengthMessage = exports.DEFAULT_ERROR_UPPER_CASE = exports.DEFAULT_ERROR_LOWER_CASE = exports.DEFAULT_ERROR_ALPHA_NUMERIC = exports.DEFAULT_ERROR_ALPHA = exports.DEFAULT_ERROR_NUMBER_NEGATIVE = exports.DEFAULT_ERROR_NUMBER_POSITIVE = exports.DEFAULT_ERROR_FORMAT_DATE_MESSAGE = exports.DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE = exports.DEFAULT_ERROR_FILE_SIZE_MESSAGE = exports.DEFAULT_ERROR_FILE_TYPE_MESSAGE = exports.DEFAULT_ERROR_URL_MESSAGE = exports.DEFAULT_ERROR_EMAIL_MESSAGE = exports.DEFAULT_ERROR_DIGITS_ONLY_MESSAGE = exports.DEFAULT_ERROR_REQUIRED_MESSAGE = exports.DEFAULT_ERROR_PATTERN_MESSAGE = void 0;
const FormTypes_1 = require("../types/FormTypes");
//Message Error
exports.DEFAULT_ERROR_PATTERN_MESSAGE = "Does not comply with the patternRequired field.";
exports.DEFAULT_ERROR_REQUIRED_MESSAGE = "Required field.";
exports.DEFAULT_ERROR_DIGITS_ONLY_MESSAGE = "The field can only contain digits.";
exports.DEFAULT_ERROR_EMAIL_MESSAGE = "Does not have email format.";
exports.DEFAULT_ERROR_URL_MESSAGE = "Invalid url format.";
exports.DEFAULT_ERROR_FILE_TYPE_MESSAGE = 'File type not allowed.';
exports.DEFAULT_ERROR_FILE_SIZE_MESSAGE = 'The file size exceeds the allowed limit.';
exports.DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE = 'The file dimensions are not allowed';
exports.DEFAULT_ERROR_FORMAT_DATE_MESSAGE = 'The date format is invalid';
exports.DEFAULT_ERROR_NUMBER_POSITIVE = 'Only positive numbers are allowed.';
exports.DEFAULT_ERROR_NUMBER_NEGATIVE = 'Only negative numbers are allowed.';
exports.DEFAULT_ERROR_ALPHA = 'Only supports letters.';
exports.DEFAULT_ERROR_ALPHA_NUMERIC = 'Only supports letters and numbers.';
exports.DEFAULT_ERROR_LOWER_CASE = 'Only supports lowercase letters.';
exports.DEFAULT_ERROR_UPPER_CASE = 'Only supports uppercase letters.';
//Message error con parametros
/**
 * Genera un mensaje de error para cuando un campo no cumple con la longitud mínima.
 *
 * @param {number} value - La longitud mínima requerida.
 * @returns {string} Un mensaje de error que indica que el campo debe tener al menos `value` caracteres.
 */
const defaultErrorMinLengthMessage = (value) => `The field must have at least ${value} characters`;
exports.defaultErrorMinLengthMessage = defaultErrorMinLengthMessage;
/**
 * Genera un mensaje de error para cuando un campo excede la longitud máxima permitida.
 *
 * @param {number} value - La longitud máxima permitida.
 * @returns {string} Un mensaje de error que indica que el campo no puede tener más de `value` caracteres.
 */
const defaultErrorMaxLengthMessage = (value) => `The field cannot be more than ${value} characters.`;
exports.defaultErrorMaxLengthMessage = defaultErrorMaxLengthMessage;
/**
 * Genera un mensaje de error para cuando un valor numérico no está dentro del rango permitido.
 *
 * @param {number} min - El valor mínimo permitido.
 * @param {number} max - El valor máximo permitido.
 * @returns {string} Un mensaje de error que indica que el valor debe estar entre `min` y `max`.
 */
const defaultErrorNumberRangeMessage = (min, max) => `The value must be between ${min} and ${max}.`;
exports.defaultErrorNumberRangeMessage = defaultErrorNumberRangeMessage;
/**
 * Genera un mensaje de error para cuando las dimensiones de un archivo no cumplen con los requisitos.
 *
 * @param {number} width - El ancho permitido del archivo.
 * @param {number} height - La altura permitida del archivo.
 * @returns {string} Un mensaje de error que indica que las dimensiones del archivo son incorrectas.
 */
const defaultErrorFileDimensionsMessage = (width, height) => `${exports.DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE} (${width}x${height}).`;
exports.defaultErrorFileDimensionsMessage = defaultErrorFileDimensionsMessage;
const defaultErrorFormatDateMessage = (format) => `${exports.DEFAULT_ERROR_FORMAT_DATE_MESSAGE}.  the format is (${format}).`;
exports.defaultErrorFormatDateMessage = defaultErrorFormatDateMessage;
//Expresion Regular Digits(Numbers)
exports.EXPRESSION_REGULAR_ONLY_NUMBERS = /[^\d-]|(?!^)-/g;
exports.EXPRESSION_REGULAR_ONLY_NUMBERS_STRING = /^[0-9]+$/;
exports.EXPRESSION_REGULAR_DECIMALS = /^\d+(\.\d+)?$/;
//Expression Regular Strings
exports.EXPRESSION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
exports.EXPRESSION_URL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
exports.EXPRESSION_ALPHA = /^[a-zA-Z]+$/;
exports.EXPRESSION_ALPHA_NUMERIC = /^[a-zA-Z0-9]+$/;
exports.EXPRESSION_LOWER_CASE = /^[a-z]+$/;
exports.EXPRESSION_UPPER_CASE = /^[A-Z]+$/;
//Number
/**
 * Valida si un número está dentro de un rango específico.
 *
 * @param {number} value - El número a validar.
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @returns {boolean} `true` si el número está dentro del rango, `false` de lo contrario.
 */
const expressionNumberRangeValidator = (value, min, max) => typeof value === 'number' && value >= min && value <= max;
exports.expressionNumberRangeValidator = expressionNumberRangeValidator;
const expressionNumberPositive = (value) => value > 0;
exports.expressionNumberPositive = expressionNumberPositive;
const expressionNumberNegative = (value) => value < 0;
exports.expressionNumberNegative = expressionNumberNegative;
//File
const expressionFileSizeValidator = (file, maxSize) => file.size <= maxSize;
exports.expressionFileSizeValidator = expressionFileSizeValidator;
const expressionFileTypeValidator = (file, allowedTypes) => allowedTypes.toString().includes(file.type);
exports.expressionFileTypeValidator = expressionFileTypeValidator;
const expressionImageDimensionsValidator = (file, dimensions) => {
    let result = false;
    expressionImageDimensionsValidatorAsync(file, dimensions)
        .then((result) => result = result)
        .catch((error) => console.error(error));
    return result;
};
exports.expressionImageDimensionsValidator = expressionImageDimensionsValidator;
//Expressions Asyncs
const expressionImageDimensionsValidatorAsync = async (file, dimensions) => {
    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        return img.width === dimensions.width && img.height === dimensions.height;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
//General
const expressionRequiredValidator = (value) => {
    if (typeof value === "string") {
        return value !== "";
    }
    else if (typeof value === "number") {
        return value !== 0;
    }
    else if (value instanceof File) {
        return value !== null && value !== undefined;
    }
    else if (value instanceof Date) {
        return value !== null;
    }
    else if (Array.isArray(value)) {
        return value.length > 0;
    }
    return false;
};
exports.expressionRequiredValidator = expressionRequiredValidator;
//String
const expressionMinLengthValidator = (value, minLength) => typeof value === 'string' && value.length >= minLength;
exports.expressionMinLengthValidator = expressionMinLengthValidator;
const expressionMaxLengthValidator = (value, maxLength) => typeof value === 'string' && value.length <= maxLength;
exports.expressionMaxLengthValidator = expressionMaxLengthValidator;
const expressionDigitsOnlyValidator = (value) => exports.EXPRESSION_REGULAR_ONLY_NUMBERS_STRING.test(value);
exports.expressionDigitsOnlyValidator = expressionDigitsOnlyValidator;
const expressionEmailValidator = (value) => exports.EXPRESSION_EMAIL.test(value);
exports.expressionEmailValidator = expressionEmailValidator;
const expressionUrlValidator = (value) => exports.EXPRESSION_URL.test(value);
exports.expressionUrlValidator = expressionUrlValidator;
const expressionAlpha = (value) => exports.EXPRESSION_ALPHA.test(value);
exports.expressionAlpha = expressionAlpha;
const expressionAlphaNumeric = (value) => exports.EXPRESSION_ALPHA_NUMERIC.test(value);
exports.expressionAlphaNumeric = expressionAlphaNumeric;
const expressionLowerCase = (value) => exports.EXPRESSION_LOWER_CASE.test(value);
exports.expressionLowerCase = expressionLowerCase;
const expressionUpperCase = (value) => exports.EXPRESSION_UPPER_CASE.test(value);
exports.expressionUpperCase = expressionUpperCase;
// export const expressionExactLength: (value: string, exactLength: number) => boolean = (value: string, exactLength: number) => value.length !== exactLength;
//Dates
const expressionDateFormatValidator = (value, format) => FormTypes_1.DateFormatExpressions[format].test(value.toString());
exports.expressionDateFormatValidator = expressionDateFormatValidator;
// INITIALIZERS
