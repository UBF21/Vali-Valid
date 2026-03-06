/**
 * Example 03 — Async validation
 *
 * Demonstrates:
 * - AsyncPattern for server-side checks
 * - isValidating spinner
 * - Combining sync + async rules
 * - asyncFn receiving (value, form) for cross-field async logic
 */

import React from 'react';
import { useValiValid, ValidationType } from 'vali-valid';

type SignupForm = {
  username: string;
  email: string;
  referralCode: string;
};

// --- Simulated API calls ---
async function checkUsername(username: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600)); // simulate network
  const taken = ['admin', 'root', 'superuser'];
  return !taken.includes(username.toLowerCase());
}

async function checkEmail(email: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 500));
  const registered = ['test@test.com', 'admin@example.com'];
  return !registered.includes(email.toLowerCase());
}

async function validateReferral(code: string, form: Partial<SignupForm>): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 400));
  // Example: referral codes with user's first letter are invalid (demo logic)
  if (!form.username) return true;
  return !code.startsWith(form.username[0].toUpperCase());
}
// --------------------------

export function AsyncSignupForm() {
  const { form, errors, isValidating, handleChange, validate } =
    useValiValid<SignupForm>({
      initial: { username: '', email: '', referralCode: '' },
      validations: [
        {
          field: 'username',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.MinLength, value: 3 },
            { type: ValidationType.MaxLength, value: 20 },
            { type: ValidationType.Slug },
            {
              type: ValidationType.AsyncPattern,
              message: 'Username is already taken.',
              asyncFn: (value) => checkUsername(value),
            },
          ],
        },
        {
          field: 'email',
          validations: [
            { type: ValidationType.Required },
            { type: ValidationType.Email },
            {
              type: ValidationType.AsyncPattern,
              message: 'This email is already registered.',
              asyncFn: (value) => checkEmail(value),
            },
          ],
        },
        {
          field: 'referralCode',
          validations: [
            { type: ValidationType.ExactLength, value: 6 },
            {
              type: ValidationType.AsyncPattern,
              message: 'Referral code is not valid for this account.',
              asyncFn: (value, form) => validateReferral(value, form),
            },
          ],
        },
      ],
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await validate();
    if (!Object.values(errors).some(Boolean)) {
      console.log('Signup:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2>Create account</h2>

      {/* Username */}
      <div>
        <label>Username</label>
        <div style={{ position: 'relative' }}>
          <input
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="my-username"
            style={{ width: '100%', padding: '8px' }}
          />
          {isValidating && (
            <span style={{ position: 'absolute', right: 8, top: 8, fontSize: 12, color: '#888' }}>
              Checking…
            </span>
          )}
        </div>
        {errors.username && <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>{errors.username}</p>}
        {errors.username === null && <p style={{ color: 'green', margin: '4px 0 0', fontSize: 13 }}>✓ Available</p>}
      </div>

      {/* Email */}
      <div>
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.email && <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>{errors.email}</p>}
        {errors.email === null && <p style={{ color: 'green', margin: '4px 0 0', fontSize: 13 }}>✓ Available</p>}
      </div>

      {/* Referral code (optional) */}
      <div>
        <label>Referral code <span style={{ color: '#888', fontSize: 12 }}>(optional, 6 chars)</span></label>
        <input
          value={form.referralCode}
          onChange={(e) => handleChange('referralCode', e.target.value)}
          placeholder="ABC123"
          maxLength={6}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.referralCode && <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>{errors.referralCode}</p>}
      </div>

      <button type="submit" disabled={isValidating} style={{ padding: '10px' }}>
        {isValidating ? 'Validating…' : 'Create account'}
      </button>
    </form>
  );
}
