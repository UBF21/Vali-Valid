import { FieldValidationConfig, FormErrors, ValidationsConfig } from '../types/index';
import { ValidationType } from '../validation/Validators';
export interface UseValiValidOptions<T extends Record<string, any>> {
    initial: T;
    validations?: FieldValidationConfig<T>[];
    validateOnBlur?: boolean;
}
export interface UseValiValidReturn<T extends Record<string, any>> {
    form: T;
    errors: FormErrors<T>;
    isValid: boolean;
    isValidating: boolean;
    touchedFields: Set<keyof T>;
    dirtyFields: Set<keyof T>;
    handleChange: (field: keyof T, value: any) => void;
    handleBlur: (field: keyof T) => void;
    validate: () => Promise<FormErrors<T>>;
    reset: (initial?: Partial<T>) => void;
    addFieldValidation: (field: keyof T, validations: ValidationsConfig[]) => void;
    removeFieldValidation: (field: keyof T, type: ValidationType) => void;
    setFieldValidations: (field: keyof T, validations: ValidationsConfig[]) => void;
    clearFieldValidations: (field: keyof T) => void;
}
export declare function useValiValid<T extends Record<string, any>>(options: UseValiValidOptions<T>): UseValiValidReturn<T>;
//# sourceMappingURL=useValiValid.d.ts.map