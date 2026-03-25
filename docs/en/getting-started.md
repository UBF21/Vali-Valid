# Getting started

> **v3 note:** `FormErrors<T>` now returns `string[] | null` per field (all errors, not just the first). Update any JSX that renders `errors.field` directly — see [Displaying errors](#displaying-errors) below. The hook also exposes a `handleSubmit` helper and a `validateOnSubmit` option.

## Requirements

- React **≥ 16.8** (hooks support)
- TypeScript **≥ 4.0** (recommended)

---

## Installation

```bash
npm install vali-valid
# or
yarn add vali-valid
# or
pnpm add vali-valid
```

---

## Basic example

### 1. Define your form type

```tsx
type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
```

### 2. Set up the hook

> **New in v3:** the fluent `rule()` builder is the recommended syntax. The plain object array works perfectly and is fully supported — both approaches are valid.

```tsx
import { rule, useValiValid } from 'vali-valid';

const {
  form,
  errors,
  isValid,
  isValidating,
  handleChange,
  handleSubmit,
  validate,
  reset,
} = useValiValid<RegisterForm>({
  initial: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  validateOnSubmit: true,  // only validate after the first submit attempt
  validations: [
    {
      field: 'name',
      validations: rule().required().minLength(2).maxLength(50).alpha().build(),
    },
    {
      field: 'email',
      validations: rule().required().email().build(),
    },
    {
      field: 'password',
      validations: rule().required().passwordStrength().build(),
    },
    {
      field: 'confirmPassword',
      validations: rule().required().matchField('password', 'Passwords do not match.').build(),
    },
  ],
});
```

### 3. Wire up the form

In v3, `errors.<field>` is `string[] | null | undefined`. Render the array when it is non-empty.

`handleSubmit` wraps your submit logic, calls `validate()` internally, and only invokes your callback when the form is valid.

```tsx
export function RegisterForm() {
  const onSubmit = handleSubmit(async (data) => {
    console.log('Submit:', data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      {errors.name?.map((msg, i) => <span key={i}>{msg}</span>)}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email?.map((msg, i) => <span key={i}>{msg}</span>)}

      <input
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Password"
      />
      {errors.password?.map((msg, i) => <span key={i}>{msg}</span>)}

      <input
        type="password"
        value={form.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        placeholder="Confirm password"
      />
      {errors.confirmPassword?.map((msg, i) => <span key={i}>{msg}</span>)}

      <button type="submit" disabled={!isValid || isValidating}>
        {isValidating ? 'Validating…' : 'Register'}
      </button>
    </form>
  );
}
```

#### Displaying errors

Because each field now holds **all** of its errors at once, you can display a single message or the full list:

```tsx
// First error only (v2 style)
{errors.email?.[0] && <span>{errors.email[0]}</span>}

// All errors
{errors.email?.map((msg, i) => <p key={i} className="error">{msg}</p>)}
```

---

## Numeric fields

Use `isNumber` or `isDecimal` to auto-sanitize numeric inputs:

```tsx
{
  field: 'age',
  isNumber: true,   // strips non-numeric chars, converts to integer Number
  validations: rule().required().numberRange(1, 120).build(),
}
```

```tsx
{
  field: 'price',
  isDecimal: true,  // converts directly to decimal Number
  validations: rule().required().numberPositive().build(),
}
```

---

## File upload

```tsx
import { rule, useValiValid, TypeFile, FileSize } from 'vali-valid';

type UploadForm = { avatar: File | null };

const { form, errors, handleChange } = useValiValid<UploadForm>({
  initial: { avatar: null },
  validations: [
    {
      field: 'avatar',
      validations: rule()
        .required()
        .fileType([TypeFile.JPG, TypeFile.PNG])
        .fileSize(FileSize['2MB'])
        .imageMinDimensions({ width: 200, height: 200 }, 'Avatar must be at least 200×200 px.')
        .build(),
    },
  ],
});

// In the JSX:
<input
  type="file"
  accept="image/jpeg,image/png"
  onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
/>
{errors.avatar?.map((msg, i) => <span key={i}>{msg}</span>)}
```

---

## Next steps

- [All validators →](./validators.md)
- [Async validation →](./async.md)
- [Dynamic rules →](./dynamic.md)
- [Full hook API →](./hook.md)
- [Code examples →](../../examples/)
