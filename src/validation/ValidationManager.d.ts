import { BuilderValidationConfig, FieldValidationConfig, FormErrors, SetState } from "../types/FormTypes";
export declare class ValiValid<T> {
    private _rules;
    private _AllfieldValidationConfig;
    private _isFormValid;
    constructor(setFormValid: (isValid: boolean) => void, builderValidations?: BuilderValidationConfig<T>);
    addRule(field: keyof T, message: string, validate: (value: any) => boolean): void;
    addValidation(fieldValidationConfig: FieldValidationConfig<T>): this;
    validate(data: T): FormErrors<T>;
    validateField(field: keyof T, value: any): string | null;
    handleChange(name: keyof T, value: any, setForm: SetState<T>, setErrors: SetState<FormErrors<T>>): void;
}
