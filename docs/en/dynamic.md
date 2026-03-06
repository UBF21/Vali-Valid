# Dynamic validation management

ValiValid v2 lets you add, remove, replace, or clear validation rules at runtime — without re-creating the hook or the form.

---

## Available methods

| Method | Effect |
|--------|--------|
| `addFieldValidation(field, rules[])` | Appends new rules to a field |
| `removeFieldValidation(field, type)` | Removes all rules of one type from a field |
| `setFieldValidations(field, rules[])` | Replaces ALL rules for a field |
| `clearFieldValidations(field)` | Removes all rules from a field |

---

## `addFieldValidation`

Adds rules to a field **without removing** existing ones.

```tsx
const enableStrengthCheck = () => {
  addFieldValidation('password', [
    { type: ValidationType.PasswordStrength },
  ]);
};
```

---

## `removeFieldValidation`

Removes all rules of a specific `ValidationType`. Other types stay.

```tsx
const makeOptional = (optional: boolean) => {
  if (optional) {
    removeFieldValidation('phone', ValidationType.Required);
  } else {
    addFieldValidation('phone', [{ type: ValidationType.Required }]);
  }
};
```

---

## `setFieldValidations`

Replaces **all** existing rules for a field.

```tsx
const applyRules = (role: 'admin' | 'user') => {
  if (role === 'admin') {
    setFieldValidations('username', [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 6 },
      { type: ValidationType.AlphaNumeric },
    ]);
  } else {
    setFieldValidations('username', [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 3 },
    ]);
  }
};
```

---

## `clearFieldValidations`

Removes all rules from a field. Value stays in `form`.

```tsx
const toggleSection = (enabled: boolean) => {
  if (enabled) {
    addFieldValidation('discount', [
      { type: ValidationType.Required },
      { type: ValidationType.NumberRange, value: [0, 100] },
    ]);
  } else {
    clearFieldValidations('discount');
  }
};
```

---

## Multi-step form example

```tsx
type CheckoutForm = {
  email: string;
  card: string;
  giftMessage: string;
};

function CheckoutWizard() {
  const [step, setStep] = useState<'contact' | 'payment' | 'extras'>('contact');

  const {
    form, errors, handleChange, validate,
    setFieldValidations, clearFieldValidations,
  } = useValiValid<CheckoutForm>({
    initial: { email: '', card: '', giftMessage: '' },
    validations: [
      {
        field: 'email',
        validations: [
          { type: ValidationType.Required },
          { type: ValidationType.Email },
        ],
      },
    ],
  });

  const goToPayment = async () => {
    const errs = await validate();
    if (Object.values(errs).some(Boolean)) return;

    clearFieldValidations('email');
    setFieldValidations('card', [
      { type: ValidationType.Required },
      { type: ValidationType.CreditCard },
    ]);
    setStep('payment');
  };

  return (
    <form>
      {step === 'contact' && (
        <>
          <input
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p>{errors.email}</p>}
          <button type="button" onClick={goToPayment}>Next</button>
        </>
      )}

      {step === 'payment' && (
        <>
          <input
            value={form.card}
            onChange={(e) => handleChange('card', e.target.value)}
            placeholder="Card number"
          />
          {errors.card && <p>{errors.card}</p>}
          <button type="submit">Place order</button>
        </>
      )}
    </form>
  );
}
```

---

## Rule execution order

Rules run in **insertion order**. Validation stops at the first failure.

```ts
addFieldValidation('email', [
  { type: ValidationType.Required },      // checked 1st
  { type: ValidationType.MinLength, value: 5 },
  { type: ValidationType.Email },         // checked last
]);
```
