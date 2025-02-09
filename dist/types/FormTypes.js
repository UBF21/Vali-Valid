"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSize = exports.DateFormatExpressions = exports.DateFormat = exports.TypeFile = void 0;
/**
 * Enum para representar diferentes tipos de archivos y sus MIME types correspondientes.
 * @enum {string}
 */
var TypeFile;
(function (TypeFile) {
    /**
    * Tipo de archivo JPEG.
    * @type {string}
    * @value 'image/jpeg'
    */
    TypeFile["JPG"] = "image/jpeg";
    /**
     * Tipo de archivo PNG.
     * @type {string}
     * @value 'image/png'
     */
    TypeFile["PNG"] = "image/png";
    /**
     * Tipo de archivo PDF.
     * @type {string}
     * @value 'application/pdf'
     */
    TypeFile["PDF"] = "application/pdf";
    /**
     * Tipo de archivo DOCX (documento de Word).
     * @type {string}
     * @value 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
     */
    TypeFile["DOCX"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    /**
     * Tipo de archivo XLSX (hoja de cálculo de Excel).
     * @type {string}
     * @value 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
     */
    TypeFile["XLSX"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    /**
     * Tipo de archivo MP3 (audio).
     * @type {string}
     * @value 'audio/mpeg'
     */
    TypeFile["MP3"] = "audio/mpeg";
    /**
     * Tipo de archivo MP4 (video).
     * @type {string}
     * @value 'video/mp4'
     */
    TypeFile["MP4"] = "video/mp4";
})(TypeFile || (exports.TypeFile = TypeFile = {}));
var DateFormat;
(function (DateFormat) {
    DateFormat["YYYY-MM-DD"] = "YYYY-MM-DD";
    DateFormat["DD-MM-YYYY"] = "DD-MM-YYYY";
    DateFormat["YYYY/MM/DD"] = "YYYY/MM/DD";
    DateFormat["DD/MM/YYYY"] = "DD/MM/YYYY";
})(DateFormat || (exports.DateFormat = DateFormat = {}));
exports.DateFormatExpressions = {
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
var FileSize;
(function (FileSize) {
    /** 100 Kilobytes */
    FileSize[FileSize["100KB"] = 102400] = "100KB";
    /** 150 Kilobytes */
    FileSize[FileSize["150KB"] = 153600] = "150KB";
    /** 200 Kilobytes */
    FileSize[FileSize["200KB"] = 204800] = "200KB";
    /** 250 Kilobytes */
    FileSize[FileSize["250KB"] = 256000] = "250KB";
    /** 300 Kilobytes */
    FileSize[FileSize["300KB"] = 307200] = "300KB";
    /** 350 Kilobytes */
    FileSize[FileSize["350KB"] = 358400] = "350KB";
    /** 400 Kilobytes */
    FileSize[FileSize["400KB"] = 409600] = "400KB";
    /** 450 Kilobytes */
    FileSize[FileSize["450KB"] = 460800] = "450KB";
    /** 500 Kilobytes */
    FileSize[FileSize["500KB"] = 512000] = "500KB";
    /** 550 Kilobytes */
    FileSize[FileSize["550KB"] = 563200] = "550KB";
    /** 600 Kilobytes */
    FileSize[FileSize["600KB"] = 614400] = "600KB";
    /** 650 Kilobytes */
    FileSize[FileSize["650KB"] = 665600] = "650KB";
    /** 700 Kilobytes */
    FileSize[FileSize["700KB"] = 716800] = "700KB";
    /** 750 Kilobytes */
    FileSize[FileSize["750KB"] = 768000] = "750KB";
    /** 800 Kilobytes */
    FileSize[FileSize["800KB"] = 819200] = "800KB";
    /** 850 Kilobytes */
    FileSize[FileSize["850KB"] = 870400] = "850KB";
    /** 900 Kilobytes */
    FileSize[FileSize["900KB"] = 921600] = "900KB";
    /** 950 Kilobytes */
    FileSize[FileSize["950KB"] = 972800] = "950KB";
    /** 1 Megabyte */
    FileSize[FileSize["1MB"] = 1048576] = "1MB";
    /** 2 Megabytes */
    FileSize[FileSize["2MB"] = 2097152] = "2MB";
    /** 3 Megabytes */
    FileSize[FileSize["3MB"] = 3145728] = "3MB";
    /** 4 Megabytes */
    FileSize[FileSize["4MB"] = 4194304] = "4MB";
    /** 5 Megabytes */
    FileSize[FileSize["5MB"] = 5242880] = "5MB";
    /** 6 Megabytes */
    FileSize[FileSize["6MB"] = 6291456] = "6MB";
    /** 7 Megabytes */
    FileSize[FileSize["7MB"] = 7340032] = "7MB";
    /** 8 Megabytes */
    FileSize[FileSize["8MB"] = 8388608] = "8MB";
    /** 9 Megabytes */
    FileSize[FileSize["9MB"] = 9437184] = "9MB";
    /** 10 Megabytes */
    FileSize[FileSize["10MB"] = 10485760] = "10MB";
    /** 15 Megabytes */
    FileSize[FileSize["15MB"] = 15728640] = "15MB";
    /** 20 Megabytes */
    FileSize[FileSize["20MB"] = 20971520] = "20MB";
    /** 25 Megabytes */
    FileSize[FileSize["25MB"] = 26214400] = "25MB";
    /** 30 Megabytes */
    FileSize[FileSize["30MB"] = 31457280] = "30MB";
    /** 35 Megabytes */
    FileSize[FileSize["35MB"] = 36700160] = "35MB";
    /** 40 Megabytes */
    FileSize[FileSize["40MB"] = 41943040] = "40MB";
    /** 45 Megabytes */
    FileSize[FileSize["45MB"] = 47185920] = "45MB";
    /** 50 Megabytes */
    FileSize[FileSize["50MB"] = 52428800] = "50MB";
    /** 100 Megabytes */
    FileSize[FileSize["100MB"] = 104857600] = "100MB";
    /** 150 Megabytes */
    FileSize[FileSize["150MB"] = 157286400] = "150MB";
    /** 200 Megabytes */
    FileSize[FileSize["200MB"] = 209715200] = "200MB";
    /** 250 Megabytes */
    FileSize[FileSize["250MB"] = 262144000] = "250MB";
    /** 300 Megabytes */
    FileSize[FileSize["300MB"] = 314572800] = "300MB";
    /** 350 Megabytes */
    FileSize[FileSize["350MB"] = 367001600] = "350MB";
    /** 400 Megabytes */
    FileSize[FileSize["400MB"] = 419430400] = "400MB";
    /** 450 Megabytes */
    FileSize[FileSize["450MB"] = 471859200] = "450MB";
    /** 500 Megabytes */
    FileSize[FileSize["500MB"] = 524288000] = "500MB";
    /** 550 Megabytes */
    FileSize[FileSize["550MB"] = 576716800] = "550MB";
    /** 600 Megabytes */
    FileSize[FileSize["600MB"] = 629145600] = "600MB";
    /** 650 Megabytes */
    FileSize[FileSize["650MB"] = 681574400] = "650MB";
    /** 700 Megabytes */
    FileSize[FileSize["700MB"] = 734003200] = "700MB";
    /** 750 Megabytes */
    FileSize[FileSize["750MB"] = 786432000] = "750MB";
    /** 800 Megabytes */
    FileSize[FileSize["800MB"] = 838860800] = "800MB";
    /** 850 Megabytes */
    FileSize[FileSize["850MB"] = 891289600] = "850MB";
    /** 900 Megabytes */
    FileSize[FileSize["900MB"] = 943718400] = "900MB";
    /** 950 Megabytes */
    FileSize[FileSize["950MB"] = 996147200] = "950MB";
    /** 1000 Megabytes (1 Gigabyte) */
    FileSize[FileSize["1000MB"] = 1048576000] = "1000MB";
})(FileSize || (exports.FileSize = FileSize = {}));
