/**
 * Example 06 — Dynamic validation rules
 *
 * Demonstrates:
 * - addFieldValidation: add rules at runtime
 * - removeFieldValidation: make a field optional
 * - setFieldValidations: swap full rule sets based on role
 * - clearFieldValidations: disable an entire field
 * - Rules that change based on UI state (toggle, select)
 */

import React, { useState } from 'react';
import { useValiValid, ValidationType } from 'vali-valid';

type ProfileForm = {
  username: string;
  role: 'user' | 'admin' | '';
  website: string;
  promoCode: string;
  notes: string;
};

export function DynamicRulesForm() {
  const [hasPromo, setHasPromo] = useState(false);
  const [strengthEnabled, setStrengthEnabled] = useState(false);

  const {
    form, errors, isValid,
    handleChange, validate,
    addFieldValidation, removeFieldValidation,
    setFieldValidations, clearFieldValidations,
  } = useValiValid<ProfileForm>({
    initial: { username: '', role: '', website: '', promoCode: '', notes: '' },
    validations: [
      {
        field: 'username',
        validations: [
          { type: ValidationType.Required },
          { type: ValidationType.MinLength, value: 3 },
          { type: ValidationType.Slug },
        ],
      },
      {
        field: 'role',
        validations: [
          { type: ValidationType.Required },
        ],
      },
      {
        field: 'website',
        validations: [
          { type: ValidationType.Url },
        ],
      },
      // promoCode and notes start with no rules
    ],
  });

  // ── Toggle: strength check on username ─────────────────────────────────
  const toggleStrengthCheck = () => {
    if (!strengthEnabled) {
      addFieldValidation('username', [
        { type: ValidationType.MinLength, value: 6, message: 'Min 6 chars when strict mode is on.' },
      ]);
    } else {
      removeFieldValidation('username', ValidationType.MinLength);
      addFieldValidation('username', [
        { type: ValidationType.MinLength, value: 3 },
      ]);
    }
    setStrengthEnabled((v) => !v);
  };

  // ── Select: swap rules based on role ───────────────────────────────────
  const handleRoleChange = (role: ProfileForm['role']) => {
    handleChange('role', role);

    if (role === 'admin') {
      setFieldValidations('username', [
        { type: ValidationType.Required },
        { type: ValidationType.MinLength, value: 6 },
        { type: ValidationType.AlphaNumeric },
      ]);
      setFieldValidations('notes', [
        { type: ValidationType.Required, message: 'Admins must provide a bio.' },
        { type: ValidationType.MinLength, value: 20 },
      ]);
    } else if (role === 'user') {
      setFieldValidations('username', [
        { type: ValidationType.Required },
        { type: ValidationType.MinLength, value: 3 },
        { type: ValidationType.Slug },
      ]);
      clearFieldValidations('notes');
    }
  };

  // ── Toggle: promo code field ────────────────────────────────────────────
  const togglePromo = (checked: boolean) => {
    setHasPromo(checked);
    if (checked) {
      addFieldValidation('promoCode', [
        { type: ValidationType.Required, message: 'Enter your promo code.' },
        { type: ValidationType.ExactLength, value: 8 },
        { type: ValidationType.UpperCase },
      ]);
    } else {
      clearFieldValidations('promoCode');
      handleChange('promoCode', '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = await validate();
    if (!Object.values(errs).some(Boolean)) {
      console.log('Saved:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2>Edit profile</h2>

      {/* Username + toggle */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <label><strong>Username *</strong></label>
          <label style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={strengthEnabled}
              onChange={toggleStrengthCheck}
              style={{ marginRight: 4 }}
            />
            Strict mode (min 6 chars)
          </label>
        </div>
        <input
          value={form.username}
          onChange={(e) => handleChange('username', e.target.value)}
          placeholder="my-username"
          style={{ width: '100%', padding: 8 }}
        />
        {errors.username && <Err>{errors.username}</Err>}
      </div>

      {/* Role selector — changes username + notes rules */}
      <div>
        <label><strong>Role *</strong></label>
        <p style={{ color: '#6b7280', fontSize: 13, margin: '2px 0 6px' }}>
          Changing role swaps validation rules for username and notes.
        </p>
        <select
          value={form.role}
          onChange={(e) => handleRoleChange(e.target.value as ProfileForm['role'])}
          style={{ width: '100%', padding: 8 }}
        >
          <option value="">Select role…</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <Err>{errors.role}</Err>}
      </div>

      {/* Website (optional, Url rule always present) */}
      <div>
        <label><strong>Website</strong> <span style={{ color: '#9ca3af', fontSize: 12 }}>(optional)</span></label>
        <input
          value={form.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://mysite.com"
          style={{ width: '100%', padding: 8 }}
        />
        {errors.website && <Err>{errors.website}</Err>}
      </div>

      {/* Promo code — toggle activates validation */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={hasPromo}
            onChange={(e) => togglePromo(e.target.checked)}
          />
          <strong>I have a promo code</strong>
        </label>
        {hasPromo && (
          <div style={{ marginTop: 8 }}>
            <input
              value={form.promoCode}
              onChange={(e) => handleChange('promoCode', e.target.value.toUpperCase())}
              placeholder="ABCD1234"
              maxLength={8}
              style={{ width: '100%', padding: 8 }}
            />
            {errors.promoCode && <Err>{errors.promoCode}</Err>}
          </div>
        )}
      </div>

      {/* Notes — required only for admins */}
      {form.role === 'admin' && (
        <div>
          <label><strong>Bio / Notes *</strong> <span style={{ color: '#6b7280', fontSize: 12 }}>(admin only)</span></label>
          <textarea
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Tell us about your admin role (min 20 chars)…"
            style={{ width: '100%', padding: 8, minHeight: 80 }}
          />
          {errors.notes && <Err>{errors.notes}</Err>}
        </div>
      )}

      <button type="submit" disabled={!isValid} style={{ padding: '10px', marginTop: 4 }}>
        Save profile
      </button>
    </form>
  );
}

const Err = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>{children}</p>
);
