# TypeScript types reference

All types exported from `vali-valid`.

---

## Core types

### `FieldValidationConfig<T>`

```ts
type FieldValidationConfig<T> = {
  field: keyof T;                    // Required — the field name
  validations: ValidationsConfig[];  // Required — array of rules
  isNumber?: boolean;   // Strip non-numeric chars → integer Number
  isDecimal?: boolean;  // Convert directly → decimal Number
};
```

### `FormErrors<T>`

```ts
type FormErrors<T> = { [key in keyof T]?: string | null };
// string    → validation failed, show this message
// null      → field validated and passed
// undefined → field not yet validated
```

### `SyncRule<T>` / `AsyncRule<T>`

Internal rule types. Rarely needed directly.

```ts
type SyncRule<T> = {
  type: string;
  field: keyof T;
  message: string;
  validate: (value: any) => boolean;
};

type AsyncRule<T> = {
  type: string;
  field: keyof T;
  message: string;
  asyncFn: (value: any, form: T) => Promise<boolean>;
};
```

---

## Hook interfaces

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

### `ValidationType` — 43 entries

```ts
enum ValidationType {
  // String (23)
  Required, MinLength, MaxLength, ExactLength,
  Email, Url, Alpha, AlphaNumeric, LowerCase, UpperCase,
  NoWhitespace, Contains, StartsWith, EndsWith,
  Slug, PasswordStrength, HexColor, IPv4, UUID, Json, Phone, CreditCard, Pattern,
  // Numeric (6)
  DigitsOnly, NumberRange, NumberPositive, NumberNegative, Integer, MultipleOf,
  // Date (5)
  DateFormat, MinDate, MaxDate, FutureDate, PastDate,
  // File (6)
  FileType, FileSize, FileDimensions, ImageAspectRatio, ImageMinDimensions, ImageMaxDimensions,
  // Cross-field (2)
  MatchField, RequiredIf,
  // Async (1)
  AsyncPattern,
}
```

### `TypeFile`

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

```ts
enum DateFormat {
  'YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'
}
```

### `FileSize`

Predefined byte constants from `100KB` to `1000MB`.

```ts
FileSize['2MB']   // 2097152
FileSize['500KB'] // 512000
FileSize['100MB'] // 104857600
```

---

## All 43 validation config types

| Type | Extra fields |
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
