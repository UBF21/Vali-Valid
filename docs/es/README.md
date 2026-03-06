# ValiValid v2 — Documentación en Español

> Librería de validación de formularios para React con reglas síncronas y asíncronas, gestión dinámica de validaciones, y más de 43 validadores integrados.

🇺🇸 [English version →](../en/README.md)

---

## Tabla de contenidos

| Archivo | Descripción |
|---------|-------------|
| [getting-started.md](./getting-started.md) | Instalación, configuración básica y primer ejemplo |
| [hook.md](./hook.md) | `useValiValid` — referencia completa de la API del hook |
| [validators.md](./validators.md) | Los 43 `ValidationType` con parámetros y ejemplos |
| [async.md](./async.md) | Guía de validación asíncrona (`AsyncPattern` + validadores de imagen) |
| [dynamic.md](./dynamic.md) | Gestión de reglas en tiempo de ejecución (agregar / quitar / reemplazar) |
| [engine.md](./engine.md) | Clase `ValiValid` — uso avanzado sin React |
| [types.md](./types.md) | Referencia de tipos TypeScript, enums e interfaces |
| [architecture.md](./architecture.md) | Arquitectura interna con diagramas |

📂 **Ejemplos de código** → [examples/](../../examples/)

---

## Ejemplo rápido

```tsx
import { useValiValid, ValidationType } from 'vali-valid';

type LoginForm = { email: string; password: string };

const { form, errors, isValid, handleChange, validate } = useValiValid<LoginForm>({
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
        { type: ValidationType.PasswordStrength },
      ],
    },
  ],
});
```

---

## ¿Qué hay de nuevo en v2?

| Característica | v1 | v2 |
|----------------|----|----|
| API principal | clase `new ValiValid()` | hook `useValiValid` |
| Validación asíncrona | — | `AsyncPattern` + reglas de imagen |
| Reglas dinámicas | — | `addFieldValidation` / `removeFieldValidation` / `setFieldValidations` / `clearFieldValidations` |
| Estado de carga | — | `isValidating` |
| Reset de formulario | — | `reset(initial?)` |
| Tipos de validación | 18 | 43 |
| Bug `FileDimensions` | siempre `false` | corregido (ahora es async) |
| Bug mensaje `LowerCase` | mensaje incorrecto | corregido |
| Número `0` | tratado como vacío | tratado como válido |
| Campos requeridos | `field?`, `validations?` | `field`, `validations` (requeridos) |
