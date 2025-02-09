import { DateFormat, DateFormatExpressions, FileSize, TypeFile } from "../types/FormTypes";

//Message Error
export const DEFAULT_ERROR_PATTERN_MESSAGE: string = "Does not comply with the patternRequired field.";
export const DEFAULT_ERROR_REQUIRED_MESSAGE: string = "Required field.";
export const DEFAULT_ERROR_DIGITS_ONLY_MESSAGE: string = "The field can only contain digits.";
export const DEFAULT_ERROR_EMAIL_MESSAGE: string = "Does not have email format.";
export const DEFAULT_ERROR_URL_MESSAGE: string = "Invalid url format.";
export const DEFAULT_ERROR_FILE_TYPE_MESSAGE: string = 'File type not allowed.';
export const DEFAULT_ERROR_FILE_SIZE_MESSAGE: string = 'The file size exceeds the allowed limit.';
export const DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE: string = 'The file dimensions are not allowed';
export const DEFAULT_ERROR_FORMAT_DATE_MESSAGE: string = 'The date format is invalid';
export const DEFAULT_ERROR_NUMBER_POSITIVE: string = 'Only positive numbers are allowed.';
export const DEFAULT_ERROR_NUMBER_NEGATIVE: string = 'Only negative numbers are allowed.';
export const DEFAULT_ERROR_ALPHA: string = 'Only supports letters.';
export const DEFAULT_ERROR_ALPHA_NUMERIC: string = 'Only supports letters and numbers.';
export const DEFAULT_ERROR_LOWER_CASE: string = 'Only supports lowercase letters.';
export const DEFAULT_ERROR_UPPER_CASE: string = 'Only supports uppercase letters.';

//Message error con parametros

/**
 * Genera un mensaje de error para cuando un campo no cumple con la longitud mínima.
 * 
 * @param {number} value - La longitud mínima requerida.
 * @returns {string} Un mensaje de error que indica que el campo debe tener al menos `value` caracteres.
 */
export const defaultErrorMinLengthMessage: (value: number) => string = (value: number) => `The field must have at least ${value} characters`;

/**
 * Genera un mensaje de error para cuando un campo excede la longitud máxima permitida.
 * 
 * @param {number} value - La longitud máxima permitida.
 * @returns {string} Un mensaje de error que indica que el campo no puede tener más de `value` caracteres.
 */
export const defaultErrorMaxLengthMessage: (value: number) => string = (value: number) => `The field cannot be more than ${value} characters.`;

/**
 * Genera un mensaje de error para cuando un valor numérico no está dentro del rango permitido.
 * 
 * @param {number} min - El valor mínimo permitido.
 * @param {number} max - El valor máximo permitido.
 * @returns {string} Un mensaje de error que indica que el valor debe estar entre `min` y `max`.
 */
export const defaultErrorNumberRangeMessage: (min: number, max: number) => string = (min: number, max: number) => `The value must be between ${min} and ${max}.`;

/**
 * Genera un mensaje de error para cuando las dimensiones de un archivo no cumplen con los requisitos.
 * 
 * @param {number} width - El ancho permitido del archivo.
 * @param {number} height - La altura permitida del archivo.
 * @returns {string} Un mensaje de error que indica que las dimensiones del archivo son incorrectas.
 */
export const defaultErrorFileDimensionsMessage: (width: number, height: number) => string = (width: number, height: number) => `${DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE} (${width}x${height}).`;
export const defaultErrorFormatDateMessage: (format: DateFormat) => string = (format: DateFormat) => `${DEFAULT_ERROR_FORMAT_DATE_MESSAGE}.  the format is (${format}).`;


//Expresion Regular Digits(Numbers)
export const EXPRESSION_REGULAR_ONLY_NUMBERS: RegExp = /[^\d-]|(?!^)-/g;
export const EXPRESSION_REGULAR_ONLY_NUMBERS_STRING: RegExp = /^[0-9]+$/;
export const EXPRESSION_REGULAR_DECIMALS: RegExp = /^\d+(\.\d+)?$/;

//Expression Regular Strings
export const EXPRESSION_EMAIL: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EXPRESSION_URL: RegExp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
export const EXPRESSION_ALPHA: RegExp = /^[a-zA-Z]+$/;
export const EXPRESSION_ALPHA_NUMERIC: RegExp = /^[a-zA-Z0-9]+$/;
export const EXPRESSION_LOWER_CASE: RegExp = /^[a-z]+$/;
export const EXPRESSION_UPPER_CASE: RegExp = /^[A-Z]+$/;

//Number

/**
 * Valida si un número está dentro de un rango específico.
 *
 * @param {number} value - El número a validar.
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @returns {boolean} `true` si el número está dentro del rango, `false` de lo contrario.
 */
export const expressionNumberRangeValidator: (value: number, min: number, max: number) => boolean = (value: number, min: number, max: number) => typeof value === 'number' && value >= min && value <= max;
export const expressionNumberPositive: (value: number) => boolean = (value: number) => value > 0;
export const expressionNumberNegative: (value: number) => boolean = (value: number) => value < 0;


//File
export const expressionFileSizeValidator: (file: File, maxSize: number | FileSize) => boolean = (file: File, maxSize: number) => file.size <= maxSize;
export const expressionFileTypeValidator = (file: File, allowedTypes: TypeFile[] | string[]): boolean => allowedTypes.toString().includes(file.type);
export const expressionImageDimensionsValidator: (file: File, dimensions: { width: number; height: number }) => boolean = (file: File, dimensions: { width: number; height: number }) => {
    let result: boolean = false;

    expressionImageDimensionsValidatorAsync(file, dimensions)
        .then((result) => result = result)
        .catch((error) => console.error(error));

    return result;
}

//Expressions Asyncs
const expressionImageDimensionsValidatorAsync = async (file: File, dimensions: { width: number; height: number }): Promise<boolean> => {
    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        return img.width === dimensions.width && img.height === dimensions.height;
    } catch (error) {
        console.error(error);
        return false;
    }
};

//General
export const expressionRequiredValidator: (value: any) => boolean = (value: any) => {
    if (typeof value === "string") {
        return value !== "";
    } else if (typeof value === "number") {
        return value !== 0;
    } else if (value instanceof File) {
        return value !== null && value !== undefined;
    } else if (value instanceof Date) {
        return value !== null;
    } else if (Array.isArray(value)) {
        return value.length > 0;
    }
    return false;
};

//String
export const expressionMinLengthValidator: (value: string, minLength: number) => boolean = (value: string, minLength: number) => typeof value === 'string' && value.length >= minLength;
export const expressionMaxLengthValidator: (value: string, maxLength: number) => boolean = (value: string, maxLength: number) => typeof value === 'string' && value.length <= maxLength;
export const expressionDigitsOnlyValidator: (value: string) => boolean = (value: string) => EXPRESSION_REGULAR_ONLY_NUMBERS_STRING.test(value);
export const expressionEmailValidator: (value: string) => boolean = (value: string) => EXPRESSION_EMAIL.test(value);
export const expressionUrlValidator: (value: string) => boolean = (value: string) => EXPRESSION_URL.test(value);
export const expressionAlpha: (value: string) => boolean = (value: string) => EXPRESSION_ALPHA.test(value);
export const expressionAlphaNumeric: (value: string) => boolean = (value: string) => EXPRESSION_ALPHA_NUMERIC.test(value);
export const expressionLowerCase: (value: string) => boolean = (value: string) => EXPRESSION_LOWER_CASE.test(value);
export const expressionUpperCase: (value: string) => boolean = (value: string) => EXPRESSION_UPPER_CASE.test(value);
export const expressionExactLength: (value: string, exactLength: number) => boolean = (value: string, exactLength: number) => value.length !== exactLength;

//Dates
export const expressionDateFormatValidator: (value: string, format: DateFormat) => boolean = (value: string, format: DateFormat) => DateFormatExpressions[format].test(value.toString());



// INITIALIZERS
