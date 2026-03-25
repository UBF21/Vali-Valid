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
14. [v3.1.0 — builder syntax + criteriaMode](#14-v310--builder-syntax--criteriamode)

---

## 1. Basic login form

**Validators used:** `Required`, `Email`, `MinLength`

```tsx
import { rule, useValiValid, ValidationType } from 'vali-valid';

type LoginForm = { email: string; password: string };

export function LoginForm() {
  const { form, errors, isValid, handleChange, validate, reset } =
    useValiValid<LoginForm>({
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
      {errors.email?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}

      <input
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Password"
      />
      {errors.password?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}

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
import { rule, useValiValid, ValidationType } from 'vali-valid';

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
          validations: rule().required().alpha().minLength(2).maxLength(30).build(),
        },
        {
          field: 'lastName',
          validations: rule().required().alpha().minLength(2).maxLength(30).build(),
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
          // traditional form — also valid
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
          {errors[field]?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
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
import { rule, useValiValid, ValidationType } from 'vali-valid';

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
          validations: rule()
            .required()
            .minLength(3)
            .slug()
            .asyncPattern(
              (value) => isUsernameAvailable(value),
              'Username is already taken.',
            )
            .build(),
        },
        {
          field: 'email',
          // traditional form — also valid
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
      {errors.username?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
      {errors.username === null && <p style={{ color: 'green' }}>✓ Available</p>}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}

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
import { rule, useValiValid, TypeFile, FileSize, ValidationType } from 'vali-valid';

type MediaForm = { avatar: File | null; banner: File | null };

export function FileUploadForm() {
  const { form, errors, isValidating, handleChange, validate } =
    useValiValid<MediaForm>({
      initial: { avatar: null, banner: null },
      validations: [
        {
          field: 'avatar',
          validations: rule()
            .required()
            .fileType([TypeFile.JPG, TypeFile.PNG])
            .fileSize(FileSize['2MB'])
            .imageAspectRatio({ width: 1, height: 1 }, 0.02, 'Avatar must be square (1:1).')
            .imageMinDimensions({ width: 200, height: 200 })
            .imageMaxDimensions({ width: 2000, height: 2000 })
            .build(),
        },
        {
          field: 'banner',
          // traditional form — also valid
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
        {errors.avatar?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
      </div>

      <div>
        <label>Banner (JPG/PNG, 16:9, max 5MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleChange('banner', e.target.files?.[0] ?? null)}
        />
        {errors.banner?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
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
import { rule, useValiValid, ValidationType } from 'vali-valid';

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
        { field: 'name',  validations: rule().required().minLength(2).build() },
        {
          field: 'email',
          // traditional form — also valid
          validations: [{ type: ValidationType.Required }, { type: ValidationType.Email }],
        },
      ],
    });

  const next = async () => {
    const errs = await validate();
    if (Object.values(errs).some(Boolean)) return;

    if (step === 1) {
      clearFieldValidations('name');
      clearFieldValidations('email');
      setFieldValidations('shippingMethod', rule().required().build());
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
      setFieldValidations('cardNumber', rule().required().creditCard().build());
      setFieldValidations('cvv', rule().required().digitsOnly().minLength(3).build());
    }

    setStep((s) => s + 1);
  };

  return (
    <div>
      <p>Step {step} of 3</p>

      {step === 1 && (
        <>
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full name" />
          {errors.name?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
          <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Email" />
          {errors.email?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
        </>
      )}

      {step === 2 && (
        <>
          <select value={form.shippingMethod} onChange={(e) => handleChange('shippingMethod', e.target.value)}>
            <option value="">Choose…</option>
            <option value="pickup">Store pickup</option>
            <option value="home">Home delivery</option>
          </select>
          {errors.shippingMethod?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
          {form.shippingMethod === 'home' && (
            <>
              <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Address" />
              {errors.address?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
            </>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <input value={form.cardNumber} onChange={(e) => handleChange('cardNumber', e.target.value)} placeholder="Card number" />
          {errors.cardNumber?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
          <input value={form.cvv} onChange={(e) => handleChange('cvv', e.target.value)} placeholder="CVV" />
          {errors.cvv?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
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
import { rule, useValiValid, ValidationType } from 'vali-valid';

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
          validations: rule().required().minLength(3).slug().build(),
        },
        {
          field: 'role',
          // traditional form — also valid
          validations: [{ type: ValidationType.Required }],
        },
      ],
    });

  // Swap rules when role changes
  const handleRoleChange = (role: string) => {
    handleChange('role', role);
    if (role === 'admin') {
      setFieldValidations('username', rule()
        .required()
        .minLength(6)
        .alphaNumeric()
        .build()
      );
    } else {
      setFieldValidations('username', rule()
        .required()
        .minLength(3)
        .slug()
        .build()
      );
    }
  };

  // Activate / deactivate promo code field
  const togglePromo = (active: boolean) => {
    setHasPromo(active);
    if (active) {
      addFieldValidation('promoCode', rule()
        .required()
        .exactLength(8)
        .upperCase()
        .build()
      );
    } else {
      clearFieldValidations('promoCode');
      handleChange('promoCode', '');
    }
  };

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <input value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="Username" />
      {errors.username?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}

      <select value={form.role} onChange={(e) => handleRoleChange(e.target.value)}>
        <option value="">Select role…</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}

      <label>
        <input type="checkbox" checked={hasPromo} onChange={(e) => togglePromo(e.target.checked)} />
        {' '}I have a promo code
      </label>
      {hasPromo && (
        <>
          <input value={form.promoCode} onChange={(e) => handleChange('promoCode', e.target.value.toUpperCase())} placeholder="ABCD1234" maxLength={8} />
          {errors.promoCode?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
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
import { ValiValid, rule, ValidationType, DateFormat } from 'vali-valid';

// ── 1. Sync validation ──────────────────────────────────────────────────────

type UserDto = { username: string; email: string; age: number };

const validator = new ValiValid<UserDto>([
  {
    field: 'username',
    validations: rule().required().minLength(3).slug().build(),
  },
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'age',
    isNumber: true,
    // traditional form — also valid
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
    validations: rule()
      .required()
      .asyncPattern(
        async (value) => {
          await new Promise((r) => setTimeout(r, 200));
          return !['PROD-001', 'PROD-002'].includes(value);
        },
        'SKU already exists.',
      )
      .build(),
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
  { field: 'clientName', validations: rule().required().build() },
]);

// Add rules programmatically
invoiceValidator.addFieldValidation('vatNumber', rule()
  .required()
  .exactLength(9)
  .build()
);

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
import { rule, setLocale, getLocale, useValiValid, ValidationType } from 'vali-valid';

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
      validations: rule().required().email().build(),
      // → 'Campo obligatorio.' / 'El formato de correo electrónico no es válido.'
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
import { rule, useValiValid, ValidationType } from 'vali-valid';

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
        validations: rule().required().minLength(2).build(),
      },
      {
        field: 'email',
        validations: rule().required().email().build(),
      },
      {
        field: 'message',
        // traditional form — also valid
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
import { ValiValid, rule, ValidationType } from 'vali-valid';

type PriceForm = { price: number; discount: number; tax: number };

const validator = new ValiValid<PriceForm>([
  {
    field: 'price',
    isDecimal: true,
    validations: rule()
      .required()
      .greaterThan(0, 'Price must be positive.')
      .lessThan(10000, 'Price cannot exceed $10,000.')
      .precision(2, 'Max 2 decimal places.')
      .build(),
  },
  {
    field: 'discount',
    isDecimal: true,
    validations: rule()
      .greaterThan(-1)  // >= 0
      .lessThan(100)    // < 100%
      .precision(2)
      .build(),
  },
  {
    field: 'tax',
    isDecimal: true,
    // traditional form — also valid
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
import { ValiValid, rule, ValidationType } from 'vali-valid';

type EventForm = { startDate: string; endDate: string };

const eventValidator = new ValiValid<EventForm>([
  {
    field: 'startDate',
    validations: rule()
      .required()
      .dateAfter(new Date(), 'Start date must be in the future.')
      .build(),
  },
  {
    field: 'endDate',
    // traditional form — also valid
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
import { ValiValid, rule, ValidationType } from 'vali-valid';

type SettingsForm = { theme: string; language: string };

const settingsValidator = new ValiValid<SettingsForm>([
  {
    field: 'theme',
    validations: rule()
      .oneOf(['light', 'dark', 'system'], 'Theme must be light, dark, or system.')
      .build(),
  },
  {
    field: 'language',
    // traditional form — also valid
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
import { rule, useValiValid, ValidationType } from 'vali-valid';

type TagForm = { tags: string[]; categories: string[]; permissions: string[] };

const { form, errors, validate } = useValiValid<TagForm>({
  initial: { tags: [], categories: [], permissions: [] },
  validations: [
    {
      field: 'tags',
      validations: rule()
        .arrayMinLength(1, 'Add at least one tag.')
        .arrayMaxLength(10, 'Max 10 tags allowed.')
        .arrayUnique('Duplicate tags are not allowed.')
        .build(),
    },
    {
      field: 'categories',
      validations: rule().arrayMinLength(1).arrayUnique().build(),
    },
    {
      field: 'permissions',
      // traditional form — also valid
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
import { ValiValid, rule } from 'vali-valid';

type ListForm = { items: string[] };

const v = new ValiValid<ListForm>([
  {
    field: 'items',
    validations: rule()
      .arrayMinLength(2)
      .arrayMaxLength(5)
      .arrayUnique()
      .arrayContains('required-item')
      .build(),
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
import { rule, useValiValid, ValidationType } from 'vali-valid';

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
          // traditional form — also valid
          validations: [{ type: ValidationType.Required }],
        },
        {
          field: 'newPassword',
          validations: rule()
            .required()
            .passwordStrength()
            .notMatchField('currentPassword', 'New password must differ from the current one.')
            .build(),
        },
        {
          field: 'confirmNewPassword',
          validations: rule()
            .required()
            .matchField('newPassword', 'Passwords do not match.')
            .build(),
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
          {errors[field]?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
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
import { rule, useValiValid, ValidationType } from 'vali-valid';

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
        {
          field: 'method',
          // traditional form — also valid
          validations: [{ type: ValidationType.Required }],
        },
        {
          field: 'address',
          validations: rule()
            .requiredUnless(
              (f) => f.method === 'pickup',
              'Address is required for home delivery.',
            )
            .minLength(10)
            .build(),
        },
        {
          field: 'pickupStore',
          validations: rule()
            .requiredUnless(
              (f) => f.method === 'delivery',
              'Select a pickup store.',
            )
            .build(),
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
      {errors.method?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}

      {form.method === 'delivery' && (
        <>
          <input
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Street address"
          />
          {errors.address?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
        </>
      )}

      {form.method === 'pickup' && (
        <>
          <select value={form.pickupStore} onChange={(e) => handleChange('pickupStore', e.target.value)}>
            <option value="">Select store…</option>
            <option value="downtown">Downtown</option>
            <option value="mall">City Mall</option>
          </select>
          {errors.pickupStore?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
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
import { ValiValid, rule, ValidationType } from 'vali-valid';

type ScheduleForm = { openTime: string; closeTime: string; appointmentTime: string };

const v = new ValiValid<ScheduleForm>([
  {
    field: 'openTime',
    validations: rule().required().time('24h').build(),
  },
  {
    field: 'closeTime',
    validations: rule().required().time('24h').build(),
  },
  {
    field: 'appointmentTime',
    // traditional form — also valid
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
import { ValiValid, rule, ValidationType } from 'vali-valid';

type CommentForm = { body: string; title: string };

const v = new ValiValid<CommentForm>([
  {
    field: 'body',
    validations: rule()
      .required()
      .noHtml('HTML is not allowed in comments.')
      .maxLength(2000)
      .build(),
  },
  {
    field: 'title',
    // traditional form — also valid
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
import { ValiValid, rule } from 'vali-valid';

type BankForm = { iban: string };

const v = new ValiValid<BankForm>([
  {
    field: 'iban',
    validations: rule().required().iban('Enter a valid IBAN.').build(),
  },
]);

console.log(v.validateFieldSync('iban', 'GB82WEST12345698765432')); // null ✓
console.log(v.validateFieldSync('iban', 'GB00WEST12345698765432')); // error
```

### PostalCode

```ts
import { ValiValid, rule, ValidationType } from 'vali-valid';

const usValidator = new ValiValid<{ zipCode: string }>([
  {
    field: 'zipCode',
    validations: rule().required().postalCode('US').build(),
  },
]);

const deValidator = new ValiValid<{ zipCode: string }>([
  {
    field: 'zipCode',
    // traditional form — also valid
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
import { ValiValid, rule } from 'vali-valid';

type LocationForm = { lat: number; lng: number };

const v = new ValiValid<LocationForm>([
  {
    field: 'lat',
    isDecimal: true,
    validations: rule().required().latitude().build(),
  },
  {
    field: 'lng',
    isDecimal: true,
    validations: rule().required().longitude().build(),
  },
]);

console.log(v.validateSync({ lat: 40.7128, lng: -74.006 }));  // {} ✓ (New York)
console.log(v.validateSync({ lat: 91, lng: 181 }));            // { lat: '...', lng: '...' }
```

### SemVer

```ts
import { ValiValid, rule } from 'vali-valid';

type PackageForm = { version: string };

const v = new ValiValid<PackageForm>([
  {
    field: 'version',
    validations: rule().required().semVer('Version must follow X.Y.Z format.').build(),
  },
]);

console.log(v.validateFieldSync('version', '1.0.0'));          // null ✓
console.log(v.validateFieldSync('version', '1.0.0-beta.1'));   // null ✓
console.log(v.validateFieldSync('version', '1.0'));            // error
console.log(v.validateFieldSync('version', 'v1.0.0'));         // error
```

### Base64

```ts
import { ValiValid, rule, ValidationType } from 'vali-valid';

type EncodedForm = { payload: string; thumbnail: string };

const v = new ValiValid<EncodedForm>([
  {
    field: 'payload',
    validations: rule()
      .required()
      .base64('Payload must be a valid Base64 string.')
      .build(),
  },
  {
    field: 'thumbnail',
    // traditional form — also valid
    validations: [
      { type: ValidationType.Base64 },
    ],
  },
]);

console.log(v.validateFieldSync('payload', 'SGVsbG8gV29ybGQ=')); // null ✓
console.log(v.validateFieldSync('payload', 'not base64!'));       // error
```

---

## 14. v3.1.0 — builder syntax + criteriaMode

This example demonstrates the builder API alongside the traditional array syntax, and uses `criteriaMode: 'firstError'` so that each field shows only its first error at a time.

**Validators used:** `Required`, `MinLength`, `PasswordStrength`, `MatchField`

```tsx
import { rule, useValiValid, ValidationType } from 'vali-valid';

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordForm() {
  const { form, errors, isValid, handleChange, handleSubmit } =
    useValiValid<ChangePasswordForm>({
      initial: { currentPassword: '', newPassword: '', confirmPassword: '' },
      // criteriaMode: 'firstError' — each field shows only its first failing rule
      criteriaMode: 'firstError',
      validations: [
        {
          field: 'currentPassword',
          // Builder syntax
          validations: rule().required().minLength(8).build(),
        },
        {
          field: 'newPassword',
          // Builder syntax
          validations: rule().required().passwordStrength().build(),
        },
        {
          field: 'confirmPassword',
          // Traditional array syntax — also valid, both styles can be mixed
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

  const onSubmit = handleSubmit(async (data) => {
    await api.changePassword(data);
  });

  return (
    <form onSubmit={onSubmit}>
      {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
        <div key={field}>
          <input
            type="password"
            value={form[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field}
          />
          {/* criteriaMode:'firstError' guarantees at most one message per field */}
          {errors[field]?.map((e, i) => <p key={i} style={{ color: 'red' }}>{e}</p>)}
        </div>
      ))}
      <button type="submit" disabled={!isValid}>Update password</button>
    </form>
  );
}
```

---
