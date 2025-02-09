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
export declare enum TypeFile {
    /**
    * Tipo de archivo JPEG.
    * @type {string}
    * @value 'image/jpeg'
    */
    JPG = "image/jpeg",
    /**
     * Tipo de archivo PNG.
     * @type {string}
     * @value 'image/png'
     */
    PNG = "image/png",
    /**
     * Tipo de archivo PDF.
     * @type {string}
     * @value 'application/pdf'
     */
    PDF = "application/pdf",
    /**
     * Tipo de archivo DOCX (documento de Word).
     * @type {string}
     * @value 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
     */
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    /**
     * Tipo de archivo XLSX (hoja de cálculo de Excel).
     * @type {string}
     * @value 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
     */
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    /**
     * Tipo de archivo MP3 (audio).
     * @type {string}
     * @value 'audio/mpeg'
     */
    MP3 = "audio/mpeg",
    /**
     * Tipo de archivo MP4 (video).
     * @type {string}
     * @value 'video/mp4'
     */
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
/**
 * Enum para representar diferentes tamaños de archivo en bytes.
 * Cada valor es calculado en función de kilobytes (KB) o megabytes (MB).
 * @enum {number}
 */
export declare enum FileSize {
    /** 100 Kilobytes */
    "100KB" = 102400,
    /** 150 Kilobytes */
    "150KB" = 153600,
    /** 200 Kilobytes */
    "200KB" = 204800,
    /** 250 Kilobytes */
    "250KB" = 256000,
    /** 300 Kilobytes */
    "300KB" = 307200,
    /** 350 Kilobytes */
    "350KB" = 358400,
    /** 400 Kilobytes */
    "400KB" = 409600,
    /** 450 Kilobytes */
    "450KB" = 460800,
    /** 500 Kilobytes */
    "500KB" = 512000,
    /** 550 Kilobytes */
    "550KB" = 563200,
    /** 600 Kilobytes */
    "600KB" = 614400,
    /** 650 Kilobytes */
    "650KB" = 665600,
    /** 700 Kilobytes */
    "700KB" = 716800,
    /** 750 Kilobytes */
    "750KB" = 768000,
    /** 800 Kilobytes */
    "800KB" = 819200,
    /** 850 Kilobytes */
    "850KB" = 870400,
    /** 900 Kilobytes */
    "900KB" = 921600,
    /** 950 Kilobytes */
    "950KB" = 972800,
    /** 1 Megabyte */
    "1MB" = 1048576,
    /** 2 Megabytes */
    "2MB" = 2097152,
    /** 3 Megabytes */
    "3MB" = 3145728,
    /** 4 Megabytes */
    "4MB" = 4194304,
    /** 5 Megabytes */
    "5MB" = 5242880,
    /** 6 Megabytes */
    "6MB" = 6291456,
    /** 7 Megabytes */
    "7MB" = 7340032,
    /** 8 Megabytes */
    "8MB" = 8388608,
    /** 9 Megabytes */
    "9MB" = 9437184,
    /** 10 Megabytes */
    "10MB" = 10485760,
    /** 15 Megabytes */
    "15MB" = 15728640,
    /** 20 Megabytes */
    "20MB" = 20971520,
    /** 25 Megabytes */
    "25MB" = 26214400,
    /** 30 Megabytes */
    "30MB" = 31457280,
    /** 35 Megabytes */
    "35MB" = 36700160,
    /** 40 Megabytes */
    "40MB" = 41943040,
    /** 45 Megabytes */
    "45MB" = 47185920,
    /** 50 Megabytes */
    "50MB" = 52428800,
    /** 100 Megabytes */
    "100MB" = 104857600,
    /** 150 Megabytes */
    "150MB" = 157286400,
    /** 200 Megabytes */
    "200MB" = 209715200,
    /** 250 Megabytes */
    "250MB" = 262144000,
    /** 300 Megabytes */
    "300MB" = 314572800,
    /** 350 Megabytes */
    "350MB" = 367001600,
    /** 400 Megabytes */
    "400MB" = 419430400,
    /** 450 Megabytes */
    "450MB" = 471859200,
    /** 500 Megabytes */
    "500MB" = 524288000,
    /** 550 Megabytes */
    "550MB" = 576716800,
    /** 600 Megabytes */
    "600MB" = 629145600,
    /** 650 Megabytes */
    "650MB" = 681574400,
    /** 700 Megabytes */
    "700MB" = 734003200,
    /** 750 Megabytes */
    "750MB" = 786432000,
    /** 800 Megabytes */
    "800MB" = 838860800,
    /** 850 Megabytes */
    "850MB" = 891289600,
    /** 900 Megabytes */
    "900MB" = 943718400,
    /** 950 Megabytes */
    "950MB" = 996147200,
    /** 1000 Megabytes (1 Gigabyte) */
    "1000MB" = 1048576000
}
//# sourceMappingURL=FormTypes.d.ts.map