import { DateFormat, FileSize, TypeFile } from "../types/FormTypes";
export declare const DEFAULT_ERROR_PATTERN_MESSAGE: string;
export declare const DEFAULT_ERROR_REQUIRED_MESSAGE: string;
export declare const DEFAULT_ERROR_DIGITS_ONLY_MESSAGE: string;
export declare const DEFAULT_ERROR_EMAIL_MESSAGE: string;
export declare const DEFAULT_ERROR_URL_MESSAGE: string;
export declare const DEFAULT_ERROR_FILE_TYPE_MESSAGE: string;
export declare const DEFAULT_ERROR_FILE_SIZE_MESSAGE: string;
export declare const DEFAULT_ERROR_FILE_DIMENSIONS_MESSAGE: string;
export declare const DEFAULT_ERROR_FORMAT_DATE_MESSAGE: string;
export declare const DEFAULT_ERROR_NUMBER_POSITIVE: string;
export declare const DEFAULT_ERROR_NUMBER_NEGATIVE: string;
export declare const DEFAULT_ERROR_ALPHA: string;
export declare const DEFAULT_ERROR_ALPHA_NUMERIC: string;
export declare const DEFAULT_ERROR_LOWER_CASE: string;
export declare const DEFAULT_ERROR_UPPER_CASE: string;
/**
 * Genera un mensaje de error para cuando un campo no cumple con la longitud mínima.
 *
 * @param {number} value - La longitud mínima requerida.
 * @returns {string} Un mensaje de error que indica que el campo debe tener al menos `value` caracteres.
 */
export declare const defaultErrorMinLengthMessage: (value: number) => string;
/**
 * Genera un mensaje de error para cuando un campo excede la longitud máxima permitida.
 *
 * @param {number} value - La longitud máxima permitida.
 * @returns {string} Un mensaje de error que indica que el campo no puede tener más de `value` caracteres.
 */
export declare const defaultErrorMaxLengthMessage: (value: number) => string;
/**
 * Genera un mensaje de error para cuando un valor numérico no está dentro del rango permitido.
 *
 * @param {number} min - El valor mínimo permitido.
 * @param {number} max - El valor máximo permitido.
 * @returns {string} Un mensaje de error que indica que el valor debe estar entre `min` y `max`.
 */
export declare const defaultErrorNumberRangeMessage: (min: number, max: number) => string;
/**
 * Genera un mensaje de error para cuando las dimensiones de un archivo no cumplen con los requisitos.
 *
 * @param {number} width - El ancho permitido del archivo.
 * @param {number} height - La altura permitida del archivo.
 * @returns {string} Un mensaje de error que indica que las dimensiones del archivo son incorrectas.
 */
export declare const defaultErrorFileDimensionsMessage: (width: number, height: number) => string;
export declare const defaultErrorFormatDateMessage: (format: DateFormat) => string;
export declare const EXPRESSION_REGULAR_ONLY_NUMBERS: RegExp;
export declare const EXPRESSION_REGULAR_ONLY_NUMBERS_STRING: RegExp;
export declare const EXPRESSION_REGULAR_DECIMALS: RegExp;
export declare const EXPRESSION_EMAIL: RegExp;
export declare const EXPRESSION_URL: RegExp;
export declare const EXPRESSION_ALPHA: RegExp;
export declare const EXPRESSION_ALPHA_NUMERIC: RegExp;
export declare const EXPRESSION_LOWER_CASE: RegExp;
export declare const EXPRESSION_UPPER_CASE: RegExp;
/**
 * Valida si un número está dentro de un rango específico.
 *
 * @param {number} value - El número a validar.
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @returns {boolean} `true` si el número está dentro del rango, `false` de lo contrario.
 */
export declare const expressionNumberRangeValidator: (value: number, min: number, max: number) => boolean;
export declare const expressionNumberPositive: (value: number) => boolean;
export declare const expressionNumberNegative: (value: number) => boolean;
export declare const expressionFileSizeValidator: (file: File, maxSize: number | FileSize) => boolean;
export declare const expressionFileTypeValidator: (file: File, allowedTypes: TypeFile[] | string[]) => boolean;
export declare const expressionImageDimensionsValidator: (file: File, dimensions: {
    width: number;
    height: number;
}) => boolean;
export declare const expressionRequiredValidator: (value: any) => boolean;
export declare const expressionMinLengthValidator: (value: string, minLength: number) => boolean;
export declare const expressionMaxLengthValidator: (value: string, maxLength: number) => boolean;
export declare const expressionDigitsOnlyValidator: (value: string) => boolean;
export declare const expressionEmailValidator: (value: string) => boolean;
export declare const expressionUrlValidator: (value: string) => boolean;
export declare const expressionAlpha: (value: string) => boolean;
export declare const expressionAlphaNumeric: (value: string) => boolean;
export declare const expressionLowerCase: (value: string) => boolean;
export declare const expressionUpperCase: (value: string) => boolean;
export declare const expressionDateFormatValidator: (value: string, format: DateFormat) => boolean;
//# sourceMappingURL=Constants.d.ts.map