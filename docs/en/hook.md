# `useValiValid` — Hook API reference

The primary public API of ValiValid v2. Wraps the `ValiValid` engine in a React hook, managing form state, error state, and the async validation lifecycle.

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
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `initial` | `T` | Yes | Initial values for all form fields |
| `validations` | `FieldValidationConfig<T>[]` | No | Validation rules per field |

### `FieldValidationConfig<T>`

```ts
type FieldValidationConfig<T> = {
  field: keyof T;
  validations: ValidationsConfig[];
  isNumber?: boolean;   // Strip non-numeric chars → integer Number
  isDecimal?: boolean;  // Convert directly → decimal Number
};
```

---

## Return value

```ts
interface UseValiValidReturn<T> {
  // State
  form: T;
  errors: FormErrors<T>;
  isValid: boolean;
  isValidating: boolean;

  // Actions
  handleChange: (field: keyof T, value: any) => void;
  validate: () => Promise<FormErrors<T>>;
  reset: (initial?: Partial<T>) => void;

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
type FormErrors<T> = { [key in keyof T]?: string | null };
```

| Value | Meaning |
|-------|---------|
| `string` | Validation failed — display this message |
| `null` | Field validated and passed |
| `undefined` | Field not yet validated |

```tsx
{errors.email && <p className="error">{errors.email}</p>}
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
