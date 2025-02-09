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
export type ValidationsConfig =
    | ValidationConfigRequired
    | ValidationConfigMinLength
    | ValidationConfigMaxLength
    | ValidationConfigDigitsOnly
    | ValidationConfigNumberRange
    | ValidationConfigEmail
    | ValidationConfigUrl
    | ValidationConfigFileSize
    | ValidationConfigFileType
    | ValidationConfigFileDimensions
    | ValidationConfigPattern
    | ValidationConfigDateFormat
    | ValidationConfigNumberPositive
    | ValidationConfigNumberNegative
    | ValidationConfigAlpha
    | ValidationConfigAlphaNumeric
    | ValidationConfigLowerCase
    | ValidationConfigUpperCase;

/**
 * @template T
 * @typedef {Object} FieldValidationConfig
 * @property {keyof T} field - El nombre del campo en el objeto `T` que se va a validar.
 * @property {ValidationsConfig[]} validations - Las configuraciones de validación que se aplican al campo.
 * @description Configuración de validación para un campo específico de un objeto `T`.
 */
export type FieldValidationConfig<T> = {
    field?: keyof T;
    validations?: ValidationsConfig[];
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


/**
 * Enum para representar diferentes tipos de archivos y sus MIME types correspondientes.
 * @enum {string}
 */

export enum TypeFile {

    /**
    * Tipo de archivo JPEG.
    * @type {string}
    * @value 'image/jpeg'
    */
    JPG = 'image/jpeg',

    /**
     * Tipo de archivo PNG.
     * @type {string}
     * @value 'image/png'
     */
    PNG = 'image/png',

    /**
     * Tipo de archivo PDF.
     * @type {string}
     * @value 'application/pdf'
     */
    PDF = 'application/pdf',

    /**
     * Tipo de archivo DOCX (documento de Word).
     * @type {string}
     * @value 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
     */
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    /**
     * Tipo de archivo XLSX (hoja de cálculo de Excel).
     * @type {string}
     * @value 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
     */
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    /**
     * Tipo de archivo MP3 (audio).
     * @type {string}
     * @value 'audio/mpeg'
     */
    MP3 = 'audio/mpeg',

    /**
     * Tipo de archivo MP4 (video).
     * @type {string}
     * @value 'video/mp4'
     */
    MP4 = 'video/mp4'
}

export enum DateFormat {
    "YYYY-MM-DD" = 'YYYY-MM-DD',
    "DD-MM-YYYY" = 'DD-MM-YYYY',
    "YYYY/MM/DD" = 'YYYY/MM/DD',
    "DD/MM/YYYY" = 'DD/MM/YYYY',
}

export const DateFormatExpressions = {
    [DateFormat["YYYY-MM-DD"]]: /^\d{4}-\d{2}-\d{2}$/,
    [DateFormat["DD-MM-YYYY"]]: /^\d{2}-\d{2}-\d{4}$/,
    [DateFormat["YYYY/MM/DD"]]: /^\d{4}\/\d{2}\/\d{2}$/,
    [DateFormat["DD/MM/YYYY"]]: /^\d{2}\/\d{2}\/\d{4}$/,
};


/**
 * Enum para representar diferentes tamaños de archivo en bytes.
 * Cada valor es calculado en función de kilobytes (KB) o megabytes (MB).
 * @enum {number}
 */
export enum FileSize {
    /** 100 Kilobytes */
    "100KB" = 100 * 1024,

    /** 150 Kilobytes */
    "150KB" = 150 * 1024,

    /** 200 Kilobytes */
    "200KB" = 200 * 1024,

    /** 250 Kilobytes */
    "250KB" = 250 * 1024,

    /** 300 Kilobytes */
    "300KB" = 300 * 1024,

    /** 350 Kilobytes */
    "350KB" = 350 * 1024,

    /** 400 Kilobytes */
    "400KB" = 400 * 1024,

    /** 450 Kilobytes */
    "450KB" = 450 * 1024,

    /** 500 Kilobytes */
    "500KB" = 500 * 1024,

    /** 550 Kilobytes */
    "550KB" = 550 * 1024,

    /** 600 Kilobytes */
    "600KB" = 600 * 1024,

    /** 650 Kilobytes */
    "650KB" = 650 * 1024,

    /** 700 Kilobytes */
    "700KB" = 700 * 1024,

    /** 750 Kilobytes */
    "750KB" = 750 * 1024,

    /** 800 Kilobytes */
    "800KB" = 800 * 1024,

    /** 850 Kilobytes */
    "850KB" = 850 * 1024,

    /** 900 Kilobytes */
    "900KB" = 900 * 1024,

    /** 950 Kilobytes */
    "950KB" = 950 * 1024,

    /** 1 Megabyte */
    "1MB" = 1 * 1024 * 1024,

    /** 2 Megabytes */
    "2MB" = 2 * 1024 * 1024,

    /** 3 Megabytes */
    "3MB" = 3 * 1024 * 1024,

    /** 4 Megabytes */
    "4MB" = 4 * 1024 * 1024,

    /** 5 Megabytes */
    "5MB" = 5 * 1024 * 1024,

    /** 6 Megabytes */
    "6MB" = 6 * 1024 * 1024,

    /** 7 Megabytes */
    "7MB" = 7 * 1024 * 1024,

    /** 8 Megabytes */
    "8MB" = 8 * 1024 * 1024,

    /** 9 Megabytes */
    "9MB" = 9 * 1024 * 1024,

    /** 10 Megabytes */
    "10MB" = 10 * 1024 * 1024,

    /** 15 Megabytes */
    "15MB" = 15 * 1024 * 1024,

    /** 20 Megabytes */
    "20MB" = 20 * 1024 * 1024,

    /** 25 Megabytes */
    "25MB" = 25 * 1024 * 1024,

    /** 30 Megabytes */
    "30MB" = 30 * 1024 * 1024,

    /** 35 Megabytes */
    "35MB" = 35 * 1024 * 1024,

    /** 40 Megabytes */
    "40MB" = 40 * 1024 * 1024,

    /** 45 Megabytes */
    "45MB" = 45 * 1024 * 1024,

    /** 50 Megabytes */
    "50MB" = 50 * 1024 * 1024,

    /** 100 Megabytes */
    "100MB" = 100 * 1024 * 1024,

    /** 150 Megabytes */
    "150MB" = 150 * 1024 * 1024,

    /** 200 Megabytes */
    "200MB" = 200 * 1024 * 1024,

    /** 250 Megabytes */
    "250MB" = 250 * 1024 * 1024,

    /** 300 Megabytes */
    "300MB" = 300 * 1024 * 1024,

    /** 350 Megabytes */
    "350MB" = 350 * 1024 * 1024,

    /** 400 Megabytes */
    "400MB" = 400 * 1024 * 1024,

    /** 450 Megabytes */
    "450MB" = 450 * 1024 * 1024,

    /** 500 Megabytes */
    "500MB" = 500 * 1024 * 1024,

    /** 550 Megabytes */
    "550MB" = 550 * 1024 * 1024,

    /** 600 Megabytes */
    "600MB" = 600 * 1024 * 1024,

    /** 650 Megabytes */
    "650MB" = 650 * 1024 * 1024,

    /** 700 Megabytes */
    "700MB" = 700 * 1024 * 1024,

    /** 750 Megabytes */
    "750MB" = 750 * 1024 * 1024,

    /** 800 Megabytes */
    "800MB" = 800 * 1024 * 1024,

    /** 850 Megabytes */
    "850MB" = 850 * 1024 * 1024,

    /** 900 Megabytes */
    "900MB" = 900 * 1024 * 1024,

    /** 950 Megabytes */
    "950MB" = 950 * 1024 * 1024,

    /** 1000 Megabytes (1 Gigabyte) */
    "1000MB" = 1000 * 1024 * 1024
}