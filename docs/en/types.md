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
  // v3 additions:
  transform?: (value: any) => any;  // Transform value before validation runs
  watchFields?: string[];           // Re-validate this field when any of these fields change
};
```

`transform` runs before any validator sees the value and does not mutate the stored form state. For example, trimming whitespace:

```ts
{
  field: 'username',
  transform: (v) => (typeof v === 'string' ? v.trim() : v),
  validations: [{ type: ValidationType.Required }],
}
```

`watchFields` triggers re-validation of the current field whenever the listed fields change. Useful for cross-field dependencies:

```ts
{
  field: 'confirmPassword',
  watchFields: ['password'],   // re-validates confirmPassword when password changes
  validations: [
    { type: ValidationType.MatchField, field: 'password' },
  ],
}
```

### `FormErrors<T>`

```ts
// v3 — each field holds ALL its errors, not just the first
type FormErrors<T> = { [key in keyof T]?: string[] | null };
// string[]  → one or more validation messages
// null      → field validated and passed (all rules passed)
// undefined → field not yet validated
```

> **Migration from v2:** Replace `errors.field && <span>{errors.field}</span>` with `errors.field?.map((msg, i) => <span key={i}>{msg}</span>)`. If you only want the first message, use `errors.field?.[0]`.

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
  // v3 additions:
  validateOnSubmit?: boolean;  // Only validate after first handleSubmit call
  debounceMs?: number;         // Debounce async validation (milliseconds)
}
```

### `UseValiValidReturn<T>`

```ts
interface UseValiValidReturn<T extends Record<string, any>> {
  // State
  form: T;
  errors: FormErrors<T>;           // v3: string[] | null per field
  isValid: boolean;
  isValidating: boolean;
  // v3 additions:
  isSubmitted: boolean;            // true after the first handleSubmit call
  submitCount: number;             // number of submit attempts

  // Actions
  handleChange: (field: keyof T, value: any) => void;
  validate: () => Promise<FormErrors<T>>;
  reset: (initial?: Partial<T>) => void;
  // v3 additions:
  handleSubmit: (onSubmit: (data: T) => Promise<void>) => () => Promise<void>;
  setServerErrors: (errors: Partial<FormErrors<T>>) => void;
  setValues: (values: Partial<T>) => void;

  // Dynamic rule management
  addFieldValidation: (field: keyof T, validations: ValidationsConfig[]) => void;
  removeFieldValidation: (field: keyof T, type: ValidationType) => void;
  setFieldValidations: (field: keyof T, validations: ValidationsConfig[]) => void;
  clearFieldValidations: (field: keyof T) => void;
}
```

---

## Enums

### `ValidationType` — 50 entries

```ts
enum ValidationType {
  // String (26)
  Required, MinLength, MaxLength, ExactLength,
  Email, Url, Alpha, AlphaNumeric, LowerCase, UpperCase,
  NoWhitespace, Contains, StartsWith, EndsWith,
  Slug, PasswordStrength, HexColor, IPv4, UUID, Json, Phone, CreditCard, Pattern,
  // v3 string additions:
  IPv6, MACAddress, DataURI,
  // Numeric (6)
  DigitsOnly, NumberRange, NumberPositive, NumberNegative, Integer, MultipleOf,
  // Date (5)
  DateFormat, MinDate, MaxDate, FutureDate, PastDate,
  // File (7)
  FileType, FileSize, FileDimensions, ImageAspectRatio, ImageMinDimensions, ImageMaxDimensions,
  // v3 file addition:
  MimeType,
  // Cross-field (3)
  MatchField, RequiredIf,
  // v3 cross-field addition:
  DateRange,
  // Array (1 new in v3)
  ArrayItems,
  // Enum (1 new in v3)
  NotOneOf,
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

## All 50 validation config types

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
| `ValidationConfigNotOneOf` | `value: any[]` |
| `ValidationConfigIPv6` | — |
| `ValidationConfigMACAddress` | — |
| `ValidationConfigDataURI` | — |
| `ValidationConfigMimeType` | `value: string[]` |
| `ValidationConfigDateRange` | `startField: string`, `endField: string` |
| `ValidationConfigArrayItems` | `rules: ValidationsConfig[]` |
