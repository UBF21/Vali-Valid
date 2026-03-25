# Builder fluido

ValiValid v3 introduce una API de builder fluido mediante la función `rule()`. En lugar de escribir arrays de configuración planos, puedes encadenar métodos para una sintaxis más legible y componible.

---

## Nuevo en v3 — el Builder fluido

`rule().build()` devuelve exactamente el mismo `ValidationsConfig[]` que un array de objetos planos — **ambos están completamente soportados**. El Builder es la forma recomendada para código nuevo: agrega lógica OR, composición y una sintaxis más limpia sobre la forma tradicional.

```ts
// Array tradicional — funciona perfectamente, completamente soportado
validations: [
  { type: ValidationType.Required },
  { type: ValidationType.NoHTML },
  { type: ValidationType.MaxLength, value: 160 },
]

// Builder (nuevo en v3) — mismo resultado, recomendado para código nuevo
validations: rule()
  .required()
  .noHtml()
  .maxLength(160)
  .build()

// Solo el Builder puede expresar lógica OR:
validations: rule()
  .required()
  .or([rule().email(), rule().phone()])
  .build()
```

| Sintaxis | Soporta | Notas |
|----------|---------|-------|
| Array tradicional | Solo AND | Completamente soportado — ideal para cadenas simples |
| Builder `rule()` ✦ nuevo | AND + OR + composición | Recomendado para código nuevo |

> **La lógica OR es exclusiva del Builder.** No existe equivalente en array para `.or([...])`.

## ¿Por qué usar el builder?

El Builder es un superconjunto del array plano — maneja cadenas AND de forma idéntica, y es la única opción para lógica OR, validación de arrays anidados y composición de reglas reutilizables.

---

## Importación

```ts
import { rule } from 'vali-valid';
```

---

## Uso básico — AND (todas las reglas deben pasar)

Encadenar métodos aplica un AND implícito: todas las reglas de la cadena deben pasar para que el campo sea válido.

```ts
rule().required().email().build()
rule().required().minLength(8).passwordStrength().build()
rule().required().minLength(3).maxLength(20).slug().build()
```

Llama siempre a `.build()` al final para producir el array `ValidationsConfig[]`.

---

## Referencia de la API

### Validadores de string

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
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

### Validadores numéricos

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.digitsOnly(msg?)` | `DigitsOnly` | — |
| `.numberRange(min, max, msg?)` | `NumberRange` | `[min, max]` |
| `.numberPositive(msg?)` | `NumberPositive` | — |
| `.numberNegative(msg?)` | `NumberNegative` | — |
| `.integer(msg?)` | `Integer` | — |
| `.multipleOf(n, msg?)` | `MultipleOf` | `value: number` |
| `.greaterThan(n, msg?)` | `GreaterThan` | `value: number` |
| `.lessThan(n, msg?)` | `LessThan` | `value: number` |
| `.precision(n, msg?)` | `Precision` | `value: number` |

### Validadores de fecha

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.dateFormat(fmt, msg?)` | `DateFormat` | `format: DateFormat` |
| `.minDate(v, msg?)` | `MinDate` | `value: string \| Date` |
| `.maxDate(v, msg?)` | `MaxDate` | `value: string \| Date` |
| `.futureDate(msg?)` | `FutureDate` | — |
| `.pastDate(msg?)` | `PastDate` | — |
| `.dateAfter(v, msg?)` | `DateAfter` | `value: string \| Date` |
| `.dateBefore(v, msg?)` | `DateBefore` | `value: string \| Date` |
| `.dateRange(start, end, msg?)` | `DateRange` | `startField, endField: string` |

### Validadores de archivo

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.fileType(types, msg?)` | `FileType` | `TypeFile[] \| string[]` |
| `.fileSize(n, msg?)` | `FileSize` | `number \| FileSize` |
| `.fileDimensions(dims, msg?)` | `FileDimensions` | `{ width, height }` |
| `.imageAspectRatio(ratio, tol?, msg?)` | `ImageAspectRatio` | `{ width, height }, tolerance?` |
| `.imageMinDimensions(dims, msg?)` | `ImageMinDimensions` | `{ width?, height? }` |
| `.imageMaxDimensions(dims, msg?)` | `ImageMaxDimensions` | `{ width?, height? }` |
| `.mimeType(types, msg?)` | `MimeType` | `string[]` |

### Validadores cross-field

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.matchField(field, msg?)` | `MatchField` | `field: string` |
| `.notMatchField(field, msg?)` | `NotMatchField` | `field: string` |
| `.requiredIf(cond, msg?)` | `RequiredIf` | `condition: (form) => boolean` |
| `.requiredUnless(cond, msg?)` | `RequiredUnless` | `condition: (form) => boolean` |

### Validadores de array

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.arrayMinLength(n, msg?)` | `ArrayMinLength` | `value: number` |
| `.arrayMaxLength(n, msg?)` | `ArrayMaxLength` | `value: number` |
| `.arrayUnique(msg?)` | `ArrayUnique` | — |
| `.arrayContains(v, msg?)` | `ArrayContains` | `value: any` |
| `.arrayItems(builder, msg?)` | `ArrayItems` | `RuleBuilder` |

### Validadores de enum

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.oneOf(values, msg?)` | `OneOf` | `value: any[]` |
| `.notOneOf(values, msg?)` | `NotOneOf` | `value: any[]` |

### Validadores de formato

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.time(fmt?, msg?)` | `Time` | `format?: '24h' \| '12h'` |
| `.noHtml(msg?)` | `NoHTML` | — |

### Validadores geo / financieros

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.iban(msg?)` | `IBAN` | — |
| `.postalCode(country, msg?)` | `PostalCode` | `country: string` |
| `.latitude(msg?)` | `Latitude` | — |
| `.longitude(msg?)` | `Longitude` | — |
| `.semVer(msg?)` | `SemVer` | — |
| `.base64(msg?)` | `Base64` | — |

### Validadores asíncronos

| Método | `ValidationType` equivalente | Parámetros |
|--------|------------------------------|-----------|
| `.asyncPattern(fn, msg?)` | `AsyncPattern` | `asyncFn: (value, form) => Promise<boolean>` |

### Métodos de composición

| Método | Descripción |
|--------|-------------|
| `.or(branches: RuleBuilder[])` | Al menos una rama debe pasar |
| `.and(builder: RuleBuilder)` | Combina las reglas de otro builder en esta cadena |
| `.build()` | Devuelve el array final `ValidationsConfig[]` |

---

## Lógica OR

Usa `.or()` para expresar "alguna de estas alternativas debe pasar". El campo es válido si al menos una rama pasa.

```ts
// Email O teléfono
rule().required().or([
  rule().email(),
  rule().phone(),
]).build()

// Usuario: alfanumérico O email (permite login por cualquiera)
rule().required().or([
  rule().alphaNumeric().minLength(3),
  rule().email(),
]).build()
```

---

## Composición con `.and()`

`.and(builder)` combina todas las reglas de un builder existente en la cadena actual.

```ts
// Definir una base reutilizable
const reglasNombre = rule().required().minLength(2).maxLength(50).alpha();

// Extender para campos específicos
const reglasNombreInicio = rule().and(reglasNombre).startsWith('A').build();
const reglasApellido = rule().and(reglasNombre).build();
```

---

## Validación de arrays anidados con `.arrayItems()`

`.arrayItems()` acepta otro `RuleBuilder` y aplica sus reglas a cada elemento de un campo array.

```ts
// Cada elemento debe ser un email válido
rule().arrayItems(rule().required().email()).build()

// Cada elemento debe ser un slug de entre 2 y 20 caracteres
rule().arrayItems(rule().required().slug().minLength(2).maxLength(20)).build()

// OR anidado por elemento
rule().arrayItems(
  rule().required().or([rule().email(), rule().phone()])
).build()
```

---

## Ejemplo completo con `useValiValid`

```tsx
import { useValiValid, ValidationType, rule } from 'vali-valid';

type FormularioContacto = {
  contacto: string;    // puede ser email o teléfono
  etiquetas: string[]; // array de slugs
  sitioWeb: string;    // URL opcional, debe comenzar con https
  fechaNacimiento: string;
};

function ComponenteFormulario() {
  const { form, errors, handleChange, handleSubmit } = useValiValid<FormularioContacto>({
    initial: { contacto: '', etiquetas: [], sitioWeb: '', fechaNacimiento: '' },
    validations: [
      {
        field: 'contacto',
        validations: rule()
          .required('El contacto es obligatorio.')
          .or([
            rule().email('Ingresa un email válido.'),
            rule().phone('Ingresa un teléfono válido.'),
          ])
          .build(),
      },
      {
        field: 'etiquetas',
        validations: rule()
          .arrayMinLength(1, 'Agrega al menos una etiqueta.')
          .arrayMaxLength(5, 'Máximo 5 etiquetas.')
          .arrayItems(
            rule().required().slug().minLength(2).maxLength(20)
          )
          .build(),
      },
      {
        field: 'sitioWeb',
        validations: rule()
          .url()
          .startsWith('https://', 'Debes usar HTTPS.')
          .build(),
      },
      {
        field: 'fechaNacimiento',
        validations: rule()
          .required()
          .pastDate('La fecha de nacimiento debe ser pasada.')
          .build(),
      },
    ],
  });

  const onSubmit = handleSubmit(async (data) => {
    await api.guardarContacto(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        value={form.contacto}
        onChange={(e) => handleChange('contacto', e.target.value)}
        placeholder="Email o teléfono"
      />
      {errors.contacto?.map((msg, i) => <p key={i}>{msg}</p>)}

      {/* ... otros campos */}

      <button type="submit">Guardar</button>
    </form>
  );
}
```

---

## Usar el builder con el motor standalone

El builder funciona igualmente bien con la clase `ValiValid` directamente:

```ts
import { ValiValid, rule } from 'vali-valid';

const validador = new ValiValid([
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

const errores = validador.validateSync({ email: 'malo', roles: [] });
```

---

## Tipo `RuleBuilder`

```ts
interface RuleBuilder {
  // Todos los métodos validadores (ver referencia de API)
  or(branches: RuleBuilder[]): RuleBuilder;
  and(builder: RuleBuilder): RuleBuilder;
  build(): ValidationsConfig[];
}
```

Importa el tipo para usarlo en firmas de función:

```ts
import type { RuleBuilder } from 'vali-valid';

function crearReglaEmailOTelefono(): RuleBuilder {
  return rule().required().or([rule().email(), rule().phone()]);
}

// En la configuración:
{ field: 'contacto', validations: crearReglaEmailOTelefono().build() }
```
