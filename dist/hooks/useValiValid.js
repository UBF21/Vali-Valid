"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValiValid = useValiValid;
const react_1 = require("react");
const ValiValid_1 = require("../validation/ValiValid");
function useValiValid(options) {
    const { initial, validations = [], validateOnBlur = false } = options;
    const engineRef = (0, react_1.useRef)(new ValiValid_1.ValiValid(validations));
    const initialRef = (0, react_1.useRef)(initial);
    const [form, setForm] = (0, react_1.useState)(initial);
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isValidating, setIsValidating] = (0, react_1.useState)(false);
    const [touchedFields, setTouchedFields] = (0, react_1.useState)(new Set());
    const [dirtyFields, setDirtyFields] = (0, react_1.useState)(new Set());
    const formRef = (0, react_1.useRef)(form);
    formRef.current = form;
    const computeIsValid = (errs) => {
        const vals = Object.values(errs);
        if (vals.length === 0)
            return true;
        return vals.every((e) => e === null || e === undefined);
    };
    const isValid = computeIsValid(errors);
    const runFieldValidation = (0, react_1.useCallback)((field, sanitized) => {
        const engine = engineRef.current;
        const syncError = engine.validateFieldSync(field, sanitized);
        setErrors((prev) => (Object.assign(Object.assign({}, prev), { [field]: syncError })));
        if (engine.hasAsyncRules(field)) {
            setIsValidating(true);
            engine.validateFieldAsync(field, sanitized, formRef.current).then((asyncError) => {
                setErrors((prev) => (Object.assign(Object.assign({}, prev), { [field]: asyncError })));
                setIsValidating(false);
            });
        }
    }, []);
    const handleChange = (0, react_1.useCallback)((field, value) => {
        const engine = engineRef.current;
        const sanitized = engine.getFieldValue(field, value);
        setForm((prev) => {
            const next = Object.assign(Object.assign({}, prev), { [field]: sanitized });
            formRef.current = next;
            return next;
        });
        // Track dirty fields
        setDirtyFields((prev) => {
            const next = new Set(prev);
            if (sanitized !== initialRef.current[field]) {
                next.add(field);
            }
            else {
                next.delete(field);
            }
            return next;
        });
        // When validateOnBlur is true, skip validation on change
        if (!validateOnBlur) {
            runFieldValidation(field, sanitized);
        }
    }, [validateOnBlur, runFieldValidation]);
    const handleBlur = (0, react_1.useCallback)((field) => {
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
    const validate = (0, react_1.useCallback)(async () => {
        const engine = engineRef.current;
        setIsValidating(true);
        const allErrors = await engine.validateAsync(formRef.current);
        setErrors(allErrors);
        setIsValidating(false);
        return allErrors;
    }, []);
    const reset = (0, react_1.useCallback)((newInitial) => {
        const next = newInitial ? Object.assign(Object.assign({}, initial), newInitial) : initial;
        setForm(next);
        formRef.current = next;
        setErrors({});
        setIsValidating(false);
        setTouchedFields(new Set());
        setDirtyFields(new Set());
    }, [initial]);
    const addFieldValidation = (0, react_1.useCallback)((field, validationList) => {
        engineRef.current.addFieldValidation(field, validationList);
    }, []);
    const removeFieldValidation = (0, react_1.useCallback)((field, type) => {
        engineRef.current.removeFieldValidation(field, type);
    }, []);
    const setFieldValidations = (0, react_1.useCallback)((field, validationList) => {
        engineRef.current.setFieldValidations(field, validationList);
    }, []);
    const clearFieldValidations = (0, react_1.useCallback)((field) => {
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
