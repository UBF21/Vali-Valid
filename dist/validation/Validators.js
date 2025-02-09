"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationType = void 0;
/**
 * @name ValidationType
 * @enum { string }
 * @description Lista de tipos de validaciones predeterminadas de ValiValid
 * */
var ValidationType;
(function (ValidationType) {
    /** Campo Obligatorio. */
    ValidationType["Required"] = "Required";
    /** Longitud mínima permitida. */
    ValidationType["MinLength"] = "MinLength";
    /** Longitud máxima permitida. */
    ValidationType["MaxLength"] = "MaxLength";
    /** Solo dígitos permitidos. */
    ValidationType["DigitsOnly"] = "DigitsOnly";
    /** Rango de números permitido. */
    ValidationType["NumberRange"] = "NumberRange";
    /** Formato de email. */
    ValidationType["Email"] = "Email";
    /** URL */
    ValidationType["Url"] = "Url";
    /** Extensión de archivo */
    ValidationType["FileType"] = "FileType";
    /** tamaño de archivo */
    ValidationType["FileSize"] = "FileSize";
    /** Dimensiones de archivo*/
    ValidationType["FileDimensions"] = "FileDimensions";
    /** Patrón Personalizado */
    ValidationType["Pattern"] = "Pattern";
    /** Formato Fecha */
    ValidationType["DateFormat"] = "DateFormat";
    /** Números Positivos */
    ValidationType["NumberPositive"] = "NumberPositive";
    /**Números Negativos */
    ValidationType["NumberNegative"] = "NumberNegative";
    /** Letras */
    ValidationType["Alpha"] = "Alpha";
    /** Letras y Números */
    ValidationType["AlphaNumeric"] = "AlphaNumeric";
    /** Letras Minúsculas */
    ValidationType["LowerCase"] = "LowerCase";
    /** Letras Mayusculas */
    ValidationType["UpperCase"] = "UpperCase";
})(ValidationType || (exports.ValidationType = ValidationType = {}));
