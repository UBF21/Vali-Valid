# Getting started

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

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

const {
  form,
  errors,
  isValid,
  isValidating,
  handleChange,
  validate,
  reset,
} = useValiValid<RegisterForm>({
  initial: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  validations: [
    {
      field: 'name',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.MinLength, value: 2 },
        { type: ValidationType.MaxLength, value: 50 },
        { type: ValidationType.Alpha },
      ],
    },
    {
      field: 'email',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.Email },
      ],
    },
    {
      field: 'password',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.PasswordStrength },
      ],
    },
    {
      field: 'confirmPassword',
      validations: [
        { type: ValidationType.Required },
        {
          type: ValidationType.MatchField,
          field: 'password',
          message: 'Passwords do not match.',
        },
      ],
    },
  ],
});
```

### 3. Wire up the form

```tsx
export function RegisterForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await validate();
    if (Object.values(errors).every((e) => !e)) {
      console.log('Submit:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name}</span>}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password}</span>}

      <input
        type="password"
        value={form.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        placeholder="Confirm password"
      />
      {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

      <button type="submit" disabled={!isValid || isValidating}>
        {isValidating ? 'Validating…' : 'Register'}
      </button>
    </form>
  );
}
```

---

## Numeric fields

Use `isNumber` or `isDecimal` to auto-sanitize numeric inputs:

```tsx
{
  field: 'age',
  isNumber: true,   // strips non-numeric chars, converts to integer Number
  validations: [
    { type: ValidationType.Required },
    { type: ValidationType.NumberRange, value: [1, 120] },
  ],
}
```

```tsx
{
  field: 'price',
  isDecimal: true,  // converts directly to decimal Number
  validations: [
    { type: ValidationType.Required },
    { type: ValidationType.NumberPositive },
  ],
}
```

---

## File upload

```tsx
import { useValiValid, ValidationType, TypeFile, FileSize } from 'vali-valid';

type UploadForm = { avatar: File | null };

const { form, errors, handleChange } = useValiValid<UploadForm>({
  initial: { avatar: null },
  validations: [
    {
      field: 'avatar',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.FileType, value: [TypeFile.JPG, TypeFile.PNG] },
        { type: ValidationType.FileSize, value: FileSize['2MB'] },
        {
          type: ValidationType.ImageMinDimensions,
          value: { width: 200, height: 200 },
          message: 'Avatar must be at least 200×200 px.',
        },
      ],
    },
  ],
});

// In the JSX:
<input
  type="file"
  accept="image/jpeg,image/png"
  onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
/>
{errors.avatar && <span>{errors.avatar}</span>}
```

---

## Next steps

- [All validators →](./validators.md)
- [Async validation →](./async.md)
- [Dynamic rules →](./dynamic.md)
- [Full hook API →](./hook.md)
- [Code examples →](../../examples/)
