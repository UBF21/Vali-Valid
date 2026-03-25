# Gestión dinámica de validaciones

ValiValid v2 permite agregar, eliminar, reemplazar o limpiar reglas de validación en tiempo de ejecución — sin recrear el hook ni el formulario.

---

## Métodos disponibles

| Método | Efecto |
|--------|--------|
| `addFieldValidation(campo, reglas[])` | Agrega nuevas reglas a un campo |
| `removeFieldValidation(campo, tipo)` | Elimina todas las reglas de un tipo de un campo |
| `setFieldValidations(campo, reglas[])` | Reemplaza TODAS las reglas de un campo |
| `clearFieldValidations(campo)` | Elimina todas las reglas de un campo |

Todos los métodos vienen del valor de retorno del hook `useValiValid`.

---

## `addFieldValidation`

Agrega una o más reglas a un campo **sin eliminar** las existentes.

```ts
addFieldValidation(field: keyof T, validations: ValidationsConfig[]): void
```

### Ejemplo: agregar una regla según acción del usuario

```tsx
import { rule, useValiValid, ValidationType } from 'vali-valid';

function PasoPassword() {
  const { form, errors, handleChange, addFieldValidation } = useValiValid<Form>({
    initial: { password: '' },
    validations: [
      {
        field: 'password',
        // forma tradicional — también funciona
        validations: [{ type: ValidationType.Required }],
      },
    ],
  });

  const activarVerificacion = () => {
    addFieldValidation('password', rule().passwordStrength().build());
  };

  return (
    <>
      <input
        type="password"
        onChange={(e) => handleChange('password', e.target.value)}
      />
      {errors.password && <p>{errors.password}</p>}
      <button type="button" onClick={activarVerificacion}>
        Activar verificación de fortaleza
      </button>
    </>
  );
}
```

---

## `removeFieldValidation`

Elimina todas las reglas de un `ValidationType` específico de un campo. Los demás tipos permanecen.

```ts
removeFieldValidation(field: keyof T, type: ValidationType): void
```

### Ejemplo: hacer un campo opcional

```tsx
import { rule, ValidationType } from 'vali-valid';

const handleToggleOpcional = (esOpcional: boolean) => {
  if (esOpcional) {
    removeFieldValidation('telefono', ValidationType.Required);
  } else {
    addFieldValidation('telefono', rule().required().build());
  }
};
```

---

## `setFieldValidations`

**Reemplaza todas** las reglas existentes de un campo con un nuevo conjunto.

```ts
setFieldValidations(field: keyof T, validations: ValidationsConfig[]): void
```

### Ejemplo: cambiar el perfil de validación según el rol del usuario

```tsx
import { rule } from 'vali-valid';

const aplicarReglas = (rol: 'admin' | 'usuario') => {
  if (rol === 'admin') {
    setFieldValidations('username', rule()
      .required()
      .minLength(6)
      .alphaNumeric()
      .build()
    );
  } else {
    setFieldValidations('username', rule()
      .required()
      .minLength(3)
      .build()
    );
  }
};
```

---

## `clearFieldValidations`

Elimina **todas** las reglas de un campo. El valor permanece en `form` y los `errors` no se limpian automáticamente.

```ts
clearFieldValidations(field: keyof T): void
```

### Ejemplo: deshabilitar validación para una sección opcional

```tsx
import { rule } from 'vali-valid';

const { clearFieldValidations, addFieldValidation } = useValiValid(…);

const toggleSeccionOpcional = (activa: boolean) => {
  if (activa) {
    addFieldValidation('descuento', rule()
      .required()
      .numberRange(0, 100)
      .build()
    );
  } else {
    clearFieldValidations('descuento');
  }
};
```

---

## Ejemplo: formulario de múltiples pasos

La gestión dinámica es especialmente útil en formularios multi-paso donde cada paso activa reglas distintas.

```tsx
import { useState } from 'react';
import { rule, useValiValid, ValidationType } from 'vali-valid';

type FormularioPago = {
  email: string;
  tarjeta: string;
  mensajeRegalo: string;
};

function WizardCheckout() {
  const [paso, setPaso] = useState<'contacto' | 'pago' | 'extras'>('contacto');

  const {
    form,
    errors,
    handleChange,
    validate,
    setFieldValidations,
    clearFieldValidations,
  } = useValiValid<FormularioPago>({
    initial: { email: '', tarjeta: '', mensajeRegalo: '' },
    validations: [
      // Solo reglas de contacto activas al inicio
      {
        field: 'email',
        validations: rule().required().email().build(),
      },
    ],
  });

  const irAPago = async () => {
    const errs = await validate();
    if (Object.values(errs).some(Boolean)) return;

    clearFieldValidations('email');
    setFieldValidations('tarjeta', rule().required().creditCard().build());
    setPaso('pago');
  };

  const irAExtras = async () => {
    const errs = await validate();
    if (Object.values(errs).some(Boolean)) return;

    clearFieldValidations('tarjeta');
    setFieldValidations('mensajeRegalo',
      // forma tradicional — también funciona
      [{ type: ValidationType.MaxLength, value: 200 }]
    );
    setPaso('extras');
  };

  return (
    <form>
      {paso === 'contacto' && (
        <>
          <input
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email"
          />
          {errors.email && <p>{errors.email}</p>}
          <button type="button" onClick={irAPago}>Siguiente</button>
        </>
      )}

      {paso === 'pago' && (
        <>
          <input
            value={form.tarjeta}
            onChange={(e) => handleChange('tarjeta', e.target.value)}
            placeholder="Número de tarjeta"
          />
          {errors.tarjeta && <p>{errors.tarjeta}</p>}
          <button type="button" onClick={irAExtras}>Siguiente</button>
        </>
      )}

      {paso === 'extras' && (
        <>
          <textarea
            value={form.mensajeRegalo}
            onChange={(e) => handleChange('mensajeRegalo', e.target.value)}
            placeholder="Mensaje de regalo (opcional)"
          />
          {errors.mensajeRegalo && <p>{errors.mensajeRegalo}</p>}
          <button type="submit">Realizar pedido</button>
        </>
      )}
    </form>
  );
}
```

---

## Orden de ejecución de reglas

Cuando existen múltiples reglas para un campo, se ejecutan en **orden de inserción**. La validación se detiene en el primer fallo (comportamiento "primer error únicamente").

```ts
import { rule, ValidationType } from 'vali-valid';

// Orden de ejecución: Required → MinLength → Email
// Se detiene en el primer fallo
addFieldValidation('email', rule()
  .required()       // se verifica primero
  .minLength(5)
  .email()          // se verifica al final
  .build()
);
```
