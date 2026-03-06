"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSize = exports.DateFormatExpressions = exports.DateFormat = exports.TypeFile = void 0;
var TypeFile;
(function (TypeFile) {
    TypeFile["JPG"] = "image/jpeg";
    TypeFile["PNG"] = "image/png";
    TypeFile["PDF"] = "application/pdf";
    TypeFile["DOCX"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    TypeFile["XLSX"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    TypeFile["MP3"] = "audio/mpeg";
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
    [DateFormat['YYYY-MM-DD']]: /^\d{4}-\d{2}-\d{2}$/,
    [DateFormat['DD-MM-YYYY']]: /^\d{2}-\d{2}-\d{4}$/,
    [DateFormat['YYYY/MM/DD']]: /^\d{4}\/\d{2}\/\d{2}$/,
    [DateFormat['DD/MM/YYYY']]: /^\d{2}\/\d{2}\/\d{4}$/,
};
var FileSize;
(function (FileSize) {
    FileSize[FileSize["100KB"] = 102400] = "100KB";
    FileSize[FileSize["150KB"] = 153600] = "150KB";
    FileSize[FileSize["200KB"] = 204800] = "200KB";
    FileSize[FileSize["250KB"] = 256000] = "250KB";
    FileSize[FileSize["300KB"] = 307200] = "300KB";
    FileSize[FileSize["350KB"] = 358400] = "350KB";
    FileSize[FileSize["400KB"] = 409600] = "400KB";
    FileSize[FileSize["450KB"] = 460800] = "450KB";
    FileSize[FileSize["500KB"] = 512000] = "500KB";
    FileSize[FileSize["550KB"] = 563200] = "550KB";
    FileSize[FileSize["600KB"] = 614400] = "600KB";
    FileSize[FileSize["650KB"] = 665600] = "650KB";
    FileSize[FileSize["700KB"] = 716800] = "700KB";
    FileSize[FileSize["750KB"] = 768000] = "750KB";
    FileSize[FileSize["800KB"] = 819200] = "800KB";
    FileSize[FileSize["850KB"] = 870400] = "850KB";
    FileSize[FileSize["900KB"] = 921600] = "900KB";
    FileSize[FileSize["950KB"] = 972800] = "950KB";
    FileSize[FileSize["1MB"] = 1048576] = "1MB";
    FileSize[FileSize["2MB"] = 2097152] = "2MB";
    FileSize[FileSize["3MB"] = 3145728] = "3MB";
    FileSize[FileSize["4MB"] = 4194304] = "4MB";
    FileSize[FileSize["5MB"] = 5242880] = "5MB";
    FileSize[FileSize["6MB"] = 6291456] = "6MB";
    FileSize[FileSize["7MB"] = 7340032] = "7MB";
    FileSize[FileSize["8MB"] = 8388608] = "8MB";
    FileSize[FileSize["9MB"] = 9437184] = "9MB";
    FileSize[FileSize["10MB"] = 10485760] = "10MB";
    FileSize[FileSize["15MB"] = 15728640] = "15MB";
    FileSize[FileSize["20MB"] = 20971520] = "20MB";
    FileSize[FileSize["25MB"] = 26214400] = "25MB";
    FileSize[FileSize["30MB"] = 31457280] = "30MB";
    FileSize[FileSize["35MB"] = 36700160] = "35MB";
    FileSize[FileSize["40MB"] = 41943040] = "40MB";
    FileSize[FileSize["45MB"] = 47185920] = "45MB";
    FileSize[FileSize["50MB"] = 52428800] = "50MB";
    FileSize[FileSize["100MB"] = 104857600] = "100MB";
    FileSize[FileSize["150MB"] = 157286400] = "150MB";
    FileSize[FileSize["200MB"] = 209715200] = "200MB";
    FileSize[FileSize["250MB"] = 262144000] = "250MB";
    FileSize[FileSize["300MB"] = 314572800] = "300MB";
    FileSize[FileSize["350MB"] = 367001600] = "350MB";
    FileSize[FileSize["400MB"] = 419430400] = "400MB";
    FileSize[FileSize["450MB"] = 471859200] = "450MB";
    FileSize[FileSize["500MB"] = 524288000] = "500MB";
    FileSize[FileSize["550MB"] = 576716800] = "550MB";
    FileSize[FileSize["600MB"] = 629145600] = "600MB";
    FileSize[FileSize["650MB"] = 681574400] = "650MB";
    FileSize[FileSize["700MB"] = 734003200] = "700MB";
    FileSize[FileSize["750MB"] = 786432000] = "750MB";
    FileSize[FileSize["800MB"] = 838860800] = "800MB";
    FileSize[FileSize["850MB"] = 891289600] = "850MB";
    FileSize[FileSize["900MB"] = 943718400] = "900MB";
    FileSize[FileSize["950MB"] = 996147200] = "950MB";
    FileSize[FileSize["1000MB"] = 1048576000] = "1000MB";
})(FileSize || (exports.FileSize = FileSize = {}));
