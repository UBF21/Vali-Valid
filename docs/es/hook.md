# `useValiValid` — Referencia de la API del hook

Es la API pública principal de ValiValid v3. Envuelve el motor `ValiValid` en un hook de React, gestionando el estado del formulario, los errores y el ciclo de vida de la validación asíncrona.

---

## Firma

```ts
function useValiValid<T extends Record<string, any>>(
  options: UseValiValidOptions<T>
): UseValiValidReturn<T>
```

---

## Opciones

```ts
interface UseValiValidOptions<T> {
  initial: T;
  validations?: FieldValidationConfig<T>[];
  validateOnSubmit?: boolean;  // solo valida después del primer submit
  debounceMs?: number;         // debounce para validaciones async (ms)
  // v3.1.0
  validateOnMount?: boolean;   // valida todos los campos al montar el componente
  asyncTimeout?: number;       // timeout en ms para validadores async (default 5000)
  criteriaMode?: 'firstError' | 'all';  // mostrar primer error o todos los errores por campo
}
```

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `initial` | `T` | Sí | Valores iniciales de todos los campos |
| `validations` | `FieldValidationConfig<T>[]` | No | Reglas de validación por campo |
| `validateOnSubmit` | `boolean` | No | Si `true`, suprime errores en tiempo real hasta el primer submit |
| `debounceMs` | `number` | No | Tiempo de espera en ms antes de ejecutar validaciones asíncronas |
| `validateOnMount` | `boolean` | No | Si `true`, ejecuta la validación completa al montar el componente |
| `asyncTimeout` | `number` | No | Tiempo máximo en ms antes de que un validador async se cancele. Por defecto `5000` |
| `criteriaMode` | `'firstError' \| 'all'` | No | `'firstError'` devuelve solo el primer error por campo (comportamiento v2); `'all'` devuelve todos los errores (por defecto en v3) |

### `FieldValidationConfig<T>`

```ts
type FieldValidationConfig<T> = {
  field: keyof T;                    // Nombre del campo
  validations: ValidationsConfig[];  // Array de reglas
  isNumber?: boolean;   // Elimina chars no numéricos → Number entero
  isDecimal?: boolean;  // Convierte directamente → Number decimal
  transform?: (value: any) => any;  // Transforma el valor antes de validar
  watchFields?: string[];           // Campos que al cambiar re-validan este campo
};
```

---

## Valor de retorno

```ts
interface UseValiValidReturn<T> {
  // Estado
  form: T;
  errors: FormErrors<T>;
  isValid: boolean;
  isValidating: boolean;
  isSubmitted: boolean;    // true después del primer handleSubmit
  submitCount: number;     // número de intentos de submit

  // Acciones
  handleChange: (field: keyof T, value: any) => void;
  handleSubmit: (onSubmit: (data: T) => Promise<void>) => () => Promise<void>;
  validate: () => Promise<FormErrors<T>>;
  reset: (initial?: Partial<T>) => void;
  setServerErrors: (errors: Partial<Record<keyof T, string[]>>) => void;
  setValues: (values: Partial<T>) => void;

  // v3.1.0 — Control de validación
  trigger: (field?: keyof T) => Promise<void>;  // dispara validación para uno o todos los campos
  clearErrors: (field?: keyof T) => void;       // limpia errores para uno o todos los campos

  // Gestión dinámica de reglas
  addFieldValidation: (field: keyof T, validations: ValidationsConfig[]) => void;
  removeFieldValidation: (field: keyof T, type: ValidationType) => void;
  setFieldValidations: (field: keyof T, validations: ValidationsConfig[]) => void;
  clearFieldValidations: (field: keyof T) => void;
}
```

---

## Propiedades de estado

### `form: T`

Valores actuales de todos los campos. Se actualiza en cada llamada a `handleChange`.

```tsx
<input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
```

### `errors: FormErrors<T>`

```ts
type FormErrors<T> = { [key in keyof T]?: string[] | null };
```

| Valor | Significado |
|-------|-------------|
| `string[]` | Validación fallida — array con todos los mensajes de error |
| `null` | Campo validado correctamente |
| `undefined` | Campo aún no validado |

```tsx
{/* Mostrar todos los errores */}
{errors.email?.map((msg, i) => <p key={i} className="error">{msg}</p>)}

{/* Mostrar solo el primero */}
{errors.email?.[0] && <p className="error">{errors.email[0]}</p>}
```

### `isSubmitted: boolean`

`true` después de que el usuario llama a `handleSubmit` por primera vez. Útil junto con `validateOnSubmit` para controlar cuándo se muestran los errores.

```tsx
{isSubmitted && errors.email?.map((msg, i) => <p key={i}>{msg}</p>)}
```

### `submitCount: number`

Número de veces que se ha llamado a `handleSubmit`. Empieza en `0`.

```tsx
{submitCount > 0 && <p>Ya intentaste enviar {submitCount} veces.</p>}
```

### `isValid: boolean`

`true` cuando todos los valores de `errors` son `null` o `undefined`. Se calcula en cada render sin estado adicional.

> **Consejo:** Usa `isValid` para deshabilitar el botón de envío, pero siempre llama a `validate()` al enviar el formulario para capturar los campos que el usuario no tocó.

### `isValidating: boolean`

`true` mientras alguna regla asíncrona está en ejecución. Útil para mostrar un spinner o deshabilitar el botón de envío durante validaciones en el servidor.

```tsx
<button disabled={!isValid || isValidating}>
  {isValidating ? 'Verificando…' : 'Enviar'}
</button>
```

---

## Acciones

### `handleChange(field, value)`

El manejador de cambio principal. Llámalo desde cualquier evento `onChange`.

**Qué hace:**

1. Sanitiza el valor (`isNumber` / `isDecimal`)
2. Actualiza el estado de `form`
3. Ejecuta la validación síncrona de inmediato → actualiza `errors`
4. Si el campo tiene reglas asíncronas: establece `isValidating = true`, ejecuta la validación asíncrona, actualiza `errors` y restablece `isValidating`

```tsx
<input
  value={form.username}
  onChange={(e) => handleChange('username', e.target.value)}
/>
```

Para checkboxes y selects:

```tsx
<select onChange={(e) => handleChange('pais', e.target.value)} />
<input
  type="checkbox"
  onChange={(e) => handleChange('aceptaTerminos', e.target.checked)}
/>
```

---

### `handleSubmit(onSubmit)`

Helper de submit de v3. Recibe una función `async` que se ejecuta solo si todas las validaciones pasan. Gestiona automáticamente `isSubmitted` y `submitCount`.

```tsx
const onSubmit = handleSubmit(async (data) => {
  await api.guardarPerfil(data);
});

return <form onSubmit={onSubmit}>…</form>;
```

Equivale a llamar a `validate()`, comprobar errores y llamar a tu función de envío — pero en una sola línea.

---

### `validate(): Promise<FormErrors<T>>`

Valida el formulario completo (síncronas + asíncronas). Llámalo al enviar para capturar campos no tocados por el usuario.

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const errores = await validate();

  const hayErrores = Object.values(errores).some(Boolean);
  if (!hayErrores) {
    await enviarFormulario(form);
  }
};
```

Devuelve un objeto `FormErrors<T>`. El hook también actualiza el estado `errors` automáticamente.

---

### `reset(initial?)`

Restablece el formulario y los errores. Pasa un objeto parcial para sobrescribir campos específicos.

```tsx
// Reset completo a los valores iniciales originales
reset();

// Reset con nuevos valores predeterminados
reset({ email: 'prefill@ejemplo.com' });
```

---

### `setServerErrors(errors)`

Inyecta errores del servidor directamente en el estado de errores del formulario. Ideal para manejar errores de validación retornados por una API tras el submit.

```tsx
const onSubmit = handleSubmit(async (data) => {
  const res = await api.registrar(data);
  if (res.errors) {
    // { email: ['Este email ya está registrado.'], username: ['Nombre de usuario no disponible.'] }
    setServerErrors(res.errors);
  }
});
```

---

### `setValues(values)`

Asigna múltiples campos del formulario a la vez sin disparar validación por campo individual.

```tsx
// Prellenar campos desde un perfil existente
setValues({
  nombre: usuario.nombre,
  email: usuario.email,
  bio: usuario.bio,
});
```

---

### `trigger(field?)` _(v3.1.0)_

Dispara la validación manualmente para un campo específico o para todos los campos del formulario. Útil cuando necesitas validar sin que el usuario haya interactuado con el campo.

```tsx
// Validar un campo específico
await trigger('email');

// Validar todos los campos (equivale a validate())
await trigger();
```

```tsx
// Ejemplo: validar al cambiar de pestaña en un formulario multi-paso
const handleNextStep = async () => {
  await trigger('nombre');
  await trigger('email');
  if (isValid) setStep(2);
};
```

---

### `clearErrors(field?)` _(v3.1.0)_

Limpia los errores de un campo específico o de todos los campos del formulario sin modificar los valores actuales.

```tsx
// Limpiar el error de un campo
clearErrors('email');

// Limpiar todos los errores
clearErrors();
```

```tsx
// Ejemplo: limpiar errores del servidor al re-editar el campo
<input
  value={form.email}
  onChange={(e) => {
    clearErrors('email');         // limpia el error mientras el usuario edita
    handleChange('email', e.target.value);
  }}
/>
```

---

## Gestión dinámica de reglas

Consulta [dynamic.md](./dynamic.md) para ejemplos detallados.

### `addFieldValidation(field, validations)`

Agrega nuevas reglas a un campo sin eliminar las existentes.

```ts
addFieldValidation('username', rule().minLength(3).build());
```

### `removeFieldValidation(field, type)`

Elimina todas las reglas de un tipo específico de un campo.

```ts
removeFieldValidation('username', ValidationType.MinLength);
```

### `setFieldValidations(field, validations)`

Reemplaza **todas** las reglas de un campo.

```ts
setFieldValidations('rol', rule().required().build());
```

### `clearFieldValidations(field)`

Elimina todas las reglas de validación de un campo. El valor del campo permanece en `form`.

```ts
clearFieldValidations('codigoCupon');
```

---

## Ejemplo completo con todas las funcionalidades

```tsx
import { rule, useValiValid, ValidationType, TypeFile, FileSize } from 'vali-valid';

type PerfilForm = {
  username: string;
  email: string;
  sitioWeb: string;
  avatar: File | null;
  bio: string;
};

function EditorPerfil() {
  const {
    form,
    errors,
    isValid,
    isValidating,
    handleChange,
    validate,
    reset,
  } = useValiValid<PerfilForm>({
    initial: {
      username: '',
      email: '',
      sitioWeb: '',
      avatar: null,
      bio: '',
    },
    validations: [
      {
        field: 'username',
        validations: rule()
          .required()
          .minLength(3)
          .maxLength(20)
          .slug()
          .build(),
      },
      {
        field: 'email',
        validations: rule()
          .required()
          .email()
          .asyncPattern(
            async (value) => {
              const res = await fetch(`/api/check-email?email=${value}`);
              const { disponible } = await res.json();
              return disponible;
            },
            'Este email ya está registrado.',
          )
          .build(),
      },
      {
        field: 'sitioWeb',
        // forma tradicional — también funciona
        validations: [{ type: ValidationType.Url }],
      },
      {
        field: 'avatar',
        validations: rule()
          .fileType([TypeFile.JPG, TypeFile.PNG])
          .fileSize(FileSize['2MB'])
          .imageAspectRatio({ width: 1, height: 1 }, 0, 'El avatar debe ser cuadrado (1:1).')
          .build(),
      },
      {
        field: 'bio',
        validations: rule().maxLength(160).build(),
      },
    ],
  });

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const errs = await validate();
      if (Object.values(errs).every((e) => !e)) {
        console.log('Guardar perfil', form);
      }
    }}>
      <input
        value={form.username}
        onChange={(e) => handleChange('username', e.target.value)}
        placeholder="username"
      />
      {errors.username?.map((msg, i) => <p key={i} style={{ color: 'red' }}>{msg}</p>)}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      {isValidating && <span>Verificando disponibilidad…</span>}
      {errors.email?.map((msg, i) => <p key={i} style={{ color: 'red' }}>{msg}</p>)}

      <input
        value={form.sitioWeb}
        onChange={(e) => handleChange('sitioWeb', e.target.value)}
        placeholder="https://…"
      />
      {errors.sitioWeb?.map((msg, i) => <p key={i} style={{ color: 'red' }}>{msg}</p>)}

      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
      />
      {errors.avatar?.map((msg, i) => <p key={i} style={{ color: 'red' }}>{msg}</p>)}

      <textarea
        value={form.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        maxLength={160}
      />
      {errors.bio?.map((msg, i) => <p key={i} style={{ color: 'red' }}>{msg}</p>)}

      <button type="submit" disabled={isValidating}>
        Guardar
      </button>
    </form>
  );
}
```
