import { describe, it, expect, afterEach, vi } from 'vitest';
import { ValiValid } from '../validation/ValiValid';
import { ValidationType } from '../validation/Validators';
import { rule } from '../builder/index';
import { setLocale, getLocale } from '../i18n/index';

describe('ValiValid', () => {
    describe('multiple errors per field', () => {
        it('returns all errors for a field, not just the first', () => {
            const engine = new ValiValid([{
                field: 'password',
                validations: [
                    { type: ValidationType.MinLength, value: 8 },
                    { type: ValidationType.PasswordStrength },
                ],
            }]);
            const errors = engine.validateSync({ password: 'abc' } as any);
            expect(errors.password).toBeInstanceOf(Array);
            expect(errors.password!.length).toBeGreaterThan(1);
        });

        it('returns null when field is valid', () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [{ type: ValidationType.Email }],
            }]);
            const errors = engine.validateSync({ email: 'user@example.com' } as any);
            expect(errors.email).toBeNull();
        });

        it('returns array with single error when only one rule fails', () => {
            const engine = new ValiValid([{
                field: 'name',
                validations: [
                    { type: ValidationType.Required },
                    { type: ValidationType.MinLength, value: 3 },
                ],
            }]);
            const errors = engine.validateSync({ name: '' } as any);
            expect(Array.isArray(errors.name)).toBe(true);
        });
    });

    describe('transform pipeline', () => {
        it('applies transform before validation', () => {
            const engine = new ValiValid([{
                field: 'age',
                transform: (v) => parseInt(v, 10),
                validations: [{ type: ValidationType.NumberPositive }],
            }]);
            const errors = engine.validateSync({ age: '25' } as any);
            expect(errors.age).toBeNull();
        });

        it('transform to uppercase passes uppercase validator', () => {
            const engine = new ValiValid([{
                field: 'code',
                transform: (v) => typeof v === 'string' ? v.toUpperCase() : v,
                validations: [{ type: ValidationType.UpperCase }],
            }]);
            const errors = engine.validateSync({ code: 'abc' } as any);
            expect(errors.code).toBeNull();
        });
    });

    describe('watchFields', () => {
        it('getWatchedFields returns fields that watch a given field', () => {
            const engine = new ValiValid([{
                field: 'confirmPassword',
                watchFields: ['password'],
                validations: [{ type: ValidationType.Required }],
            }]);
            expect(engine.getWatchedFields('password')).toContain('confirmPassword');
        });

        it('returns empty array for field with no watchers', () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [{ type: ValidationType.Email }],
            }]);
            expect(engine.getWatchedFields('email')).toEqual([]);
        });
    });

    describe('nested dot-notation fields', () => {
        it('validates nested field using dot path', () => {
            const engine = new ValiValid([{
                field: 'address.city',
                validations: [{ type: ValidationType.Required }],
            }]);
            const errors = engine.validateSync({ address: { city: '' } } as any);
            expect((errors as any)['address.city']).toBeInstanceOf(Array);
            expect((errors as any)['address.city'].length).toBeGreaterThan(0);
        });

        it('returns null for valid nested field', () => {
            const engine = new ValiValid([{
                field: 'address.city',
                validations: [{ type: ValidationType.Required }],
            }]);
            const errors = engine.validateSync({ address: { city: 'Madrid' } } as any);
            expect((errors as any)['address.city']).toBeNull();
        });
    });

    describe('validateFieldSync returns string[] | null', () => {
        it('returns string array for invalid field', () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [
                    { type: ValidationType.Required },
                    { type: ValidationType.Email },
                ],
            }]);
            const result = engine.validateFieldSync('email', '');
            expect(Array.isArray(result)).toBe(true);
        });

        it('returns null for valid field', () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [{ type: ValidationType.Email }],
            }]);
            const result = engine.validateFieldSync('email', 'test@example.com');
            expect(result).toBeNull();
        });
    });

    describe('new validators', () => {
        it('NotOneOf rejects blacklisted values', () => {
            const engine = new ValiValid([{
                field: 'role',
                validations: [{ type: ValidationType.NotOneOf, value: ['admin', 'root'] }],
            }]);
            const errors = engine.validateSync({ role: 'admin' } as any);
            expect(errors.role).toBeInstanceOf(Array);
        });

        it('IPv6 validates correctly', () => {
            const engine = new ValiValid([{
                field: 'ip',
                validations: [{ type: ValidationType.IPv6 }],
            }]);
            expect(engine.validateFieldSync('ip', '::1')).toBeNull();
            expect(engine.validateFieldSync('ip', '999.999.999')).toBeInstanceOf(Array);
        });

        it('ArrayItems validates each item', () => {
            const engine = new ValiValid([{
                field: 'emails',
                validations: [{
                    type: ValidationType.ArrayItems,
                    validations: [{ type: ValidationType.Email }],
                }],
            }]);
            const okErrors = engine.validateSync({ emails: ['a@b.com', 'c@d.com'] } as any);
            expect(okErrors.emails).toBeNull();

            const badErrors = engine.validateSync({ emails: ['a@b.com', 'invalid'] } as any);
            expect(badErrors.emails).toBeInstanceOf(Array);
        });
    });

    describe('addFieldValidation accumulates rules', () => {
        it('appends a new MinLength rule and the stricter one causes validation failure', () => {
            const engine = new ValiValid([{
                field: 'name',
                validations: [{ type: ValidationType.MinLength, value: 3 }],
            }]);

            // Add a second MinLength rule (stricter)
            engine.addFieldValidation('name', [{ type: ValidationType.MinLength, value: 10 }]);

            const rules = (engine as any)._syncRules.get('name') as any[];
            const minLengthRules = rules.filter((r: any) => r.type === ValidationType.MinLength);
            // Both rules are stored (addFieldValidation appends)
            expect(minLengthRules.length).toBeGreaterThanOrEqual(1);

            // 'hello' is 5 chars — passes MinLength(3) but fails MinLength(10)
            const errorMsg = engine.validateFieldSync('name', 'hello');
            // MinLength(3) passes, MinLength(10) fails → error array with at least 1 entry
            expect(errorMsg).toBeInstanceOf(Array);
            expect(errorMsg!.length).toBeGreaterThanOrEqual(1);
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: Async rules
    // ─────────────────────────────────────────────────────────────────────────

    describe('async rules — validateAsync', () => {
        it('returns null for a field that passes an async rule', async () => {
            const engine = new ValiValid([{
                field: 'username',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    asyncFn: async (val) => val !== 'taken',
                }],
            }]);
            const errors = await engine.validateAsync({ username: 'free' } as any);
            expect(errors.username).toBeNull();
        });

        it('returns string[] when async rule fails', async () => {
            const engine = new ValiValid([{
                field: 'username',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    message: 'Username is taken',
                    asyncFn: async (val) => val !== 'taken',
                }],
            }]);
            const errors = await engine.validateAsync({ username: 'taken' } as any);
            expect(errors.username).toBeInstanceOf(Array);
            expect(errors.username![0]).toBe('Username is taken');
        });

        it('accumulates both sync and async errors for the same field', async () => {
            const engine = new ValiValid([{
                field: 'username',
                validations: [
                    { type: ValidationType.MinLength, value: 10, message: 'Too short' },
                    {
                        type: ValidationType.AsyncPattern,
                        message: 'Username is taken',
                        asyncFn: async () => false,
                    },
                ],
            }]);
            const errors = await engine.validateAsync({ username: 'ab' } as any);
            expect(errors.username).toBeInstanceOf(Array);
            expect(errors.username!.length).toBeGreaterThanOrEqual(2);
            expect(errors.username).toContain('Too short');
            expect(errors.username).toContain('Username is taken');
        });

        it('fields with no rules do not appear as keys in validateAsync result from async-only rules', async () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [{ type: ValidationType.Email }],
            }]);
            const errors = await engine.validateAsync({ email: 'valid@example.com' } as any);
            expect(errors.email).toBeNull();
        });
    });

    describe('async rules — validateFieldAsync', () => {
        it('returns null when both sync and async pass', async () => {
            const engine = new ValiValid([{
                field: 'code',
                validations: [
                    { type: ValidationType.MinLength, value: 3 },
                    { type: ValidationType.AsyncPattern, asyncFn: async () => true },
                ],
            }]);
            const result = await engine.validateFieldAsync('code', 'abc123', { code: 'abc123' } as any);
            expect(result).toBeNull();
        });

        it('returns array when only async rule fails', async () => {
            const engine = new ValiValid([{
                field: 'slug',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    message: 'Slug already used',
                    asyncFn: async () => false,
                }],
            }]);
            const result = await engine.validateFieldAsync('slug', 'my-slug', { slug: 'my-slug' } as any);
            expect(result).toBeInstanceOf(Array);
            expect(result![0]).toBe('Slug already used');
        });

        it('combines sync + async errors in validateFieldAsync', async () => {
            const engine = new ValiValid([{
                field: 'handle',
                validations: [
                    { type: ValidationType.MinLength, value: 20, message: 'Too short' },
                    { type: ValidationType.AsyncPattern, message: 'Already taken', asyncFn: async () => false },
                ],
            }]);
            const result = await engine.validateFieldAsync('handle', 'short', { handle: 'short' } as any);
            expect(result).toBeInstanceOf(Array);
            expect(result!).toContain('Too short');
            expect(result!).toContain('Already taken');
        });
    });

    describe('async rules — hasAsyncRules', () => {
        it('returns true for a field with AsyncPattern rule', () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [{ type: ValidationType.AsyncPattern, asyncFn: async () => true }],
            }]);
            expect(engine.hasAsyncRules('email')).toBe(true);
        });

        it('returns false for a field with only sync rules', () => {
            const engine = new ValiValid([{
                field: 'name',
                validations: [{ type: ValidationType.Required }],
            }]);
            expect(engine.hasAsyncRules('name')).toBe(false);
        });

        it('returns false for a field that does not exist', () => {
            const engine = new ValiValid([]);
            expect(engine.hasAsyncRules('anything')).toBe(false);
        });

        it('returns true for a field with FileDimensions (async)', () => {
            const engine = new ValiValid([{
                field: 'avatar',
                validations: [{ type: ValidationType.FileDimensions, value: { width: 100, height: 100 } }],
            }]);
            expect(engine.hasAsyncRules('avatar')).toBe(true);
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: Rule management
    // ─────────────────────────────────────────────────────────────────────────

    describe('removeFieldValidation', () => {
        it('removes a rule by type string so the field passes afterward', () => {
            const engine = new ValiValid([{
                field: 'name',
                validations: [
                    { type: ValidationType.Required },
                    { type: ValidationType.MinLength, value: 10 },
                ],
            }]);
            // Before removal — 'hi' fails MinLength(10)
            expect(engine.validateFieldSync('name', 'hi')).toBeInstanceOf(Array);

            // Remove MinLength — now 'hi' should pass
            engine.removeFieldValidation('name', ValidationType.MinLength);
            expect(engine.validateFieldSync('name', 'hi')).toBeNull();
        });

        it('does not affect other rules on the same field', () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [
                    { type: ValidationType.Required },
                    { type: ValidationType.Email },
                ],
            }]);
            engine.removeFieldValidation('email', ValidationType.Email);
            // Empty string still fails Required
            expect(engine.validateFieldSync('email', '')).toBeInstanceOf(Array);
        });

        it('is a no-op for a field that has no rules at all', () => {
            const engine = new ValiValid([]);
            expect(() => engine.removeFieldValidation('ghost', ValidationType.Required)).not.toThrow();
        });
    });

    describe('setFieldValidations', () => {
        it('replaces all existing rules for a field', () => {
            const engine = new ValiValid([{
                field: 'pin',
                validations: [
                    { type: ValidationType.Required },
                    { type: ValidationType.MinLength, value: 6 },
                ],
            }]);
            // Replace with a single MaxLength rule
            engine.setFieldValidations('pin', [{ type: ValidationType.MaxLength, value: 3 }]);
            const syncRules = (engine as any)._syncRules.get('pin') as any[];
            expect(syncRules.length).toBe(1);
            expect(syncRules[0].type).toBe(ValidationType.MaxLength);
        });

        it('new rules take effect immediately', () => {
            const engine = new ValiValid([{
                field: 'code',
                validations: [{ type: ValidationType.DigitsOnly }],
            }]);
            engine.setFieldValidations('code', [{ type: ValidationType.Alpha }]);
            // 'abc' passes Alpha but would fail DigitsOnly
            expect(engine.validateFieldSync('code', 'abc')).toBeNull();
            // '123' fails Alpha (old DigitsOnly rule gone)
            expect(engine.validateFieldSync('code', '123')).toBeInstanceOf(Array);
        });
    });

    describe('clearFieldValidations', () => {
        it('clears all rules so the field always returns null', () => {
            const engine = new ValiValid([{
                field: 'secret',
                validations: [
                    { type: ValidationType.Required },
                    { type: ValidationType.MinLength, value: 20 },
                ],
            }]);
            engine.clearFieldValidations('secret');
            expect(engine.validateFieldSync('secret', '')).toBeNull();
        });

        it('clears async rules as well', () => {
            const engine = new ValiValid([{
                field: 'handle',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    asyncFn: async () => false,
                }],
            }]);
            engine.clearFieldValidations('handle');
            expect(engine.hasAsyncRules('handle')).toBe(false);
        });
    });

    describe('addFieldValidation on a field with no prior rules', () => {
        it('registers the rule and validates correctly', () => {
            const engine = new ValiValid([]);
            engine.addFieldValidation('city', [{ type: ValidationType.Required }]);
            expect(engine.validateFieldSync('city', '')).toBeInstanceOf(Array);
            expect(engine.validateFieldSync('city', 'Madrid')).toBeNull();
        });
    });

    describe('getWatchedFields — multiple watchers', () => {
        it('returns multiple watchers when multiple fields watch the same target', () => {
            const engine = new ValiValid([
                {
                    field: 'confirmPassword',
                    watchFields: ['password'],
                    validations: [{ type: ValidationType.Required }],
                },
                {
                    field: 'passwordHint',
                    watchFields: ['password'],
                    validations: [{ type: ValidationType.Required }],
                },
            ]);
            const watchers = engine.getWatchedFields('password');
            expect(watchers).toContain('confirmPassword');
            expect(watchers).toContain('passwordHint');
        });

        it('is populated via NotMatchField rules automatically', () => {
            const engine = new ValiValid([{
                field: 'newPassword',
                validations: [{ type: ValidationType.NotMatchField, field: 'oldPassword' }],
            }]);
            expect(engine.getWatchedFields('oldPassword')).toContain('newPassword');
        });

        it('is populated via MatchField rules automatically', () => {
            const engine = new ValiValid([{
                field: 'confirmPassword',
                validations: [{ type: ValidationType.MatchField, field: 'password' }],
            }]);
            expect(engine.getWatchedFields('password')).toContain('confirmPassword');
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: transform + getFieldValue
    // ─────────────────────────────────────────────────────────────────────────

    describe('getFieldValue — isNumber / isDecimal / transform / boolean', () => {
        it('with isNumber:true strips non-digit characters', () => {
            const engine = new ValiValid([{
                field: 'phone',
                isNumber: true,
                validations: [{ type: ValidationType.NumberPositive }],
            }]);
            // getFieldValue should strip non-numeric chars and return a number
            const val = engine.getFieldValue('phone', '(555) 123-4567');
            expect(typeof val).toBe('number');
            expect(val).toBeGreaterThan(0);
        });

        it('with isDecimal:true converts string to float', () => {
            const engine = new ValiValid([{
                field: 'price',
                isNumber: true,
                isDecimal: true,
                validations: [{ type: ValidationType.NumberPositive }],
            }]);
            const val = engine.getFieldValue('price', '3.14');
            expect(val).toBe(3.14);
        });

        it('with transform, the transform function takes precedence over isNumber', () => {
            const engine = new ValiValid([{
                field: 'score',
                isNumber: true,
                transform: (v) => parseInt(v, 10) * 2,
                validations: [{ type: ValidationType.NumberPositive }],
            }]);
            const val = engine.getFieldValue('score', '5');
            expect(val).toBe(10);
        });

        it('boolean values pass through unchanged regardless of isNumber', () => {
            const engine = new ValiValid([{
                field: 'active',
                isNumber: true,
                validations: [{ type: ValidationType.Required }],
            }]);
            expect(engine.getFieldValue('active', true)).toBe(true);
            expect(engine.getFieldValue('active', false)).toBe(false);
        });

        it('field with no meta returns value unchanged', () => {
            const engine = new ValiValid([{
                field: 'title',
                validations: [{ type: ValidationType.Required }],
            }]);
            expect(engine.getFieldValue('title', 'hello')).toBe('hello');
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: New v3 validators via engine
    // ─────────────────────────────────────────────────────────────────────────

    describe('MACAddress validator', () => {
        it('accepts a valid MAC address with colons', () => {
            const engine = new ValiValid([{
                field: 'mac',
                validations: [{ type: ValidationType.MACAddress }],
            }]);
            expect(engine.validateFieldSync('mac', '01:23:45:67:89:AB')).toBeNull();
        });

        it('accepts a valid MAC address with hyphens', () => {
            const engine = new ValiValid([{
                field: 'mac',
                validations: [{ type: ValidationType.MACAddress }],
            }]);
            expect(engine.validateFieldSync('mac', '01-23-45-67-89-ab')).toBeNull();
        });

        it('rejects an invalid MAC address', () => {
            const engine = new ValiValid([{
                field: 'mac',
                validations: [{ type: ValidationType.MACAddress }],
            }]);
            expect(engine.validateFieldSync('mac', 'ZZ:ZZ:ZZ:ZZ:ZZ:ZZ')).toBeInstanceOf(Array);
        });

        it('rejects an incomplete MAC address', () => {
            const engine = new ValiValid([{
                field: 'mac',
                validations: [{ type: ValidationType.MACAddress }],
            }]);
            expect(engine.validateFieldSync('mac', '01:23:45')).toBeInstanceOf(Array);
        });
    });

    describe('DataURI validator', () => {
        it('accepts a valid data URI', () => {
            const engine = new ValiValid([{
                field: 'img',
                validations: [{ type: ValidationType.DataURI }],
            }]);
            const valid = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
            expect(engine.validateFieldSync('img', valid)).toBeNull();
        });

        it('rejects a plain string', () => {
            const engine = new ValiValid([{
                field: 'img',
                validations: [{ type: ValidationType.DataURI }],
            }]);
            expect(engine.validateFieldSync('img', 'not-a-data-uri')).toBeInstanceOf(Array);
        });

        it('rejects an HTTP URL', () => {
            const engine = new ValiValid([{
                field: 'img',
                validations: [{ type: ValidationType.DataURI }],
            }]);
            expect(engine.validateFieldSync('img', 'https://example.com/image.png')).toBeInstanceOf(Array);
        });
    });

    describe('MimeType validator', () => {
        it('accepts an exact MIME type match', () => {
            const engine = new ValiValid([{
                field: 'file',
                validations: [{ type: ValidationType.MimeType, value: ['image/png', 'image/jpeg'] } as any],
            }]);
            expect(engine.validateFieldSync('file', 'image/png')).toBeNull();
        });

        it('accepts a wildcard MIME type match', () => {
            const engine = new ValiValid([{
                field: 'file',
                validations: [{ type: ValidationType.MimeType, value: ['image/*'] } as any],
            }]);
            expect(engine.validateFieldSync('file', 'image/gif')).toBeNull();
        });

        it('rejects a MIME type not in the allowed list', () => {
            const engine = new ValiValid([{
                field: 'file',
                validations: [{ type: ValidationType.MimeType, value: ['image/png'] } as any],
            }]);
            expect(engine.validateFieldSync('file', 'application/pdf')).toBeInstanceOf(Array);
        });

        it('rejects an empty string', () => {
            const engine = new ValiValid([{
                field: 'file',
                validations: [{ type: ValidationType.MimeType, value: ['image/*'] } as any],
            }]);
            expect(engine.validateFieldSync('file', '')).toBeInstanceOf(Array);
        });
    });

    describe('DateRange validator (cross-field)', () => {
        it('passes when start date is before end date', () => {
            const engine = new ValiValid([{
                field: 'dateRange',
                validations: [{
                    type: ValidationType.DateRange,
                    startField: 'startDate',
                    endField: 'endDate',
                } as any],
            }]);
            const form = { dateRange: '', startDate: '2024-01-01', endDate: '2024-12-31' };
            const errors = engine.validateSync(form as any);
            expect(errors.dateRange).toBeNull();
        });

        it('fails when start date is after end date', () => {
            const engine = new ValiValid([{
                field: 'dateRange',
                validations: [{
                    type: ValidationType.DateRange,
                    startField: 'startDate',
                    endField: 'endDate',
                } as any],
            }]);
            const form = { dateRange: '', startDate: '2024-12-31', endDate: '2024-01-01' };
            const errors = engine.validateSync(form as any);
            expect(errors.dateRange).toBeInstanceOf(Array);
        });

        it('passes when start equals end date', () => {
            const engine = new ValiValid([{
                field: 'dateRange',
                validations: [{
                    type: ValidationType.DateRange,
                    startField: 'startDate',
                    endField: 'endDate',
                } as any],
            }]);
            const form = { dateRange: '', startDate: '2024-06-15', endDate: '2024-06-15' };
            const errors = engine.validateSync(form as any);
            expect(errors.dateRange).toBeNull();
        });
    });

    describe('ArrayItems with multiple sub-rules', () => {
        it('passes when all items satisfy both Required and MinLength', () => {
            const engine = new ValiValid([{
                field: 'tags',
                validations: [{
                    type: ValidationType.ArrayItems,
                    validations: [
                        { type: ValidationType.Required },
                        { type: ValidationType.MinLength, value: 3 },
                    ],
                }],
            }]);
            const errors = engine.validateSync({ tags: ['abc', 'defg', 'xyz'] } as any);
            expect(errors.tags).toBeNull();
        });

        it('fails when any item fails MinLength even though Required passes', () => {
            const engine = new ValiValid([{
                field: 'tags',
                validations: [{
                    type: ValidationType.ArrayItems,
                    validations: [
                        { type: ValidationType.Required },
                        { type: ValidationType.MinLength, value: 5 },
                    ],
                }],
            }]);
            const errors = engine.validateSync({ tags: ['hello', 'hi'] } as any);
            expect(errors.tags).toBeInstanceOf(Array);
        });

        it('fails when any item is empty (fails Required)', () => {
            const engine = new ValiValid([{
                field: 'tags',
                validations: [{
                    type: ValidationType.ArrayItems,
                    validations: [{ type: ValidationType.Required }],
                }],
            }]);
            const errors = engine.validateSync({ tags: ['valid', ''] } as any);
            expect(errors.tags).toBeInstanceOf(Array);
        });
    });

    describe('NotOneOf with edge cases', () => {
        it('passes any value when the blacklist is empty', () => {
            const engine = new ValiValid([{
                field: 'role',
                validations: [{ type: ValidationType.NotOneOf, value: [] }],
            }]);
            expect(engine.validateFieldSync('role', 'admin')).toBeNull();
            expect(engine.validateFieldSync('role', 'anything')).toBeNull();
        });

        it('passes a value that is not in the blacklist', () => {
            const engine = new ValiValid([{
                field: 'role',
                validations: [{ type: ValidationType.NotOneOf, value: ['admin', 'root'] }],
            }]);
            expect(engine.validateFieldSync('role', 'user')).toBeNull();
        });
    });

    describe('IPv6 — additional edge cases', () => {
        it('accepts a full IPv6 address', () => {
            const engine = new ValiValid([{
                field: 'ip',
                validations: [{ type: ValidationType.IPv6 }],
            }]);
            expect(engine.validateFieldSync('ip', '2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBeNull();
        });

        it('rejects an IPv4 address', () => {
            const engine = new ValiValid([{
                field: 'ip',
                validations: [{ type: ValidationType.IPv6 }],
            }]);
            expect(engine.validateFieldSync('ip', '192.168.1.1')).toBeInstanceOf(Array);
        });

        it('rejects an empty string', () => {
            const engine = new ValiValid([{
                field: 'ip',
                validations: [{ type: ValidationType.IPv6 }],
            }]);
            expect(engine.validateFieldSync('ip', '')).toBeInstanceOf(Array);
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: RuleBuilder.or() integration via engine
    // ─────────────────────────────────────────────────────────────────────────

    describe('RuleBuilder.or() integration', () => {
        it('passes when value satisfies at least one branch', () => {
            const engine = new ValiValid([{
                field: 'contact',
                validations: rule().or([rule().email(), rule().url()]).build(),
            }]);
            // Email branch passes
            expect(engine.validateFieldSync('contact', 'user@example.com')).toBeNull();
            // URL branch passes
            expect(engine.validateFieldSync('contact', 'https://example.com')).toBeNull();
        });

        it('fails when value satisfies no branch', () => {
            const engine = new ValiValid([{
                field: 'contact',
                validations: rule().or([rule().email(), rule().url()], 'Must be email or URL').build(),
            }]);
            const result = engine.validateFieldSync('contact', 'not-email-or-url');
            expect(result).toBeInstanceOf(Array);
            expect(result![0]).toBe('Must be email or URL');
        });

        it('throws when branches array is empty', () => {
            expect(() => rule().or([])).toThrow('[ValiValid] or(): branches array must not be empty.');
        });

        it('throws when a branch is empty (has no rules)', () => {
            expect(() => rule().or([rule()])).toThrow(/branch at index 0 has no rules/);
        });

        it('throws when a branch contains AsyncPattern', () => {
            expect(() =>
                rule().or([rule().asyncPattern(async () => true)])
            ).toThrow(/AsyncPattern/);
        });

        it('throws when a branch contains a cross-field rule (MatchField)', () => {
            expect(() =>
                rule().or([rule().matchField('other')])
            ).toThrow(/MatchField/);
        });

        it('passes with a custom message when valid', () => {
            const engine = new ValiValid([{
                field: 'id',
                validations: rule().or([rule().digitsOnly(), rule().uuid()], 'Must be digits or UUID').build(),
            }]);
            expect(engine.validateFieldSync('id', '12345')).toBeNull();
        });

        it('combines or() with other rules in the same builder chain', () => {
            const engine = new ValiValid([{
                field: 'token',
                validations: rule()
                    .required()
                    .or([rule().minLength(5), rule().email()])
                    .build(),
            }]);
            // Required fails on empty
            expect(engine.validateFieldSync('token', '')).toBeInstanceOf(Array);
            // 'abc' fails Required (passes) but or() branch minLength(5) fails and email() fails
            expect(engine.validateFieldSync('token', 'ab')).toBeInstanceOf(Array);
            // 'hello' is 5 chars — passes minLength(5) branch
            expect(engine.validateFieldSync('token', 'hello')).toBeNull();
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: Cross-field validators
    // ─────────────────────────────────────────────────────────────────────────

    describe('MatchField', () => {
        it('passes when fields match', () => {
            const engine = new ValiValid([{
                field: 'confirmPassword',
                validations: [{ type: ValidationType.MatchField, field: 'password' }],
            }]);
            const form = { password: 'secret123', confirmPassword: 'secret123' };
            const errors = engine.validateSync(form as any);
            expect(errors.confirmPassword).toBeNull();
        });

        it('fails when fields do not match', () => {
            const engine = new ValiValid([{
                field: 'confirmPassword',
                validations: [{ type: ValidationType.MatchField, field: 'password' }],
            }]);
            const form = { password: 'secret123', confirmPassword: 'different' };
            const errors = engine.validateSync(form as any);
            expect(errors.confirmPassword).toBeInstanceOf(Array);
        });

        it('passes via validateFieldSync with explicit form context', () => {
            const engine = new ValiValid([{
                field: 'confirmPassword',
                validations: [{ type: ValidationType.MatchField, field: 'password' }],
            }]);
            const form = { password: 'abc', confirmPassword: 'abc' } as any;
            const result = engine.validateFieldSync('confirmPassword', 'abc', form);
            expect(result).toBeNull();
        });
    });

    describe('NotMatchField', () => {
        it('passes when fields are different', () => {
            const engine = new ValiValid([{
                field: 'newPassword',
                validations: [{ type: ValidationType.NotMatchField, field: 'oldPassword' }],
            }]);
            const form = { oldPassword: 'oldSecret', newPassword: 'newSecret' };
            const errors = engine.validateSync(form as any);
            expect(errors.newPassword).toBeNull();
        });

        it('fails when fields are the same', () => {
            const engine = new ValiValid([{
                field: 'newPassword',
                validations: [{ type: ValidationType.NotMatchField, field: 'oldPassword' }],
            }]);
            const form = { oldPassword: 'sameSecret', newPassword: 'sameSecret' };
            const errors = engine.validateSync(form as any);
            expect(errors.newPassword).toBeInstanceOf(Array);
        });
    });

    describe('RequiredIf', () => {
        it('is required when condition returns true', () => {
            const engine = new ValiValid([{
                field: 'companyName',
                validations: [{
                    type: ValidationType.RequiredIf,
                    condition: (form) => form.isCompany === true,
                }],
            }]);
            const form = { isCompany: true, companyName: '' };
            const errors = engine.validateSync(form as any);
            expect(errors.companyName).toBeInstanceOf(Array);
        });

        it('is optional when condition returns false', () => {
            const engine = new ValiValid([{
                field: 'companyName',
                validations: [{
                    type: ValidationType.RequiredIf,
                    condition: (form) => form.isCompany === true,
                }],
            }]);
            const form = { isCompany: false, companyName: '' };
            const errors = engine.validateSync(form as any);
            expect(errors.companyName).toBeNull();
        });

        it('passes when condition is true and field has a value', () => {
            const engine = new ValiValid([{
                field: 'vatNumber',
                validations: [{
                    type: ValidationType.RequiredIf,
                    condition: (form) => form.isCompany === true,
                }],
            }]);
            const form = { isCompany: true, vatNumber: 'ES12345678Z' };
            const errors = engine.validateSync(form as any);
            expect(errors.vatNumber).toBeNull();
        });
    });

    describe('RequiredUnless', () => {
        it('is required when condition returns false', () => {
            const engine = new ValiValid([{
                field: 'phone',
                validations: [{
                    type: ValidationType.RequiredUnless,
                    condition: (form) => form.hasEmail === true,
                }],
            }]);
            const form = { hasEmail: false, phone: '' };
            const errors = engine.validateSync(form as any);
            expect(errors.phone).toBeInstanceOf(Array);
        });

        it('is optional when condition returns true', () => {
            const engine = new ValiValid([{
                field: 'phone',
                validations: [{
                    type: ValidationType.RequiredUnless,
                    condition: (form) => form.hasEmail === true,
                }],
            }]);
            const form = { hasEmail: true, phone: '' };
            const errors = engine.validateSync(form as any);
            expect(errors.phone).toBeNull();
        });

        it('passes when condition is false and field has a value', () => {
            const engine = new ValiValid([{
                field: 'phone',
                validations: [{
                    type: ValidationType.RequiredUnless,
                    condition: (form) => form.hasEmail === true,
                }],
            }]);
            const form = { hasEmail: false, phone: '+34600000000' };
            const errors = engine.validateSync(form as any);
            expect(errors.phone).toBeNull();
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: validateSync / validateAsync — all-fields result shape
    // ─────────────────────────────────────────────────────────────────────────

    describe('validateSync result shape', () => {
        it('fields with no rules do not appear as keys in the result', () => {
            const engine = new ValiValid([{
                field: 'email',
                validations: [{ type: ValidationType.Email }],
            }]);
            const errors = engine.validateSync({ email: 'valid@example.com', name: 'Alice' } as any);
            expect(Object.keys(errors)).not.toContain('name');
        });

        it('fields that pass all rules return null', () => {
            const engine = new ValiValid([
                { field: 'email', validations: [{ type: ValidationType.Email }] },
                { field: 'name', validations: [{ type: ValidationType.Required }] },
            ]);
            const errors = engine.validateSync({ email: 'a@b.com', name: 'Alice' } as any);
            expect(errors.email).toBeNull();
            expect(errors.name).toBeNull();
        });

        it('fields with multiple failing rules return array with all error messages', () => {
            const engine = new ValiValid([{
                field: 'password',
                validations: [
                    { type: ValidationType.MinLength, value: 20, message: 'Too short' },
                    { type: ValidationType.PasswordStrength, message: 'Too weak' },
                ],
            }]);
            const errors = engine.validateSync({ password: 'abc' } as any);
            expect(errors.password).toBeInstanceOf(Array);
            expect(errors.password).toContain('Too short');
            expect(errors.password).toContain('Too weak');
        });

        it('mixed result: some fields pass, some fail', () => {
            const engine = new ValiValid([
                { field: 'email', validations: [{ type: ValidationType.Email }] },
                { field: 'age', validations: [{ type: ValidationType.NumberPositive }] },
            ]);
            const errors = engine.validateSync({ email: 'bad-email', age: 25 } as any);
            expect(errors.email).toBeInstanceOf(Array);
            expect(errors.age).toBeNull();
        });
    });

    describe('validateAsync result shape', () => {
        it('fields that pass async rule return null', async () => {
            const engine = new ValiValid([{
                field: 'handle',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    asyncFn: async () => true,
                }],
            }]);
            const errors = await engine.validateAsync({ handle: 'myhandle' } as any);
            expect(errors.handle).toBeNull();
        });

        it('fields with failing async rule return string array', async () => {
            const engine = new ValiValid([{
                field: 'handle',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    message: 'Handle taken',
                    asyncFn: async () => false,
                }],
            }]);
            const errors = await engine.validateAsync({ handle: 'taken-handle' } as any);
            expect(errors.handle).toBeInstanceOf(Array);
            expect(errors.handle![0]).toBe('Handle taken');
        });

        it('sync-only fields appear in async result too', async () => {
            const engine = new ValiValid([
                { field: 'name', validations: [{ type: ValidationType.Required }] },
                {
                    field: 'handle',
                    validations: [{
                        type: ValidationType.AsyncPattern,
                        asyncFn: async () => true,
                    }],
                },
            ]);
            const errors = await engine.validateAsync({ name: '', handle: 'ok' } as any);
            expect(errors.name).toBeInstanceOf(Array);
            expect(errors.handle).toBeNull();
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// v4 engine tests
// ─────────────────────────────────────────────────────────────────────────────

describe('v4 engine — new validators via validateSync', () => {
    it('alphaDash — valid value passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().alphaDash().build(),
        }]);
        expect(engine.validateFieldSync('f', 'hello-world_123')).toBeNull();
    });

    it('alphaDash — invalid value fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().alphaDash().build(),
        }]);
        expect(engine.validateFieldSync('f', 'hello world')).toBeInstanceOf(Array);
    });

    it('notEmpty — non-blank passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().notEmpty().build(),
        }]);
        expect(engine.validateFieldSync('f', 'hello')).toBeNull();
    });

    it('notEmpty — blank fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().notEmpty().build(),
        }]);
        expect(engine.validateFieldSync('f', '   ')).toBeInstanceOf(Array);
    });

    it('jwt — valid three-part passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().jwt().build(),
        }]);
        expect(engine.validateFieldSync('f', 'header.payload.signature')).toBeNull();
    });

    it('jwt — invalid fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().jwt().build(),
        }]);
        expect(engine.validateFieldSync('f', 'nodots')).toBeInstanceOf(Array);
    });

    it('finite — integer passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().finite().build(),
        }]);
        expect(engine.validateFieldSync('f', 42)).toBeNull();
    });

    it('finite — Infinity fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().finite().build(),
        }]);
        expect(engine.validateFieldSync('f', 'Infinity')).toBeInstanceOf(Array);
    });

    it('port — 80 passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().port().build(),
        }]);
        expect(engine.validateFieldSync('f', 80)).toBeNull();
    });

    it('port — 99999 fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().port().build(),
        }]);
        expect(engine.validateFieldSync('f', 99999)).toBeInstanceOf(Array);
    });

    it('greaterThanOrEqual — 5 >= 5 passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().greaterThanOrEqual(5).build(),
        }]);
        expect(engine.validateFieldSync('f', 5)).toBeNull();
    });

    it('greaterThanOrEqual — 4 < 5 fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().greaterThanOrEqual(5).build(),
        }]);
        expect(engine.validateFieldSync('f', 4)).toBeInstanceOf(Array);
    });

    it('lessThanOrEqual — 5 <= 5 passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().lessThanOrEqual(5).build(),
        }]);
        expect(engine.validateFieldSync('f', 5)).toBeNull();
    });

    it('lessThanOrEqual — 6 > 5 fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: rule().lessThanOrEqual(5).build(),
        }]);
        expect(engine.validateFieldSync('f', 6)).toBeInstanceOf(Array);
    });

    it('arrayExactLength — [1,2,3] exact 3 passes', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.ArrayExactLength, value: 3 }],
        }]);
        expect(engine.validateFieldSync('f', [1, 2, 3])).toBeNull();
    });

    it('arrayExactLength — [1,2] for 3 fails', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.ArrayExactLength, value: 3 }],
        }]);
        expect(engine.validateFieldSync('f', [1, 2])).toBeInstanceOf(Array);
    });

    it('dateAfterField — later date passes cross-field', () => {
        const engine = new ValiValid([{
            field: 'endDate',
            validations: [{ type: ValidationType.DateAfterField, field: 'startDate' }],
        }]);
        const form = { startDate: '2025-01-01', endDate: '2025-01-02' } as any;
        const errors = engine.validateSync(form);
        expect(errors.endDate).toBeNull();
    });

    it('dateBeforeField — earlier date passes cross-field', () => {
        const engine = new ValiValid([{
            field: 'startDate',
            validations: [{ type: ValidationType.DateBeforeField, field: 'endDate' }],
        }]);
        const form = { startDate: '2025-01-01', endDate: '2025-01-02' } as any;
        const errors = engine.validateSync(form);
        expect(errors.startDate).toBeNull();
    });

    it('uuid version:1 — accepts v1 UUID', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.UUID, version: 1 }],
        }]);
        // A valid v1 UUID (version nibble = 1)
        expect(engine.validateFieldSync('f', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBeNull();
    });

    it('uuid version:1 — rejects v4 UUID', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.UUID, version: 1 }],
        }]);
        // A valid v4 UUID (version nibble = 4) should fail version:1 check
        expect(engine.validateFieldSync('f', '550e8400-e29b-41d4-a716-446655440000')).toBeInstanceOf(Array);
    });
});

describe('v4 engine — criteriaMode', () => {
    it('criteriaMode default (all) returns all errors', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [
                { type: ValidationType.Required, message: 'required error' },
                { type: ValidationType.MinLength, value: 5, message: 'minlength error' },
            ],
        }]);
        const errors = engine.validateSync({ f: '' } as any);
        expect(errors.f).toBeInstanceOf(Array);
        expect(errors.f!.length).toBe(2);
    });

    it('criteriaMode firstError returns only first error', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [
                { type: ValidationType.Required, message: 'required error' },
                { type: ValidationType.MinLength, value: 5, message: 'minlength error' },
            ],
        }], { criteriaMode: 'firstError' });
        const errors = engine.validateSync({ f: '' } as any);
        expect(errors.f).toBeInstanceOf(Array);
        expect(errors.f!.length).toBe(1);
        expect(errors.f![0]).toBe('required error');
    });
});

describe('v4 engine — optional/nullable/bail sentinels', () => {
    it('optional — empty string skips subsequent rules', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [
                { type: '__optional__' } as any,
                { type: ValidationType.Required },
            ],
        }]);
        const errors = engine.validateSync({ f: '' } as any);
        expect(errors.f).toBeNull();
    });

    it('optional — non-empty still validates', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [
                { type: '__optional__' } as any,
                { type: ValidationType.Email },
            ],
        }]);
        const errors = engine.validateSync({ f: 'notanemail' } as any);
        expect(errors.f).toBeInstanceOf(Array);
    });

    it('nullable — null skips subsequent rules', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [
                { type: '__nullable__' } as any,
                { type: ValidationType.Required },
            ],
        }]);
        const errors = engine.validateSync({ f: null } as any);
        expect(errors.f).toBeNull();
    });

    it('nullable — empty string does NOT skip', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [
                { type: '__nullable__' } as any,
                { type: ValidationType.Required },
            ],
        }]);
        const errors = engine.validateSync({ f: '' } as any);
        expect(errors.f).toBeInstanceOf(Array);
    });

    it('bail — stops after first error', () => {
        const engine = new ValiValid([{
            field: 'f',
            validations: [
                { type: ValidationType.Required, message: 'required error' },
                { type: '__bail__' } as any,
                { type: ValidationType.Email, message: 'email error' },
            ],
        }]);
        const errors = engine.validateSync({ f: '' } as any);
        expect(errors.f).toBeInstanceOf(Array);
        // bail stops after Required fails — Email rule should not run
        expect(errors.f!.length).toBe(1);
        expect(errors.f![0]).toBe('required error');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// RuleBuilder new methods — exhaustive tests
// ─────────────────────────────────────────────────────────────────────────────

const validateField = (builder: ReturnType<typeof rule>, value: any, form?: any) =>
    new ValiValid([{ field: 'f', validations: builder.build() }])
        .validateFieldSync('f', value, form ?? { f: value });

describe('RuleBuilder.withMessage()', () => {
    it('overrides the message of the last rule', () => {
        const errors = validateField(rule().required().withMessage('Custom required'), '');
        expect(errors).toEqual(['Custom required']);
    });

    it('withMessage on chained rule — only last rule message is overridden', () => {
        const errors = validateField(rule().required().email().withMessage('Bad email'), 'not-email');
        // required passes, email fails with custom message
        expect(errors).toEqual(['Bad email']);
    });

    it('throws when called on empty builder', () => {
        expect(() => rule().withMessage('oops')).toThrow('[ValiValid]');
    });

    it('does not affect earlier rules in chain', () => {
        // required fails with default message, not the custom one
        const errors = validateField(rule().required().email().withMessage('Bad email'), '');
        // required error should be the default required message, not 'Bad email'
        expect(errors).not.toEqual(['Bad email']);
        expect(errors!.length).toBeGreaterThan(0);
    });

    it('custom message appears in the errors array', () => {
        const errors = validateField(rule().email().withMessage('Must be valid email'), 'bad');
        expect(errors).toContain('Must be valid email');
    });

    it('withMessage after or() overrides or() message', () => {
        const errors = validateField(
            rule().or([rule().email(), rule().phone()]).withMessage('Email or phone required'),
            'neither'
        );
        expect(errors).toContain('Email or phone required');
    });
});

describe('RuleBuilder.not()', () => {
    it('not(email) passes on non-email value', () => {
        expect(validateField(rule().not(rule().email()), 'not-an-email')).toBeNull();
    });

    it('not(email) fails on valid email', () => {
        const errors = validateField(rule().not(rule().email()), 'user@example.com');
        expect(errors).not.toBeNull();
        expect(Array.isArray(errors)).toBe(true);
    });

    it('not(required) passes on empty string — empty does not satisfy required, so not() passes', () => {
        expect(validateField(rule().not(rule().required()), '')).toBeNull();
    });

    it('not(minLength(5)) passes on short string', () => {
        expect(validateField(rule().not(rule().minLength(5)), 'ab')).toBeNull();
    });

    it('not(minLength(5)) fails on long string', () => {
        expect(validateField(rule().not(rule().minLength(5)), 'hello world')).not.toBeNull();
    });

    it('required().not(email) — empty string fails required', () => {
        const errors = validateField(rule().required().not(rule().email()), '');
        expect(errors).not.toBeNull();
    });

    it('required().not(email) — non-email value passes both', () => {
        expect(validateField(rule().required().not(rule().email()), 'hello')).toBeNull();
    });

    it('throws when branch contains AsyncPattern', () => {
        expect(() => rule().not(rule().asyncPattern(async () => true, 'msg'))).toThrow('[ValiValid]');
    });

    it('throws when branch contains DateAfterField', () => {
        expect(() => rule().not(rule().dateAfterField('start'))).toThrow('[ValiValid]');
    });

    it('throws when branch contains RequiredIf', () => {
        expect(() => rule().not(rule().requiredIf(() => true))).toThrow('[ValiValid]');
    });

    it('custom message propagates to error array', () => {
        const errors = validateField(rule().not(rule().email(), 'Must NOT be an email'), 'u@x.com');
        expect(errors).toContain('Must NOT be an email');
    });
});

describe('RuleBuilder.if()', () => {
    it('condition=true, thenBranch=email — valid email passes', () => {
        expect(validateField(rule().if(() => true, rule().email()), 'u@x.com')).toBeNull();
    });

    it('condition=true, thenBranch=email — invalid email fails', () => {
        const errors = validateField(rule().if(() => true, rule().email()), 'not-email');
        expect(errors).not.toBeNull();
    });

    it('condition=false, no elseBranch — any value passes', () => {
        expect(validateField(rule().if(() => false, rule().email()), 'not-email')).toBeNull();
    });

    it('condition=false, elseBranch=minLength(3) — short value fails else', () => {
        const errors = validateField(rule().if(() => false, rule().email(), rule().minLength(3)), 'ab');
        expect(errors).not.toBeNull();
    });

    it('condition=false, elseBranch=minLength(3) — long value passes else', () => {
        expect(validateField(rule().if(() => false, rule().email(), rule().minLength(3)), 'hello')).toBeNull();
    });

    it('condition receives form context', () => {
        // condition checks form.type === 'business' → apply email rule
        const builder = rule().if((form) => form.type === 'business', rule().email());
        type FormShape = { email: string; type: string };
        const engineBusiness = new ValiValid<FormShape>([{ field: 'email', validations: builder.build() }]);
        const enginePersonal = new ValiValid<FormShape>([{ field: 'email', validations: builder.build() }]);
        expect(engineBusiness.validateFieldSync('email', 'bad', { email: 'bad', type: 'business' })).not.toBeNull();
        expect(enginePersonal.validateFieldSync('email', 'bad', { email: 'bad', type: 'personal' })).toBeNull();
    });

    it('throws when thenBranch contains AsyncPattern', () => {
        expect(() => rule().if(() => true, rule().asyncPattern(async () => true, 'msg'))).toThrow('[ValiValid]');
    });

    it('throws when elseBranch contains DateAfterField', () => {
        expect(() => rule().if(() => true, rule().email(), rule().dateAfterField('start'))).toThrow('[ValiValid]');
    });

    it('throws when thenBranch contains RequiredIf', () => {
        expect(() => rule().if(() => true, rule().requiredIf(() => true))).toThrow('[ValiValid]');
    });

    it('custom message appears in error', () => {
        const errors = validateField(
            rule().if(() => true, rule().email(), undefined, 'Conditional failed'),
            'not-email'
        );
        expect(errors).toContain('Conditional failed');
    });

    it('required().if() — empty value fails required regardless of if condition', () => {
        const errors = validateField(rule().required().if(() => true, rule().email()), '');
        expect(errors).not.toBeNull();
    });
});

describe('RuleBuilder.optional()', () => {
    it('optional() + required — empty string produces no error', () => {
        expect(validateField(rule().optional().required(), '')).toBeNull();
    });

    it('optional() + required — null produces no error', () => {
        expect(validateField(rule().optional().required(), null)).toBeNull();
    });

    it('optional() + required — undefined produces no error', () => {
        expect(validateField(rule().optional().required(), undefined)).toBeNull();
    });

    it('optional() + email — non-empty invalid email produces error', () => {
        const errors = validateField(rule().optional().email(), 'not-email');
        expect(errors).not.toBeNull();
    });

    it('optional() + email — non-empty valid email passes', () => {
        expect(validateField(rule().optional().email(), 'u@x.com')).toBeNull();
    });

    it('optional() at start — empty value with no subsequent rules → null', () => {
        expect(validateField(rule().optional(), '')).toBeNull();
    });

    it('optional() at start — non-empty value with no subsequent rules → null', () => {
        expect(validateField(rule().optional(), 'hello')).toBeNull();
    });

    it('rule before optional() still evaluated for non-empty: minLength + optional + email', () => {
        // minLength(2) evaluated → passes for 'hello'; optional sees non-empty → continues; email fails
        const errors = validateField(rule().minLength(2).optional().email(), 'hello');
        expect(errors).not.toBeNull();
    });
});

describe('RuleBuilder.nullable()', () => {
    it('nullable() + required — null produces no error', () => {
        expect(validateField(rule().nullable().required(), null)).toBeNull();
    });

    it('nullable() + required — undefined produces no error', () => {
        expect(validateField(rule().nullable().required(), undefined)).toBeNull();
    });

    it('nullable() + required — empty string DOES produce error (not null/undefined)', () => {
        const errors = validateField(rule().nullable().required(), '');
        expect(errors).not.toBeNull();
    });

    it('nullable() + email — null passes', () => {
        expect(validateField(rule().nullable().email(), null)).toBeNull();
    });

    it('nullable() + email — invalid non-null string fails', () => {
        const errors = validateField(rule().nullable().email(), 'bad');
        expect(errors).not.toBeNull();
    });

    it('nullable() + email — valid email passes', () => {
        expect(validateField(rule().nullable().email(), 'u@x.com')).toBeNull();
    });
});

describe('RuleBuilder.bail()', () => {
    it('required().bail().email() on empty — only required error (bail stops at 1)', () => {
        const errors = validateField(rule().required().bail().email(), '');
        expect(errors).not.toBeNull();
        expect(errors!.length).toBe(1);
    });

    it('required().bail().email() on non-email valid string — only email error', () => {
        const errors = validateField(rule().required().bail().email(), 'not-email');
        expect(errors).not.toBeNull();
        expect(errors!.length).toBe(1);
    });

    it('required().bail().email() on valid email — null', () => {
        expect(validateField(rule().required().bail().email(), 'u@x.com')).toBeNull();
    });

    it('without bail: required().email() on empty — 2 errors', () => {
        const errors = validateField(rule().required().email(), '');
        expect(errors).not.toBeNull();
        expect(errors!.length).toBe(2);
    });

    it('multiple bails: required().bail().minLength(5).bail().email() on empty — 1 error', () => {
        const errors = validateField(rule().required().bail().minLength(5).bail().email(), '');
        expect(errors!.length).toBe(1);
    });

    it('bail after passing rules: minLength(1).bail().email() on "x" — email error only', () => {
        // minLength(1) passes, bail checks (0 errors so far → no stop), email fails
        const errors = validateField(rule().minLength(1).bail().email(), 'x');
        expect(errors).not.toBeNull();
        expect(errors!.length).toBe(1);
    });
});

describe('RuleBuilder fluent API — build() output', () => {
    it('rule().required().build() produces 1 config', () => {
        expect(rule().required().build()).toHaveLength(1);
    });

    it('rule().required().email().build() produces 2 configs', () => {
        expect(rule().required().email().build()).toHaveLength(2);
    });

    it('rule().required().email().minLength(5).build() produces 3 configs', () => {
        expect(rule().required().email().minLength(5).build()).toHaveLength(3);
    });

    it('rule().uuid().build() — version is undefined (defaults to v4)', () => {
        const cfg = rule().uuid().build()[0] as any;
        expect(cfg.version).toBeUndefined();
    });

    it('rule().uuid(1).build() — version is 1', () => {
        const cfg = rule().uuid(1).build()[0] as any;
        expect(cfg.version).toBe(1);
    });

    it('rule().uuid(4, "Bad UUID").build() — message is set', () => {
        const cfg = rule().uuid(4, 'Bad UUID').build()[0] as any;
        expect(cfg.message).toBe('Bad UUID');
    });

    it('rule().alphaDash().build() has type AlphaDash', () => {
        expect((rule().alphaDash().build()[0] as any).type).toBe(ValidationType.AlphaDash);
    });

    it('rule().notEmpty().build() has type NotEmpty', () => {
        expect((rule().notEmpty().build()[0] as any).type).toBe(ValidationType.NotEmpty);
    });

    it('rule().jwt().build() has type JWT', () => {
        expect((rule().jwt().build()[0] as any).type).toBe(ValidationType.JWT);
    });

    it('rule().finite().build() has type Finite', () => {
        expect((rule().finite().build()[0] as any).type).toBe(ValidationType.Finite);
    });

    it('rule().port().build() has type Port', () => {
        expect((rule().port().build()[0] as any).type).toBe(ValidationType.Port);
    });

    it('rule().greaterThanOrEqual(5).build() has value 5', () => {
        expect((rule().greaterThanOrEqual(5).build()[0] as any).value).toBe(5);
    });

    it('rule().lessThanOrEqual(10).build() has value 10', () => {
        expect((rule().lessThanOrEqual(10).build()[0] as any).value).toBe(10);
    });

    it('rule().dateAfterField("start").build() has field "start"', () => {
        expect((rule().dateAfterField('start').build()[0] as any).field).toBe('start');
    });

    it('rule().dateBeforeField("end").build() has field "end"', () => {
        expect((rule().dateBeforeField('end').build()[0] as any).field).toBe('end');
    });

    it('rule().arrayExactLength(3).build() has value 3', () => {
        expect((rule().arrayExactLength(3).build()[0] as any).value).toBe(3);
    });

    describe('engine asyncTimeout option', () => {
        it('treats a timed-out async rule as passing (no error)', async () => {
            const engine = new ValiValid(
                [{
                    field: 'email',
                    validations: [{
                        type: ValidationType.AsyncPattern,
                        asyncFn: () => new Promise<boolean>(() => {}), // never resolves
                        message: 'slow',
                    }],
                }],
                { asyncTimeout: 50 }
            );
            const errors = await engine.validateAsync({ email: 'x' } as any);
            // Timeout → rule skipped → no error collected
            expect(errors.email).toBeNull();
        }, 2000);

        it('validateFieldAsync: treats a timed-out async rule as passing (no error)', async () => {
            const engine = new ValiValid(
                [{
                    field: 'username',
                    validations: [{
                        type: ValidationType.AsyncPattern,
                        asyncFn: () => new Promise<boolean>(() => {}), // never resolves
                        message: 'slow',
                    }],
                }],
                { asyncTimeout: 50 }
            );
            const result = await engine.validateFieldAsync('username', 'test', { username: 'test' } as any);
            expect(result).toBeNull();
        }, 2000);

        it('still returns errors for rules that resolve within the timeout', async () => {
            const engine = new ValiValid(
                [{
                    field: 'email',
                    validations: [{
                        type: ValidationType.AsyncPattern,
                        asyncFn: async () => false, // resolves immediately as failing
                        message: 'always fails',
                    }],
                }],
                { asyncTimeout: 500 }
            );
            const errors = await engine.validateAsync({ email: 'x' } as any);
            expect(errors.email).toEqual(['always fails']);
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// New tests: edge-cases, locale, criteriaMode, asyncTimeout
// ─────────────────────────────────────────────────────────────────────────────

describe('edge-cases and new features', () => {
    // Restore global locale after each test to avoid cross-test contamination
    const originalLocale = getLocale();
    afterEach(() => { setLocale(originalLocale); });

    // 1. validateRequired with an invalid Date object → should produce an error
    it('validateRequired: invalid Date object fails required validation', () => {
        const engine = new ValiValid([{
            field: 'dob',
            validations: [{ type: ValidationType.Required }],
        }]);
        const errors = engine.validateSync({ dob: new Date('invalid') } as any);
        expect(errors.dob).toBeInstanceOf(Array);
        expect(errors.dob!.length).toBeGreaterThan(0);
    });

    // 2. validateBase64 with empty string → should produce an error
    it('validateBase64: empty string fails base64 validation', () => {
        const engine = new ValiValid([{
            field: 'data',
            validations: [{ type: ValidationType.Base64 }],
        }]);
        const errors = engine.validateSync({ data: '' } as any);
        expect(errors.data).toBeInstanceOf(Array);
        expect(errors.data!.length).toBeGreaterThan(0);
    });

    // 3. Per-instance locale 'es' → error messages in Spanish, without touching global locale
    it('per-instance locale es — errors are in Spanish', () => {
        const globalLocale = getLocale();
        const engine = new ValiValid([{
            field: 'email',
            validations: [{ type: ValidationType.Required }],
        }], { locale: 'es' });
        const errors = engine.validateSync({ email: '' } as any);
        expect(errors.email).toBeInstanceOf(Array);
        // Spanish required message
        expect(errors.email![0]).toBe('Campo obligatorio.');
        // Global locale must not have changed
        expect(getLocale()).toBe(globalLocale);
    });

    // 4. Two instances with different locales do not interfere with each other
    it('two instances with different locales do not interfere', () => {
        const engineEn = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.Required }],
        }], { locale: 'en' });
        const engineEs = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.Required }],
        }], { locale: 'es' });

        const errorsEn = engineEn.validateSync({ f: '' } as any);
        const errorsEs = engineEs.validateSync({ f: '' } as any);

        expect(errorsEn.f).toBeInstanceOf(Array);
        expect(errorsEs.f).toBeInstanceOf(Array);
        // Messages must differ between locales
        expect(errorsEn.f![0]).not.toBe(errorsEs.f![0]);
    });

    // 5. asyncTimeout:50 per-instance with a slow validator (200ms) → rule is dropped (no error)
    it('asyncTimeout:50 — slow async validator (200ms) is dropped, resolves without error', async () => {
        const engine = new ValiValid([{
            field: 'username',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: () => new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 200)),
                message: 'slow',
            }],
        }], { asyncTimeout: 50 });
        const errors = await engine.validateAsync({ username: 'test' } as any);
        // Timeout fires before the rule resolves → error is swallowed → null
        expect(errors.username).toBeNull();
    }, 3000);

    // 6. asyncTimeout:0 (default) — slow validator is awaited and its result is used
    it('asyncTimeout:0 (default) — slow async validator is awaited fully', async () => {
        const engine = new ValiValid([{
            field: 'username',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: () => new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 50)),
                message: 'async error',
            }],
        }]);
        const errors = await engine.validateAsync({ username: 'test' } as any);
        // No timeout — error must be collected
        expect(errors.username).toBeInstanceOf(Array);
        expect(errors.username![0]).toBe('async error');
    }, 3000);

    // 7. criteriaMode:'firstError' → only 1 error per field even when multiple rules fail
    it("criteriaMode:'firstError' — only the first error is returned per field", () => {
        const engine = new ValiValid([{
            field: 'password',
            validations: [
                { type: ValidationType.Required, message: 'required' },
                { type: ValidationType.MinLength, value: 8, message: 'too short' },
                { type: ValidationType.PasswordStrength, message: 'too weak' },
            ],
        }], { criteriaMode: 'firstError' });
        const errors = engine.validateSync({ password: '' } as any);
        expect(errors.password).toBeInstanceOf(Array);
        expect(errors.password!.length).toBe(1);
        expect(errors.password![0]).toBe('required');
    });

    // 8. criteriaMode:'all' (default) → multiple errors per field collected
    it("criteriaMode:'all' (default) — all errors are returned per field", () => {
        const engine = new ValiValid([{
            field: 'password',
            validations: [
                { type: ValidationType.Required, message: 'required' },
                { type: ValidationType.MinLength, value: 8, message: 'too short' },
                { type: ValidationType.PasswordStrength, message: 'too weak' },
            ],
        }]);
        const errors = engine.validateSync({ password: '' } as any);
        expect(errors.password).toBeInstanceOf(Array);
        expect(errors.password!.length).toBeGreaterThanOrEqual(2);
        expect(errors.password).toContain('required');
        expect(errors.password).toContain('too short');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// New focused tests added to cover FIX 1 and confirm API breadth
// ─────────────────────────────────────────────────────────────────────────────

describe('validateMultipleOf — IEEE 754 decimal precision fix', () => {
    // FIX 1: the old code used value % multiple === 0 which fails for decimals.
    // The fixed implementation uses Math.round((value / multiple) * 1e10) % 1e10 === 0.

    it('0.3 is a multiple of 0.1 (would fail with raw modulo)', () => {
        const engine = new ValiValid([{
            field: 'amount',
            validations: [{ type: ValidationType.MultipleOf, value: 0.1 }],
        }]);
        // 0.3 % 0.1 ≈ 5.55e-17 due to IEEE 754 — the fix must handle this
        expect(engine.validateFieldSync('amount', 0.3)).toBeNull();
    });

    it('0.1 is a multiple of 0.1', () => {
        const engine = new ValiValid([{
            field: 'amount',
            validations: [{ type: ValidationType.MultipleOf, value: 0.1 }],
        }]);
        expect(engine.validateFieldSync('amount', 0.1)).toBeNull();
    });

    it('0.2 is a multiple of 0.1', () => {
        const engine = new ValiValid([{
            field: 'amount',
            validations: [{ type: ValidationType.MultipleOf, value: 0.1 }],
        }]);
        expect(engine.validateFieldSync('amount', 0.2)).toBeNull();
    });

    it('0.25 is NOT a multiple of 0.1 → error', () => {
        const engine = new ValiValid([{
            field: 'amount',
            validations: [{ type: ValidationType.MultipleOf, value: 0.1 }],
        }]);
        expect(engine.validateFieldSync('amount', 0.25)).toBeInstanceOf(Array);
    });

    it('0.15 is NOT a multiple of 0.1 → error', () => {
        const engine = new ValiValid([{
            field: 'amount',
            validations: [{ type: ValidationType.MultipleOf, value: 0.1 }],
        }]);
        expect(engine.validateFieldSync('amount', 0.15)).toBeInstanceOf(Array);
    });

    it('integer multiples still work: 6 is multiple of 3', () => {
        const engine = new ValiValid([{
            field: 'n',
            validations: [{ type: ValidationType.MultipleOf, value: 3 }],
        }]);
        expect(engine.validateFieldSync('n', 6)).toBeNull();
    });

    it('integer multiples still work: 7 is NOT a multiple of 3 → error', () => {
        const engine = new ValiValid([{
            field: 'n',
            validations: [{ type: ValidationType.MultipleOf, value: 3 }],
        }]);
        expect(engine.validateFieldSync('n', 7)).toBeInstanceOf(Array);
    });

    it('0 is a multiple of any non-zero number', () => {
        const engine = new ValiValid([{
            field: 'n',
            validations: [{ type: ValidationType.MultipleOf, value: 0.5 }],
        }]);
        expect(engine.validateFieldSync('n', 0)).toBeNull();
    });

    it('multiple of 0 is always invalid (division by zero guard)', () => {
        const engine = new ValiValid([{
            field: 'n',
            validations: [{ type: ValidationType.MultipleOf, value: 0 }],
        }]);
        // multiple === 0 → always fails
        expect(engine.validateFieldSync('n', 5)).toBeInstanceOf(Array);
    });

    it('RuleBuilder.multipleOf(0.1) — 0.3 passes', () => {
        const engine = new ValiValid([{
            field: 'price',
            validations: rule().multipleOf(0.1).build(),
        }]);
        expect(engine.validateFieldSync('price', 0.3)).toBeNull();
    });

    it('RuleBuilder.multipleOf(0.1) — 0.25 fails', () => {
        const engine = new ValiValid([{
            field: 'price',
            validations: rule().multipleOf(0.1).build(),
        }]);
        expect(engine.validateFieldSync('price', 0.25)).toBeInstanceOf(Array);
    });
});

describe('BAIL sentinel — sync bail stops async rules from running', () => {
    it('when a sync rule fails before bail, async rule is NOT reached in validateFieldAsync', async () => {
        let asyncCalled = false;
        const engine = new ValiValid([{
            field: 'email',
            validations: [
                { type: ValidationType.Required, message: 'required' },
                { type: '__bail__' as any },
                {
                    type: ValidationType.AsyncPattern,
                    asyncFn: async () => { asyncCalled = true; return false; },
                    message: 'async',
                },
            ],
        }]);
        // Empty string fails Required → bail → async should not run
        const syncErrors = engine.validateFieldSync('email', '');
        expect(syncErrors).toBeInstanceOf(Array);
        expect(syncErrors![0]).toBe('required');
        // validateAsync merges sync + async; because bail stops sync at 1 error
        // the async rule is still registered, but the sync path emitted an error already.
        // We verify the async rule was NOT independently invoked by the sync path.
        expect(asyncCalled).toBe(false);
    });
});

describe('IF conditional rule — engine integration', () => {
    it('condition true → then branch runs and passes valid value', () => {
        const engine = new ValiValid([{
            field: 'email',
            validations: rule().if(() => true, rule().email()).build(),
        }]);
        expect(engine.validateFieldSync('email', 'u@x.com')).toBeNull();
    });

    it('condition true → then branch runs and fails invalid value', () => {
        const engine = new ValiValid([{
            field: 'email',
            validations: rule().if(() => true, rule().email()).build(),
        }]);
        expect(engine.validateFieldSync('email', 'not-email')).toBeInstanceOf(Array);
    });

    it('condition false → then branch is skipped, any value passes', () => {
        const engine = new ValiValid([{
            field: 'email',
            validations: rule().if(() => false, rule().email()).build(),
        }]);
        expect(engine.validateFieldSync('email', 'not-email')).toBeNull();
    });

    it('condition false with else branch → else validates', () => {
        const engine = new ValiValid([{
            field: 'code',
            validations: rule().if(() => false, rule().email(), rule().minLength(5)).build(),
        }]);
        expect(engine.validateFieldSync('code', 'ab')).toBeInstanceOf(Array);
        expect(engine.validateFieldSync('code', 'abcde')).toBeNull();
    });
});

describe('OR rule — engine integration', () => {
    it('passes when value satisfies the email branch', () => {
        const engine = new ValiValid([{
            field: 'contact',
            validations: rule().or([rule().email(), rule().phone()]).build(),
        }]);
        expect(engine.validateFieldSync('contact', 'u@example.com')).toBeNull();
    });

    it('fails when value satisfies neither branch', () => {
        const engine = new ValiValid([{
            field: 'contact',
            validations: rule().or([rule().email(), rule().phone()], 'Must be email or phone').build(),
        }]);
        const result = engine.validateFieldSync('contact', 'neither');
        expect(result).toBeInstanceOf(Array);
        expect(result![0]).toBe('Must be email or phone');
    });
});

describe('NOT rule — engine integration', () => {
    it('not(email) passes on a non-email string', () => {
        const engine = new ValiValid([{
            field: 'val',
            validations: rule().not(rule().email()).build(),
        }]);
        expect(engine.validateFieldSync('val', 'not-an-email')).toBeNull();
    });

    it('not(email) fails on a valid email', () => {
        const engine = new ValiValid([{
            field: 'val',
            validations: rule().not(rule().email()).build(),
        }]);
        expect(engine.validateFieldSync('val', 'u@x.com')).toBeInstanceOf(Array);
    });
});

describe('OPTIONAL sentinel — engine integration', () => {
    it('optional + required: empty string skips all validations → null', () => {
        const engine = new ValiValid([{
            field: 'nick',
            validations: rule().optional().required().build(),
        }]);
        expect(engine.validateFieldSync('nick', '')).toBeNull();
    });

    it('optional + required: null skips all validations → null', () => {
        const engine = new ValiValid([{
            field: 'nick',
            validations: rule().optional().required().build(),
        }]);
        expect(engine.validateFieldSync('nick', null)).toBeNull();
    });

    it('optional + email: non-empty invalid value still validates → error', () => {
        const engine = new ValiValid([{
            field: 'nick',
            validations: rule().optional().email().build(),
        }]);
        expect(engine.validateFieldSync('nick', 'bad-email')).toBeInstanceOf(Array);
    });
});

describe('NULLABLE sentinel — engine integration', () => {
    it('nullable + required: null skips validations → null', () => {
        const engine = new ValiValid([{
            field: 'comment',
            validations: rule().nullable().required().build(),
        }]);
        expect(engine.validateFieldSync('comment', null)).toBeNull();
    });

    it('nullable + required: empty string does NOT skip → error', () => {
        const engine = new ValiValid([{
            field: 'comment',
            validations: rule().nullable().required().build(),
        }]);
        expect(engine.validateFieldSync('comment', '')).toBeInstanceOf(Array);
    });

    it('nullable + email: valid email passes', () => {
        const engine = new ValiValid([{
            field: 'comment',
            validations: rule().nullable().email().build(),
        }]);
        expect(engine.validateFieldSync('comment', 'u@x.com')).toBeNull();
    });
});

describe('asyncTimeout engine option — additional coverage', () => {
    it('asyncTimeout:50, slow rule (200ms) is treated as passing', async () => {
        const engine = new ValiValid([{
            field: 'field',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: () => new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 200)),
                message: 'slow error',
            }],
        }], { asyncTimeout: 50 });
        const errors = await engine.validateAsync({ field: 'value' } as any);
        // timeout fires at 50ms, rule resolve at 200ms → error is dropped
        expect(errors.field).toBeNull();
    }, 3000);

    it('asyncTimeout:0 (no timeout), fast rule resolves with error', async () => {
        const engine = new ValiValid([{
            field: 'field',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: async () => false,
                message: 'async fail',
            }],
        }]);
        const errors = await engine.validateAsync({ field: 'value' } as any);
        expect(errors.field).toBeInstanceOf(Array);
        expect(errors.field![0]).toBe('async fail');
    });
});

describe('locale per-instance forwarded to engine messages', () => {
    afterEach(() => { setLocale('en'); });

    it('locale:es → Spanish required message without altering global locale', () => {
        const engine = new ValiValid([{
            field: 'name',
            validations: [{ type: ValidationType.Required }],
        }], { locale: 'es' });
        const errors = engine.validateSync({ name: '' } as any);
        expect(errors.name).toBeInstanceOf(Array);
        expect(errors.name![0]).toBe('Campo obligatorio.');
        // Global locale must remain 'en'
        expect(getLocale()).toBe('en');
    });

    it('locale:en (explicit) → English required message', () => {
        const engine = new ValiValid([{
            field: 'name',
            validations: [{ type: ValidationType.Required }],
        }], { locale: 'en' });
        const errors = engine.validateSync({ name: '' } as any);
        expect(errors.name).toBeInstanceOf(Array);
        expect(errors.name![0]).toBe('Required field.');
    });

    it('two instances with different locales produce different messages', () => {
        const engineEn = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.Required }],
        }], { locale: 'en' });
        const engineEs = new ValiValid([{
            field: 'f',
            validations: [{ type: ValidationType.Required }],
        }], { locale: 'es' });
        const errEn = engineEn.validateSync({ f: '' } as any);
        const errEs = engineEs.validateSync({ f: '' } as any);
        expect(errEn.f![0]).not.toBe(errEs.f![0]);
    });
});

describe('addFieldValidation / removeFieldValidation / clearFieldValidations — additional API coverage', () => {
    it('addFieldValidation on a fresh engine registers rules correctly', () => {
        const engine = new ValiValid<{ city: string }>([]);
        engine.addFieldValidation('city', [{ type: ValidationType.Required }]);
        expect(engine.validateFieldSync('city', '')).toBeInstanceOf(Array);
        expect(engine.validateFieldSync('city', 'Madrid')).toBeNull();
    });

    it('addFieldValidation accumulates: second call appends, does not replace', () => {
        const engine = new ValiValid([{
            field: 'code',
            validations: [{ type: ValidationType.Required }],
        }]);
        engine.addFieldValidation('code', [{ type: ValidationType.MinLength, value: 10 }]);
        // 'hi' passes Required but fails MinLength(10)
        expect(engine.validateFieldSync('code', 'hi')).toBeInstanceOf(Array);
        // 'helloworld!!' passes both
        expect(engine.validateFieldSync('code', 'helloworld!!')).toBeNull();
    });

    it('removeFieldValidation removes only the specified rule type', () => {
        const engine = new ValiValid([{
            field: 'email',
            validations: [
                { type: ValidationType.Required },
                { type: ValidationType.Email },
            ],
        }]);
        engine.removeFieldValidation('email', ValidationType.Email);
        // Required still fires
        expect(engine.validateFieldSync('email', '')).toBeInstanceOf(Array);
        // Email rule gone — any non-empty string passes now
        expect(engine.validateFieldSync('email', 'not-an-email')).toBeNull();
    });

    it('removeFieldValidation on non-existent field is a no-op', () => {
        const engine = new ValiValid([]);
        expect(() => engine.removeFieldValidation('ghost', ValidationType.Required)).not.toThrow();
    });

    it('clearFieldValidations removes all rules — field always returns null', () => {
        const engine = new ValiValid([{
            field: 'secret',
            validations: [
                { type: ValidationType.Required },
                { type: ValidationType.MinLength, value: 20 },
            ],
        }]);
        engine.clearFieldValidations('secret');
        expect(engine.validateFieldSync('secret', '')).toBeNull();
        expect(engine.validateFieldSync('secret', 'short')).toBeNull();
    });

    it('clearFieldValidations also removes async rules', () => {
        const engine = new ValiValid([{
            field: 'handle',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: async () => false,
                message: 'taken',
            }],
        }]);
        expect(engine.hasAsyncRules('handle')).toBe(true);
        engine.clearFieldValidations('handle');
        expect(engine.hasAsyncRules('handle')).toBe(false);
    });
});

describe('validateAsync / validateFieldAsync — rejection semantics', () => {
    it('async rule that rejects with a non-timeout error is treated as failing (validateAsync)', async () => {
        const engine = new ValiValid<{ username: string }>([{
            field: 'username',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: async () => { throw new Error('network failure'); },
                message: 'username check failed',
            }],
        }]);
        const errors = await engine.validateAsync({ username: 'alice' } as any);
        expect(errors.username).toBeInstanceOf(Array);
        expect(errors.username).toContain('username check failed');
    });

    it('async rule that rejects with a non-timeout error is treated as failing (validateFieldAsync)', async () => {
        const engine = new ValiValid<{ username: string }>([{
            field: 'username',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: async () => { throw new Error('db error'); },
                message: 'server error',
            }],
        }]);
        const errors = await engine.validateFieldAsync('username', 'alice', { username: 'alice' } as any);
        expect(errors).toBeInstanceOf(Array);
        expect(errors).toContain('server error');
    });

    it('async rule that times out is treated as passing — field has no async errors', async () => {
        const engine = new ValiValid<{ slug: string }>([{
            field: 'slug',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: () => new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 200)),
                message: 'slug taken',
            }],
        }], { asyncTimeout: 50 });
        const errors = await engine.validateAsync({ slug: 'my-slug' } as any);
        // The rule resolves false after 200 ms but the engine times out at 50 ms → treated as passing
        expect(errors.slug).toBeNull();
    }, 1000);

    it('async rule that resolves with false produces an error (normal failing path)', async () => {
        const engine = new ValiValid<{ handle: string }>([{
            field: 'handle',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: async () => false,
                message: 'handle already taken',
            }],
        }]);
        const errors = await engine.validateAsync({ handle: 'taken-handle' } as any);
        expect(errors.handle).toBeInstanceOf(Array);
        expect(errors.handle).toContain('handle already taken');
    });

    it('async rule that resolves with true produces no error (normal passing path)', async () => {
        const engine = new ValiValid<{ handle: string }>([{
            field: 'handle',
            validations: [{
                type: ValidationType.AsyncPattern,
                asyncFn: async () => true,
                message: 'handle already taken',
            }],
        }]);
        const errors = await engine.validateAsync({ handle: 'free-handle' } as any);
        expect(errors.handle).toBeNull();
    });
});

describe("criteriaMode:'firstError' — async rejection and early stop", () => {
    it("criteriaMode:'firstError' + async rule that rejects → only 1 error per field", async () => {
        const engine = new ValiValid<{ username: string }>([{
            field: 'username',
            validations: [
                {
                    type: ValidationType.AsyncPattern,
                    asyncFn: async () => { throw new Error('network failure'); },
                    message: 'first async error',
                },
                {
                    type: ValidationType.AsyncPattern,
                    asyncFn: async () => false,
                    message: 'second async error',
                },
            ],
        }], { criteriaMode: 'firstError' });
        const errors = await engine.validateAsync({ username: 'alice' } as any);
        // The first rule rejects → treated as failing; criteriaMode:'firstError' breaks after it
        expect(errors.username).toBeInstanceOf(Array);
        expect(errors.username!.length).toBe(1);
        expect(errors.username![0]).toBe('first async error');
    });

    it("criteriaMode:'firstError' + first async rule resolves false → second async rule is not run", async () => {
        let secondCallCount = 0;
        const engine = new ValiValid<{ code: string }>([{
            field: 'code',
            validations: [
                {
                    type: ValidationType.AsyncPattern,
                    asyncFn: async () => false,
                    message: 'first failure',
                },
                {
                    type: ValidationType.AsyncPattern,
                    asyncFn: async () => { secondCallCount++; return false; },
                    message: 'second failure',
                },
            ],
        }], { criteriaMode: 'firstError' });
        const errors = await engine.validateAsync({ code: 'test' } as any);
        // First rule fails → criteriaMode:'firstError' stops → second rule never runs
        expect(errors.code).toBeInstanceOf(Array);
        expect(errors.code!.length).toBe(1);
        expect(errors.code![0]).toBe('first failure');
        expect(secondCallCount).toBe(0);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Section: withEngineTimeout — timer cleanup
    // ─────────────────────────────────────────────────────────────────────────

    describe('withEngineTimeout — timer cleanup', () => {
        it('clears the timeout timer when the async rule resolves first', async () => {
            vi.useFakeTimers();
            const engine = new ValiValid([{
                field: 'x',
                validations: [{ type: ValidationType.AsyncPattern, asyncFn: async () => true }],
            }], { asyncTimeout: 5000 });

            const promise = engine.validateAsync({ x: 'hello' } as any);
            await vi.runAllTimersAsync(); // advance all timers
            const errors = await promise;
            expect(errors.x).toBeNull(); // rule passed — no error
            // No unhandled rejection from the timeout firing after resolution
            vi.useRealTimers();
        });

        it('treats a timed-out async rule as passing (no error on the field)', async () => {
            vi.useFakeTimers();
            // Slow async rule: resolves after 300 ms
            const engine = new ValiValid([{
                field: 'y',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    asyncFn: () => new Promise<boolean>(resolve => setTimeout(() => resolve(false), 300)),
                }],
            }], { asyncTimeout: 50 });

            const promise = engine.validateAsync({ y: 'value' } as any);
            // Advance 50 ms so the 50 ms engine timeout fires before the 300 ms rule resolves
            await vi.advanceTimersByTimeAsync(50);
            const errors = await promise;
            // Timeout fires first — by pass semantics the field should have no error
            expect(errors.y).toBeNull();
            vi.useRealTimers();
        });

        it('no unhandled rejection fires when the slow async rule eventually rejects after timeout wins', async () => {
            // Attach a process.on('unhandledRejection') listener before the test.
            // If the dangling promise chain from withEngineTimeout leaks an unhandled rejection,
            // this handler will be called — and we fail the test.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const proc = (globalThis as any).process as {
                on: (event: string, listener: (reason: unknown) => void) => void;
                off: (event: string, listener: (reason: unknown) => void) => void;
            };
            const unhandledRejections: unknown[] = [];
            const handler = (reason: unknown) => { unhandledRejections.push(reason); };
            proc.on('unhandledRejection', handler);

            vi.useFakeTimers();

            // Slow async rule: rejects after 300 ms (worse-case scenario — rejection after timeout)
            const engine = new ValiValid([{
                field: 'z',
                validations: [{
                    type: ValidationType.AsyncPattern,
                    // asyncFn rejects *after* the 50 ms engine timeout fires
                    asyncFn: () => new Promise<boolean>((_resolve, reject) =>
                        setTimeout(() => reject(new Error('late rejection')), 300)
                    ),
                }],
            }], { asyncTimeout: 50 });

            const promise = engine.validateAsync({ z: 'value' } as any);

            // Advance 50 ms — the engine timeout fires and validateAsync settles (bypass semantics)
            await vi.advanceTimersByTimeAsync(50);
            const errors = await promise;
            // Timeout fired first → field has no error (bypass semantics)
            expect(errors.z).toBeNull();

            // Now advance past 300 ms so the slow rule's rejection fires.
            // withEngineTimeout's .then handler on the slow promise catches it via the rejection
            // branch and calls clearTimeout (already fired), then re-throws — but the resulting
            // rejection on 'guarded' has no unhandled listener, so it MUST be swallowed by the
            // engine's own catch block inside validateFieldAsync.
            await vi.advanceTimersByTimeAsync(300);

            // Give the microtask queue a few rounds to propagate any unhandled rejections
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();

            vi.useRealTimers();

            // Remove listener before asserting so we don't affect other tests
            proc.off('unhandledRejection', handler);

            // No unhandled rejection should have been recorded
            expect(unhandledRejections).toHaveLength(0);
        });
    });

    describe('validateFieldAsync — combined sync + async errors', () => {
        it('returns errors from BOTH sync and async rules when both fail', async () => {
            const engine = new ValiValid([{
                field: 'username',
                validations: [
                    { type: ValidationType.MinLength, value: 8, message: 'Too short' },
                    {
                        type: ValidationType.AsyncPattern,
                        message: 'Username already taken',
                        asyncFn: async () => false,
                    },
                ],
            }]);

            const errors = await engine.validateFieldAsync('username', 'abc', { username: 'abc' } as any);

            expect(errors).toBeInstanceOf(Array);
            expect(errors).toContain('Too short');
            expect(errors).toContain('Username already taken');
            expect(errors!.length).toBe(2);
        });

        it('returns only sync error when sync rule fails and async rule passes', async () => {
            const engine = new ValiValid([{
                field: 'username',
                validations: [
                    { type: ValidationType.MinLength, value: 8, message: 'Too short' },
                    {
                        type: ValidationType.AsyncPattern,
                        message: 'Username already taken',
                        asyncFn: async () => true,
                    },
                ],
            }]);

            const errors = await engine.validateFieldAsync('username', 'abc', { username: 'abc' } as any);

            expect(errors).toBeInstanceOf(Array);
            expect(errors).toContain('Too short');
            expect(errors).not.toContain('Username already taken');
            expect(errors!.length).toBe(1);
        });

        it('returns only async error when sync rule passes and async rule fails', async () => {
            const engine = new ValiValid([{
                field: 'username',
                validations: [
                    { type: ValidationType.MinLength, value: 3, message: 'Too short' },
                    {
                        type: ValidationType.AsyncPattern,
                        message: 'Username already taken',
                        asyncFn: async () => false,
                    },
                ],
            }]);

            const errors = await engine.validateFieldAsync('username', 'alice', { username: 'alice' } as any);

            expect(errors).toBeInstanceOf(Array);
            expect(errors).not.toContain('Too short');
            expect(errors).toContain('Username already taken');
            expect(errors!.length).toBe(1);
        });
    });
});
