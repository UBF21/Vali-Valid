# `useValiValid` — Hook API reference

The primary public API of ValiValid v3. Wraps the `ValiValid` engine in a React hook, managing form state, error state, and the async validation lifecycle.

---

## Signature

```ts
function useValiValid<T extends Record<string, any>>(
  options: UseValiValidOptions<T>
): UseValiValidReturn<T>
```

---

## Options

```ts
interface UseValiValidOptions<T> {
  initial: T;
  validations?: FieldValidationConfig<T>[];
  validateOnSubmit?: boolean;   // Only validate after first handleSubmit call
  debounceMs?: number;          // Debounce async validation (milliseconds)
  // v3.1.0 additions:
  validateOnMount?: boolean;    // Run full validation when component mounts
  asyncTimeout?: number;        // ms timeout per async rule (0 = no timeout, default)
  criteriaMode?: 'firstError' | 'all';  // Stop at first error or collect all
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `initial` | `T` | Yes | Initial values for all form fields |
| `validations` | `FieldValidationConfig<T>[]` | No | Validation rules per field |
| `validateOnSubmit` | `boolean` | No | When `true`, inline validation is suppressed until after the first submit attempt. Fields validate as normal after the first `handleSubmit` call. |
| `debounceMs` | `number` | No | Milliseconds to wait before running async validators after a change. Prevents a request-per-keystroke. Default: `0`. |
| `validateOnMount` | `boolean` | No | When `true`, validates all fields immediately after the component mounts. Useful for pre-filled forms that should show errors right away. Default: `false`. |
| `asyncTimeout` | `number` | No | Timeout in milliseconds applied to each individual async rule. If a rule does not resolve within this time it is treated as passing (no error). `0` means no timeout (default). |
| `criteriaMode` | `'firstError' \| 'all'` | No | Controls how many errors are collected per field. `'all'` (default) returns every failing rule message. `'firstError'` stops after the first failure and returns a single-element array. |

### `FieldValidationConfig<T>`

```ts
type FieldValidationConfig<T> = {
  field: keyof T;
  validations: ValidationsConfig[];
  isNumber?: boolean;   // Strip non-numeric chars → integer Number
  isDecimal?: boolean;  // Convert directly → decimal Number
  // v3 additions:
  transform?: (value: any) => any;  // Transform value before validation runs
  watchFields?: string[];           // Re-validate this field when any of these fields change
};
```

---

## Return value

```ts
interface UseValiValidReturn<T> {
  // State
  form: T;
  errors: FormErrors<T>;           // v3: string[] | null per field
  isValid: boolean;
  isValidating: boolean;
  // v3 additions:
  isSubmitted: boolean;            // true after the first handleSubmit call
  submitCount: number;             // total number of submit attempts

  // Actions
  handleChange: (field: keyof T, value: any) => void;
  validate: () => Promise<FormErrors<T>>;
  reset: (initial?: Partial<T>) => void;
  // v3 additions:
  handleSubmit: (onSubmit: (data: T) => Promise<void>) => () => Promise<void>;
  setServerErrors: (errors: Partial<FormErrors<T>>) => void;
  setValues: (values: Partial<T>) => void;
  // v3.1.0 additions:
  trigger: (field?: keyof T) => Promise<void>;
  clearErrors: (field?: keyof T) => void;

  // Dynamic rule management
  addFieldValidation: (field: keyof T, validations: ValidationsConfig[]) => void;
  removeFieldValidation: (field: keyof T, type: ValidationType) => void;
  setFieldValidations: (field: keyof T, validations: ValidationsConfig[]) => void;
  clearFieldValidations: (field: keyof T) => void;
}
```

---

## State properties

### `form: T`

Current values of all form fields. Updated on every `handleChange` call.

```tsx
<input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
```

### `errors: FormErrors<T>`

```ts
// v3
type FormErrors<T> = { [key in keyof T]?: string[] | null };
```

| Value | Meaning |
|-------|---------|
| `string[]` | One or more validation messages — display each one |
| `null` | Field validated and passed |
| `undefined` | Field not yet validated |

```tsx
{/* All errors */}
{errors.email?.map((msg, i) => <p key={i} className="error">{msg}</p>)}

{/* First error only (v2 migration style) */}
{errors.email?.[0] && <p className="error">{errors.email[0]}</p>}
```

### `isValid: boolean`

`true` when every value in `errors` is `null` or `undefined`. Computed each render — no extra state.

> **Tip:** Use `isValid` to disable the submit button, but always call `validate()` on submit to catch untouched fields.

### `isValidating: boolean`

`true` while any async validation rule is running. Use it to show a spinner or disable the submit button.

```tsx
<button disabled={!isValid || isValidating}>
  {isValidating ? 'Checking…' : 'Submit'}
</button>
```

### `isSubmitted: boolean` _(v3)_

`false` on initial render, becomes `true` after the first `handleSubmit` call regardless of whether the form was valid. Combined with `validateOnSubmit`, this lets you suppress error messages until the user attempts to submit.

```tsx
{isSubmitted && errors.email?.map((msg, i) => <p key={i}>{msg}</p>)}
```

### `submitCount: number` _(v3)_

Increments by 1 on every `handleSubmit` call (including failed submissions). Useful for analytics or showing a "you have tried N times" message.

```tsx
{submitCount > 3 && <p>Having trouble? <a href="/help">Contact support</a></p>}
```

---

## Actions

### `handleChange(field, value)`

The main change handler. Call it from any `onChange` event.

**What it does:**
1. Sanitizes the value (`isNumber` / `isDecimal`)
2. Updates `form` state
3. Runs sync validation immediately → updates `errors`
4. If the field has async rules: sets `isValidating = true`, runs async validation, updates `errors`, resets `isValidating`

```tsx
<input
  value={form.username}
  onChange={(e) => handleChange('username', e.target.value)}
/>

// Checkbox:
<input type="checkbox" onChange={(e) => handleChange('agree', e.target.checked)} />

// Select:
<select onChange={(e) => handleChange('country', e.target.value)} />

// File input:
<input type="file" onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)} />
```

---

### `validate(): Promise<FormErrors<T>>`

Validates the entire form (sync + async). Call this on submit to catch fields the user never touched.

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const errors = await validate();
  if (!Object.values(errors).some(Boolean)) {
    await submitForm(form);
  }
};
```

Returns `FormErrors<T>` and also updates `errors` state automatically.

---

### `reset(initial?)`

Resets form and errors. Pass a partial object to override specific fields.

```tsx
reset();                                      // full reset to original initial
reset({ email: 'prefilled@example.com' });   // reset with new defaults
```

---

### `handleSubmit(onSubmit)` _(v3)_

Returns an event handler that:
1. Calls `validate()` to run all rules (sync and async).
2. If valid, calls your `onSubmit` callback with the current form data.
3. Increments `submitCount` and sets `isSubmitted = true` on every call.

```tsx
const onSubmit = handleSubmit(async (data) => {
  await api.saveUser(data);
  reset();
});

return <form onSubmit={onSubmit}>...</form>;
```

The returned function is stable across re-renders (memoised), so it is safe to pass to `<form onSubmit>` directly.

---

### `setServerErrors(errors)` _(v3)_

Injects server-side validation errors into the `errors` state. Each value must be a `string[]` matching the `FormErrors<T>` shape.

```tsx
const onSubmit = handleSubmit(async (data) => {
  try {
    await api.register(data);
  } catch (err) {
    if (err.status === 422) {
      setServerErrors({
        email: ['This email is already registered.'],
        username: ['Username is taken.'],
      });
    }
  }
});
```

---

### `setValues(values)` _(v3)_

Sets multiple form fields at once without triggering per-field validation. Useful for pre-filling a form after an async fetch.

```tsx
useEffect(() => {
  api.getUser(id).then((user) => {
    setValues({ name: user.name, email: user.email });
  });
}, [id]);
```

---

### `trigger(field?)` _(v3.1.0)_

Manually triggers validation without a change event. When called with a `field` argument, validates only that field. When called with no argument, validates the entire form (equivalent to `validate()`).

```tsx
// Validate a single field programmatically
await trigger('email');

// Validate the whole form
await trigger();

// Example: validate on blur
<input
  onBlur={() => trigger('email')}
  value={form.email}
  onChange={(e) => handleChange('email', e.target.value)}
/>
```

---

### `clearErrors(field?)` _(v3.1.0)_

Clears error messages from the `errors` state. When called with a `field` argument, clears only that field's errors. When called with no argument, clears all errors.

```tsx
// Clear a single field's errors
clearErrors('email');

// Clear all errors (e.g. when closing a form modal)
clearErrors();
```

---

## Dynamic rule management

See [dynamic.md](./dynamic.md) for full examples.

### `addFieldValidation(field, validations)`

Adds new rules to a field without removing existing ones.

### `removeFieldValidation(field, type)`

Removes all rules of a specific `ValidationType` from a field.

### `setFieldValidations(field, validations)`

Replaces **all** rules for a field.

### `clearFieldValidations(field)`

Removes all validation rules from a field.
