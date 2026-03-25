/** React setState-compatible setter type. */
export type SetState<T> = (value: T | ((prevState: T) => T)) => void;

/**
 * Options for the ValiValid engine constructor.
 */
export type ValiValidOptions = {
    /** 'all' (default) returns all errors per field; 'firstError' stops at the first. */
    criteriaMode?: 'all' | 'firstError';
    /** Per-instance locale override (e.g. 'en', 'es', 'fr'). Safe for SSR. */
    locale?: string;
    /**
     * Per-async-rule timeout in milliseconds.
     * When > 0, each individual async rule is raced against a timer; if the rule
     * does not resolve within `asyncTimeout` ms it is treated as passing (no error).
     * Default: 0 (no timeout).
     */
    asyncTimeout?: number;
};

export type { ValidationsConfig } from '../validation/Validators';

/**
 * Configuration for a single field's validation rules.
 * @template T - Form data shape
 * @example
 * const config: FieldValidationConfig<MyForm> = {
 *   field: 'email',
 *   validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }],
 * };
 */
export type FieldValidationConfig<T> = {
    field: keyof T;
    validations: import('../validation/Validators').ValidationsConfig[];
    isNumber?: boolean;
    isDecimal?: boolean;
    transform?: (value: any) => any;
    watchFields?: string[];
};

export type BuilderValidationConfig<T> = FieldValidationConfig<T>[];

/**
 * Internal representation of a synchronous validation rule stored in the engine.
 * Created by `ValiValid.addValidation()` — not intended for direct use.
 */
export type SyncRule<T> = {
    type: string;
    field: keyof T;
    message: string | (() => string);
    validate: (value: any, form?: any) => boolean;
};

/**
 * Internal representation of an asynchronous validation rule stored in the engine.
 * Created by `ValiValid.addValidation()` — not intended for direct use.
 */
export type AsyncRule<T> = {
    type: string;
    field: keyof T;
    message: string | (() => string);
    asyncFn: (value: any, form: T) => Promise<boolean>;
};

/**
 * Per-field error state:
 * - `undefined` — field has not been validated yet
 * - `null` — field is valid
 * - `string[]` — field has errors (the array contains error messages)
 *
 * When `criteriaMode: 'firstError'` is set on the engine, each array
 * contains at most 1 element.
 */
export type FormErrors<T> = {
    [key in keyof T]?: string[] | null;
};

export enum TypeFile {
    JPG = 'image/jpeg',
    PNG = 'image/png',
    PDF = 'application/pdf',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    MP3 = 'audio/mpeg',
    MP4 = 'video/mp4',
}

export enum DateFormat {
    'YYYY-MM-DD' = 'YYYY-MM-DD',
    'DD-MM-YYYY' = 'DD-MM-YYYY',
    'YYYY/MM/DD' = 'YYYY/MM/DD',
    'DD/MM/YYYY' = 'DD/MM/YYYY',
}

export const DateFormatExpressions: Record<DateFormat, RegExp> = {
    [DateFormat['YYYY-MM-DD']]: /^\d{4}-\d{2}-\d{2}$/,
    [DateFormat['DD-MM-YYYY']]: /^\d{2}-\d{2}-\d{4}$/,
    [DateFormat['YYYY/MM/DD']]: /^\d{4}\/\d{2}\/\d{2}$/,
    [DateFormat['DD/MM/YYYY']]: /^\d{2}\/\d{2}\/\d{4}$/,
};

export enum FileSize {
    '100KB' = 100 * 1024,
    '150KB' = 150 * 1024,
    '200KB' = 200 * 1024,
    '250KB' = 250 * 1024,
    '300KB' = 300 * 1024,
    '350KB' = 350 * 1024,
    '400KB' = 400 * 1024,
    '450KB' = 450 * 1024,
    '500KB' = 500 * 1024,
    '550KB' = 550 * 1024,
    '600KB' = 600 * 1024,
    '650KB' = 650 * 1024,
    '700KB' = 700 * 1024,
    '750KB' = 750 * 1024,
    '800KB' = 800 * 1024,
    '850KB' = 850 * 1024,
    '900KB' = 900 * 1024,
    '950KB' = 950 * 1024,
    '1MB' = 1 * 1024 * 1024,
    '2MB' = 2 * 1024 * 1024,
    '3MB' = 3 * 1024 * 1024,
    '4MB' = 4 * 1024 * 1024,
    '5MB' = 5 * 1024 * 1024,
    '6MB' = 6 * 1024 * 1024,
    '7MB' = 7 * 1024 * 1024,
    '8MB' = 8 * 1024 * 1024,
    '9MB' = 9 * 1024 * 1024,
    '10MB' = 10 * 1024 * 1024,
    '15MB' = 15 * 1024 * 1024,
    '20MB' = 20 * 1024 * 1024,
    '25MB' = 25 * 1024 * 1024,
    '30MB' = 30 * 1024 * 1024,
    '35MB' = 35 * 1024 * 1024,
    '40MB' = 40 * 1024 * 1024,
    '45MB' = 45 * 1024 * 1024,
    '50MB' = 50 * 1024 * 1024,
    '100MB' = 100 * 1024 * 1024,
    '150MB' = 150 * 1024 * 1024,
    '200MB' = 200 * 1024 * 1024,
    '250MB' = 250 * 1024 * 1024,
    '300MB' = 300 * 1024 * 1024,
    '350MB' = 350 * 1024 * 1024,
    '400MB' = 400 * 1024 * 1024,
    '450MB' = 450 * 1024 * 1024,
    '500MB' = 500 * 1024 * 1024,
    '550MB' = 550 * 1024 * 1024,
    '600MB' = 600 * 1024 * 1024,
    '650MB' = 650 * 1024 * 1024,
    '700MB' = 700 * 1024 * 1024,
    '750MB' = 750 * 1024 * 1024,
    '800MB' = 800 * 1024 * 1024,
    '850MB' = 850 * 1024 * 1024,
    '900MB' = 900 * 1024 * 1024,
    '950MB' = 950 * 1024 * 1024,
    '1000MB' = 1000 * 1024 * 1024,
}
