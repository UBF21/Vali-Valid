import { useCallback, useRef, useState } from 'react';
import { FieldValidationConfig, FormErrors, ValidationsConfig } from '../types/index';
import { ValidationType } from '../validation/Validators';
import { ValiValid } from '../validation/ValiValid';

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

export function useValiValid<T extends Record<string, any>>(
    options: UseValiValidOptions<T>
): UseValiValidReturn<T> {
    const { initial, validations = [], validateOnBlur = false } = options;

    const engineRef = useRef<ValiValid<T>>(new ValiValid<T>(validations));
    const initialRef = useRef<T>(initial);

    const [form, setForm] = useState<T>(initial);
    const [errors, setErrors] = useState<FormErrors<T>>({});
    const [isValidating, setIsValidating] = useState(false);
    const [touchedFields, setTouchedFields] = useState<Set<keyof T>>(new Set());
    const [dirtyFields, setDirtyFields] = useState<Set<keyof T>>(new Set());

    const formRef = useRef<T>(form);
    formRef.current = form;

    const computeIsValid = (errs: FormErrors<T>): boolean => {
        const vals = Object.values(errs);
        if (vals.length === 0) return true;
        return vals.every((e) => e === null || e === undefined);
    };

    const isValid = computeIsValid(errors);

    const runFieldValidation = useCallback((field: keyof T, sanitized: any) => {
        const engine = engineRef.current;
        const syncError = engine.validateFieldSync(field, sanitized);
        setErrors((prev) => ({ ...prev, [field]: syncError }));

        if (engine.hasAsyncRules(field)) {
            setIsValidating(true);
            engine.validateFieldAsync(field, sanitized, formRef.current).then((asyncError) => {
                setErrors((prev) => ({ ...prev, [field]: asyncError }));
                setIsValidating(false);
            });
        }
    }, []);

    const handleChange = useCallback((field: keyof T, value: any) => {
        const engine = engineRef.current;
        const sanitized = engine.getFieldValue(field, value);

        setForm((prev) => {
            const next = { ...prev, [field]: sanitized };
            formRef.current = next;
            return next;
        });

        // Track dirty fields
        setDirtyFields((prev) => {
            const next = new Set(prev);
            if (sanitized !== initialRef.current[field]) {
                next.add(field);
            } else {
                next.delete(field);
            }
            return next;
        });

        // When validateOnBlur is true, skip validation on change
        if (!validateOnBlur) {
            runFieldValidation(field, sanitized);
        }
    }, [validateOnBlur, runFieldValidation]);

    const handleBlur = useCallback((field: keyof T) => {
        setTouchedFields((prev) => {
            const next = new Set(prev);
            next.add(field);
            return next;
        });

        if (validateOnBlur) {
            const engine = engineRef.current;
            const sanitized = engine.getFieldValue(field, formRef.current[field]);
            runFieldValidation(field, sanitized);
        }
    }, [validateOnBlur, runFieldValidation]);

    const validate = useCallback(async (): Promise<FormErrors<T>> => {
        const engine = engineRef.current;
        setIsValidating(true);
        const allErrors = await engine.validateAsync(formRef.current);
        setErrors(allErrors);
        setIsValidating(false);
        return allErrors;
    }, []);

    const reset = useCallback((newInitial?: Partial<T>) => {
        const next = newInitial ? { ...initial, ...newInitial } : initial;
        setForm(next as T);
        formRef.current = next as T;
        setErrors({});
        setIsValidating(false);
        setTouchedFields(new Set());
        setDirtyFields(new Set());
    }, [initial]);

    const addFieldValidation = useCallback((field: keyof T, validationList: ValidationsConfig[]) => {
        engineRef.current.addFieldValidation(field, validationList);
    }, []);

    const removeFieldValidation = useCallback((field: keyof T, type: ValidationType) => {
        engineRef.current.removeFieldValidation(field, type);
    }, []);

    const setFieldValidations = useCallback((field: keyof T, validationList: ValidationsConfig[]) => {
        engineRef.current.setFieldValidations(field, validationList);
    }, []);

    const clearFieldValidations = useCallback((field: keyof T) => {
        engineRef.current.clearFieldValidations(field);
    }, []);

    return {
        form,
        errors,
        isValid,
        isValidating,
        touchedFields,
        dirtyFields,
        handleChange,
        handleBlur,
        validate,
        reset,
        addFieldValidation,
        removeFieldValidation,
        setFieldValidations,
        clearFieldValidations,
    };
}
