# `useValiValid` — Referencia de la API del hook

Es la API pública principal de ValiValid v2. Envuelve el motor `ValiValid` en un hook de React, gestionando el estado del formulario, los errores y el ciclo de vida de la validación asíncrona.

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
}
```

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `initial` | `T` | Sí | Valores iniciales de todos los campos |
| `validations` | `FieldValidationConfig<T>[]` | No | Reglas de validación por campo |

### `FieldValidationConfig<T>`

```ts
type FieldValidationConfig<T> = {
  field: keyof T;                    // Nombre del campo
  validations: ValidationsConfig[];  // Array de reglas
  isNumber?: boolean;   // Elimina chars no numéricos → Number entero
  isDecimal?: boolean;  // Convierte directamente → Number decimal
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

  // Acciones
  handleChange: (field: keyof T, value: any) => void;
  validate: () => Promise<FormErrors<T>>;
  reset: (initial?: Partial<T>) => void;

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
type FormErrors<T> = { [key in keyof T]?: string | null };
```

| Valor | Significado |
|-------|-------------|
| `string` | Validación fallida — mensaje a mostrar |
| `null` | Campo validado correctamente |
| `undefined` | Campo aún no validado |

```tsx
{errors.email && <p className="error">{errors.email}</p>}
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

## Gestión dinámica de reglas

Consulta [dynamic.md](./dynamic.md) para ejemplos detallados.

### `addFieldValidation(field, validations)`

Agrega nuevas reglas a un campo sin eliminar las existentes.

```ts
addFieldValidation('username', [
  { type: ValidationType.MinLength, value: 3 },
]);
```

### `removeFieldValidation(field, type)`

Elimina todas las reglas de un tipo específico de un campo.

```ts
removeFieldValidation('username', ValidationType.MinLength);
```

### `setFieldValidations(field, validations)`

Reemplaza **todas** las reglas de un campo.

```ts
setFieldValidations('rol', [
  { type: ValidationType.Required },
]);
```

### `clearFieldValidations(field)`

Elimina todas las reglas de validación de un campo. El valor del campo permanece en `form`.

```ts
clearFieldValidations('codigoCupon');
```

---

## Ejemplo completo con todas las funcionalidades

```tsx
import { useValiValid, ValidationType, TypeFile, FileSize } from 'vali-valid';

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
        validations: [
          { type: ValidationType.Required },
          { type: ValidationType.MinLength, value: 3 },
          { type: ValidationType.MaxLength, value: 20 },
          { type: ValidationType.Slug },
        ],
      },
      {
        field: 'email',
        validations: [
          { type: ValidationType.Required },
          { type: ValidationType.Email },
          {
            type: ValidationType.AsyncPattern,
            message: 'Este email ya está registrado.',
            asyncFn: async (value) => {
              const res = await fetch(`/api/check-email?email=${value}`);
              const { disponible } = await res.json();
              return disponible;
            },
          },
        ],
      },
      {
        field: 'sitioWeb',
        validations: [{ type: ValidationType.Url }],
      },
      {
        field: 'avatar',
        validations: [
          { type: ValidationType.FileType, value: [TypeFile.JPG, TypeFile.PNG] },
          { type: ValidationType.FileSize, value: FileSize['2MB'] },
          {
            type: ValidationType.ImageAspectRatio,
            value: { width: 1, height: 1 },
            message: 'El avatar debe ser cuadrado (1:1).',
          },
        ],
      },
      {
        field: 'bio',
        validations: [
          { type: ValidationType.MaxLength, value: 160 },
        ],
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
      {errors.username && <p>{errors.username}</p>}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      {isValidating && <span>Verificando disponibilidad…</span>}
      {errors.email && <p>{errors.email}</p>}

      <input
        value={form.sitioWeb}
        onChange={(e) => handleChange('sitioWeb', e.target.value)}
        placeholder="https://…"
      />
      {errors.sitioWeb && <p>{errors.sitioWeb}</p>}

      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
      />
      {errors.avatar && <p>{errors.avatar}</p>}

      <textarea
        value={form.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        maxLength={160}
      />
      {errors.bio && <p>{errors.bio}</p>}

      <button type="submit" disabled={isValidating}>
        Guardar
      </button>
    </form>
  );
}
```
