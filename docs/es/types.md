# Referencia de tipos TypeScript

Todos los tipos exportados desde `vali-valid`.

---

## Tipos principales

### `FieldValidationConfig<T>`

Configuración de las reglas de validación para un campo.

```ts
type FieldValidationConfig<T> = {
  field: keyof T;                    // Requerido — nombre del campo
  validations: ValidationsConfig[];  // Requerido — array de reglas
  isNumber?: boolean;   // Elimina chars no numéricos, convierte a Number entero
  isDecimal?: boolean;  // Convierte directamente a Number decimal
};
```

### `BuilderValidationConfig<T>`

Alias para un array de `FieldValidationConfig<T>`.

```ts
type BuilderValidationConfig<T> = FieldValidationConfig<T>[];
```

### `FormErrors<T>`

Mapa de nombres de campos a mensajes de error.

```ts
type FormErrors<T> = {
  [key in keyof T]?: string | null;
};
```

| Valor | Significado |
|-------|-------------|
| `string` | Validación fallida — mostrar este mensaje |
| `null` | Campo validado correctamente |
| `undefined` | Campo aún no validado |

### `ValidationsConfig`

Unión de los 43 tipos de configuración de validación. Úsala para tipar arrays de reglas dinámicas.

```ts
import { ValidationsConfig, ValidationType } from 'vali-valid';

const reglas: ValidationsConfig[] = [
  { type: ValidationType.Required },
  { type: ValidationType.Email },
];
```

### `SyncRule<T>`

Representación interna de una regla síncrona. Raramente necesaria de forma directa.

```ts
type SyncRule<T> = {
  type: string;
  field: keyof T;
  message: string;
  validate: (value: any) => boolean;
};
```

### `AsyncRule<T>`

Representación interna de una regla asíncrona.

```ts
type AsyncRule<T> = {
  type: string;
  field: keyof T;
  message: string;
  asyncFn: (value: any, form: T) => Promise<boolean>;
};
```

### `SetState<T>`

Forma del setter de `useState` de React.

```ts
type SetState<T> = (value: T | ((prevState: T) => T)) => void;
```

---

## Tipos del hook

### `UseValiValidOptions<T>`

```ts
interface UseValiValidOptions<T extends Record<string, any>> {
  initial: T;
  validations?: FieldValidationConfig<T>[];
}
```

### `UseValiValidReturn<T>`

```ts
interface UseValiValidReturn<T extends Record<string, any>> {
  form: T;
  errors: FormErrors<T>;
  isValid: boolean;
  isValidating: boolean;
  handleChange: (field: keyof T, value: any) => void;
  validate: () => Promise<FormErrors<T>>;
  reset: (initial?: Partial<T>) => void;
  addFieldValidation: (field: keyof T, validations: ValidationsConfig[]) => void;
  removeFieldValidation: (field: keyof T, type: ValidationType) => void;
  setFieldValidations: (field: keyof T, validations: ValidationsConfig[]) => void;
  clearFieldValidations: (field: keyof T) => void;
}
```

---

## Enums

### `ValidationType`

Los 43 tipos de validación. Consulta [validators.md](./validators.md) para detalles de cada uno.

```ts
enum ValidationType {
  // String (23 tipos)
  Required, MinLength, MaxLength, ExactLength,
  Email, Url, Alpha, AlphaNumeric, LowerCase, UpperCase,
  NoWhitespace, Contains, StartsWith, EndsWith,
  Slug, PasswordStrength, HexColor, IPv4, UUID, Json, Phone, CreditCard,
  Pattern,

  // Numérico (6 tipos)
  DigitsOnly, NumberRange, NumberPositive, NumberNegative, Integer, MultipleOf,

  // Fecha (5 tipos)
  DateFormat, MinDate, MaxDate, FutureDate, PastDate,

  // Archivo (6 tipos)
  FileType, FileSize, FileDimensions,
  ImageAspectRatio, ImageMinDimensions, ImageMaxDimensions,

  // Cross-field (2 tipos)
  MatchField, RequiredIf,

  // Asíncrono (1 tipo)
  AsyncPattern,
}
```

### `TypeFile`

Constantes de tipo MIME para la validación `FileType`.

```ts
enum TypeFile {
  JPG  = 'image/jpeg',
  PNG  = 'image/png',
  PDF  = 'application/pdf',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  MP3  = 'audio/mpeg',
  MP4  = 'video/mp4',
}
```

### `DateFormat`

Patrones de formato de fecha para la validación `DateFormat`.

```ts
enum DateFormat {
  'YYYY-MM-DD' = 'YYYY-MM-DD',
  'DD-MM-YYYY' = 'DD-MM-YYYY',
  'YYYY/MM/DD' = 'YYYY/MM/DD',
  'DD/MM/YYYY' = 'DD/MM/YYYY',
}
```

### `FileSize`

Límites de tamaño de archivo predefinidos en bytes. Rango: `100KB` → `1000MB`.

```ts
enum FileSize {
  '100KB'  = 102400,
  '1MB'    = 1048576,
  '5MB'    = 5242880,
  '10MB'   = 10485760,
  '100MB'  = 104857600,
  '1000MB' = 1048576000,
  // ... y muchos más
}
```

---

## Referencia de tipos de configuración de validación

Todos los tipos siguen este patrón:

```ts
type ValidationConfigXxx = {
  type: ValidationType.Xxx;
  value?: ...; // requerido para validadores parametrizados
  message?: string; // mensaje de error personalizado opcional
};
```

| Tipo | Campos extra |
|------|-------------|
| `ValidationConfigRequired` | — |
| `ValidationConfigMinLength` | `value: number` |
| `ValidationConfigMaxLength` | `value: number` |
| `ValidationConfigExactLength` | `value: number` |
| `ValidationConfigEmail` | — |
| `ValidationConfigUrl` | — |
| `ValidationConfigAlpha` | — |
| `ValidationConfigAlphaNumeric` | — |
| `ValidationConfigLowerCase` | — |
| `ValidationConfigUpperCase` | — |
| `ValidationConfigNoWhitespace` | — |
| `ValidationConfigContains` | `value: string` |
| `ValidationConfigStartsWith` | `value: string` |
| `ValidationConfigEndsWith` | `value: string` |
| `ValidationConfigSlug` | — |
| `ValidationConfigPasswordStrength` | — |
| `ValidationConfigHexColor` | — |
| `ValidationConfigIPv4` | — |
| `ValidationConfigUUID` | — |
| `ValidationConfigJson` | — |
| `ValidationConfigPhone` | — |
| `ValidationConfigCreditCard` | — |
| `ValidationConfigPattern` | `value: (v: any) => boolean` |
| `ValidationConfigDigitsOnly` | — |
| `ValidationConfigNumberRange` | `value: [number, number]` |
| `ValidationConfigNumberPositive` | — |
| `ValidationConfigNumberNegative` | — |
| `ValidationConfigInteger` | — |
| `ValidationConfigMultipleOf` | `value: number` |
| `ValidationConfigDateFormat` | `format: DateFormat` |
| `ValidationConfigMinDate` | `value: string \| Date` |
| `ValidationConfigMaxDate` | `value: string \| Date` |
| `ValidationConfigFutureDate` | — |
| `ValidationConfigPastDate` | — |
| `ValidationConfigFileType` | `value: TypeFile[] \| string[]` |
| `ValidationConfigFileSize` | `value: number \| FileSize` |
| `ValidationConfigFileDimensions` | `value: { width: number; height: number }` |
| `ValidationConfigImageAspectRatio` | `value: { width: number; height: number }`, `tolerance?: number` |
| `ValidationConfigImageMinDimensions` | `value: { width?: number; height?: number }` |
| `ValidationConfigImageMaxDimensions` | `value: { width?: number; height?: number }` |
| `ValidationConfigMatchField` | `field: string` |
| `ValidationConfigRequiredIf` | `condition: (form: Record<string, any>) => boolean` |
| `ValidationConfigAsyncPattern` | `asyncFn: (value: any, form: Record<string, any>) => Promise<boolean>` |
