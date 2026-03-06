# ValiValid

> TypeScript form validation library for React — 63 built-in validators, async support, i18n (en/es), dynamic rule management, and a `useValiValid` hook with `touchedFields`, `dirtyFields`, `handleBlur` and `validateOnBlur`.

[![npm version](https://img.shields.io/npm/v/vali-valid)](https://www.npmjs.com/package/vali-valid)
[![license](https://img.shields.io/npm/l/vali-valid)](https://github.com/UBF21/Vali-Valid/blob/main/LICENSE)

---

## Installation

```bash
npm install vali-valid
```

---

## Quick start

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type LoginForm = { email: string; password: string };

export function LoginForm() {
  const { form, errors, isValid, handleChange, validate, reset } =
    useValiValid<LoginForm>({
      initial: { email: '', password: '' },
      validations: [
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
            { type: ValidationType.MinLength, value: 8 },
          ],
        },
      ],
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = await validate();
    if (!Object.values(errs).some(Boolean)) console.log('Submit:', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <input
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Password"
      />
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <button type="submit" disabled={!isValid}>Sign in</button>
      <button type="button" onClick={() => reset()}>Clear</button>
    </form>
  );
}
```

---

## `useValiValid` hook

```ts
const {
  form,            // current form state
  errors,          // { [field]: string | null }
  isValid,         // true when all errors are null
  isValidating,    // true while async rules run
  touchedFields,   // Set<keyof T> — fields the user has interacted with
  dirtyFields,     // Set<keyof T> — fields that differ from initial value
  handleChange,    // (field, value) => void
  handleBlur,      // (field) => void — marks as touched; validates if validateOnBlur
  validate,        // () => Promise<FormErrors<T>> — validates all fields
  reset,           // (partial?: Partial<T>) => void
  addFieldValidation,     // add rules to a field at runtime
  removeFieldValidation,  // remove a specific rule type from a field
  setFieldValidations,    // replace all rules for a field
  clearFieldValidations,  // remove all rules for a field
} = useValiValid<T>({
  initial,          // T — initial form values
  validations?,     // FieldValidationConfig<T>[]
  validateOnBlur?,  // boolean — if true, skip validation on change; validate on blur instead
});
```

---

## i18n

Messages default to English. Call `setLocale` once at app startup before any component mounts:

```ts
import { setLocale } from 'vali-valid';

setLocale('es'); // 'en' | 'es'
```

```ts
// Auto-detect browser language
import { setLocale } from 'vali-valid';
setLocale(navigator.language.startsWith('es') ? 'es' : 'en');
```

---

## validateOnBlur + touchedFields + dirtyFields

```tsx
const { form, errors, touchedFields, dirtyFields, handleChange, handleBlur } =
  useValiValid<ContactForm>({
    initial: { name: '', email: '' },
    validateOnBlur: true,  // errors appear only after blur
    validations: [...],
  });

// Show error only after user has left the field
const showError = (field: keyof ContactForm) =>
  touchedFields.has(field) ? errors[field] : null;

return (
  <input
    value={form.name}
    onChange={(e) => handleChange('name', e.target.value)}
    onBlur={() => handleBlur('name')}
  />
);
```

---

## All 63 validators

### String (23)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `Required` | — | Field must not be empty |
| `MinLength` | `value: number` | Minimum character count |
| `MaxLength` | `value: number` | Maximum character count |
| `ExactLength` | `value: number` | Exact character count |
| `Email` | — | Valid email format |
| `Url` | — | Valid URL format |
| `Alpha` | — | Letters only |
| `AlphaNumeric` | — | Letters and numbers only |
| `LowerCase` | — | Lowercase only |
| `UpperCase` | — | Uppercase only |
| `NoWhitespace` | — | No spaces allowed |
| `Contains` | `value: string` | Must contain substring |
| `StartsWith` | `value: string` | Must start with prefix |
| `EndsWith` | `value: string` | Must end with suffix |
| `Slug` | — | Lowercase letters, numbers, hyphens |
| `PasswordStrength` | — | Uppercase + lowercase + number + special char |
| `HexColor` | — | Valid hex color (#RGB or #RRGGBB) |
| `IPv4` | — | Valid IPv4 address |
| `UUID` | — | Valid UUID v4 |
| `Json` | — | Valid JSON string |
| `Phone` | — | Valid phone number |
| `CreditCard` | — | Luhn algorithm |
| `Pattern` | `value: (v) => boolean` | Custom validation function |

### Numeric (8)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `DigitsOnly` | — | Only digit characters |
| `NumberRange` | `value: [min, max]` | Value within range |
| `NumberPositive` | — | Value > 0 |
| `NumberNegative` | — | Value < 0 |
| `Integer` | — | No decimal part |
| `MultipleOf` | `value: number` | Divisible by N |
| `GreaterThan` | `value: number` | Value > N |
| `LessThan` | `value: number` | Value < N |
| `Precision` | `value: number` | Max N decimal places |

### Date (6)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `DateFormat` | `format: DateFormat` | Matches date format pattern |
| `MinDate` | `value: string \| Date` | On or after date |
| `MaxDate` | `value: string \| Date` | On or before date |
| `FutureDate` | — | Date must be in the future |
| `PastDate` | — | Date must be in the past |
| `DateAfter` | `value: string \| Date` | Strictly after date |
| `DateBefore` | `value: string \| Date` | Strictly before date |

### File & Image (6)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `FileType` | `value: TypeFile[] \| string[]` | Allowed MIME types |
| `FileSize` | `value: number \| FileSize` | Max file size in bytes |
| `FileDimensions` | `value: { width, height }` | Exact image dimensions (async) |
| `ImageAspectRatio` | `value: { width, height }, tolerance?` | Aspect ratio check (async) |
| `ImageMinDimensions` | `value: { width?, height? }` | Minimum image dimensions (async) |
| `ImageMaxDimensions` | `value: { width?, height? }` | Maximum image dimensions (async) |

### Cross-field (4)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `MatchField` | `field: string` | Must equal another field |
| `NotMatchField` | `field: string` | Must not equal another field |
| `RequiredIf` | `condition: (form) => boolean` | Required when condition is true |
| `RequiredUnless` | `condition: (form) => boolean` | Required unless condition is true |

### Array (4)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `ArrayMinLength` | `value: number` | Array must have at least N elements |
| `ArrayMaxLength` | `value: number` | Array must have at most N elements |
| `ArrayUnique` | — | No duplicate elements |
| `ArrayContains` | `value: any` | Array must contain the value |

### Enum / Set (1)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `OneOf` | `value: any[]` | Must be one of the allowed values |

### Format (2)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `Time` | `format?: '24h' \| '12h'` | Valid time (HH:MM or HH:MM AM/PM) |
| `NoHTML` | — | No HTML tags allowed |

### Geo / Finance / Other (6)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `IBAN` | — | Valid IBAN (mod-97 algorithm) |
| `PostalCode` | `country: string` | Postal code by country (US, CA, UK, DE, FR, ES, IT, AU, NL, BR, MX, AR) |
| `Latitude` | — | Number between -90 and 90 |
| `Longitude` | — | Number between -180 and 180 |
| `SemVer` | — | Semantic version (X.Y.Z) |
| `Base64` | — | Valid Base64 string |

### Async (1)

| ValidationType | Config | Description |
|----------------|--------|-------------|
| `AsyncPattern` | `asyncFn: (value, form) => Promise<boolean>` | Custom async validation |

---

## Dynamic rule management

```ts
const { addFieldValidation, removeFieldValidation, setFieldValidations, clearFieldValidations } =
  useValiValid({ initial, validations });

// Add rules to a field
addFieldValidation('promoCode', [
  { type: ValidationType.Required },
  { type: ValidationType.ExactLength, value: 8 },
]);

// Remove a specific rule type
removeFieldValidation('promoCode', ValidationType.Required);

// Replace all rules for a field
setFieldValidations('username', [
  { type: ValidationType.Required },
  { type: ValidationType.MinLength, value: 6 },
]);

// Remove all rules from a field
clearFieldValidations('promoCode');
```

---

## Standalone engine (no React)

The `ValiValid` class has **zero React dependencies** — use it in Vue, Angular, Svelte, Node.js, or any TypeScript environment.

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type UserDto = { username: string; email: string };

const validator = new ValiValid<UserDto>([
  {
    field: 'username',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 3 },
    ],
  },
  {
    field: 'email',
    validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }],
  },
]);

// Sync
const errors = validator.validateSync({ username: 'j', email: 'bad' });
console.log(errors); // { username: '...', email: '...' }

// Async
const allErrors = await validator.validateAsync({ username: 'john', email: 'john@ok.com' });

// Single field
console.log(validator.validateFieldSync('email', 'bad')); // error message
console.log(validator.validateFieldSync('email', 'ok@ok.com')); // null
```

### Vue 3

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { ValiValid, ValidationType } from 'vali-valid';

type Form = { email: string; password: string };
const form = ref<Form>({ email: '', password: '' });
const errors = ref<Partial<Record<keyof Form, string | null>>>({});

const engine = new ValiValid<Form>([
  { field: 'email', validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }] },
  { field: 'password', validations: [{ type: ValidationType.Required }, { type: ValidationType.MinLength, value: 8 }] },
]);

const isValid = computed(() => !Object.values(errors.value).some(Boolean));

function handleChange(field: keyof Form, value: string) {
  form.value = { ...form.value, [field]: value };
  errors.value = { ...errors.value, [field]: engine.validateFieldSync(field, value) };
}

async function handleSubmit() {
  errors.value = engine.validateSync(form.value);
  if (isValid.value) await submitToApi(form.value);
}
</script>
```

### Angular

```ts
// validation.service.ts
import { Injectable } from '@angular/core';
import { ValiValid, ValidationType } from 'vali-valid';

type LoginForm = { email: string; password: string };

@Injectable({ providedIn: 'root' })
export class LoginValidationService {
  private engine = new ValiValid<LoginForm>([
    { field: 'email', validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }] },
    { field: 'password', validations: [{ type: ValidationType.Required }, { type: ValidationType.MinLength, value: 8 }] },
  ]);

  validateField(field: keyof LoginForm, value: string) {
    return this.engine.validateFieldSync(field, value);
  }

  async validateAll(form: LoginForm) {
    return this.engine.validateAsync(form);
  }
}
```

> Full Vue and Angular examples are in [`docs/en/engine.md`](./docs/en/engine.md).

---

## Number fields

```ts
{
  field: 'price',
  isDecimal: true,   // accepts decimals → stored as Number
  validations: [
    { type: ValidationType.Required },
    { type: ValidationType.NumberPositive },
    { type: ValidationType.Precision, value: 2 },
  ],
}
```

| `isNumber` | `isDecimal` | Behavior |
|------------|-------------|----------|
| `false` / omitted | — | Value treated as string |
| `true` | `false` / omitted | Strips non-numeric chars, stored as integer |
| `true` | `true` | Stored as decimal number |

---

## What's new in v2.1

| Feature | v2.0 | v2.1 |
|---------|------|------|
| Validators | 43 | **63** |
| i18n | — | `setLocale('en' \| 'es')` |
| `validateOnBlur` | — | ✓ |
| `touchedFields` | — | ✓ |
| `dirtyFields` | — | ✓ |
| `handleBlur` | — | ✓ |
| `GreaterThan` / `LessThan` / `Precision` | — | ✓ |
| `DateAfter` / `DateBefore` | — | ✓ |
| `OneOf` | — | ✓ |
| `NotMatchField` / `RequiredUnless` | — | ✓ |
| Array validators | — | ✓ |
| `Time` / `NoHTML` | — | ✓ |
| `IBAN` / `PostalCode` / `Latitude` / `Longitude` | — | ✓ |
| `SemVer` / `Base64` | — | ✓ |

---

## Documentation

Full documentation available in [`docs/`](./docs/):

| Language | Link |
|----------|------|
| English | [docs/en/](./docs/en/) |
| Español | [docs/es/](./docs/es/) |

Includes: getting started, hook API, all validators, async guide, dynamic rules, engine usage, types reference, architecture diagrams, and **examples**.

---

## Author

**Felipe Rafael Montenegro Morriberon**
[https://fm-portafolio.netlify.app/](https://fm-portafolio.netlify.app/)

## License

MIT — [UBF21/Vali-Valid](https://github.com/UBF21/Vali-Valid)
