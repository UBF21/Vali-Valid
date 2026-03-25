# Builder fluent API

ValiValid v3 introduces a fluent builder API via the `rule()` function. Instead of writing plain config arrays, you can chain methods for a more readable, composable syntax.

---

## New in v3 — the fluent Builder

`rule().build()` returns the exact same `ValidationsConfig[]` as a plain object array — **both are fully supported**. The Builder is the recommended approach for new code: it adds OR logic, composition, and a cleaner syntax on top of the traditional form.

```ts
// Traditional array — works perfectly, fully supported
validations: [
  { type: ValidationType.Required },
  { type: ValidationType.NoHTML },
  { type: ValidationType.MaxLength, value: 160 },
]

// Builder (new in v3) — same result, recommended for new code
validations: rule()
  .required()
  .noHtml()
  .maxLength(160)
  .build()

// Only the Builder can express OR logic:
validations: rule()
  .required()
  .or([rule().email(), rule().phone()])
  .build()
```

| Syntax | Supports | Notes |
|--------|----------|-------|
| Traditional array | AND only | Fully supported — great for simple chains |
| Builder `rule()` ✦ new | AND + OR + composition | Recommended for new code |

> **OR logic is Builder-only.** There is no array equivalent for `.or([...])`.

## Why use the builder?

The Builder is a superset of the plain array syntax — it handles AND chains identically, and is the only option for OR logic, nested array validation, and reusable rule composition.

---

## Import

```ts
import { rule } from 'vali-valid';
```

---

## Basic usage — AND (all rules must pass)

Chaining methods applies an implicit AND: every rule in the chain must pass for the field to be valid.

```ts
rule().required().email().build()
rule().required().minLength(8).passwordStrength().build()
rule().required().minLength(3).maxLength(20).slug().build()
```

Always call `.build()` at the end to produce the `ValidationsConfig[]` array.

---

## API reference

### String validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.required(msg?)` | `Required` | `message?: string` |
| `.minLength(n, msg?)` | `MinLength` | `value: number` |
| `.maxLength(n, msg?)` | `MaxLength` | `value: number` |
| `.exactLength(n, msg?)` | `ExactLength` | `value: number` |
| `.email(msg?)` | `Email` | — |
| `.url(msg?)` | `Url` | — |
| `.alpha(msg?)` | `Alpha` | — |
| `.alphaNumeric(msg?)` | `AlphaNumeric` | — |
| `.lowerCase(msg?)` | `LowerCase` | — |
| `.upperCase(msg?)` | `UpperCase` | — |
| `.noWhitespace(msg?)` | `NoWhitespace` | — |
| `.contains(sub, msg?)` | `Contains` | `value: string` |
| `.startsWith(prefix, msg?)` | `StartsWith` | `value: string` |
| `.endsWith(suffix, msg?)` | `EndsWith` | `value: string` |
| `.slug(msg?)` | `Slug` | — |
| `.passwordStrength(msg?)` | `PasswordStrength` | — |
| `.hexColor(msg?)` | `HexColor` | — |
| `.ipv4(msg?)` | `IPv4` | — |
| `.ipv6(msg?)` | `IPv6` | — |
| `.macAddress(msg?)` | `MACAddress` | — |
| `.dataUri(msg?)` | `DataURI` | — |
| `.uuid(msg?)` | `UUID` | — |
| `.json(msg?)` | `Json` | — |
| `.phone(msg?)` | `Phone` | — |
| `.creditCard(msg?)` | `CreditCard` | — |
| `.pattern(fn, msg?)` | `Pattern` | `value: (v) => boolean` |

### Numeric validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.digitsOnly(msg?)` | `DigitsOnly` | — |
| `.numberRange(min, max, msg?)` | `NumberRange` | `[min, max]` |
| `.numberPositive(msg?)` | `NumberPositive` | — |
| `.numberNegative(msg?)` | `NumberNegative` | — |
| `.integer(msg?)` | `Integer` | — |
| `.multipleOf(n, msg?)` | `MultipleOf` | `value: number` |
| `.greaterThan(n, msg?)` | `GreaterThan` | `value: number` |
| `.lessThan(n, msg?)` | `LessThan` | `value: number` |
| `.precision(n, msg?)` | `Precision` | `value: number` |

### Date validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.dateFormat(fmt, msg?)` | `DateFormat` | `format: DateFormat` |
| `.minDate(v, msg?)` | `MinDate` | `value: string \| Date` |
| `.maxDate(v, msg?)` | `MaxDate` | `value: string \| Date` |
| `.futureDate(msg?)` | `FutureDate` | — |
| `.pastDate(msg?)` | `PastDate` | — |
| `.dateAfter(v, msg?)` | `DateAfter` | `value: string \| Date` |
| `.dateBefore(v, msg?)` | `DateBefore` | `value: string \| Date` |
| `.dateRange(start, end, msg?)` | `DateRange` | `startField, endField: string` |

### File validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.fileType(types, msg?)` | `FileType` | `TypeFile[] \| string[]` |
| `.fileSize(n, msg?)` | `FileSize` | `number \| FileSize` |
| `.fileDimensions(dims, msg?)` | `FileDimensions` | `{ width, height }` |
| `.imageAspectRatio(ratio, tol?, msg?)` | `ImageAspectRatio` | `{ width, height }, tolerance?` |
| `.imageMinDimensions(dims, msg?)` | `ImageMinDimensions` | `{ width?, height? }` |
| `.imageMaxDimensions(dims, msg?)` | `ImageMaxDimensions` | `{ width?, height? }` |
| `.mimeType(types, msg?)` | `MimeType` | `string[]` |

### Cross-field validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.matchField(field, msg?)` | `MatchField` | `field: string` |
| `.notMatchField(field, msg?)` | `NotMatchField` | `field: string` |
| `.requiredIf(cond, msg?)` | `RequiredIf` | `condition: (form) => boolean` |
| `.requiredUnless(cond, msg?)` | `RequiredUnless` | `condition: (form) => boolean` |

### Array validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.arrayMinLength(n, msg?)` | `ArrayMinLength` | `value: number` |
| `.arrayMaxLength(n, msg?)` | `ArrayMaxLength` | `value: number` |
| `.arrayUnique(msg?)` | `ArrayUnique` | — |
| `.arrayContains(v, msg?)` | `ArrayContains` | `value: any` |
| `.arrayItems(builder, msg?)` | `ArrayItems` | `RuleBuilder` |

### Enum validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.oneOf(values, msg?)` | `OneOf` | `value: any[]` |
| `.notOneOf(values, msg?)` | `NotOneOf` | `value: any[]` |

### Format validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.time(fmt?, msg?)` | `Time` | `format?: '24h' \| '12h'` |
| `.noHtml(msg?)` | `NoHTML` | — |

### Geo / Finance validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.iban(msg?)` | `IBAN` | — |
| `.postalCode(country, msg?)` | `PostalCode` | `country: string` |
| `.latitude(msg?)` | `Latitude` | — |
| `.longitude(msg?)` | `Longitude` | — |
| `.semVer(msg?)` | `SemVer` | — |
| `.base64(msg?)` | `Base64` | — |

### Async validators

| Method | Equivalent `ValidationType` | Parameters |
|--------|-----------------------------|-----------|
| `.asyncPattern(fn, msg?)` | `AsyncPattern` | `asyncFn: (value, form) => Promise<boolean>` |

### Composition methods

| Method | Description |
|--------|-------------|
| `.or(branches: RuleBuilder[])` | At least one branch must pass |
| `.and(builder: RuleBuilder)` | Merges another builder's rules into this chain |
| `.build()` | Returns the final `ValidationsConfig[]` array |

---

## OR logic

Use `.or()` to express "one of these alternatives must pass". The field is valid if any one branch passes.

```ts
// Email OR phone
rule().required().or([
  rule().email(),
  rule().phone(),
]).build()

// Username: alphanumeric OR email (allow login by either)
rule().required().or([
  rule().alphaNumeric().minLength(3),
  rule().email(),
]).build()
```

---

## Composition with `.and()`

`.and(builder)` merges all rules from an existing builder into the current chain.

```ts
// Define a reusable base
const nameRules = rule().required().minLength(2).maxLength(50).alpha();

// Extend for a specific field
const firstNameRules = rule().and(nameRules).startsWith('A').build();
const lastNameRules = rule().and(nameRules).build();
```

---

## Nested array validation with `.arrayItems()`

`.arrayItems()` accepts another `RuleBuilder` and applies its rules to each element of an array field.

```ts
// Each element must be a valid email
rule().arrayItems(rule().required().email()).build()

// Each element must be a slug between 2 and 20 chars
rule().arrayItems(rule().required().slug().minLength(2).maxLength(20)).build()

// Nested OR per item
rule().arrayItems(
  rule().required().or([rule().email(), rule().phone()])
).build()
```

---

## Complete example with `useValiValid`

```tsx
import { useValiValid, ValidationType, rule } from 'vali-valid';

type ContactForm = {
  contact: string;     // can be email or phone
  tags: string[];      // array of slugs
  website: string;     // optional URL, must start with https
  birthDate: string;
};

function ContactFormComponent() {
  const { form, errors, handleChange, handleSubmit } = useValiValid<ContactForm>({
    initial: { contact: '', tags: [], website: '', birthDate: '' },
    validations: [
      {
        field: 'contact',
        validations: rule()
          .required('Contact is required.')
          .or([
            rule().email('Enter a valid email.'),
            rule().phone('Enter a valid phone number.'),
          ])
          .build(),
      },
      {
        field: 'tags',
        validations: rule()
          .arrayMinLength(1, 'Add at least one tag.')
          .arrayMaxLength(5, 'Maximum 5 tags.')
          .arrayItems(
            rule().required().slug().minLength(2).maxLength(20)
          )
          .build(),
      },
      {
        field: 'website',
        validations: rule()
          .url()
          .startsWith('https://', 'Must use HTTPS.')
          .build(),
      },
      {
        field: 'birthDate',
        validations: rule()
          .required()
          .pastDate('Birth date must be in the past.')
          .build(),
      },
    ],
  });

  const onSubmit = handleSubmit(async (data) => {
    await api.saveContact(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        value={form.contact}
        onChange={(e) => handleChange('contact', e.target.value)}
        placeholder="Email or phone"
      />
      {errors.contact?.map((msg, i) => <p key={i}>{msg}</p>)}

      {/* ... other fields */}

      <button type="submit">Save</button>
    </form>
  );
}
```

---

## Using the builder with the standalone engine

The builder works equally well with the `ValiValid` class directly:

```ts
import { ValiValid, rule } from 'vali-valid';

const validator = new ValiValid([
  {
    field: 'email',
    validations: rule().required().email().build(),
  },
  {
    field: 'roles',
    validations: rule()
      .arrayMinLength(1)
      .arrayItems(rule().oneOf(['admin', 'editor', 'viewer']))
      .build(),
  },
]);

const errors = validator.validateSync({ email: 'bad', roles: [] });
```

---

## `RuleBuilder` type

```ts
interface RuleBuilder {
  // All validator methods (see API reference above)
  or(branches: RuleBuilder[]): RuleBuilder;
  and(builder: RuleBuilder): RuleBuilder;
  build(): ValidationsConfig[];
}
```

Import the type for use in function signatures:

```ts
import type { RuleBuilder } from 'vali-valid';

function makeEmailOrPhoneRule(): RuleBuilder {
  return rule().required().or([rule().email(), rule().phone()]);
}

// Then in config:
{ field: 'contact', validations: makeEmailOrPhoneRule().build() }
```
