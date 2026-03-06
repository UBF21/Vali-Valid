# ValiValid v2 — Documentation

> React form validation library with sync/async rules, dynamic field management, and 43 built-in validators.

---

## Languages

| | Language | Docs |
|-|----------|------|
| 🇺🇸 | **English** | [docs/en/](./en/README.md) |
| 🇪🇸 | Español | [docs/es/](./es/README.md) |

---

## Quick start

```bash
npm install vali-valid
```

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
        { type: ValidationType.MinLength, value: 8 },
      ],
    },
  ],
});
```

See [examples/](../examples/) for full usage examples.

---

## What's new in v2

| Feature | v1 | v2 |
|---------|----|----|
| Primary API | `new ValiValid()` class | `useValiValid` hook |
| Async validation | — | `AsyncPattern` + image rules |
| Dynamic rules | — | `add` / `remove` / `set` / `clear` field validations |
| Loading state | — | `isValidating` |
| Form reset | — | `reset(initial?)` |
| Validation types | 18 | 43 |
| `FileDimensions` bug | always `false` | fixed (async) |
| `LowerCase` message bug | wrong message | fixed |
| Number `0` | treated as empty | treated as valid |
