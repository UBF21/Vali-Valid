# Examples

Practical examples covering every feature of ValiValid — from basic forms to advanced scenarios.

---

## Table of contents

1. [Basic login form](#1-basic-login-form)
2. [Registration with password confirmation](#2-registration-with-password-confirmation)
3. [Async validation](#3-async-validation)
4. [File upload with image constraints](#4-file-upload-with-image-constraints)
5. [Multi-step form](#5-multi-step-form)
6. [Dynamic rules](#6-dynamic-rules)
7. [ValiValid engine (no React)](#7-valiValid-engine-no-react)
8. [i18n — switching language at runtime](#8-i18n--switching-language-at-runtime)
9. [validateOnBlur + touchedFields + dirtyFields](#9-validateonblur--touchedfields--dirtyfields)
10. [New v2.1 validators — numeric & date](#10-new-v21-validators--numeric--date)
11. [New v2.1 validators — arrays](#11-new-v21-validators--arrays)
12. [New v2.1 validators — cross-field](#12-new-v21-validators--cross-field)
13. [New v2.1 validators — format & geo](#13-new-v21-validators--format--geo)

---

## 1. Basic login form

**Validators used:** `Required`, `Email`, `MinLength`

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

## 2. Registration with password confirmation

**Validators used:** `Required`, `Alpha`, `MinLength`, `MaxLength`, `Email`, `PasswordStrength`, `MatchField`

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const { form, errors, isValid, handleChange, validate } =
    useValiValid<RegisterForm>({
      initial: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
      validations: [
        {
          field: 'firstName',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.Alpha },
            { type: ValidationType.MinLength, value: 2 },
            { type: ValidationType.MaxLength, value: 30 },
          ],
        },
        {
          field: 'lastName',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.Alpha },
            { type: ValidationType.MinLength, value: 2 },
            { type: ValidationType.MaxLength, value: 30 },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = await validate();
    if (!Object.values(errs).some(Boolean)) console.log('Registered');
  };

  return (
    <form onSubmit={handleSubmit}>
      {(['firstName', 'lastName', 'email', 'password', 'confirmPassword'] as const).map((field) => (
        <div key={field}>
          <input
            type={field.toLowerCase().includes('password') ? 'password' : 'text'}
            value={form[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field}
          />
          {errors[field] && <p style={{ color: 'red' }}>{errors[field]}</p>}
        </div>
      ))}
      <button type="submit" disabled={!isValid}>Register</button>
    </form>
  );
}
```

---

## 3. Async validation

**Validators used:** `Required`, `MinLength`, `Slug`, `AsyncPattern`

`asyncFn` receives `(value, form)` so you can write cross-field async logic.

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type SignupForm = { username: string; email: string };

async function isUsernameAvailable(username: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 500)); // simulate network
  return !['admin', 'root'].includes(username);
}

async function isEmailAvailable(email: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 400));
  return !['taken@example.com'].includes(email);
}

export function AsyncSignupForm() {
  const { form, errors, isValidating, handleChange, validate } =
    useValiValid<SignupForm>({
      initial: { username: '', email: '' },
      validations: [
        {
          field: 'username',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.MinLength, value: 3 },
            { type: ValidationType.Slug },
            {
              type: ValidationType.AsyncPattern,
              message: 'Username is already taken.',
              asyncFn: (value) => isUsernameAvailable(value),
            },
          ],
        },
        {
          field: 'email',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.Email },
            {
              type: ValidationType.AsyncPattern,
              message: 'Email is already registered.',
              asyncFn: (value) => isEmailAvailable(value),
            },
          ],
        },
      ],
    });

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <input
        value={form.username}
        onChange={(e) => handleChange('username', e.target.value)}
        placeholder="Username"
      />
      {isValidating && <span>Checking…</span>}
      {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
      {errors.username === null && <p style={{ color: 'green' }}>✓ Available</p>}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <button type="submit" disabled={isValidating}>
        {isValidating ? 'Validating…' : 'Create account'}
      </button>
    </form>
  );
}
```

---

## 4. File upload with image constraints

**Validators used:** `Required`, `FileType`, `FileSize`, `ImageAspectRatio`, `ImageMinDimensions`, `ImageMaxDimensions`, `FileDimensions`

```tsx
import { useValiValid, ValidationType, TypeFile, FileSize } from 'vali-valid';

type MediaForm = { avatar: File | null; banner: File | null };

export function FileUploadForm() {
  const { form, errors, isValidating, handleChange, validate } =
    useValiValid<MediaForm>({
      initial: { avatar: null, banner: null },
      validations: [
        {
          field: 'avatar',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.FileType, value: [TypeFile.JPG, TypeFile.PNG] },
            { type: ValidationType.FileSize, value: FileSize['2MB'] },
            {
              type: ValidationType.ImageAspectRatio,
              value: { width: 1, height: 1 },
              tolerance: 0.02,
              message: 'Avatar must be square (1:1).',
            },
            {
              type: ValidationType.ImageMinDimensions,
              value: { width: 200, height: 200 },
            },
            {
              type: ValidationType.ImageMaxDimensions,
              value: { width: 2000, height: 2000 },
            },
          ],
        },
        {
          field: 'banner',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.FileType, value: [TypeFile.JPG, TypeFile.PNG] },
            { type: ValidationType.FileSize, value: FileSize['5MB'] },
            {
              type: ValidationType.ImageAspectRatio,
              value: { width: 16, height: 9 },
              tolerance: 0.02,
              message: 'Banner must be 16:9.',
            },
          ],
        },
      ],
    });

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <div>
        <label>Avatar (JPG/PNG, square, 200–2000px, max 2MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
        />
        {errors.avatar && <p style={{ color: 'red' }}>{errors.avatar}</p>}
      </div>

      <div>
        <label>Banner (JPG/PNG, 16:9, max 5MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleChange('banner', e.target.files?.[0] ?? null)}
        />
        {errors.banner && <p style={{ color: 'red' }}>{errors.banner}</p>}
      </div>

      <button type="submit" disabled={isValidating}>
        {isValidating ? 'Checking dimensions…' : 'Upload'}
      </button>
    </form>
  );
}
```

---

## 5. Multi-step form

**Demonstrates:** `setFieldValidations`, `clearFieldValidations`, `RequiredIf`, step-by-step `validate()`

```tsx
import { useState } from 'react';
import { useValiValid, ValidationType } from 'vali-valid';

type OrderForm = {
  name: string; email: string;
  shippingMethod: string; address: string;
  cardNumber: string; cvv: string;
};

export function MultiStepForm() {
  const [step, setStep] = useState(1);

  const { form, errors, isValidating, handleChange, validate, setFieldValidations, clearFieldValidations } =
    useValiValid<OrderForm>({
      initial: { name: '', email: '', shippingMethod: '', address: '', cardNumber: '', cvv: '' },
      validations: [
        { field: 'name',  validations: [{ type: ValidationType.Required }, { type: ValidationType.MinLength, value: 2 }] },
        { field: 'email', validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }] },
      ],
    });

  const next = async () => {
    const errs = await validate();
    if (Object.values(errs).some(Boolean)) return;

    if (step === 1) {
      clearFieldValidations('name');
      clearFieldValidations('email');
      setFieldValidations('shippingMethod', [{ type: ValidationType.Required }]);
      setFieldValidations('address', [
        {
          type: ValidationType.RequiredIf,
          condition: (f) => f.shippingMethod === 'home',
          message: 'Address is required for home delivery.',
        },
      ]);
    }

    if (step === 2) {
      clearFieldValidations('shippingMethod');
      clearFieldValidations('address');
      setFieldValidations('cardNumber', [{ type: ValidationType.Required }, { type: ValidationType.CreditCard }]);
      setFieldValidations('cvv', [{ type: ValidationType.Required }, { type: ValidationType.DigitsOnly }, { type: ValidationType.MinLength, value: 3 }]);
    }

    setStep((s) => s + 1);
  };

  return (
    <div>
      <p>Step {step} of 3</p>

      {step === 1 && (
        <>
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full name" />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Email" />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <select value={form.shippingMethod} onChange={(e) => handleChange('shippingMethod', e.target.value)}>
            <option value="">Choose…</option>
            <option value="pickup">Store pickup</option>
            <option value="home">Home delivery</option>
          </select>
          {errors.shippingMethod && <p style={{ color: 'red' }}>{errors.shippingMethod}</p>}
          {form.shippingMethod === 'home' && (
            <>
              <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Address" />
              {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
            </>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <input value={form.cardNumber} onChange={(e) => handleChange('cardNumber', e.target.value)} placeholder="Card number" />
          {errors.cardNumber && <p style={{ color: 'red' }}>{errors.cardNumber}</p>}
          <input value={form.cvv} onChange={(e) => handleChange('cvv', e.target.value)} placeholder="CVV" />
          {errors.cvv && <p style={{ color: 'red' }}>{errors.cvv}</p>}
        </>
      )}

      {step < 3
        ? <button onClick={next} disabled={isValidating}>Next →</button>
        : <button onClick={() => console.log('Order:', form)}>Place order</button>
      }
    </div>
  );
}
```

---

## 6. Dynamic rules

**Demonstrates:** `addFieldValidation`, `removeFieldValidation`, `setFieldValidations`, `clearFieldValidations`

```tsx
import { useState } from 'react';
import { useValiValid, ValidationType } from 'vali-valid';

type ProfileForm = {
  username: string;
  role: string;
  promoCode: string;
};

export function DynamicRulesForm() {
  const [hasPromo, setHasPromo] = useState(false);

  const { form, errors, isValid, handleChange, validate,
    addFieldValidation, removeFieldValidation,
    setFieldValidations, clearFieldValidations } =
    useValiValid<ProfileForm>({
      initial: { username: '', role: '', promoCode: '' },
      validations: [
        {
          field: 'username',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.MinLength, value: 3 },
            { type: ValidationType.Slug },
          ],
        },
        { field: 'role', validations: [{ type: ValidationType.Required }] },
      ],
    });

  // Swap rules when role changes
  const handleRoleChange = (role: string) => {
    handleChange('role', role);
    if (role === 'admin') {
      setFieldValidations('username', [
        { type: ValidationType.Required },
        { type: ValidationType.MinLength, value: 6 },
        { type: ValidationType.AlphaNumeric },
      ]);
    } else {
      setFieldValidations('username', [
        { type: ValidationType.Required },
        { type: ValidationType.MinLength, value: 3 },
        { type: ValidationType.Slug },
      ]);
    }
  };

  // Activate / deactivate promo code field
  const togglePromo = (active: boolean) => {
    setHasPromo(active);
    if (active) {
      addFieldValidation('promoCode', [
        { type: ValidationType.Required },
        { type: ValidationType.ExactLength, value: 8 },
        { type: ValidationType.UpperCase },
      ]);
    } else {
      clearFieldValidations('promoCode');
      handleChange('promoCode', '');
    }
  };

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <input value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="Username" />
      {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}

      <select value={form.role} onChange={(e) => handleRoleChange(e.target.value)}>
        <option value="">Select role…</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>}

      <label>
        <input type="checkbox" checked={hasPromo} onChange={(e) => togglePromo(e.target.checked)} />
        {' '}I have a promo code
      </label>
      {hasPromo && (
        <>
          <input value={form.promoCode} onChange={(e) => handleChange('promoCode', e.target.value.toUpperCase())} placeholder="ABCD1234" maxLength={8} />
          {errors.promoCode && <p style={{ color: 'red' }}>{errors.promoCode}</p>}
        </>
      )}

      <button type="submit" disabled={!isValid}>Save</button>
    </form>
  );
}
```

---

## 7. ValiValid engine (no React)

Use `ValiValid` directly in Node.js, scripts, or server-side code.

**Validators used:** `Required`, `Email`, `MinLength`, `NumberRange`, `Integer`, `NumberPositive`, `AsyncPattern`, `Pattern`, `DateFormat`, `FutureDate`

```ts
import { ValiValid, ValidationType, DateFormat } from 'vali-valid';

// ── 1. Sync validation ──────────────────────────────────────────────────────

type UserDto = { username: string; email: string; age: number };

const validator = new ValiValid<UserDto>([
  {
    field: 'username',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 3 },
      { type: ValidationType.Slug },
    ],
  },
  {
    field: 'email',
    validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }],
  },
  {
    field: 'age',
    isNumber: true,
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.NumberRange, value: [18, 120] },
      { type: ValidationType.Integer },
    ],
  },
]);

const errors = validator.validateSync({ username: 'j', email: 'bad', age: 15 });
console.log(errors);
// { username: '...', email: '...', age: '...' }

// ── 2. Single-field check ───────────────────────────────────────────────────

console.log(validator.validateFieldSync('email', 'ok@ok.com')); // null
console.log(validator.validateFieldSync('email', 'bad'));       // error message

// ── 3. Async validation ─────────────────────────────────────────────────────

type ProductDto = { sku: string; price: number };

const productValidator = new ValiValid<ProductDto>([
  {
    field: 'sku',
    validations: [
      { type: ValidationType.Required },
      {
        type: ValidationType.AsyncPattern,
        message: 'SKU already exists.',
        asyncFn: async (value) => {
          await new Promise((r) => setTimeout(r, 200));
          return !['PROD-001', 'PROD-002'].includes(value);
        },
      },
    ],
  },
  {
    field: 'price',
    isDecimal: true,
    validations: [{ type: ValidationType.Required }, { type: ValidationType.NumberPositive }],
  },
]);

(async () => {
  const errs = await productValidator.validateAsync({ sku: 'PROD-001', price: -5 });
  console.log(errs); // { sku: 'SKU already exists.', price: '...' }
})();

// ── 4. Dynamic rules at runtime ─────────────────────────────────────────────

type InvoiceForm = { clientName: string; vatNumber: string };

const invoiceValidator = new ValiValid<InvoiceForm>([
  { field: 'clientName', validations: [{ type: ValidationType.Required }] },
]);

// Add rules programmatically
invoiceValidator.addFieldValidation('vatNumber', [
  { type: ValidationType.Required },
  { type: ValidationType.ExactLength, value: 9 },
]);

console.log(invoiceValidator.validateFieldSync('vatNumber', '')); // Required field.

// Remove and clear
invoiceValidator.removeFieldValidation('vatNumber', ValidationType.Required);
invoiceValidator.clearFieldValidations('vatNumber');
console.log(invoiceValidator.validateFieldSync('vatNumber', '')); // null (no rules)
```

---

## 8. i18n — switching language at runtime

Call `setLocale` **before** creating the engine (messages are resolved at rule registration time).

```ts
import { setLocale, getLocale, useValiValid, ValidationType } from 'vali-valid';

// Default locale is 'en'
console.log(getLocale()); // 'en'

// Switch to Spanish globally
setLocale('es');

// Now all engines created after this point will use Spanish messages
const { form, errors, handleChange } = useValiValid({
  initial: { email: '' },
  validations: [
    {
      field: 'email',
      validations: [
        { type: ValidationType.Required },  // → 'Campo obligatorio.'
        { type: ValidationType.Email },     // → 'El formato de correo electrónico no es válido.'
      ],
    },
  ],
});
```

> **Tip:** Call `setLocale` once at app startup (e.g., in your `i18n` bootstrap) before any component mounts.

```ts
// app/i18n.ts
import { setLocale } from 'vali-valid';

export function initLocale(lang: 'en' | 'es') {
  setLocale(lang);
}

// In main.tsx / App.tsx
initLocale(navigator.language.startsWith('es') ? 'es' : 'en');
```

---

## 9. validateOnBlur + touchedFields + dirtyFields

When `validateOnBlur: true`, errors only appear after the user leaves a field.
`touchedFields` tracks which fields have been interacted with; `dirtyFields` tracks which differ from their initial value.

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type ContactForm = { name: string; email: string; message: string };

export function ContactForm() {
  const {
    form, errors, isValid,
    touchedFields, dirtyFields,
    handleChange, handleBlur,
    validate, reset,
  } = useValiValid<ContactForm>({
    initial: { name: '', email: '', message: '' },
    validateOnBlur: true,   // errors appear on blur, not on every keystroke
    validations: [
      {
        field: 'name',
        validations: [{ type: ValidationType.Required }, { type: ValidationType.MinLength, value: 2 }],
      },
      {
        field: 'email',
        validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }],
      },
      {
        field: 'message',
        validations: [{ type: ValidationType.Required }, { type: ValidationType.MinLength, value: 10 }],
      },
    ],
  });

  // Show error only if the field has been touched
  const showError = (field: keyof ContactForm) =>
    touchedFields.has(field) ? errors[field] : null;

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <div>
        <input
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}   // marks as touched + validates
          placeholder="Name"
        />
        {/* Dirty indicator */}
        {dirtyFields.has('name') && <span style={{ fontSize: 11, color: '#6b7280' }}> (edited)</span>}
        {showError('name') && <p style={{ color: 'red' }}>{showError('name')}</p>}
      </div>

      <div>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="Email"
        />
        {showError('email') && <p style={{ color: 'red' }}>{showError('email')}</p>}
      </div>

      <div>
        <textarea
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder="Message (min 10 chars)"
        />
        {showError('message') && <p style={{ color: 'red' }}>{showError('message')}</p>}
      </div>

      <p style={{ fontSize: 13, color: '#6b7280' }}>
        Touched: {touchedFields.size} / Dirty: {dirtyFields.size}
      </p>

      <button type="submit" disabled={!isValid}>Send</button>
      <button type="button" onClick={() => reset()}>Reset</button>
    </form>
  );
}
```

---

## 10. New v2.1 validators — numeric & date

### GreaterThan, LessThan, Precision

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type PriceForm = { price: number; discount: number; tax: number };

const validator = new ValiValid<PriceForm>([
  {
    field: 'price',
    isDecimal: true,
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.GreaterThan, value: 0, message: 'Price must be positive.' },
      { type: ValidationType.LessThan,    value: 10000, message: 'Price cannot exceed $10,000.' },
      { type: ValidationType.Precision,   value: 2, message: 'Max 2 decimal places.' },
    ],
  },
  {
    field: 'discount',
    isDecimal: true,
    validations: [
      { type: ValidationType.GreaterThan, value: -1 },   // >= 0
      { type: ValidationType.LessThan,    value: 100 },  // < 100%
      { type: ValidationType.Precision,   value: 2 },
    ],
  },
  {
    field: 'tax',
    isDecimal: true,
    validations: [
      { type: ValidationType.Precision, value: 4 }, // e.g. 0.1525
    ],
  },
]);

console.log(validator.validateSync({ price: 99.999, discount: 101, tax: 0.12345 }));
// { price: 'Max 2 decimal places.', discount: '...less than 100...', tax: '...max 4...' }
```

### DateAfter, DateBefore

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type EventForm = { startDate: string; endDate: string };

const eventValidator = new ValiValid<EventForm>([
  {
    field: 'startDate',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.DateAfter, value: new Date(), message: 'Start date must be in the future.' },
    ],
  },
  {
    field: 'endDate',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.DateAfter, value: '2025-01-01' },
      { type: ValidationType.DateBefore, value: '2030-12-31' },
    ],
  },
]);

console.log(eventValidator.validateFieldSync('startDate', '2020-01-01')); // error
console.log(eventValidator.validateFieldSync('startDate', '2028-06-01')); // null
```

### OneOf

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type SettingsForm = { theme: string; language: string };

const settingsValidator = new ValiValid<SettingsForm>([
  {
    field: 'theme',
    validations: [
      {
        type: ValidationType.OneOf,
        value: ['light', 'dark', 'system'],
        message: 'Theme must be light, dark, or system.',
      },
    ],
  },
  {
    field: 'language',
    validations: [
      { type: ValidationType.OneOf, value: ['en', 'es', 'fr', 'de', 'pt'] },
    ],
  },
]);

console.log(settingsValidator.validateFieldSync('theme', 'blue'));   // error
console.log(settingsValidator.validateFieldSync('theme', 'dark'));   // null
console.log(settingsValidator.validateFieldSync('language', 'jp')); // error
```

---

## 11. New v2.1 validators — arrays

### ArrayMinLength, ArrayMaxLength, ArrayUnique, ArrayContains

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type TagForm = { tags: string[]; categories: string[]; permissions: string[] };

const { form, errors, validate } = useValiValid<TagForm>({
  initial: { tags: [], categories: [], permissions: [] },
  validations: [
    {
      field: 'tags',
      validations: [
        { type: ValidationType.ArrayMinLength, value: 1, message: 'Add at least one tag.' },
        { type: ValidationType.ArrayMaxLength, value: 10, message: 'Max 10 tags allowed.' },
        { type: ValidationType.ArrayUnique, message: 'Duplicate tags are not allowed.' },
      ],
    },
    {
      field: 'categories',
      validations: [
        { type: ValidationType.ArrayMinLength, value: 1 },
        { type: ValidationType.ArrayUnique },
      ],
    },
    {
      field: 'permissions',
      validations: [
        {
          type: ValidationType.ArrayContains,
          value: 'read',
          message: '"read" permission is required.',
        },
        { type: ValidationType.ArrayMaxLength, value: 5 },
      ],
    },
  ],
});

// Example usage in a tag input component:
const addTag = (tag: string) => {
  handleChange('tags', [...form.tags, tag]);
};
```

```ts
// Standalone checks
import { ValiValid, ValidationType } from 'vali-valid';

type ListForm = { items: string[] };

const v = new ValiValid<ListForm>([
  {
    field: 'items',
    validations: [
      { type: ValidationType.ArrayMinLength, value: 2 },
      { type: ValidationType.ArrayMaxLength, value: 5 },
      { type: ValidationType.ArrayUnique },
      { type: ValidationType.ArrayContains, value: 'required-item' },
    ],
  },
]);

console.log(v.validateFieldSync('items', []));                              // min length error
console.log(v.validateFieldSync('items', ['a', 'a']));                     // unique error
console.log(v.validateFieldSync('items', ['required-item', 'b']));         // null ✓
console.log(v.validateFieldSync('items', ['required-item', 'b', 'c', 'd', 'e', 'f'])); // max length error
```

---

## 12. New v2.1 validators — cross-field

### NotMatchField

Ensures a field does **not** equal another field (e.g., new password ≠ old password).

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export function ChangePasswordForm() {
  const { form, errors, isValid, handleChange, validate } =
    useValiValid<PasswordChangeForm>({
      initial: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
      validations: [
        {
          field: 'currentPassword',
          validations: [{ type: ValidationType.Required }],
        },
        {
          field: 'newPassword',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.PasswordStrength },
            {
              type: ValidationType.NotMatchField,
              field: 'currentPassword',
              message: 'New password must differ from the current one.',
            },
          ],
        },
        {
          field: 'confirmNewPassword',
          validations: [
            { type: ValidationType.Required },
            {
              type: ValidationType.MatchField,
              field: 'newPassword',
              message: 'Passwords do not match.',
            },
          ],
        },
      ],
    });

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      {(['currentPassword', 'newPassword', 'confirmNewPassword'] as const).map((field) => (
        <div key={field}>
          <input
            type="password"
            value={form[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field}
          />
          {errors[field] && <p style={{ color: 'red' }}>{errors[field]}</p>}
        </div>
      ))}
      <button type="submit" disabled={!isValid}>Update password</button>
    </form>
  );
}
```

### RequiredUnless

The field is required **unless** the condition is true.

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type ShippingForm = {
  method: 'pickup' | 'delivery' | '';
  address: string;
  pickupStore: string;
};

export function ShippingForm() {
  const { form, errors, handleChange, validate } =
    useValiValid<ShippingForm>({
      initial: { method: '', address: '', pickupStore: '' },
      validations: [
        { field: 'method', validations: [{ type: ValidationType.Required }] },
        {
          field: 'address',
          validations: [
            {
              type: ValidationType.RequiredUnless,
              // Not required when method is pickup
              condition: (f) => f.method === 'pickup',
              message: 'Address is required for home delivery.',
            },
            { type: ValidationType.MinLength, value: 10 },
          ],
        },
        {
          field: 'pickupStore',
          validations: [
            {
              type: ValidationType.RequiredUnless,
              // Not required when method is delivery
              condition: (f) => f.method === 'delivery',
              message: 'Select a pickup store.',
            },
          ],
        },
      ],
    });

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <select value={form.method} onChange={(e) => handleChange('method', e.target.value as any)}>
        <option value="">Select method…</option>
        <option value="pickup">Store pickup</option>
        <option value="delivery">Home delivery</option>
      </select>
      {errors.method && <p style={{ color: 'red' }}>{errors.method}</p>}

      {form.method === 'delivery' && (
        <>
          <input
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Street address"
          />
          {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
        </>
      )}

      {form.method === 'pickup' && (
        <>
          <select value={form.pickupStore} onChange={(e) => handleChange('pickupStore', e.target.value)}>
            <option value="">Select store…</option>
            <option value="downtown">Downtown</option>
            <option value="mall">City Mall</option>
          </select>
          {errors.pickupStore && <p style={{ color: 'red' }}>{errors.pickupStore}</p>}
        </>
      )}

      <button type="submit">Continue</button>
    </form>
  );
}
```

---

## 13. New v2.1 validators — format & geo

### Time

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type ScheduleForm = { openTime: string; closeTime: string; appointmentTime: string };

const v = new ValiValid<ScheduleForm>([
  {
    field: 'openTime',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Time, format: '24h' }, // HH:MM
    ],
  },
  {
    field: 'closeTime',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Time, format: '24h' },
    ],
  },
  {
    field: 'appointmentTime',
    validations: [
      { type: ValidationType.Time, format: '12h' }, // HH:MM AM/PM
    ],
  },
]);

console.log(v.validateFieldSync('openTime', '09:30'));        // null ✓
console.log(v.validateFieldSync('openTime', '25:00'));        // error
console.log(v.validateFieldSync('appointmentTime', '02:30 PM')); // null ✓
console.log(v.validateFieldSync('appointmentTime', '14:00')); // error (not 12h)
```

### NoHTML

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type CommentForm = { body: string; title: string };

const v = new ValiValid<CommentForm>([
  {
    field: 'body',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.NoHTML, message: 'HTML is not allowed in comments.' },
      { type: ValidationType.MaxLength, value: 2000 },
    ],
  },
  {
    field: 'title',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.NoHTML },
      { type: ValidationType.MaxLength, value: 100 },
    ],
  },
]);

console.log(v.validateFieldSync('body', 'Hello world'));           // null ✓
console.log(v.validateFieldSync('body', 'Hello <script>xss</script>')); // error
```

### IBAN

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type BankForm = { iban: string };

const v = new ValiValid<BankForm>([
  {
    field: 'iban',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.IBAN, message: 'Enter a valid IBAN.' },
    ],
  },
]);

console.log(v.validateFieldSync('iban', 'GB82WEST12345698765432')); // null ✓
console.log(v.validateFieldSync('iban', 'GB00WEST12345698765432')); // error
```

### PostalCode

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type AddressForm = { zipCode: string; country: string };

const usValidator = new ValiValid<{ zipCode: string }>([
  {
    field: 'zipCode',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.PostalCode, country: 'US' },
    ],
  },
]);

const deValidator = new ValiValid<{ zipCode: string }>([
  {
    field: 'zipCode',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.PostalCode, country: 'DE' },
    ],
  },
]);

console.log(usValidator.validateFieldSync('zipCode', '90210'));      // null ✓
console.log(usValidator.validateFieldSync('zipCode', '9021'));       // error
console.log(deValidator.validateFieldSync('zipCode', '10115'));      // null ✓ (Berlin)
console.log(deValidator.validateFieldSync('zipCode', '101150'));     // error
```

Supported country codes: `US`, `CA`, `UK`, `DE`, `FR`, `ES`, `IT`, `AU`, `NL`, `BR`, `MX`, `AR`.

### Latitude & Longitude

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type LocationForm = { lat: number; lng: number };

const v = new ValiValid<LocationForm>([
  {
    field: 'lat',
    isDecimal: true,
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Latitude },
    ],
  },
  {
    field: 'lng',
    isDecimal: true,
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Longitude },
    ],
  },
]);

console.log(v.validateSync({ lat: 40.7128, lng: -74.006 }));  // {} ✓ (New York)
console.log(v.validateSync({ lat: 91, lng: 181 }));            // { lat: '...', lng: '...' }
```

### SemVer

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type PackageForm = { version: string };

const v = new ValiValid<PackageForm>([
  {
    field: 'version',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.SemVer, message: 'Version must follow X.Y.Z format.' },
    ],
  },
]);

console.log(v.validateFieldSync('version', '1.0.0'));          // null ✓
console.log(v.validateFieldSync('version', '1.0.0-beta.1'));   // null ✓
console.log(v.validateFieldSync('version', '1.0'));            // error
console.log(v.validateFieldSync('version', 'v1.0.0'));         // error
```

### Base64

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type EncodedForm = { payload: string; thumbnail: string };

const v = new ValiValid<EncodedForm>([
  {
    field: 'payload',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Base64, message: 'Payload must be a valid Base64 string.' },
    ],
  },
  {
    field: 'thumbnail',
    validations: [
      { type: ValidationType.Base64 },
    ],
  },
]);

console.log(v.validateFieldSync('payload', 'SGVsbG8gV29ybGQ=')); // null ✓
console.log(v.validateFieldSync('payload', 'not base64!'));       // error
```

---

> All examples use TypeScript. JavaScript usage is identical — just drop the type annotations.
