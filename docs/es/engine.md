# Clase `ValiValid` — API del motor

La clase `ValiValid<T>` es el motor central detrás de `useValiValid`. Gestiona las reglas de validación directamente, sin ninguna dependencia de React. Úsala si necesitas:

- Validación en el servidor (Node.js)
- Hooks personalizados o componentes de clase
- Probar la lógica de validación de forma aislada
- Frameworks distintos a React

---

## Importación

```ts
import { ValiValid, rule } from 'vali-valid';
```

---

## Constructor

```ts
new ValiValid<T>(configs?: FieldValidationConfig<T>[], options?: ValiValidEngineOptions)
```

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `configs` | `FieldValidationConfig<T>[]` | No | Reglas de validación iniciales por campo |
| `options` | `ValiValidEngineOptions` | No | Opciones del motor (ver más abajo) |

### `ValiValidEngineOptions`

```ts
interface ValiValidEngineOptions {
  asyncTimeout?: number;                    // Timeout en ms para validadores async (default 5000)
  criteriaMode?: 'firstError' | 'all';     // Devolver solo el primer error o todos por campo
}
```

| Opción | Tipo | Por defecto | Descripción |
|--------|------|-------------|-------------|
| `asyncTimeout` | `number` | `5000` | Tiempo máximo en ms antes de que una promesa async se rechace con error de timeout. Aplica a `AsyncPattern` y validadores de imagen. |
| `criteriaMode` | `'firstError' \| 'all'` | `'all'` | `'firstError'` detiene la ejecución tras el primer error por campo; `'all'` ejecuta todas las reglas y acumula los mensajes en un array. |

```ts
// Ejemplo con opciones del motor
const motor = new ValiValid<Formulario>([...configs], {
  asyncTimeout: 3000,       // cancelar validaciones async si tardan más de 3 s
  criteriaMode: 'all',      // mostrar todos los errores por campo
});
```

```ts
import { ValiValid, rule, ValidationType } from 'vali-valid';

type Formulario = { email: string; edad: number };

const motor = new ValiValid<Formulario>([
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'edad',
    isNumber: true,
    // forma tradicional — también funciona
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.NumberRange, value: [18, 99] },
    ],
  },
]);
```

---

## Métodos de validación

### `validateSync(fields: T): FormErrors<T>`

Ejecuta todas las reglas síncronas contra un objeto de formulario completo. Devuelve un mapa de errores donde cada valor es `string[] | null`.

```ts
const errores = motor.validateSync({ email: 'no-es-email', edad: 15 });
// errores.email → ['Does not have email format.']
// errores.edad  → ['The value must be between 18 and 99.']

// Mostrar los errores en React:
errores.email?.map((msg, i) => <p key={i}>{msg}</p>)

// Comprobar si hay errores:
const hayErrores = Object.values(errores).some(Boolean);
```

### `validateFieldSync(field: keyof T, value: any): string[] | null`

Valida el valor de un único campo contra sus reglas síncronas. Devuelve un array de mensajes de error o `null` si la validación es exitosa.

```ts
motor.validateFieldSync('email', 'hola');    // ['Does not have email format.']
motor.validateFieldSync('email', 'a@b.co'); // null
```

### `validateAsync(fields: T): Promise<FormErrors<T>>`

Ejecuta primero las reglas síncronas, luego las asíncronas para los campos sin errores sync. Ejecuta todas las reglas async en paralelo.

```ts
const errores = await motor.validateAsync(formulario);
```

### `validateFieldAsync(field: keyof T, value: any, form: T): Promise<string | null>`

Valida un único campo ejecutando sync primero y luego async de forma secuencial.

```ts
const error = await motor.validateFieldAsync('avatar', archivo, formulario);
```

---

## Gestión dinámica de reglas

### `addFieldValidation(field, validations[]): void`

Agrega reglas a un campo (se combina con las existentes).

```ts
import { rule } from 'vali-valid';

motor.addFieldValidation('username', rule().slug().build());
```

### `removeFieldValidation(field, type): void`

Elimina todas las reglas de un tipo específico de un campo.

```ts
import { ValidationType } from 'vali-valid';

motor.removeFieldValidation('telefono', ValidationType.Required);
```

### `setFieldValidations(field, validations[]): void`

Reemplaza todas las reglas de un campo.

```ts
import { rule } from 'vali-valid';

motor.setFieldValidations('rol', rule().required().build());
```

### `clearFieldValidations(field): void`

Elimina todas las reglas de un campo.

```ts
motor.clearFieldValidations('campoOpcional');
```

### `hasAsyncRules(field): boolean`

Devuelve `true` si el campo tiene al menos una regla asíncrona.

```ts
motor.hasAsyncRules('avatar'); // true si FileDimensions, etc. están registrados
```

---

## Procesamiento de valores

### `getFieldValue(field: keyof T, value: any): any`

Sanitiza un valor según los metadatos `isNumber` / `isDecimal` del campo.

```ts
motor.getFieldValue('edad', '25abc');  // 25 (isNumber elimina chars no numéricos)
motor.getFieldValue('precio', '19.99'); // 19.99 (isDecimal convierte a Number)
motor.getFieldValue('nombre', 'Alicia'); // 'Alicia' (sin metadatos, pasa directo)
```

---

## Integración con otros frameworks

El motor `ValiValid` **no tiene dependencias de React**. Puedes usarlo en cualquier entorno JavaScript/TypeScript.

---

### Vue 3 (Composition API)

```vue
<!-- LoginForm.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { ValiValid, rule } from 'vali-valid';

type LoginForm = { email: string; password: string };

const form = ref<LoginForm>({ email: '', password: '' });
const errors = ref<Partial<Record<keyof LoginForm, string | null>>>({});
const enviando = ref(false);

const motor = new ValiValid<LoginForm>([
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'password',
    // forma tradicional — también funciona
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 8 },
    ],
  },
]);

const esValido = computed(() => !Object.values(errors.value).some(Boolean));

function handleChange(campo: keyof LoginForm, valor: string) {
  form.value = { ...form.value, [campo]: valor };
  errors.value = {
    ...errors.value,
    [campo]: motor.validateFieldSync(campo, valor),
  };
}

async function handleSubmit() {
  enviando.value = true;
  const todosLosErrores = motor.validateSync(form.value);
  errors.value = todosLosErrores;
  if (!Object.values(todosLosErrores).some(Boolean)) {
    await enviarAlApi(form.value);
  }
  enviando.value = false;
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
    <p v-if="errors.email" style="color: red">{{ errors.email }}</p>

    <input
      type="password"
      :value="form.password"
      @input="handleChange('password', ($event.target as HTMLInputElement).value)"
      placeholder="Contraseña"
    />
    <p v-if="errors.password" style="color: red">{{ errors.password }}</p>

    <button type="submit" :disabled="!esValido || enviando">Iniciar sesión</button>
  </form>
</template>
```

---

### Angular (Servicio + enfoque reactivo)

```ts
// validation.service.ts
import { Injectable } from '@angular/core';
import { ValiValid, rule } from 'vali-valid';

type LoginForm = { email: string; password: string };

@Injectable({ providedIn: 'root' })
export class LoginValidationService {
  private motor = new ValiValid<LoginForm>([
    {
      field: 'email',
      validations: rule().required().email().build(),
    },
    {
      field: 'password',
      validations: rule().required().minLength(8).build(),
    },
  ]);

  validarCampo(campo: keyof LoginForm, valor: string): string | null {
    return this.motor.validateFieldSync(campo, valor);
  }

  validarTodo(form: LoginForm): Partial<Record<keyof LoginForm, string | null>> {
    return this.motor.validateSync(form);
  }

  async validarTodoAsync(form: LoginForm) {
    return this.motor.validateAsync(form);
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
    <form (ngSubmit)="alEnviar()">
      <input
        type="email"
        [(ngModel)]="form.email"
        name="email"
        (ngModelChange)="alCambiarCampo('email', $event)"
        placeholder="Email"
      />
      <p *ngIf="errors.email" style="color: red">{{ errors.email }}</p>

      <input
        type="password"
        [(ngModel)]="form.password"
        name="password"
        (ngModelChange)="alCambiarCampo('password', $event)"
        placeholder="Contraseña"
      />
      <p *ngIf="errors.password" style="color: red">{{ errors.password }}</p>

      <button type="submit" [disabled]="!esValido">Iniciar sesión</button>
    </form>
  `,
})
export class LoginComponent {
  form = { email: '', password: '' };
  errors: Partial<Record<string, string | null>> = {};

  constructor(private validador: LoginValidationService) {}

  get esValido(): boolean {
    return !Object.values(this.errors).some(Boolean);
  }

  alCambiarCampo(campo: 'email' | 'password', valor: string) {
    this.errors = {
      ...this.errors,
      [campo]: this.validador.validarCampo(campo, valor),
    };
  }

  async alEnviar() {
    const todosLosErrores = await this.validador.validarTodoAsync(this.form);
    this.errors = todosLosErrores;
    if (!Object.values(todosLosErrores).some(Boolean)) {
      console.log('Enviando:', this.form);
    }
  }
}
```

---

### Node.js (validación del lado del servidor)

```ts
import { ValiValid, rule, setLocale } from 'vali-valid';

setLocale('es');

type CrearUsuarioDto = { username: string; email: string; edad: number };

const validador = new ValiValid<CrearUsuarioDto>([
  {
    field: 'username',
    validations: rule().required().minLength(3).alphaNumeric().build(),
  },
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'edad',
    isNumber: true,
    validations: rule().required().numberRange(18, 120).build(),
  },
]);

// Ejemplo de middleware Express / Fastify
export function validarCrearUsuario(body: unknown) {
  const errors = validador.validateSync(body as CrearUsuarioDto);
  const tieneErrores = Object.values(errors).some(Boolean);
  return { valido: !tieneErrores, errors };
}
```

---

## Ejemplo de uso standalone (sin React)

```ts
import { ValiValid, rule, ValidationType } from 'vali-valid';

type FormularioPedido = {
  email: string;
  cantidad: number;
  voucher: string;
};

const validador = new ValiValid<FormularioPedido>([
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'cantidad',
    isNumber: true,
    validations: rule().required().numberRange(1, 100).integer().build(),
  },
  {
    field: 'voucher',
    // forma tradicional — también funciona
    validations: [
      {
        type: ValidationType.AsyncPattern,
        message: 'Código de voucher inválido.',
        asyncFn: async (value) => {
          const res = await fetch(`/api/vouchers/${value}`);
          return res.ok;
        },
      },
    ],
  },
]);

// Solo sync
const erroresSync = validador.validateSync({
  email: 'malo',
  cantidad: 0,
  voucher: 'DESC10',
});

// Completo (sync + async)
const todosLosErrores = await validador.validateAsync({
  email: 'usuario@ejemplo.com',
  cantidad: 3,
  voucher: 'DESC10',
});
```

---

## Arquitectura interna

Consulta [architecture.md](./architecture.md) para un diagrama detallado de cómo el motor almacena y ejecuta las reglas.
