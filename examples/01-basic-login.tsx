/**
 * Example 01 — Basic login form
 *
 * Demonstrates:
 * - Required + Email + MinLength
 * - isValid to disable submit
 * - validate() on submit
 * - reset()
 */

import React from 'react';
import { useValiValid, ValidationType } from 'vali-valid';

type LoginForm = {
  email: string;
  password: string;
};

export function LoginForm() {
  const { form, errors, isValid, handleChange, validate, reset } =
    useValiValid<LoginForm>({
      initial: { email: '', password: '' },
      validations: [
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
            { type: ValidationType.MinLength, value: 8 },
          ],
        },
      ],
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await validate();

    if (Object.values(errors).some(Boolean)) return;

    console.log('Login with:', form);
    reset();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <h2>Login</h2>

      <div>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Email"
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.email && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Password"
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.password && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.password}</p>}
      </div>

      <button type="submit" disabled={!isValid}>
        Sign in
      </button>

      <button type="button" onClick={() => reset()}>
        Clear
      </button>
    </form>
  );
}
