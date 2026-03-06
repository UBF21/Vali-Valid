/**
 * Example 02 — Registration form
 *
 * Demonstrates:
 * - PasswordStrength
 * - MatchField (confirm password)
 * - Alpha, MinLength, MaxLength
 * - Multiple rules per field
 */

import React from 'react';
import { useValiValid, ValidationType } from 'vali-valid';

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const { form, errors, isValid, isValidating, handleChange, validate } =
    useValiValid<RegisterForm>({
      initial: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validations: [
        {
          field: 'firstName',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.MinLength, value: 2 },
            { type: ValidationType.MaxLength, value: 30 },
            { type: ValidationType.Alpha },
          ],
        },
        {
          field: 'lastName',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.MinLength, value: 2 },
            { type: ValidationType.MaxLength, value: 30 },
            { type: ValidationType.Alpha },
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
          field: 'password',
          validations: [
            { type: ValidationType.Required },
            {
              type: ValidationType.PasswordStrength,
              message: 'Use at least 8 characters with uppercase, lowercase, number, and symbol.',
            },
          ],
        },
        {
          field: 'confirmPassword',
          validations: [
            { type: ValidationType.Required },
            {
              type: ValidationType.MatchField,
              field: 'password',
              message: 'Passwords do not match.',
            },
          ],
        },
      ],
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await validate();
    if (!Object.values(errors).some(Boolean)) {
      console.log('Register:', { ...form, password: '***' });
    }
  };

  const Field = ({
    name,
    label,
    type = 'text',
  }: {
    name: keyof RegisterForm;
    label: string;
    type?: string;
  }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={form[name] as string}
        onChange={(e) => handleChange(name, e.target.value)}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
      {errors[name] && (
        <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h2>Create account</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field name="firstName" label="First name" />
        <Field name="lastName" label="Last name" />
      </div>

      <Field name="email" label="Email" type="email" />
      <Field name="password" label="Password" type="password" />
      <Field name="confirmPassword" label="Confirm password" type="password" />

      <button type="submit" disabled={!isValid || isValidating} style={{ width: '100%', padding: '10px' }}>
        Register
      </button>
    </form>
  );
}
