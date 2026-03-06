# Arquitectura interna

Descripción técnica de cómo funciona ValiValid v2 por dentro, con diagramas de capas, flujos de ejecución y estructura de datos.

---

## Capas del sistema

```mermaid
graph TB
    subgraph "API pública"
        HOOK["useValiValid&lt;T&gt;\n(hook de React)"]
    end

    subgraph "Motor de validación"
        ENGINE["ValiValid&lt;T&gt;\n(clase)"]
        SYNC_MAP["_syncRules\nMap&lt;field, SyncRule[]&gt;"]
        ASYNC_MAP["_asyncRules\nMap&lt;field, AsyncRule[]&gt;"]
        META_MAP["_fieldMeta\nMap&lt;field, {isNumber, isDecimal}&gt;"]
    end

    subgraph "Reglas"
        SYNC_RULE["SyncRule\n{ type, field, message, validate }"]
        ASYNC_RULE["AsyncRule\n{ type, field, message, asyncFn }"]
    end

    subgraph "Definiciones"
        VALIDATORS["Validators.ts\nValidationType enum\n+ 43 config types"]
        CONSTANTS["constants/index.ts\nRegex + funciones de validación\n+ mensajes por defecto"]
        TYPES["types/index.ts\nFieldValidationConfig\nFormErrors\nSyncRule / AsyncRule"]
    end

    HOOK -->|"useRef(engine)"| ENGINE
    ENGINE --> SYNC_MAP
    ENGINE --> ASYNC_MAP
    ENGINE --> META_MAP
    SYNC_MAP --> SYNC_RULE
    ASYNC_MAP --> ASYNC_RULE
    ENGINE -->|"importa"| VALIDATORS
    ENGINE -->|"importa"| CONSTANTS
    ENGINE -->|"importa"| TYPES
    HOOK -->|"importa"| TYPES
```

---

## Estructura de archivos

```
src/
├── index.ts                  ← Re-exports públicos
├── types/
│   └── index.ts              ← Tipos: FormErrors, FieldValidationConfig, SyncRule, AsyncRule, enums
├── constants/
│   └── index.ts              ← Regex, funciones de validación, mensajes de error
├── validation/
│   ├── Validators.ts         ← ValidationType enum + 43 tipos de configuración
│   └── ValiValid.ts          ← Motor: almacenamiento y ejecución de reglas
└── hooks/
    └── useValiValid.ts       ← Hook de React: estado + ciclo de vida
```

---

## Flujo de inicialización

```mermaid
flowchart TD
    A["useValiValid({ initial, validations })"] --> B["new ValiValid(validations)"]
    B --> C["addValidation(config) por cada FieldValidationConfig"]
    C --> D{"¿tiene isNumber o isDecimal?"}
    D -->|Sí| E["_fieldMeta.set(field, meta)"]
    D -->|No| F["continúa"]
    E --> F
    F --> G["Por cada validación en config.validations"]
    G --> H{"¿Es async?\n(FileDimensions, ImageAspectRatio,\nImageMinDimensions, ImageMaxDimensions,\nAsyncPattern)"}
    H -->|Sí| I["_asyncRules.get(field).push(AsyncRule)"]
    H -->|No| J["_syncRules.get(field).push(SyncRule)"]
    I --> K["Motor listo"]
    J --> K
    K --> L["useState: form, errors, isValidating"]
    L --> M["Hook retorna API al componente"]
```

---

## Flujo de `handleChange`

```mermaid
flowchart TD
    A["handleChange(campo, valor)"] --> B["getFieldValue(campo, valor)"]
    B --> C{"¿isNumber?"}
    C -->|Sí, isDecimal| D["Number(valor)"]
    C -->|Sí, entero| E["Number(valor.replace(REGEX_ONLY_NUMBERS, ''))"]
    C -->|No| F["valor sin cambios"]
    D --> G["setForm(prev => prev + campo: valorSanitizado)"]
    E --> G
    F --> G
    G --> H["validateFieldSync(campo, valorSanitizado)"]
    H --> I["setErrors(prev => prev + campo: errorSync)"]
    I --> J{"¿hasAsyncRules(campo)?"}
    J -->|No| K["fin"]
    J -->|Sí| L["setIsValidating(true)"]
    L --> M["validateFieldAsync(campo, valor, form)"]
    M --> N["setErrors(prev => prev + campo: errorAsync)"]
    N --> O["setIsValidating(false)"]
    O --> K
```

---

## Flujo de `validate()` (formulario completo)

```mermaid
flowchart TD
    A["validate()"] --> B["setIsValidating(true)"]
    B --> C["engine.validateAsync(form)"]
    C --> D["validateSync(form)\n→ itera _syncRules por campo\n→ primer error por campo"]
    D --> E["Promise.all() sobre _asyncRules"]
    E --> F{"¿Ya hay error sync\npara este campo?"}
    F -->|Sí| G["usa el error sync"]
    F -->|No| H["ejecuta asyncRules secuencialmente\ndevuelve primer error async o null"]
    G --> I["merge: syncErrors + asyncErrors"]
    H --> I
    I --> J["setErrors(todosLosErrores)"]
    J --> K["setIsValidating(false)"]
    K --> L["return FormErrors<T>"]
```

---

## Estructura interna de reglas

### Regla síncrona

```ts
type SyncRule<T> = {
  type: string;                       // ValidationType value (ej: 'Email')
  field: keyof T;                     // campo al que pertenece (ej: 'email')
  message: string;                    // mensaje de error si falla
  validate: (value: any) => boolean;  // función pura de validación
};
```

**Ejemplo generado para `{ type: ValidationType.Email }`:**

```ts
{
  type: 'Email',
  field: 'email',
  message: 'Does not have email format.',
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
}
```

### Regla asíncrona

```ts
type AsyncRule<T> = {
  type: string;
  field: keyof T;
  message: string;
  asyncFn: (value: any, form: T) => Promise<boolean>;
};
```

**Ejemplo generado para `{ type: ValidationType.FileDimensions, value: { width: 1200, height: 628 } }`:**

```ts
{
  type: 'FileDimensions',
  field: 'banner',
  message: 'The file dimensions must be 1200x628.',
  asyncFn: (file) => validateImageDimensions(file, { width: 1200, height: 628 }),
}
```

---

## Almacenamiento de reglas (Map)

```mermaid
graph LR
    subgraph "_syncRules (Map)"
        F1["'email'"] --> R1["[ SyncRule(Required), SyncRule(Email) ]"]
        F2["'password'"] --> R2["[ SyncRule(Required), SyncRule(MinLength) ]"]
        F3["'username'"] --> R3["[ SyncRule(Required), SyncRule(Slug) ]"]
    end

    subgraph "_asyncRules (Map)"
        AF1["'email'"] --> AR1["[ AsyncRule(AsyncPattern) ]"]
        AF2["'avatar'"] --> AR2["[ AsyncRule(ImageAspectRatio), AsyncRule(ImageMinDimensions) ]"]
    end
```

---

## Validación cross-field

`MatchField` y `RequiredIf` necesitan acceso al formulario completo durante la validación. El motor usa una referencia interna `_currentForm` que se actualiza en cada llamada a `validateSync` o `validateAsync`.

```mermaid
sequenceDiagram
    participant validate
    participant ValiValid
    participant SyncRule

    validate->>ValiValid: validateSync(fields)
    ValiValid->>ValiValid: _currentForm = fields
    ValiValid->>SyncRule: rule.validate(value)
    Note right of SyncRule: MatchField lee _currentForm[targetField]
    Note right of SyncRule: RequiredIf evalúa condition(_currentForm)
    SyncRule-->>ValiValid: boolean
    ValiValid-->>validate: FormErrors<T>
```

---

## Gestión dinámica de reglas

```mermaid
stateDiagram-v2
    [*] --> Inicial: constructor(configs)

    Inicial --> ConReglas: addFieldValidation()
    ConReglas --> ConReglas: addFieldValidation() (agrega)
    ConReglas --> Reemplazado: setFieldValidations() (reemplaza todo)
    ConReglas --> Parcial: removeFieldValidation() (quita un tipo)
    ConReglas --> Vacío: clearFieldValidations()
    Reemplazado --> ConReglas: addFieldValidation()
    Parcial --> ConReglas: addFieldValidation()
    Vacío --> ConReglas: addFieldValidation()
```

---

## Sanitización de valores numéricos

```mermaid
flowchart LR
    A["getFieldValue(campo, '25abc')"] --> B{"_fieldMeta.get(campo)"}
    B -->|"isNumber: true, isDecimal: false"| C["'25abc'.replace(REGEX, '') → '25'"]
    C --> D["Number('25') → 25"]
    B -->|"isDecimal: true"| E["Number('25.99') → 25.99"]
    B -->|sin meta| F["'25abc' sin cambios"]
    B -->|"typeof boolean"| G["true / false sin cambios"]
```

---

## Decisiones de diseño

| Decisión | Razón |
|----------|-------|
| Motor separado del hook | Permite uso sin React (Node.js, testing, clase) |
| Dos Maps separados (sync/async) | Ejecución más eficiente — no hay que filtrar en cada validación |
| Primer error únicamente por campo | Mejor UX — el usuario ve un error a la vez |
| `asyncFn(value, form)` siempre recibe ambos | Evita detección por `.length` (frágil con minificadores) |
| `_currentForm` como referencia interna | Cross-field sync sin pasar el form a cada regla individual |
| `useRef` para el motor en el hook | Persiste entre renders sin causar re-renders |
| `isValidating` en el hook, no en el motor | El motor es agnóstico de React; el hook gestiona el estado de UI |
