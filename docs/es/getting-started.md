# Primeros pasos

> **Nota v3:** `FormErrors<T>` ahora retorna `string[] | null` por campo (todos los errores, no solo el primero). Actualiza cualquier JSX que renderice `errors.campo` directamente — consulta [Mostrar errores](#mostrar-errores) más abajo. El hook también expone un helper `handleSubmit` y una opción `validateOnSubmit`.

## Requisitos

- React **≥ 16.8** (soporte de hooks)
- TypeScript **≥ 4.0** (recomendado)

---

## Instalación

```bash
npm install vali-valid
# o
yarn add vali-valid
# o
pnpm add vali-valid
```

---

## Ejemplo básico

### 1. Define el tipo de tu formulario

```tsx
type RegisterForm = {
  nombre: string;
  email: string;
  password: string;
  confirmarPassword: string;
};
```

### 2. Configura el hook

> **Nuevo en v3:** el builder fluido `rule()` es la sintaxis recomendada. El array de objetos planos funciona perfectamente y está completamente soportado — ambas formas son válidas.

```tsx
import { rule, useValiValid } from 'vali-valid';

const {
  form,
  errors,
  isValid,
  isValidating,
  handleChange,
  handleSubmit,
  validate,
  reset,
} = useValiValid<RegisterForm>({
  initial: {
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
  },
  validations: [
    {
      field: 'nombre',
      validations: rule().required().minLength(2).maxLength(50).alpha().build(),
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
      field: 'confirmarPassword',
      validations: rule().required().matchField('password', 'Las contraseñas no coinciden.').build(),
    },
  ],
});
```

### 3. Conecta el formulario

```tsx
export function FormularioRegistro() {
  const onSubmit = handleSubmit(async (data) => {
    console.log('Enviar:', data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        value={form.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
        placeholder="Nombre"
      />
      {errors.nombre?.map((msg, i) => <span key={i} className="error">{msg}</span>)}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email?.map((msg, i) => <span key={i} className="error">{msg}</span>)}

      <input
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Contraseña"
      />
      {errors.password?.map((msg, i) => <span key={i} className="error">{msg}</span>)}

      <input
        type="password"
        value={form.confirmarPassword}
        onChange={(e) => handleChange('confirmarPassword', e.target.value)}
        placeholder="Confirmar contraseña"
      />
      {errors.confirmarPassword?.map((msg, i) => <span key={i} className="error">{msg}</span>)}

      <button type="submit" disabled={!isValid || isValidating}>
        {isValidating ? 'Validando…' : 'Registrarse'}
      </button>
    </form>
  );
}
```

---

## Mostrar errores

En v3, cada campo puede tener **múltiples errores simultáneos**. `errors.campo` es `string[] | null | undefined`.

```tsx
// Mostrar todos los errores
{errors.email?.map((msg, i) => <p key={i} className="error">{msg}</p>)}

// Mostrar solo el primero
{errors.email?.[0] && <p className="error">{errors.email[0]}</p>}
```

---

## Validar solo al enviar (`validateOnSubmit`)

Usa `validateOnSubmit: true` para suprimir los errores en tiempo real hasta que el usuario intente enviar el formulario por primera vez.

```tsx
const { form, errors, handleChange, handleSubmit, isSubmitted } =
  useValiValid<RegisterForm>({
    initial: { ... },
    validateOnSubmit: true,   // los errores no se muestran hasta el primer submit
    validations: [...],
  });

const onSubmit = handleSubmit(async (data) => {
  await api.register(data);
});
```

---

## Campos numéricos

Usa `isNumber` o `isDecimal` para sanitizar automáticamente valores numéricos:

```tsx
{
  field: 'edad',
  isNumber: true,        // elimina caracteres no numéricos, convierte a entero
  validations: rule().required().numberRange(1, 120).build(),
}
```

```tsx
{
  field: 'precio',
  isDecimal: true,       // convierte directamente a Number decimal
  validations: rule().required().numberPositive().build(),
}
```

---

## Carga de archivos

```tsx
import { rule, useValiValid, TypeFile, FileSize } from 'vali-valid';

type SubirArchivoForm = { avatar: File | null };

const { form, errors, handleChange } = useValiValid<SubirArchivoForm>({
  initial: { avatar: null },
  validations: [
    {
      field: 'avatar',
      validations: rule()
        .required()
        .fileType([TypeFile.JPG, TypeFile.PNG])
        .fileSize(FileSize['2MB'])
        .imageMinDimensions({ width: 200, height: 200 }, 'El avatar debe ser de al menos 200×200 px.')
        .build(),
    },
  ],
});

// En el input:
<input
  type="file"
  accept="image/jpeg,image/png"
  onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
/>
{errors.avatar?.map((msg, i) => <span key={i}>{msg}</span>)}
```

---

## Pasos siguientes

- [Todos los validadores →](./validators.md)
- [Validación asíncrona →](./async.md)
- [Reglas dinámicas →](./dynamic.md)
- [API completa del hook →](./hook.md)
- [Builder fluido →](./builder.md)
- [Ejemplos de código →](../../examples/)
