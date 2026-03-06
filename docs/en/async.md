# Async validation

ValiValid v2 has first-class support for async validation rules. They run after all sync rules pass for a field, and the hook exposes `isValidating` to track progress.

---

## How it works

```mermaid
sequenceDiagram
    participant User
    participant handleChange
    participant SyncEngine
    participant AsyncEngine
    participant ReactState

    User->>handleChange: type in input
    handleChange->>SyncEngine: validateFieldSync(field, value)
    SyncEngine-->>handleChange: syncError | null
    handleChange->>ReactState: setErrors({ field: syncError })

    alt field has async rules
        handleChange->>ReactState: setIsValidating(true)
        handleChange->>AsyncEngine: validateFieldAsync(field, value, form)
        AsyncEngine-->>handleChange: asyncError | null
        handleChange->>ReactState: setErrors({ field: asyncError })
        handleChange->>ReactState: setIsValidating(false)
    end
```

**Key behaviors:**
- Sync runs first — if sync fails, async is **skipped** for that field
- `isValidating` is `true` only while async is pending
- `validate()` always runs full async for all fields

---

## `AsyncPattern`

The most flexible async type. Provide an `asyncFn` that returns `Promise<boolean>` (`true` = valid).

```ts
{
  type: ValidationType.AsyncPattern,
  message: 'Custom error message',
  asyncFn: (value: any, form: Record<string, any>) => Promise<boolean>
}
```

`asyncFn` receives:
- `value` — current field value (already sanitized)
- `form` — the entire current form object

### Example: check username availability

```tsx
{
  field: 'username',
  validations: [
    { type: ValidationType.Required },
    { type: ValidationType.MinLength, value: 3 },
    { type: ValidationType.Slug },
    {
      type: ValidationType.AsyncPattern,
      message: 'Username is already taken.',
      asyncFn: async (value) => {
        const res = await fetch(`/api/users/check?username=${encodeURIComponent(value)}`);
        const data = await res.json();
        return data.available;
      },
    },
  ],
}
```

### Example: validate coupon with form context

```tsx
{
  field: 'coupon',
  validations: [
    {
      type: ValidationType.AsyncPattern,
      message: 'Coupon is not valid for this product.',
      asyncFn: async (value, form) => {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          body: JSON.stringify({ coupon: value, productId: form.productId }),
          headers: { 'Content-Type': 'application/json' },
        });
        return res.ok;
      },
    },
  ],
}
```

---

## Async image validators

| Type | Description |
|------|-------------|
| `FileDimensions` | Exact width and height |
| `ImageAspectRatio` | Width-to-height ratio with optional tolerance |
| `ImageMinDimensions` | Minimum width and/or height |
| `ImageMaxDimensions` | Maximum width and/or height |

### Example: profile picture

```tsx
{
  field: 'avatar',
  validations: [
    { type: ValidationType.Required },
    { type: ValidationType.FileType, value: [TypeFile.JPG, TypeFile.PNG] },
    { type: ValidationType.FileSize, value: FileSize['5MB'] },
    {
      type: ValidationType.ImageAspectRatio,
      value: { width: 1, height: 1 },
      tolerance: 0.01,
      message: 'Profile picture must be square.',
    },
    {
      type: ValidationType.ImageMinDimensions,
      value: { width: 400, height: 400 },
      message: 'Minimum size is 400×400 px.',
    },
  ],
}
```

---

## `isValidating` UX pattern

```tsx
<div className="field">
  <input onChange={(e) => handleChange('email', e.target.value)} />
  {isValidating ? (
    <span className="hint">Checking…</span>
  ) : (
    errors.email && <span className="error">{errors.email}</span>
  )}
</div>

<button type="submit" disabled={isValidating}>
  {isValidating ? 'Please wait…' : 'Submit'}
</button>
```

---

## Debouncing async validation

```tsx
import { useMemo } from 'react';
import { debounce } from 'lodash-es';

const debouncedChange = useMemo(
  () => debounce((field, value) => handleChange(field, value), 400),
  [handleChange]
);

<input onChange={(e) => debouncedChange('email', e.target.value)} />
```
