"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationType = exports.DateFormatExpressions = exports.DateFormat = exports.FileSize = exports.TypeFile = exports.getLocale = exports.setLocale = exports.ValiValid = exports.useValiValid = void 0;
// Hook — primary public API
var useValiValid_1 = require("./hooks/useValiValid");
Object.defineProperty(exports, "useValiValid", { enumerable: true, get: function () { return useValiValid_1.useValiValid; } });
// Engine (for advanced usage)
var ValiValid_1 = require("./validation/ValiValid");
Object.defineProperty(exports, "ValiValid", { enumerable: true, get: function () { return ValiValid_1.ValiValid; } });
// i18n
var index_1 = require("./i18n/index");
Object.defineProperty(exports, "setLocale", { enumerable: true, get: function () { return index_1.setLocale; } });
Object.defineProperty(exports, "getLocale", { enumerable: true, get: function () { return index_1.getLocale; } });
var index_2 = require("./types/index");
Object.defineProperty(exports, "TypeFile", { enumerable: true, get: function () { return index_2.TypeFile; } });
Object.defineProperty(exports, "FileSize", { enumerable: true, get: function () { return index_2.FileSize; } });
Object.defineProperty(exports, "DateFormat", { enumerable: true, get: function () { return index_2.DateFormat; } });
Object.defineProperty(exports, "DateFormatExpressions", { enumerable: true, get: function () { return index_2.DateFormatExpressions; } });
// Validation types & configs
var Validators_1 = require("./validation/Validators");
Object.defineProperty(exports, "ValidationType", { enumerable: true, get: function () { return Validators_1.ValidationType; } });
