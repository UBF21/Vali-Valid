import { BuilderValidationConfig, FormErrors, SetState } from "../types/FormTypes";
export declare class ValiValid<T> {
    private _rules;
    private _AllfieldValidationConfig;
    private _isFormValid;
    constructor(setFormValid: (isValid: boolean) => void, builderValidations?: BuilderValidationConfig<T>);
    private addRule;
    private addValidation;
    validate(fields: T): FormErrors<T>;
    validateField(field: keyof T, value: any): string | null;
    private getFieldValue;
    handleChange(name: keyof T, value: any, setForm: SetState<T>, setErrors: SetState<FormErrors<T>>): void;
}
//# sourceMappingURL=ValidationManager.d.ts.map