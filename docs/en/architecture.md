# Internal architecture

Technical overview of how ValiValid v2 works internally, with layer diagrams, execution flows, and data structures.

---

## System layers

```mermaid
graph TB
    subgraph "Public API"
        HOOK["useValiValid&lt;T&gt;\n(React hook)"]
    end

    subgraph "Validation engine"
        ENGINE["ValiValid&lt;T&gt;\n(class)"]
        SYNC_MAP["_syncRules\nMap&lt;field, SyncRule[]&gt;"]
        ASYNC_MAP["_asyncRules\nMap&lt;field, AsyncRule[]&gt;"]
        META_MAP["_fieldMeta\nMap&lt;field, {isNumber, isDecimal}&gt;"]
    end

    subgraph "Rules"
        SYNC_RULE["SyncRule\n{ type, field, message, validate }"]
        ASYNC_RULE["AsyncRule\n{ type, field, message, asyncFn }"]
    end

    subgraph "Definitions"
        VALIDATORS["Validators.ts\nValidationType enum\n+ 43 config types"]
        CONSTANTS["constants/index.ts\nRegex + validator functions\n+ default messages"]
        TYPES["types/index.ts\nFieldValidationConfig\nFormErrors\nSyncRule / AsyncRule"]
    end

    HOOK -->|"useRef(engine)"| ENGINE
    ENGINE --> SYNC_MAP
    ENGINE --> ASYNC_MAP
    ENGINE --> META_MAP
    SYNC_MAP --> SYNC_RULE
    ASYNC_MAP --> ASYNC_RULE
    ENGINE -->|"imports"| VALIDATORS
    ENGINE -->|"imports"| CONSTANTS
    ENGINE -->|"imports"| TYPES
    HOOK -->|"imports"| TYPES
```

---

## File structure

```
src/
├── index.ts                  ← Public re-exports
├── types/
│   └── index.ts              ← Types: FormErrors, FieldValidationConfig, SyncRule, AsyncRule, enums
├── constants/
│   └── index.ts              ← Regex, validator functions, default error messages
├── validation/
│   ├── Validators.ts         ← ValidationType enum + 43 config types
│   └── ValiValid.ts          ← Engine: rule storage and execution
└── hooks/
    └── useValiValid.ts       ← React hook: state + lifecycle
```

---

## Initialization flow

```mermaid
flowchart TD
    A["useValiValid({ initial, validations })"] --> B["new ValiValid(validations)"]
    B --> C["addValidation(config) for each FieldValidationConfig"]
    C --> D{"has isNumber or isDecimal?"}
    D -->|Yes| E["_fieldMeta.set(field, meta)"]
    D -->|No| F["continue"]
    E --> F
    F --> G["for each validation in config.validations"]
    G --> H{"Is async?\n(FileDimensions, ImageAspectRatio,\nImageMinDimensions, ImageMaxDimensions,\nAsyncPattern)"}
    H -->|Yes| I["_asyncRules.get(field).push(AsyncRule)"]
    H -->|No| J["_syncRules.get(field).push(SyncRule)"]
    I --> K["Engine ready"]
    J --> K
    K --> L["useState: form, errors, isValidating"]
    L --> M["Hook returns API to component"]
```

---

## `handleChange` flow

```mermaid
flowchart TD
    A["handleChange(field, value)"] --> B["getFieldValue(field, value)"]
    B --> C{"isNumber?"}
    C -->|Yes, isDecimal| D["Number(value)"]
    C -->|Yes, integer| E["Number(value.replace(REGEX, ''))"]
    C -->|No| F["value unchanged"]
    D --> G["setForm(prev => { ...prev, field: sanitized })"]
    E --> G
    F --> G
    G --> H["validateFieldSync(field, sanitized)"]
    H --> I["setErrors(prev => { ...prev, field: syncError })"]
    I --> J{"hasAsyncRules(field)?"}
    J -->|No| K["done"]
    J -->|Yes| L["setIsValidating(true)"]
    L --> M["validateFieldAsync(field, value, form)"]
    M --> N["setErrors(prev => { ...prev, field: asyncError })"]
    N --> O["setIsValidating(false)"]
    O --> K
```

---

## Full `validate()` flow

```mermaid
flowchart TD
    A["validate()"] --> B["setIsValidating(true)"]
    B --> C["engine.validateAsync(form)"]
    C --> D["validateSync(form)\n→ iterate _syncRules per field\n→ first error per field"]
    D --> E["Promise.all() over _asyncRules"]
    E --> F{"sync error exists\nfor this field?"}
    F -->|Yes| G["use sync error"]
    F -->|No| H["run asyncRules sequentially\nreturn first async error or null"]
    G --> I["merge: syncErrors + asyncErrors"]
    H --> I
    I --> J["setErrors(allErrors)"]
    J --> K["setIsValidating(false)"]
    K --> L["return FormErrors&lt;T&gt;"]
```

---

## Rule storage (Map)

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

## Dynamic rule management

```mermaid
stateDiagram-v2
    [*] --> Initial: constructor(configs)

    Initial --> WithRules: addFieldValidation()
    WithRules --> WithRules: addFieldValidation() (appends)
    WithRules --> Replaced: setFieldValidations() (replaces all)
    WithRules --> Partial: removeFieldValidation() (removes one type)
    WithRules --> Empty: clearFieldValidations()
    Replaced --> WithRules: addFieldValidation()
    Partial --> WithRules: addFieldValidation()
    Empty --> WithRules: addFieldValidation()
```

---

## Design decisions

| Decision | Reason |
|----------|--------|
| Engine decoupled from hook | Enables use without React (Node.js, testing) |
| Two separate Maps (sync/async) | Efficient execution — no filtering needed per validation run |
| First-error-only per field | Better UX — user sees one error at a time |
| `asyncFn(value, form)` always receives both | Avoids `.length` detection (fragile with minifiers) |
| `_currentForm` internal reference | Cross-field sync without passing form to every individual rule |
| `useRef` for engine in hook | Persists across renders without causing re-renders |
| `isValidating` in hook, not engine | Engine is React-agnostic; hook manages UI state |
