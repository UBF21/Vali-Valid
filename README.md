# vali-valid v3.1.0

> Framework-agnostic TypeScript validation engine

[![npm version](https://img.shields.io/npm/v/vali-valid?color=22d3ee&label=npm)](https://www.npmjs.com/package/vali-valid)
[![license](https://img.shields.io/npm/l/vali-valid?color=22d3ee)](https://github.com/UBF21/Vali-Valid/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-4f46e5)](https://www.typescriptlang.org/)

---

## What's new in v3

| Feature | v2 | v3.1.0 |
|---|---|---|
| Built-in validators | 63 | **74+** |
| Framework support | React only | React, Vue 3, Svelte, Angular |
| Build output | CJS only | **ESM + CJS dual build** |
| i18n locales | en, es | **en, es, pt, fr, de** |
| Rule syntax | Array config only | Array config + **fluent RuleBuilder** |
| Core subpath | — | **`vali-valid/core`** (zero framework deps) |
| Error shape per field | `string \| null` | **`string[] \| null`** (all errors) |

---

## Installation

```bash
npm install vali-valid

# Framework adapters (install the one you need)
npm install vali-valid-react
npm install vali-valid-vue
npm install vali-valid-svelte
npm install vali-valid-angular
```

---

## Two ways to define validations

Both syntaxes are fully supported and can be mixed freely.

### Traditional (array config)

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type LoginForm = { email: string; password: string };

const engine = new ValiValid<LoginForm>([
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
]);
```

### Builder (fluent, new in v3)

```ts
import { ValiValid, rule } from 'vali-valid';

type LoginForm = { email: string; password: string };

const engine = new ValiValid<LoginForm>([
  { field: 'email',    validations: rule().required().email().build() },
  { field: 'password', validations: rule().required().minLength(8).passwordStrength().build() },
]);
```

### Running validation

```ts
// Synchronous
const errors = engine.validateSync({ email: 'bad', password: '123' });
// { email: ['Invalid email address.'], password: ['Minimum 8 characters.', '...'] }

// Asynchronous (required when using AsyncPattern or image dimension validators)
const errors = await engine.validateAsync({ email: 'user@example.com', password: 'Secret1!' });
// { email: null, password: null }

// Single field
const fieldErrors = engine.validateFieldSync('email', 'not-an-email');
// ['Invalid email address.']
```

---

## React quick start

Install the React adapter first: `npm install vali-valid-react`

```tsx
import { rule, useValiValid } from 'vali-valid-react';

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const {
    form,
    errors,
    isValid,
    isValidating,
    handleChange,
    handleSubmit,
    reset,
  } = useValiValid<RegisterForm>({
    initial: { email: '', password: '', confirmPassword: '' },
    validateOnSubmit: true,
    validations: [
      { field: 'email',           validations: rule().required().email().build() },
      { field: 'password',        validations: rule().required().minLength(8).passwordStrength().build() },
      { field: 'confirmPassword', validations: rule().required().matchField('password', 'Passwords do not match.').build() },
    ],
  });

  const onSubmit = handleSubmit(async (data) => {
    await api.register(data);
    reset();
  });

  return (
    <form onSubmit={onSubmit}>
      <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
      {errors.email?.map((msg, i) => <p key={i} className="error">{msg}</p>)}

      <input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
      {errors.password?.map((msg, i) => <p key={i} className="error">{msg}</p>)}

      <input type="password" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
      {errors.confirmPassword?.map((msg, i) => <p key={i} className="error">{msg}</p>)}

      <button type="submit" disabled={!isValid || isValidating}>
        {isValidating ? 'Validating…' : 'Register'}
      </button>
    </form>
  );
}
```

### Hook options (v3.1.0)

```ts
useValiValid<T>({
  initial: T;
  validations?: FieldValidationConfig<T>[];
  validateOnSubmit?: boolean;  // suppress errors until first submit attempt
  debounceMs?: number;         // debounce async validation (ms, default 0)
})
```

### Additional hook methods (v3.1.0)

| Method | Description |
|---|---|
| `trigger(field?)` | Programmatically validate one field or the entire form |
| `clearErrors(field?)` | Clear errors for one field or all fields |
| `setServerErrors(errors)` | Inject server-side validation messages |
| `setValues(values)` | Pre-fill fields without triggering validation |
| `addFieldValidation(field, rules)` | Add rules to a field at runtime |
| `removeFieldValidation(field, type)` | Remove a specific rule type from a field |
| `setFieldValidations(field, rules)` | Replace all rules for a field |
| `clearFieldValidations(field)` | Remove all rules from a field |

---

## Core subpath export

Use `vali-valid/core` to import the engine and builder with zero framework dependencies. Ideal for Vue, Svelte, Angular, or vanilla TypeScript.

```ts
import { ValiValid, rule, setLocale } from 'vali-valid/core';

const engine = new ValiValid([
  { field: 'username', validations: rule().required().minLength(3).alphaNumeric().build() },
]);

const errors = engine.validateFieldSync('username', 'ab!');
// ['Minimum 3 characters.', 'Only alphanumeric characters are allowed.']
```

The `vali-valid/core` entry is available in both ESM and CJS builds.

---

## i18n

```ts
import { setLocale } from 'vali-valid';

setLocale('en'); // English (default)
setLocale('es'); // Spanish
setLocale('pt'); // Portuguese
setLocale('fr'); // French
setLocale('de'); // German
```

All built-in error messages are automatically translated for the active locale. You can also set a per-instance locale to keep SSR safe:

```ts
const engine = new ValiValid(configs, { locale: 'fr' });
```

---

## Error structure (v3 breaking change)

In v3, `FormErrors<T>` returns `string[] | null` per field instead of `string | null`.

```ts
type FormErrors<T> = { [key in keyof T]?: string[] | null };
```

| Value | Meaning |
|---|---|
| `string[]` | One or more validation error messages |
| `null` | Field validated and passed |
| `undefined` | Field not yet validated |

Rendering errors:

```tsx
// All errors (recommended)
{errors.email?.map((msg, i) => <p key={i}>{msg}</p>)}

// First error only (v2 migration style)
{errors.email?.[0] && <p>{errors.email[0]}</p>}
```

---

## 74+ built-in validators

### String
`Required`, `MinLength`, `MaxLength`, `ExactLength`, `Email`, `Url`, `Alpha`, `AlphaNumeric`, `AlphaDash`, `LowerCase`, `UpperCase`, `NoWhitespace`, `NotEmpty`, `Contains`, `StartsWith`, `EndsWith`, `Slug`, `PasswordStrength`, `HexColor`, `IPv4`, `IPv6`, `UUID`, `MACAddress`, `Json`, `Phone`, `CreditCard`, `IBAN`, `PostalCode`, `Pattern`, `Base64`, `DataURI`, `MimeType`, `JWT`, `SemVer`, `NoHTML`

### Numeric
`DigitsOnly`, `NumberRange`, `NumberPositive`, `NumberNegative`, `Integer`, `MultipleOf`, `GreaterThan`, `LessThan`, `GreaterThanOrEqual`, `LessThanOrEqual`, `Precision`, `Finite`, `Port`

### Date & Time
`DateFormat`, `MinDate`, `MaxDate`, `FutureDate`, `PastDate`, `DateAfter`, `DateBefore`, `DateAfterField`, `DateBeforeField`, `DateRange`, `Time`

### File & Image
`FileType`, `FileSize`, `FileDimensions`, `ImageAspectRatio`, `ImageMinDimensions`, `ImageMaxDimensions`

### Array
`ArrayMinLength`, `ArrayMaxLength`, `ArrayExactLength`, `ArrayUnique`, `ArrayContains`, `ArrayItems`

### Cross-field & Conditional
`MatchField`, `NotMatchField`, `RequiredIf`, `RequiredUnless`, `OneOf`, `NotOneOf`, `Latitude`, `Longitude`

### Logic modifiers
`Optional`, `Nullable`, `Bail`, `Not`, `If`, `Or` (fluent `.or([...])`)

### Async
`AsyncPattern` — custom async function, runs after all sync rules pass

---

## Engine options

```ts
new ValiValid(configs, {
  locale: 'en',           // per-instance locale (SSR-safe)
  criteriaMode: 'all',    // 'all' (default) | 'firstError'
  asyncTimeout: 5000,     // per-async-rule timeout in ms (0 = no timeout)
})
```

---

## RuleBuilder reference

```ts
import { rule } from 'vali-valid';

// Basic chain
rule().required().email().build()

// Conditional and cross-field
rule().required().matchField('password').build()
rule().requiredIf('role', 'admin').minLength(10).build()

// OR logic
rule().or([
  rule().email().build(),
  rule().alphaNumeric().minLength(3).build(),
]).build()

// Bail on first failure (stop further checks)
rule().bail().required().minLength(8).build()

// Optional field (skip all rules if empty)
rule().optional().email().build()
```

---

## Documentation

Full API reference and guides: [vali-valid-docs.netlify.app](https://vali-valid-docs.netlify.app/)

- [Getting started](./docs/en/getting-started.md)
- [All validators](./docs/en/validators.md)
- [RuleBuilder](./docs/en/builder.md)
- [Async validation](./docs/en/async.md)
- [Dynamic rules](./docs/en/dynamic.md)
- [i18n](./docs/en/types.md)
- [Engine API](./docs/en/engine.md)
- [Hook API](./docs/en/hook.md)

---

## Framework packages

| Framework | Package | Status |
|---|---|---|
| React | `vali-valid-react` | Available |
| Vue 3 | `vali-valid-vue` | Available |
| Svelte | `vali-valid-svelte` | Available |
| Angular | `vali-valid-angular` | Available |

---

## Author

**Felipe Rafael Montenegro Morriberon**
[https://fm-portafolio.netlify.app/](https://fm-portafolio.netlify.app/)

## License

MIT — [UBF21/Vali-Valid](https://github.com/UBF21/Vali-Valid)
