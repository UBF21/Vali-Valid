import { ValidationConfigDateFormat, ValidationConfigDigitsOnly, ValidationConfigEmail, ValidationConfigFileDimensions, ValidationConfigFileSize, ValidationConfigFileType, ValidationConfigMaxLength, ValidationConfigMinLength, ValidationConfigNumberRange, ValidationConfigPattern, ValidationConfigRequired, ValidationConfigUrl, ValidationConfigNumberNegative, ValidationConfigNumberPositive, ValidationConfigAlpha, ValidationConfigAlphaNumeric, ValidationConfigLowerCase, ValidationConfigUpperCase } from "../validation/Validators";
/**
 * @type
 * @template T
 * @callback SetState
 * @param {T | ((prevState: T) => T)} value - El nuevo valor del estado o una función que recibe el estado anterior y devuelve el nuevo estado.
 * @returns {void}
 * @description Una función que actualiza el estado con un nuevo valor o una función que calcula el nuevo valor basado en el estado anterior.
 */
export type SetState<T> = (value: T | ((prevState: T) => T)) => void;
/**
 *
 * @typedef {ValidationConfigRequired | ValidationConfigMinLength | ValidationConfigMaxLength | ValidationConfigDigitsOnly | ValidationConfigNumberRange | ValidationConfigEmail | ValidationConfigUrl | ValidationConfigFileSize | ValidationConfigFileType | ValidationConfigFileDimensions | ValidationConfigPattern | ValidationConfigDateFormat   | ValidationConfigNumberPositive | ValidationConfigNumberNegative | ValidationConfigAlpha | ValidationConfigAlphaNumeric  | ValidationConfigLowerCase | ValidationConfigUpperCase} ValidationConfig
 * @description Configuración de validación que puede ser de diferentes tipos.
 */
export type ValidationsConfig = ValidationConfigRequired | ValidationConfigMinLength | ValidationConfigMaxLength | ValidationConfigDigitsOnly | ValidationConfigNumberRange | ValidationConfigEmail | ValidationConfigUrl | ValidationConfigFileSize | ValidationConfigFileType | ValidationConfigFileDimensions | ValidationConfigPattern | ValidationConfigDateFormat | ValidationConfigNumberPositive | ValidationConfigNumberNegative | ValidationConfigAlpha | ValidationConfigAlphaNumeric | ValidationConfigLowerCase | ValidationConfigUpperCase;
/**
 * @template T
 * @typedef {Object} FieldValidationConfig
 * @property {keyof T} field - El nombre del campo en el objeto `T` que se va a validar.
 * @property {ValidationsConfig[]} validations - Las configuraciones de validación que se aplican al campo.
 * @description Configuración de validación para un campo específico de un objeto `T`.
 */
export type FieldValidationConfig<T> = {
    field: keyof T;
    validations: ValidationsConfig[];
    isNumber?: boolean;
    isDecimal?: boolean;
};
/**
 * @template T
 * @typedef {Object} FieldValidationConfig
 * @property {FieldValidationConfig<T>[]} -Las configuraciones de las validaciones que se aplican a los campos.
 * @description Configuración de validaciones para loas campos específico de un objeto `T`.
 */
export type BuilderValidationConfig<T> = FieldValidationConfig<T>[];
/**
 * @template T
 * @typedef {Object} ValidationRule
 * @property {keyof T} field - El nombre del campo en el objeto `T` que se va a validar.
 * @property {string} message - El mensaje de error que se mostrará si la validación falla.
 * @property {(value: any) => boolean} validate - Función que valida el valor del campo y devuelve true si es válido, false si no lo es.
 * @description Regla de validación para un campo específico de un objeto `T`.
 */
export type ValidationRule<T> = {
    field: keyof T;
    message: string;
    validate: (value: any) => boolean;
};
/**
 * @template T
 * @typedef {Object.<keyof T, string | null>} FormErrors
 * @description Objeto que contiene errores de validación para cada campo de un formulario representado por un objeto `T`.
 */
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
    "YYYY-MM-DD" = "YYYY-MM-DD",
    "DD-MM-YYYY" = "DD-MM-YYYY",
    "YYYY/MM/DD" = "YYYY/MM/DD",
    "DD/MM/YYYY" = "DD/MM/YYYY"
}
export declare const DateFormatExpressions: {
    "YYYY-MM-DD": RegExp;
    "DD-MM-YYYY": RegExp;
    "YYYY/MM/DD": RegExp;
    "DD/MM/YYYY": RegExp;
};
export declare enum FileSize {
    "100KB" = 102400,
    "150KB" = 153600,
    "200KB" = 204800,
    "250KB" = 256000,
    "300KB" = 307200,
    "350KB" = 358400,
    "400KB" = 409600,
    "450KB" = 460800,
    "500KB" = 512000,
    "550KB" = 563200,
    "600KB" = 614400,
    "650KB" = 665600,
    "700KB" = 716800,
    "750KB" = 768000,
    "800KB" = 819200,
    "850KB" = 870400,
    "900KB" = 921600,
    "950KB" = 972800,
    "1MB" = 1048576,
    "2MB" = 2097152,
    "3MB" = 3145728,
    "4MB" = 4194304,
    "5MB" = 5242880,
    "6MB" = 6291456,
    "7MB" = 7340032,
    "8MB" = 8388608,
    "9MB" = 9437184,
    "10MB" = 10485760,
    "15MB" = 15728640,
    "20MB" = 20971520,
    "25MB" = 26214400,
    "30MB" = 31457280,
    "35MB" = 36700160,
    "40MB" = 41943040,
    "45MB" = 47185920,
    "50MB" = 52428800,
    "100MB" = 104857600,
    "150MB" = 157286400,
    "200MB" = 209715200,
    "250MB" = 262144000,
    "300MB" = 314572800,
    "350MB" = 367001600,
    "400MB" = 419430400,
    "450MB" = 471859200,
    "500MB" = 524288000,
    "550MB" = 576716800,
    "600MB" = 629145600,
    "650MB" = 681574400,
    "700MB" = 734003200,
    "750MB" = 786432000,
    "800MB" = 838860800,
    "850MB" = 891289600,
    "900MB" = 943718400,
    "950MB" = 996147200,
    "1000MB" = 1048576000
}
