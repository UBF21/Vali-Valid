/**
 * Example 05 — Multi-step form
 *
 * Demonstrates:
 * - setFieldValidations to swap rules between steps
 * - clearFieldValidations to disable validation for a step
 * - RequiredIf for conditional required fields
 * - Step-by-step validate() before advancing
 * - Progress indicator
 */

import React, { useState } from 'react';
import { useValiValid, ValidationType, TypeFile, FileSize } from 'vali-valid';

type OrderForm = {
  // Step 1: Contact
  fullName: string;
  email: string;
  phone: string;

  // Step 2: Shipping
  shippingMethod: 'pickup' | 'home' | '';
  address: string;
  city: string;

  // Step 3: Payment
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
};

const STEPS = ['Contact', 'Shipping', 'Payment', 'Review'] as const;
type Step = (typeof STEPS)[number];

export function MultiStepOrder() {
  const [currentStep, setCurrentStep] = useState<Step>('Contact');
  const [submitted, setSubmitted] = useState(false);

  const {
    form, errors, isValidating,
    handleChange, validate,
    setFieldValidations, clearFieldValidations, addFieldValidation,
  } = useValiValid<OrderForm>({
    initial: {
      fullName: '', email: '', phone: '',
      shippingMethod: '', address: '', city: '',
      cardNumber: '', cardExpiry: '', cardCvv: '',
    },
    validations: [
      // Step 1 rules (active from the start)
      {
        field: 'fullName',
        validations: [
          { type: ValidationType.Required },
          { type: ValidationType.MinLength, value: 3 },
        ],
      },
      {
        field: 'email',
        validations: [
          { type: ValidationType.Required },
          { type: ValidationType.Email },
        ],
      },
      {
        field: 'phone',
        validations: [
          { type: ValidationType.Phone },
        ],
      },
    ],
  });

  const activateShippingRules = () => {
    setFieldValidations('shippingMethod', [
      { type: ValidationType.Required },
    ]);
    setFieldValidations('address', [
      {
        type: ValidationType.RequiredIf,
        condition: (f) => f.shippingMethod === 'home',
        message: 'Address is required for home delivery.',
      },
      { type: ValidationType.MinLength, value: 10 },
    ]);
    setFieldValidations('city', [
      {
        type: ValidationType.RequiredIf,
        condition: (f) => f.shippingMethod === 'home',
        message: 'City is required for home delivery.',
      },
    ]);
    // Clear step 1 rules (already validated)
    clearFieldValidations('fullName');
    clearFieldValidations('email');
    clearFieldValidations('phone');
  };

  const activatePaymentRules = () => {
    setFieldValidations('cardNumber', [
      { type: ValidationType.Required },
      { type: ValidationType.CreditCard },
    ]);
    setFieldValidations('cardExpiry', [
      { type: ValidationType.Required },
      { type: ValidationType.ExactLength, value: 5 },
      {
        type: ValidationType.Pattern,
        value: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
        message: 'Expiry must be MM/YY.',
      },
    ]);
    setFieldValidations('cardCvv', [
      { type: ValidationType.Required },
      { type: ValidationType.DigitsOnly },
      { type: ValidationType.MinLength, value: 3 },
      { type: ValidationType.MaxLength, value: 4 },
    ]);
    // Clear step 2 rules
    clearFieldValidations('shippingMethod');
    clearFieldValidations('address');
    clearFieldValidations('city');
  };

  const goToStep = async (nextStep: Step) => {
    const errs = await validate();
    if (Object.values(errs).some(Boolean)) return;

    if (nextStep === 'Shipping') activateShippingRules();
    if (nextStep === 'Payment') activatePaymentRules();
    if (nextStep === 'Review') {
      clearFieldValidations('cardNumber');
      clearFieldValidations('cardExpiry');
      clearFieldValidations('cardCvv');
    }

    setCurrentStep(nextStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Order placed:', form);
  };

  const stepIndex = STEPS.indexOf(currentStep);

  if (submitted) {
    return (
      <div style={{ maxWidth: 400, padding: 24, textAlign: 'center' }}>
        <h2>✓ Order placed!</h2>
        <p>Thank you, {form.fullName}. Confirmation sent to {form.email}.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440 }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= stepIndex ? '#3b82f6' : '#e5e7eb',
            }}
          />
        ))}
      </div>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Step {stepIndex + 1} of {STEPS.length} — <strong>{currentStep}</strong>
      </p>

      <form onSubmit={handleSubmit}>

        {/* ─── Step 1: Contact ─── */}
        {currentStep === 'Contact' && (
          <>
            <h3>Contact information</h3>

            <Field label="Full name *">
              <input
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
              {errors.fullName && <Err>{errors.fullName}</Err>}
            </Field>

            <Field label="Email *">
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <Err>{errors.email}</Err>}
            </Field>

            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1234567890"
              />
              {errors.phone && <Err>{errors.phone}</Err>}
            </Field>

            <NextButton onClick={() => goToStep('Shipping')} loading={isValidating} />
          </>
        )}

        {/* ─── Step 2: Shipping ─── */}
        {currentStep === 'Shipping' && (
          <>
            <h3>Shipping method</h3>

            <Field label="Delivery method *">
              <select
                value={form.shippingMethod}
                onChange={(e) => handleChange('shippingMethod', e.target.value as any)}
                style={{ width: '100%', padding: 8 }}
              >
                <option value="">Select…</option>
                <option value="pickup">Store pickup</option>
                <option value="home">Home delivery</option>
              </select>
              {errors.shippingMethod && <Err>{errors.shippingMethod}</Err>}
            </Field>

            {form.shippingMethod === 'home' && (
              <>
                <Field label="Address *">
                  <input
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                  />
                  {errors.address && <Err>{errors.address}</Err>}
                </Field>

                <Field label="City *">
                  <input
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                  {errors.city && <Err>{errors.city}</Err>}
                </Field>
              </>
            )}

            <NextButton onClick={() => goToStep('Payment')} loading={isValidating} />
          </>
        )}

        {/* ─── Step 3: Payment ─── */}
        {currentStep === 'Payment' && (
          <>
            <h3>Payment details</h3>

            <Field label="Card number *">
              <input
                value={form.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                placeholder="4111111111111111"
                maxLength={19}
              />
              {errors.cardNumber && <Err>{errors.cardNumber}</Err>}
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Expiry (MM/YY) *">
                <input
                  value={form.cardExpiry}
                  onChange={(e) => handleChange('cardExpiry', e.target.value)}
                  placeholder="12/26"
                  maxLength={5}
                />
                {errors.cardExpiry && <Err>{errors.cardExpiry}</Err>}
              </Field>

              <Field label="CVV *">
                <input
                  value={form.cardCvv}
                  onChange={(e) => handleChange('cardCvv', e.target.value)}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cardCvv && <Err>{errors.cardCvv}</Err>}
              </Field>
            </div>

            <NextButton onClick={() => goToStep('Review')} loading={isValidating} />
          </>
        )}

        {/* ─── Step 4: Review ─── */}
        {currentStep === 'Review' && (
          <>
            <h3>Order summary</h3>
            <ReviewLine label="Name" value={form.fullName} />
            <ReviewLine label="Email" value={form.email} />
            <ReviewLine label="Shipping" value={form.shippingMethod === 'home' ? `Home: ${form.address}, ${form.city}` : 'Store pickup'} />
            <ReviewLine label="Card" value={`•••• •••• •••• ${form.cardNumber.slice(-4)}`} />

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 16 }}
            >
              Place order
            </button>
          </>
        )}
      </form>
    </div>
  );
}

// ─── Small helpers ───────────────────────────────────────────────────────────

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>{label}</label>
    {children}
  </div>
);

const Err = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>{children}</p>
);

const NextButton = ({ onClick, loading }: { onClick: () => void; loading: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    style={{ width: '100%', padding: '10px', marginTop: 8, cursor: 'pointer' }}
  >
    {loading ? 'Validating…' : 'Next →'}
  </button>
);

const ReviewLine = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
    <span style={{ color: '#6b7280' }}>{label}</span>
    <strong>{value}</strong>
  </div>
);
