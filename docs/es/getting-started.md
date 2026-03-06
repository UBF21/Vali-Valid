# Primeros pasos

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

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

const {
  form,
  errors,
  isValid,
  isValidating,
  handleChange,
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
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.MinLength, value: 2 },
        { type: ValidationType.MaxLength, value: 50 },
        { type: ValidationType.Alpha },
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
      field: 'confirmarPassword',
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
```

### 3. Conecta el formulario

```tsx
export function FormularioRegistro() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errores = await validate();
    if (Object.values(errores).every((e) => !e)) {
      console.log('Enviar:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
        placeholder="Nombre"
      />
      {errors.nombre && <span className="error">{errors.nombre}</span>}

      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Contraseña"
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <input
        type="password"
        value={form.confirmarPassword}
        onChange={(e) => handleChange('confirmarPassword', e.target.value)}
        placeholder="Confirmar contraseña"
      />
      {errors.confirmarPassword && <span className="error">{errors.confirmarPassword}</span>}

      <button type="submit" disabled={!isValid || isValidating}>
        {isValidating ? 'Validando…' : 'Registrarse'}
      </button>
    </form>
  );
}
```

---

## Campos numéricos

Usa `isNumber` o `isDecimal` para sanitizar automáticamente valores numéricos:

```tsx
{
  field: 'edad',
  isNumber: true,        // elimina caracteres no numéricos, convierte a entero
  validations: [
    { type: ValidationType.Required },
    { type: ValidationType.NumberRange, value: [1, 120] },
  ],
}
```

```tsx
{
  field: 'precio',
  isDecimal: true,       // convierte directamente a Number decimal
  validations: [
    { type: ValidationType.Required },
    { type: ValidationType.NumberPositive },
  ],
}
```

---

## Carga de archivos

```tsx
import { useValiValid, ValidationType, TypeFile, FileSize } from 'vali-valid';

type SubirArchivoForm = { avatar: File | null };

const { form, errors, handleChange } = useValiValid<SubirArchivoForm>({
  initial: { avatar: null },
  validations: [
    {
      field: 'avatar',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.FileType, value: [TypeFile.JPG, TypeFile.PNG] },
        { type: ValidationType.FileSize, value: FileSize['2MB'] },
        {
          type: ValidationType.ImageMinDimensions,
          value: { width: 200, height: 200 },
          message: 'El avatar debe ser de al menos 200×200 px.',
        },
      ],
    },
  ],
});

// En el input:
<input
  type="file"
  accept="image/jpeg,image/png"
  onChange={(e) => handleChange('avatar', e.target.files?.[0] ?? null)}
/>
{errors.avatar && <span>{errors.avatar}</span>}
```

---

## Pasos siguientes

- [Todos los validadores →](./validators.md)
- [Validación asíncrona →](./async.md)
- [Reglas dinámicas →](./dynamic.md)
- [API completa del hook →](./hook.md)
