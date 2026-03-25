# `ValiValid` class — Engine API

The `ValiValid<T>` class is the core engine behind `useValiValid`. It manages validation rules directly, without any React dependency. Use it for:

- Server-side validation (Node.js)
- Custom hooks or class components
- Testing validation logic in isolation
- Non-React frameworks

---

## Import

```ts
import { ValiValid, rule } from 'vali-valid';
```

---

## Constructor

```ts
new ValiValid<T>(configs?: FieldValidationConfig<T>[], options?: ValiValidOptions)
```

### `ValiValidOptions`

```ts
interface ValiValidOptions {
  criteriaMode?: 'firstError' | 'all';  // default: 'all'
  locale?: string;                       // per-instance locale override (SSR-safe)
  asyncTimeout?: number;                 // ms timeout per async rule, 0 = no timeout (default)
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `criteriaMode` | `'all'` | `'all'` collects every failing rule message per field. `'firstError'` stops after the first failure and returns a single-element `string[]`. |
| `locale` | global locale | Overrides the global locale for this engine instance. Useful in SSR environments where each request may need a different language. |
| `asyncTimeout` | `0` | Races each async rule against a timer. If the rule does not resolve within `asyncTimeout` ms it is treated as passing (no error produced). |

```ts
import { ValiValid, rule, ValidationType } from 'vali-valid';

type Form = { email: string; age: number };

const engine = new ValiValid<Form>([
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
      { type: ValidationType.NumberRange, value: [18, 99] },
    ],
  },
]);
```

---

## Validation methods

### `validateSync(fields: T): FormErrors<T>`

```ts
const errors = engine.validateSync({ email: 'bad', age: 15 });
// errors.email → ['Does not have email format.']
// errors.age   → ['The value must be between 18 and 99.']
```

### `validateFieldSync(field, value): string[] | null`

```ts
engine.validateFieldSync('email', 'hello'); // ['Does not have email format.']
engine.validateFieldSync('email', 'a@b.co'); // null
```

### `validateAsync(fields: T): Promise<FormErrors<T>>`

```ts
const errors = await engine.validateAsync(form);
```

### `validateFieldAsync(field, value, form): Promise<string[] | null>`

```ts
const error = await engine.validateFieldAsync('avatar', file, form);
```

---

## Dynamic rule management

```ts
import { rule, ValidationType } from 'vali-valid';

engine.addFieldValidation('username', rule().slug().build());
engine.removeFieldValidation('phone', ValidationType.Required);
engine.setFieldValidations('role', rule().required().build());
engine.clearFieldValidations('optionalField');
engine.hasAsyncRules('avatar'); // boolean
```

---

## Value processing

```ts
engine.getFieldValue('age', '25abc');  // 25   (isNumber)
engine.getFieldValue('price', '9.99'); // 9.99 (isDecimal)
engine.getFieldValue('name', 'Alice'); // 'Alice' (no meta)
```

---

## Framework integration

The `ValiValid` engine has **zero React dependencies**. You can use it in any JavaScript/TypeScript environment.

---

### Vue 3 (Composition API)

```vue
<!-- LoginForm.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { ValiValid, rule } from 'vali-valid';

type LoginForm = { email: string; password: string };

const form = ref<LoginForm>({ email: '', password: '' });
const errors = ref<Partial<Record<keyof LoginForm, string[] | null>>>({});
const isSubmitting = ref(false);

const engine = new ValiValid<LoginForm>([
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'password',
    validations: rule().required().minLength(8).build(),
  },
]);

const isValid = computed(() => !Object.values(errors.value).some(Boolean));

function handleChange(field: keyof LoginForm, value: string) {
  form.value = { ...form.value, [field]: value };
  errors.value = {
    ...errors.value,
    [field]: engine.validateFieldSync(field, value),   // string[] | null
  };
}

async function handleSubmit() {
  isSubmitting.value = true;
  const allErrors = engine.validateSync(form.value);
  errors.value = allErrors;
  if (!Object.values(allErrors).some(Boolean)) {
    await submitToApi(form.value);
  }
  isSubmitting.value = false;
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input
      type="email"
      :value="form.email"
      @input="handleChange('email', ($event.target as HTMLInputElement).value)"
      placeholder="Email"
    />
    <p v-for="(msg, i) in errors.email" :key="i" style="color: red">{{ msg }}</p>

    <input
      type="password"
      :value="form.password"
      @input="handleChange('password', ($event.target as HTMLInputElement).value)"
      placeholder="Password"
    />
    <p v-for="(msg, i) in errors.password" :key="i" style="color: red">{{ msg }}</p>

    <button type="submit" :disabled="!isValid || isSubmitting">Sign in</button>
  </form>
</template>
```

---

### Angular (Service + Reactive approach)

```ts
// validation.service.ts
import { Injectable } from '@angular/core';
import { ValiValid, rule } from 'vali-valid';

type LoginForm = { email: string; password: string };

@Injectable({ providedIn: 'root' })
export class LoginValidationService {
  private engine = new ValiValid<LoginForm>([
    {
      field: 'email',
      validations: rule().required().email().build(),
    },
    {
      field: 'password',
      validations: rule().required().minLength(8).build(),
    },
  ]);

  validateField(field: keyof LoginForm, value: string): string[] | null {
    return this.engine.validateFieldSync(field, value);
  }

  validateAll(form: LoginForm): Partial<Record<keyof LoginForm, string[] | null>> {
    return this.engine.validateSync(form);
  }

  async validateAllAsync(form: LoginForm) {
    return this.engine.validateAsync(form);
  }
}
```

```ts
// login.component.ts
import { Component } from '@angular/core';
import { LoginValidationService } from './validation.service';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        type="email"
        [(ngModel)]="form.email"
        name="email"
        (ngModelChange)="onFieldChange('email', $event)"
        placeholder="Email"
      />
      <p *ngFor="let msg of errors.email" style="color: red">{{ msg }}</p>

      <input
        type="password"
        [(ngModel)]="form.password"
        name="password"
        (ngModelChange)="onFieldChange('password', $event)"
        placeholder="Password"
      />
      <p *ngFor="let msg of errors.password" style="color: red">{{ msg }}</p>

      <button type="submit" [disabled]="!isValid">Sign in</button>
    </form>
  `,
})
export class LoginComponent {
  form = { email: '', password: '' };
  errors: Partial<Record<string, string[] | null>> = {};

  constructor(private validator: LoginValidationService) {}

  get isValid(): boolean {
    return !Object.values(this.errors).some(Boolean);
  }

  onFieldChange(field: 'email' | 'password', value: string) {
    this.errors = {
      ...this.errors,
      [field]: this.validator.validateField(field, value),
    };
  }

  async onSubmit() {
    const allErrors = await this.validator.validateAllAsync(this.form);
    this.errors = allErrors;
    if (!Object.values(allErrors).some(Boolean)) {
      console.log('Submit:', this.form);
    }
  }
}
```

---

### Node.js (server-side validation)

```ts
import { ValiValid, rule, setLocale } from 'vali-valid';

setLocale('en');

type CreateUserDto = { username: string; email: string; age: number };

const validator = new ValiValid<CreateUserDto>([
  {
    field: 'username',
    validations: rule().required().minLength(3).alphaNumeric().build(),
  },
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'age',
    isNumber: true,
    validations: rule().required().numberRange(18, 120).build(),
  },
]);

// Express / Fastify middleware example
export function validateCreateUser(body: unknown) {
  const errors = validator.validateSync(body as CreateUserDto);
  const hasErrors = Object.values(errors).some(Boolean);
  return { valid: !hasErrors, errors };
}
```

---

## Standalone example

```ts
import { ValiValid, rule, ValidationType } from 'vali-valid';

type OrderForm = {
  email: string;
  quantity: number;
  voucher: string;
};

const validator = new ValiValid<OrderForm>([
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'quantity',
    isNumber: true,
    validations: rule().required().numberRange(1, 100).integer().build(),
  },
  {
    field: 'voucher',
    // traditional form — also valid
    validations: [
      {
        type: ValidationType.AsyncPattern,
        message: 'Invalid voucher code.',
        asyncFn: async (value) => {
          const res = await fetch(`/api/vouchers/${value}`);
          return res.ok;
        },
      },
    ],
  },
]);

const syncErrors = validator.validateSync({ email: 'bad', quantity: 0, voucher: 'V1' });
const allErrors  = await validator.validateAsync({ email: 'u@ex.com', quantity: 3, voucher: 'V1' });
```
