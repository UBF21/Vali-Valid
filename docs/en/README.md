# ValiValid v2 — English Documentation

> React form validation library with sync/async rules, dynamic field management, and 43 built-in validators.

---

## Table of contents

| File | Description |
|------|-------------|
| [getting-started.md](./getting-started.md) | Installation, basic setup, first example |
| [hook.md](./hook.md) | `useValiValid` — full hook API reference |
| [validators.md](./validators.md) | All 43 `ValidationType` entries with params and examples |
| [async.md](./async.md) | Async validation guide (`AsyncPattern` + image validators) |
| [dynamic.md](./dynamic.md) | Runtime validation management (add / remove / replace / clear) |
| [engine.md](./engine.md) | `ValiValid` class — advanced / non-React usage |
| [types.md](./types.md) | TypeScript types, enums, and interfaces reference |
| [architecture.md](./architecture.md) | Internal architecture with diagrams |

📂 **Examples** → [examples/](../../examples/)

---

## Quick example

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type LoginForm = { email: string; password: string };

const { form, errors, isValid, handleChange, validate } = useValiValid<LoginForm>({
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
        { type: ValidationType.PasswordStrength },
      ],
    },
  ],
});
```

---

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
