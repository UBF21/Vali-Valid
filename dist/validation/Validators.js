"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationType = void 0;
var ValidationType;
(function (ValidationType) {
    // String
    ValidationType["Required"] = "Required";
    ValidationType["MinLength"] = "MinLength";
    ValidationType["MaxLength"] = "MaxLength";
    ValidationType["ExactLength"] = "ExactLength";
    ValidationType["Email"] = "Email";
    ValidationType["Url"] = "Url";
    ValidationType["Alpha"] = "Alpha";
    ValidationType["AlphaNumeric"] = "AlphaNumeric";
    ValidationType["LowerCase"] = "LowerCase";
    ValidationType["UpperCase"] = "UpperCase";
    ValidationType["NoWhitespace"] = "NoWhitespace";
    ValidationType["Contains"] = "Contains";
    ValidationType["StartsWith"] = "StartsWith";
    ValidationType["EndsWith"] = "EndsWith";
    ValidationType["Slug"] = "Slug";
    ValidationType["PasswordStrength"] = "PasswordStrength";
    ValidationType["HexColor"] = "HexColor";
    ValidationType["IPv4"] = "IPv4";
    ValidationType["UUID"] = "UUID";
    ValidationType["Json"] = "Json";
    ValidationType["Phone"] = "Phone";
    ValidationType["CreditCard"] = "CreditCard";
    ValidationType["Pattern"] = "Pattern";
    // Numeric
    ValidationType["DigitsOnly"] = "DigitsOnly";
    ValidationType["NumberRange"] = "NumberRange";
    ValidationType["NumberPositive"] = "NumberPositive";
    ValidationType["NumberNegative"] = "NumberNegative";
    ValidationType["Integer"] = "Integer";
    ValidationType["MultipleOf"] = "MultipleOf";
    // Date
    ValidationType["DateFormat"] = "DateFormat";
    ValidationType["MinDate"] = "MinDate";
    ValidationType["MaxDate"] = "MaxDate";
    ValidationType["FutureDate"] = "FutureDate";
    ValidationType["PastDate"] = "PastDate";
    // File
    ValidationType["FileType"] = "FileType";
    ValidationType["FileSize"] = "FileSize";
    ValidationType["FileDimensions"] = "FileDimensions";
    ValidationType["ImageAspectRatio"] = "ImageAspectRatio";
    ValidationType["ImageMinDimensions"] = "ImageMinDimensions";
    ValidationType["ImageMaxDimensions"] = "ImageMaxDimensions";
    // Cross-field
    ValidationType["MatchField"] = "MatchField";
    ValidationType["RequiredIf"] = "RequiredIf";
    // Async
    ValidationType["AsyncPattern"] = "AsyncPattern";
    // v2.1 — Numeric
    ValidationType["GreaterThan"] = "GreaterThan";
    ValidationType["LessThan"] = "LessThan";
    ValidationType["Precision"] = "Precision";
    // v2.1 — Date
    ValidationType["DateAfter"] = "DateAfter";
    ValidationType["DateBefore"] = "DateBefore";
    // v2.1 — Enum / set
    ValidationType["OneOf"] = "OneOf";
    // v2.1 — Cross-field
    ValidationType["NotMatchField"] = "NotMatchField";
    ValidationType["RequiredUnless"] = "RequiredUnless";
    // v2.1 — Array
    ValidationType["ArrayMinLength"] = "ArrayMinLength";
    ValidationType["ArrayMaxLength"] = "ArrayMaxLength";
    ValidationType["ArrayUnique"] = "ArrayUnique";
    ValidationType["ArrayContains"] = "ArrayContains";
    // v2.1 — Format
    ValidationType["Time"] = "Time";
    ValidationType["NoHTML"] = "NoHTML";
    // v2.1 — Finance / geo / other
    ValidationType["IBAN"] = "IBAN";
    ValidationType["PostalCode"] = "PostalCode";
    ValidationType["Latitude"] = "Latitude";
    ValidationType["Longitude"] = "Longitude";
    ValidationType["SemVer"] = "SemVer";
    ValidationType["Base64"] = "Base64";
})(ValidationType || (exports.ValidationType = ValidationType = {}));
