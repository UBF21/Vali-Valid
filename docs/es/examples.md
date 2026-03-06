# Ejemplos

Ejemplos prácticos que cubren cada funcionalidad de ValiValid — desde formularios básicos hasta escenarios avanzados.

---

## Tabla de contenidos

1. [Formulario de login básico](#1-formulario-de-login-básico)
2. [Registro con confirmación de contraseña](#2-registro-con-confirmación-de-contraseña)
3. [Validación asíncrona](#3-validación-asíncrona)
4. [Subida de archivos con restricciones de imagen](#4-subida-de-archivos-con-restricciones-de-imagen)
5. [Formulario multi-paso](#5-formulario-multi-paso)
6. [Reglas dinámicas](#6-reglas-dinámicas)
7. [Motor ValiValid sin React](#7-motor-valiValid-sin-react)
8. [i18n — cambio de idioma en tiempo de ejecución](#8-i18n--cambio-de-idioma-en-tiempo-de-ejecución)
9. [validateOnBlur + touchedFields + dirtyFields](#9-validateonblur--touchedfields--dirtyfields)
10. [Nuevos validadores v2.1 — numérico y fecha](#10-nuevos-validadores-v21--numérico-y-fecha)
11. [Nuevos validadores v2.1 — arrays](#11-nuevos-validadores-v21--arrays)
12. [Nuevos validadores v2.1 — cross-field](#12-nuevos-validadores-v21--cross-field)
13. [Nuevos validadores v2.1 — formato y geo](#13-nuevos-validadores-v21--formato-y-geo)

---

## 1. Formulario de login básico

**Validadores usados:** `Required`, `Email`, `MinLength`

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
    if (!Object.values(errs).some(Boolean)) console.log('Enviar:', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Correo electrónico"
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <input
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Contraseña"
      />
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <button type="submit" disabled={!isValid}>Iniciar sesión</button>
      <button type="button" onClick={() => reset()}>Limpiar</button>
    </form>
  );
}
```

---

## 2. Registro con confirmación de contraseña

**Validadores usados:** `Required`, `Alpha`, `MinLength`, `MaxLength`, `Email`, `PasswordStrength`, `MatchField`

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
              message: 'Las contraseñas no coinciden.',
            },
          ],
        },
      ],
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = await validate();
    if (!Object.values(errs).some(Boolean)) console.log('Registrado');
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
      <button type="submit" disabled={!isValid}>Registrarse</button>
    </form>
  );
}
```

---

## 3. Validación asíncrona

**Validadores usados:** `Required`, `MinLength`, `Slug`, `AsyncPattern`

`asyncFn` recibe `(value, form)` para lógica asíncrona con campos cruzados.

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type SignupForm = { username: string; email: string };

async function verificarUsername(username: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 500));
  return !['admin', 'root'].includes(username);
}

async function verificarEmail(email: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 400));
  return !['usado@ejemplo.com'].includes(email);
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
              message: 'El nombre de usuario ya está en uso.',
              asyncFn: (value) => verificarUsername(value),
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
              message: 'Este correo ya está registrado.',
              asyncFn: (value) => verificarEmail(value),
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
        placeholder="Nombre de usuario"
      />
      {isValidating && <span>Verificando…</span>}
      {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
      {errors.username === null && <p style={{ color: 'green' }}>✓ Disponible</p>}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Correo electrónico"
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <button type="submit" disabled={isValidating}>
        {isValidating ? 'Validando…' : 'Crear cuenta'}
      </button>
    </form>
  );
}
```

---

## 4. Subida de archivos con restricciones de imagen

**Validadores usados:** `Required`, `FileType`, `FileSize`, `ImageAspectRatio`, `ImageMinDimensions`, `ImageMaxDimensions`

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
              message: 'El avatar debe ser cuadrado (1:1).',
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
              message: 'El banner debe ser 16:9.',
            },
          ],
        },
      ],
    });

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <div>
        <label>Avatar (JPG/PNG, cuadrado, 200–2000px, máx 2MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
        />
        {errors.avatar && <p style={{ color: 'red' }}>{errors.avatar}</p>}
      </div>

      <div>
        <label>Banner (JPG/PNG, 16:9, máx 5MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleChange('banner', e.target.files?.[0] ?? null)}
        />
        {errors.banner && <p style={{ color: 'red' }}>{errors.banner}</p>}
      </div>

      <button type="submit" disabled={isValidating}>
        {isValidating ? 'Verificando dimensiones…' : 'Subir'}
      </button>
    </form>
  );
}
```

---

## 5. Formulario multi-paso

**Demuestra:** `setFieldValidations`, `clearFieldValidations`, `RequiredIf`, `validate()` paso a paso

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

  const siguiente = async () => {
    const errs = await validate();
    if (Object.values(errs).some(Boolean)) return;

    if (step === 1) {
      clearFieldValidations('name');
      clearFieldValidations('email');
      setFieldValidations('shippingMethod', [{ type: ValidationType.Required }]);
      setFieldValidations('address', [
        {
          type: ValidationType.RequiredIf,
          condition: (f) => f.shippingMethod === 'domicilio',
          message: 'La dirección es obligatoria para entrega a domicilio.',
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
      <p>Paso {step} de 3</p>

      {step === 1 && (
        <>
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Nombre completo" />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Correo" />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <select value={form.shippingMethod} onChange={(e) => handleChange('shippingMethod', e.target.value)}>
            <option value="">Elegir…</option>
            <option value="retiro">Retiro en tienda</option>
            <option value="domicilio">Entrega a domicilio</option>
          </select>
          {errors.shippingMethod && <p style={{ color: 'red' }}>{errors.shippingMethod}</p>}
          {form.shippingMethod === 'domicilio' && (
            <>
              <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Dirección" />
              {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
            </>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <input value={form.cardNumber} onChange={(e) => handleChange('cardNumber', e.target.value)} placeholder="Número de tarjeta" />
          {errors.cardNumber && <p style={{ color: 'red' }}>{errors.cardNumber}</p>}
          <input value={form.cvv} onChange={(e) => handleChange('cvv', e.target.value)} placeholder="CVV" />
          {errors.cvv && <p style={{ color: 'red' }}>{errors.cvv}</p>}
        </>
      )}

      {step < 3
        ? <button onClick={siguiente} disabled={isValidating}>Siguiente →</button>
        : <button onClick={() => console.log('Pedido:', form)}>Confirmar pedido</button>
      }
    </div>
  );
}
```

---

## 6. Reglas dinámicas

**Demuestra:** `addFieldValidation`, `removeFieldValidation`, `setFieldValidations`, `clearFieldValidations`

```tsx
import { useState } from 'react';
import { useValiValid, ValidationType } from 'vali-valid';

type ProfileForm = { username: string; role: string; promoCode: string };

export function DynamicRulesForm() {
  const [hasPromo, setHasPromo] = useState(false);

  const { form, errors, isValid, handleChange, validate,
    addFieldValidation, setFieldValidations, clearFieldValidations } =
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

  // Cambiar reglas según el rol
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

  // Activar / desactivar campo de código promocional
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
      <input value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="Usuario" />
      {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}

      <select value={form.role} onChange={(e) => handleRoleChange(e.target.value)}>
        <option value="">Seleccionar rol…</option>
        <option value="user">Usuario</option>
        <option value="admin">Administrador</option>
      </select>
      {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>}

      <label>
        <input type="checkbox" checked={hasPromo} onChange={(e) => togglePromo(e.target.checked)} />
        {' '}Tengo un código promocional
      </label>
      {hasPromo && (
        <>
          <input value={form.promoCode} onChange={(e) => handleChange('promoCode', e.target.value.toUpperCase())} placeholder="ABCD1234" maxLength={8} />
          {errors.promoCode && <p style={{ color: 'red' }}>{errors.promoCode}</p>}
        </>
      )}

      <button type="submit" disabled={!isValid}>Guardar</button>
    </form>
  );
}
```

---

## 7. Motor ValiValid sin React

Usa `ValiValid` directamente en Node.js, scripts o código del lado del servidor.

```ts
import { ValiValid, ValidationType, DateFormat } from 'vali-valid';

// ── 1. Validación sincrónica ────────────────────────────────────────────────

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

const errores = validator.validateSync({ username: 'j', email: 'mal', age: 15 });
console.log(errores); // { username: '...', email: '...', age: '...' }

// ── 2. Verificación de un campo individual ──────────────────────────────────

console.log(validator.validateFieldSync('email', 'ok@ok.com')); // null
console.log(validator.validateFieldSync('email', 'mal'));        // mensaje de error

// ── 3. Validación asíncrona ─────────────────────────────────────────────────

type ProductDto = { sku: string; price: number };

const productValidator = new ValiValid<ProductDto>([
  {
    field: 'sku',
    validations: [
      { type: ValidationType.Required },
      {
        type: ValidationType.AsyncPattern,
        message: 'El SKU ya existe.',
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
  console.log(errs); // { sku: 'El SKU ya existe.', price: '...' }
})();

// ── 4. Gestión dinámica de reglas ───────────────────────────────────────────

type InvoiceForm = { clientName: string; vatNumber: string };

const invoiceValidator = new ValiValid<InvoiceForm>([
  { field: 'clientName', validations: [{ type: ValidationType.Required }] },
]);

// Agregar reglas dinámicamente
invoiceValidator.addFieldValidation('vatNumber', [
  { type: ValidationType.Required },
  { type: ValidationType.ExactLength, value: 9 },
]);

console.log(invoiceValidator.validateFieldSync('vatNumber', '')); // Campo obligatorio.

// Quitar y limpiar
invoiceValidator.clearFieldValidations('vatNumber');
console.log(invoiceValidator.validateFieldSync('vatNumber', '')); // null (sin reglas)
```

---

## 8. i18n — cambio de idioma en tiempo de ejecución

Llama a `setLocale` **antes** de crear el motor (los mensajes se resuelven al registrar las reglas).

```ts
import { setLocale, getLocale, useValiValid, ValidationType } from 'vali-valid';

// El locale por defecto es 'en'
console.log(getLocale()); // 'en'

// Cambiar a español globalmente
setLocale('es');

// Todos los motores creados a partir de este punto usarán mensajes en español
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

> **Consejo:** Llama `setLocale` una vez al inicio de la app (por ejemplo, en tu bootstrap de i18n) antes de que monte cualquier componente.

```ts
// app/i18n.ts
import { setLocale } from 'vali-valid';

export function initLocale(lang: 'en' | 'es') {
  setLocale(lang);
}

// En main.tsx / App.tsx
initLocale(navigator.language.startsWith('es') ? 'es' : 'en');
```

---

## 9. validateOnBlur + touchedFields + dirtyFields

Con `validateOnBlur: true`, los errores solo aparecen cuando el usuario abandona un campo.
`touchedFields` registra qué campos recibieron interacción; `dirtyFields` registra cuáles difieren del valor inicial.

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
    validateOnBlur: true,   // los errores aparecen al salir del campo, no al escribir
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

  // Mostrar error solo si el campo fue tocado
  const mostrarError = (field: keyof ContactForm) =>
    touchedFields.has(field) ? errors[field] : null;

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <div>
        <input
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}   // marca como tocado + valida
          placeholder="Nombre"
        />
        {/* Indicador de campo modificado */}
        {dirtyFields.has('name') && <span style={{ fontSize: 11, color: '#6b7280' }}> (editado)</span>}
        {mostrarError('name') && <p style={{ color: 'red' }}>{mostrarError('name')}</p>}
      </div>

      <div>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="Correo electrónico"
        />
        {mostrarError('email') && <p style={{ color: 'red' }}>{mostrarError('email')}</p>}
      </div>

      <div>
        <textarea
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder="Mensaje (mín 10 caracteres)"
        />
        {mostrarError('message') && <p style={{ color: 'red' }}>{mostrarError('message')}</p>}
      </div>

      <p style={{ fontSize: 13, color: '#6b7280' }}>
        Tocados: {touchedFields.size} / Modificados: {dirtyFields.size}
      </p>

      <button type="submit" disabled={!isValid}>Enviar</button>
      <button type="button" onClick={() => reset()}>Restablecer</button>
    </form>
  );
}
```

---

## 10. Nuevos validadores v2.1 — numérico y fecha

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
      { type: ValidationType.GreaterThan, value: 0, message: 'El precio debe ser positivo.' },
      { type: ValidationType.LessThan,    value: 10000, message: 'El precio no puede superar $10.000.' },
      { type: ValidationType.Precision,   value: 2, message: 'Máximo 2 decimales.' },
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
      { type: ValidationType.Precision, value: 4 }, // ej. 0.1525
    ],
  },
]);

console.log(validator.validateSync({ price: 99.999, discount: 101, tax: 0.12345 }));
// { price: 'Máximo 2 decimales.', discount: '...menor que 100...', tax: '...máx 4...' }
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
      { type: ValidationType.DateAfter, value: new Date(), message: 'La fecha de inicio debe ser futura.' },
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
        message: 'El tema debe ser light, dark o system.',
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

console.log(settingsValidator.validateFieldSync('theme', 'blue'));    // error
console.log(settingsValidator.validateFieldSync('theme', 'dark'));    // null
console.log(settingsValidator.validateFieldSync('language', 'jp'));   // error
```

---

## 11. Nuevos validadores v2.1 — arrays

### ArrayMinLength, ArrayMaxLength, ArrayUnique, ArrayContains

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type TagForm = { tags: string[]; categories: string[]; permissions: string[] };

const { form, errors, validate, handleChange } = useValiValid<TagForm>({
  initial: { tags: [], categories: [], permissions: [] },
  validations: [
    {
      field: 'tags',
      validations: [
        { type: ValidationType.ArrayMinLength, value: 1, message: 'Agrega al menos una etiqueta.' },
        { type: ValidationType.ArrayMaxLength, value: 10, message: 'Máximo 10 etiquetas.' },
        { type: ValidationType.ArrayUnique, message: 'No se permiten etiquetas duplicadas.' },
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
          message: 'El permiso "read" es obligatorio.',
        },
        { type: ValidationType.ArrayMaxLength, value: 5 },
      ],
    },
  ],
});
```

```ts
// Verificaciones independientes
import { ValiValid, ValidationType } from 'vali-valid';

type ListForm = { items: string[] };

const v = new ValiValid<ListForm>([
  {
    field: 'items',
    validations: [
      { type: ValidationType.ArrayMinLength, value: 2 },
      { type: ValidationType.ArrayMaxLength, value: 5 },
      { type: ValidationType.ArrayUnique },
      { type: ValidationType.ArrayContains, value: 'obligatorio' },
    ],
  },
]);

console.log(v.validateFieldSync('items', []));                                  // error min
console.log(v.validateFieldSync('items', ['a', 'a']));                          // error unique
console.log(v.validateFieldSync('items', ['obligatorio', 'b']));                // null ✓
console.log(v.validateFieldSync('items', ['obligatorio', 'b', 'c', 'd', 'e', 'f'])); // error max
```

---

## 12. Nuevos validadores v2.1 — cross-field

### NotMatchField

Asegura que un campo **no** sea igual a otro (ej. contraseña nueva ≠ contraseña actual).

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
              message: 'La nueva contraseña debe ser diferente a la actual.',
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
              message: 'Las contraseñas no coinciden.',
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
      <button type="submit" disabled={!isValid}>Actualizar contraseña</button>
    </form>
  );
}
```

### RequiredUnless

El campo es obligatorio **a menos que** la condición sea verdadera.

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type ShippingForm = {
  method: 'retiro' | 'domicilio' | '';
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
              // No es obligatorio cuando el método es retiro
              condition: (f) => f.method === 'retiro',
              message: 'La dirección es obligatoria para entrega a domicilio.',
            },
            { type: ValidationType.MinLength, value: 10 },
          ],
        },
        {
          field: 'pickupStore',
          validations: [
            {
              type: ValidationType.RequiredUnless,
              // No es obligatorio cuando el método es domicilio
              condition: (f) => f.method === 'domicilio',
              message: 'Selecciona una tienda de retiro.',
            },
          ],
        },
      ],
    });

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await validate(); }}>
      <select value={form.method} onChange={(e) => handleChange('method', e.target.value as any)}>
        <option value="">Seleccionar método…</option>
        <option value="retiro">Retiro en tienda</option>
        <option value="domicilio">Entrega a domicilio</option>
      </select>
      {errors.method && <p style={{ color: 'red' }}>{errors.method}</p>}

      {form.method === 'domicilio' && (
        <>
          <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Dirección" />
          {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
        </>
      )}

      {form.method === 'retiro' && (
        <>
          <select value={form.pickupStore} onChange={(e) => handleChange('pickupStore', e.target.value)}>
            <option value="">Seleccionar tienda…</option>
            <option value="centro">Centro</option>
            <option value="shopping">Shopping</option>
          </select>
          {errors.pickupStore && <p style={{ color: 'red' }}>{errors.pickupStore}</p>}
        </>
      )}

      <button type="submit">Continuar</button>
    </form>
  );
}
```

---

## 13. Nuevos validadores v2.1 — formato y geo

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

console.log(v.validateFieldSync('openTime', '09:30'));           // null ✓
console.log(v.validateFieldSync('openTime', '25:00'));           // error
console.log(v.validateFieldSync('appointmentTime', '02:30 PM')); // null ✓
console.log(v.validateFieldSync('appointmentTime', '14:00'));    // error (no es formato 12h)
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
      { type: ValidationType.NoHTML, message: 'No se permite HTML en los comentarios.' },
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

console.log(v.validateFieldSync('body', 'Hola mundo'));                       // null ✓
console.log(v.validateFieldSync('body', 'Hola <script>xss</script>'));        // error
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
      { type: ValidationType.IBAN, message: 'Ingresa un IBAN válido.' },
    ],
  },
]);

console.log(v.validateFieldSync('iban', 'GB82WEST12345698765432')); // null ✓
console.log(v.validateFieldSync('iban', 'GB00WEST12345698765432')); // error
```

### PostalCode

```ts
import { ValiValid, ValidationType } from 'vali-valid';

const arValidator = new ValiValid<{ zipCode: string }>([
  {
    field: 'zipCode',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.PostalCode, country: 'AR' },
    ],
  },
]);

const esValidator = new ValiValid<{ zipCode: string }>([
  {
    field: 'zipCode',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.PostalCode, country: 'ES' },
    ],
  },
]);

console.log(arValidator.validateFieldSync('zipCode', '1425'));   // null ✓ (Buenos Aires)
console.log(arValidator.validateFieldSync('zipCode', '999'));    // error
console.log(esValidator.validateFieldSync('zipCode', '28001')); // null ✓ (Madrid)
console.log(esValidator.validateFieldSync('zipCode', '2800'));  // error
```

Países soportados: `US`, `CA`, `UK`, `DE`, `FR`, `ES`, `IT`, `AU`, `NL`, `BR`, `MX`, `AR`.

### Latitude y Longitude

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

console.log(v.validateSync({ lat: -34.6037, lng: -58.3816 })); // {} ✓ (Buenos Aires)
console.log(v.validateSync({ lat: 91, lng: 181 }));             // { lat: '...', lng: '...' }
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
      { type: ValidationType.SemVer, message: 'La versión debe seguir el formato X.Y.Z.' },
    ],
  },
]);

console.log(v.validateFieldSync('version', '1.0.0'));         // null ✓
console.log(v.validateFieldSync('version', '1.0.0-beta.1')); // null ✓
console.log(v.validateFieldSync('version', '1.0'));           // error
console.log(v.validateFieldSync('version', 'v1.0.0'));        // error
```

### Base64

```ts
import { ValiValid, ValidationType } from 'vali-valid';

type EncodedForm = { payload: string };

const v = new ValiValid<EncodedForm>([
  {
    field: 'payload',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Base64, message: 'El payload debe ser una cadena Base64 válida.' },
    ],
  },
]);

console.log(v.validateFieldSync('payload', 'SGVsbG8gTXVuZG8=')); // null ✓
console.log(v.validateFieldSync('payload', 'no es base64!'));     // error
```

---

> Todos los ejemplos usan TypeScript. El uso en JavaScript es idéntico — solo se omiten las anotaciones de tipo.
