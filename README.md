# **ValiValid** - Documentación

Este código define una utilidad de validación de formularios para ReactJS usando TypeScript. La utilidad proporciona una manera de agregar reglas de validación a los campos del formulario, validar todo el formulario y manejar cambios en los campos del formulario. El validador asegura que el formulario se mantenga válido según las reglas definidas y actualiza el estado del formulario y el estado de errores en consecuencia.

### Clases y Tipos

#### `ValidationRule<T>`

```typescript
export type ValidationRule<T> = {
    field: keyof T;
    message: string;
    validate: (value: any) => boolean;
};
```

-  `field` : El campo del formulario a validar.
- `message` : El mensaje de error que se mostrará si la validación falla.
- `validate` : Una función que toma el valor del campo y devuelve un booleano indicando si el valor del campo es válido.


#### `BuilderValidationConfig<T>`

Un tipo que representa la configuración de validaciones para los campos específicos de un objeto genérico `T`.


```typescript
export type BuilderValidationConfig<T> = FieldValidationConfig<T>[];
```


#### `FormErrors<T>`

Un tipo que representa los errores para cada campo del formulario.

```typescript
export type FormErrors<T> = {
    [key in keyof T]?: string | null;
};
```
- Las claves son los nombres de los campos del formulario.
- Los valores son mensajes de error o `null` si el campo es válido.

#### `SetState<T>`

Un tipo que representa la función para actualizar el estado de un formulario.

```typescript
export type SetState<T> = (value: T | ((prevState: T) => T)) => void;
```

- `value` : El nuevo valor del estado o una función que recibe el estado anterior y devuelve el nuevo estado.
  
### `ValiValid<T>`

Una clase que gestiona las reglas de validación y la validación del formulario.

```typescript
export class ValiValid<T> {
 ......
}
```

#### `Constructor`

```typescript
export class ValiValid<T> {
     private _isFormValid: (isValid: boolean) => void;
     private _rules: Map<keyof T, ValidationRule<T>[]> = new Map();

    constructor(setFormValid: (isValid: boolean) => void,builderValidations: BuilderValidationConfig<T> = []) {
        this._isFormValid = setFormValid;
    }
}
```
- `setFormValid` Una función que toma un booleano indicando si el formulario es válido.
-  `_rules`: Es una propiedad privada de la clase FormValidator que almacena un array de reglas de validación (`ValidationRule<T>[]`). Cada regla de validación   define un campo del formulario, un mensaje de error asociado y una función de validación. Esta propiedad se utiliza internamente en los métodos `addValidation`, `validate`, y `validateField` para aplicar las validaciones definidas a los datos del formulario.


## Métodos

###  `addValidation`

Agrega una regla de validación para un campo del formulario.

```typescript
export class ValiValid<T> {
    addValidation(fieldValidationConfig: FieldValidationConfig<T>): void;
}
```

###  `Validate`

Valida todos los datos del formulario.

```typescript
export class ValiValid<T> {
   validate(fields: T): FormErrors<T> {
    }
}
```
-  `fields` : Los datos del formulario a validar.
- Devuelve un objeto que contiene mensajes de error para los campos inválidos.

###  `validateField`

Valida un solo campo del formulario.

```typescript
export class ValiValid<T> {
   validateField(field: keyof T, value: any): string | null {
    }
}
```
-  `field` : El campo del formulario a validar.
-  `value` : El valor del campo del formulario.
- Devuelve un mensaje de error si el campo es inválido, de lo contrario `null`.

###  `handleChange`

Maneja los cambios en los campos del formulario y actualiza el estado del formulario y el estado de errores.

```typescript
export class ValiValid<T> {
   handleChange( name: keyof T, value: any, setForm: SetState<T>, setErrors: SetState<FormErrors<T>> ): void{
    }
}
```
-  `name` : El nombre del campo del formulario.
-  `value` : El nuevo valor del campo del formulario.
-  `setForm` : Una función para actualizar el estado del formulario.
-  `setErrors` : Una función para actualizar el estado de errores.


## Tipos de Validaciones Preestablecidas

### `ValidationType`

El enumerador `ValidationType` contiene todos los tipos de validaciones predefinidas que ofrece **ValiValid**. Aquí tienes una lista de las validaciones disponibles:

| Tipo de Validación     | Descripción                                                                       |
|------------------------|-----------------------------------------------------------------------------------|
| `Required`             | Asegura que el campo no esté vacío.                                               |
| `MinLength`            | Valida que el campo tenga un número mínimo de caracteres.                         |
| `MaxLength`            | Valida que el campo no exceda un número máximo de caracteres.                     |    
| `DigitsOnly`           | Permite solo dígitos en el campo.                                                 |
| `NumberRange`          | Asegura que el valor esté dentro de un rango específico de números.               |
| `Email`                | Valida que el campo tenga un formato de correo electrónico válido.                |
| `Url`                  | Asegura que el campo contenga una URL válida.                                     |
| `FileType`             | Restringe los tipos de archivos que se pueden cargar.                             |
| `FileSize`             | Limita el tamaño máximo de archivo que se puede cargar.                           |
| `FileDimensions`       | Verifica que el archivo tenga dimensiones específicas (para imágenes).            |
| `Pattern`              | Permite el uso de expresiones regulares o funciones de validación personalizadas. |
| `NumberPositive`       | Valida que el número sea positivo.                                                |
| `NumberNegative`       | Asegura que el número sea negativo.                                               |
| `Alpha`                | Permite solo caracteres alfabéticos.                                              |
| `AlphaNumeric`         | Permite solo caracteres alfabéticos y numéricos.                                  |
| `LowerCase`            | Asegura que el campo esté en minúsculas.                                          |
| `UpperCase`            | Asegura que el campo esté en mayúsculas.                                          |


## Ejemplo de Implementación

A continuación, se muestra un ejemplo de cómo definir configuraciones de validación para un formulario utilizando **ValiValid**.

```typescript
import { ValidationType, FileSize, TypeFile } from 'valiValid';

const formValidations = [
    {
        field: "name",
        validations: [
            { type: ValidationType.Required, message: 'El nombre es obligatorio' },
            { type: ValidationType.AlphaNumeric, message: 'Solo se permiten letras y números' },
            { type: ValidationType.LowerCase, message: 'Debe estar en minúsculas' }
        ]
    },
    {
        field: "lastName",
        validations: [
            { type: ValidationType.Required, message: 'El apellido es obligatorio' }
        ]
    },
    {
        field: "yearsOld",
        validations: [
            { type: ValidationType.Required, message: 'La edad es obligatoria' },
            { type: ValidationType.NumberNegative, message: 'Debe ser un número negativo' }
        ],
        isNumber: true,
        isDecimal: true
    },
    {
        field: 'email',
        validations: [
            { type: ValidationType.Required, message: 'El correo es obligatorio' },
            { type: ValidationType.Email, message: 'Debe ser un correo válido' }
        ]
    },
    {
        field: 'urlLinkedin',
        validations: [
            { type: ValidationType.Required, message: 'La URL de LinkedIn es obligatoria' },
            { type: ValidationType.Url, message: 'Debe ser una URL válida' },
            {
                type: ValidationType.Pattern, 
                message: 'Debe tener al menos 14 caracteres',
                value: (value: any) => value.length >= 14
            },
            {
                type: ValidationType.Pattern,
                message: 'Debe contener un guion (-)',
                value: (value: any) => /-/.test(value)
            }
        ]
    },
    {
        field: "foto",
        validations: [
            { type: ValidationType.Required, message: 'La foto es obligatoria' },
            { type: ValidationType.FileSize, value: FileSize['200KB'], message: 'El tamaño de la foto no debe exceder 200KB' },
            { type: ValidationType.FileType, value: [TypeFile.JPG], message: 'Solo se permite el formato JPG' }
        ]
    },
    {
        field: "cv",
        validations: [
            { type: ValidationType.Required, message: 'El CV es obligatorio' },
            { type: ValidationType.FileSize, value: FileSize['3MB'], message: 'El tamaño del CV no debe exceder 3MB' },
            { type: ValidationType.FileType, value: [TypeFile.PDF], message: 'Solo se permite el formato PDF' }
        ]
    },
    {
        field: "profile",
        validations: [
            { type: ValidationType.Required, message: 'El perfil es obligatorio' },
            { type: ValidationType.FileDimensions, value: { width: 300, height: 300 }, message: 'Las dimensiones deben ser 300x300' }
        ]
    },
    {
        field: "birthdate",
        validations: [
            { type: ValidationType.Required, message: 'La fecha de nacimiento es obligatoria' }
        ]
    },
    {
        field: "dateOfGraduation",
        validations: [
            { type: ValidationType.Required, message: 'La fecha de graduación es obligatoria' }
        ]
    }
];
```

## Notas Importantes

**Manejo de Números:** Cuando se establecen `isNumber: false` e `isDecimal: false` o de pleno no se llaman a estos atributos , el valor se manejará como una cadena. Si `isNumber: true` se establece sin `isDecimal: true`, el valor en la interfaz se almacenará como un número. Establecer `isDecimal: true` permitirá que el valor acepte decimales.



## Examples 

### basic

Dispara el validador cuando se quiere enviar la información al guardar.

```tsx

export interface Person {
  firstName: string;
  lastName: string;
}

export const initialPerson = (): Person => {
  return {
    firstName: '',
    lastName: '',
  };
};

function App() {
  const [formPerson, setFormPerson] = useState<Person>(initialPerson());
  const [errors, setErrors] = useState<FormErrors<Person>>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const managerValitation = new ValiValid<Person>(setIsFormValid, [
    {
      field: 'firstName',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.DigitsOnly },
      ],
    },
    {
      field: 'lastName',
      validations: [{ type: ValidationType.Required }],
    },
  ]);

  const handleChange = (field: keyof Person, value: any): void => {
    managerValitation.handleChange(field, value, setFormPerson, setErrors);
  };

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const errors = managerValitation.validate(formPerson);
    setErrors(errors);

    if (isFormValid) {
      console.log('Form submitted:', formPerson);
      setFormPerson(initialPerson());
    }
  };

  return (
    <>
      <div className="continer mt-4 ms-4 me-4">
        <form className="row" onSubmit={onSubmit}>
          <div className="col-md-12">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={formPerson.firstName}
              onChange={(e) => {
                handleChange('firstName', e.target.value);
              }}
            />
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              {errors.firstName}
            </span>
          </div>
          <div className="col-md-12">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={formPerson.lastName}
              onChange={(e) => {
                handleChange('lastName', e.target.value);
              }}
            />
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              {errors.lastName}
            </span>
          </div>
          <div className="col-md-12 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Primary
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;

```
