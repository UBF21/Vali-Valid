# ValiValid v3.1.0 — English Documentation

> React form validation library with sync/async rules, dynamic field management, and 74+ built-in validators.

---

## Table of contents

| File | Description |
|------|-------------|
| [getting-started.md](./getting-started.md) | Installation, basic setup, first example |
| [hook.md](./hook.md) | `useValiValid` — full hook API reference |
| [validators.md](./validators.md) | All 74+ `ValidationType` entries with params and examples |
| [async.md](./async.md) | Async validation guide (`AsyncPattern` + image validators) |
| [dynamic.md](./dynamic.md) | Runtime validation management (add / remove / replace / clear) |
| [engine.md](./engine.md) | `ValiValid` class — advanced / non-React usage |
| [types.md](./types.md) | TypeScript types, enums, and interfaces reference |
| [architecture.md](./architecture.md) | Internal architecture with diagrams |

📂 **Examples** → [examples/](../../examples/)

---

## Quick example

> **Subpath exports (v3.1.0):** `vali-valid/react` (React hook), `vali-valid/vue` (Vue 3 composable), `vali-valid/svelte` (Svelte stores), `vali-valid/core` (framework-agnostic engine). The default `vali-valid` entry point re-exports everything.

```tsx
import { rule, useValiValid, ValidationType } from 'vali-valid';
// or, for tree-shaking:
// import { useValiValid } from 'vali-valid/react';

type LoginForm = { email: string; password: string };

const { form, errors, isValid, handleChange, validate } = useValiValid<LoginForm>({
  initial: { email: '', password: '' },
  validations: [
    {
      field: 'email',
      validations: rule().required().email().build(),
    },
    {
      field: 'password',
      // traditional form — also valid
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.PasswordStrength },
      ],
    },
  ],
});
```

---

## What's new in v3.1.0

| Feature | v2 | v3.1.0 |
|---------|----|--------|
| Error shape | `string \| null` per field | `string[] \| null` per field |
| Submit lifecycle | manual `validate()` | `handleSubmit`, `isSubmitted`, `submitCount` |
| Server errors | — | `setServerErrors` |
| Bulk field update | — | `setValues` |
| Validation triggers | `handleChange` only | `trigger(field?)` — manual trigger |
| Error clearing | — | `clearErrors(field?)` |
| Mount validation | — | `validateOnMount` option |
| Async timeout | — | `asyncTimeout` option (ms) |
| Error collection | always all errors | `criteriaMode: 'firstError' \| 'all'` |
| Subpath exports | `vali-valid` only | `vali-valid/core`, `vali-valid/react`, `vali-valid/vue`, `vali-valid/svelte` |
| Framework adapters | React only | React, Vue 3, Svelte 4, Angular (via core engine) |
| i18n locales | en, es | en, es, pt, fr, de |
| Validation types | 43 | 74+ |
| Tests | 730 | 897 |

## What's new in v2

| Feature | v1 | v2 |
|---------|----|----|
| Primary API | `new ValiValid()` class | `useValiValid` hook |
| Async validation | — | `AsyncPattern` + image rules |
| Dynamic rules | — | `addFieldValidation` / `removeFieldValidation` / `setFieldValidations` / `clearFieldValidations` |
| Loading state | — | `isValidating` |
| Form reset | — | `reset(initial?)` |
| Validation types | 18 | 43 |
| `FileDimensions` bug | always `false` | fixed (async) |
| `LowerCase` message | wrong message | fixed |
| Number `0` | treated as empty | treated as valid |
| Required field config | `field?`, `validations?` | `field`, `validations` (required) |
