# ValiValid v3.1.0 — Documentación en Español

> Librería de validación de formularios para React con reglas síncronas y asíncronas, gestión dinámica de validaciones, y más de 74+ validadores integrados.

🇺🇸 [English version →](../en/README.md)

---

## Tabla de contenidos

| Archivo | Descripción |
|---------|-------------|
| [getting-started.md](./getting-started.md) | Instalación, configuración básica y primer ejemplo |
| [hook.md](./hook.md) | `useValiValid` — referencia completa de la API del hook |
| [validators.md](./validators.md) | Los 74+ `ValidationType` con parámetros y ejemplos |
| [async.md](./async.md) | Guía de validación asíncrona (`AsyncPattern` + validadores de imagen) |
| [dynamic.md](./dynamic.md) | Gestión de reglas en tiempo de ejecución (agregar / quitar / reemplazar) |
| [engine.md](./engine.md) | Clase `ValiValid` — uso avanzado sin React |
| [types.md](./types.md) | Referencia de tipos TypeScript, enums e interfaces |
| [architecture.md](./architecture.md) | Arquitectura interna con diagramas |

📂 **Ejemplos de código** → [examples/](../../examples/)

---

## Importaciones disponibles

```ts
// React (principal)
import { useValiValid, rule, ValidationType } from 'vali-valid';
import { useValiValid } from 'vali-valid/react';

// Motor central (sin dependencias de framework)
import { ValiValid, rule } from 'vali-valid/core';

// Adaptadores para otros frameworks
import { useValiValid } from 'vali-valid/vue';       // Vue 3 composable
import { createValiValid } from 'vali-valid/svelte'; // Svelte 4 stores
// Angular: usa vali-valid/core directamente
```

---

## Ejemplo rápido

```tsx
import { rule, useValiValid, ValidationType } from 'vali-valid';

type LoginForm = { email: string; password: string };

const { form, errors, isValid, handleChange, validate } = useValiValid<LoginForm>({
  initial: { email: '', password: '' },
  validations: [
    {
      field: 'email',
      validations: rule().required().email().build(),
    },
    {
      field: 'password',
      // forma tradicional — también funciona
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.PasswordStrength },
      ],
    },
  ],
});
```

---

## ¿Qué hay de nuevo en v3.1.0?

| Característica | v2 | v3.1.0 |
|----------------|----|----|
| Tipos de validación | 43 | 74+ |
| Frameworks soportados | Solo React | React, Vue 3, Svelte 4, Angular |
| Subpath exports | `vali-valid` | `vali-valid/react`, `vali-valid/vue`, `vali-valid/svelte`, `vali-valid/core` |
| Formato de build | CJS | CJS + ESM (dual build via tsup) |
| Errores por campo | `string \| null` | `string[] \| null` (array de mensajes) |
| Opciones del hook | `validateOnSubmit`, `debounceMs` | + `validateOnMount`, `asyncTimeout`, `criteriaMode` |
| Métodos del hook | — | `trigger()`, `clearErrors()` |
| i18n | en, es | en, es, pt, fr, de |
| Tests | 730 | 897 |
| Seguridad de tipos | 72% | 95%+ |

### ¿Qué hay de nuevo en v2? (referencia histórica)

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
