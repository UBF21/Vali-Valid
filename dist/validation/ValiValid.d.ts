import { FieldValidationConfig, FormErrors, ValidationsConfig } from '../types/index';
import { ValidationType } from './Validators';
export declare class ValiValid<T extends Record<string, any>> {
    private _syncRules;
    private _asyncRules;
    private _fieldMeta;
    constructor(configs?: FieldValidationConfig<T>[]);
    private addRule;
    private addAsyncRule;
    private addValidation;
    addFieldValidation(field: keyof T, validations: ValidationsConfig[]): void;
    removeFieldValidation(field: keyof T, type: ValidationType): void;
    setFieldValidations(field: keyof T, validations: ValidationsConfig[]): void;
    clearFieldValidations(field: keyof T): void;
    hasAsyncRules(field: keyof T): boolean;
    getFieldValue(field: keyof T, value: any): any;
    validateSync(fields: T): FormErrors<T>;
    validateFieldSync(field: keyof T, value: any): string | null;
    validateAsync(fields: T): Promise<FormErrors<T>>;
    validateFieldAsync(field: keyof T, value: any, form: T): Promise<string | null>;
}
//# sourceMappingURL=ValiValid.d.ts.map