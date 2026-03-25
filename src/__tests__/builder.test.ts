import { describe, it, expect } from 'vitest';
import { rule, RuleBuilder, ValiValid, ValidationType, TypeFile, FileSize, DateFormat } from '../index';

// ---------------------------------------------------------------------------
// Helper: extracts the `type` strings from a built rule array
// ---------------------------------------------------------------------------
function types(r: ReturnType<RuleBuilder['build']>): string[] {
    return r.map((c) => c.type);
}

// ---------------------------------------------------------------------------
// 1. rule().required().email().build() → correct ValidationsConfig array
// ---------------------------------------------------------------------------
describe('RuleBuilder — email field chain', () => {
    it('produces a ValidationsConfig array with Required then Email', () => {
        const result = rule().required().email().build();
        expect(result).toHaveLength(2);
        expect(result[0].type).toBe(ValidationType.Required);
        expect(result[1].type).toBe(ValidationType.Email);
    });

    it('preserves custom messages on each rule', () => {
        const result = rule()
            .required('Email is required')
            .email('Must be a valid email')
            .build();
        expect(result[0]).toHaveProperty('message', 'Email is required');
        expect(result[1]).toHaveProperty('message', 'Must be a valid email');
    });

    it('build() returns a new array each call (immutable snapshot)', () => {
        const builder = rule().required().email();
        const a = builder.build();
        const b = builder.build();
        expect(a).not.toBe(b); // different array references
        expect(a).toEqual(b);  // same content
    });
});

// ---------------------------------------------------------------------------
// 2. rule().minLength(8).passwordStrength().build()
// ---------------------------------------------------------------------------
describe('RuleBuilder — password field chain', () => {
    it('produces MinLength then PasswordStrength', () => {
        const result = rule().minLength(8).passwordStrength().build();
        expect(types(result)).toEqual([ValidationType.MinLength, ValidationType.PasswordStrength]);
    });

    it('MinLength rule carries the correct value', () => {
        const result = rule().minLength(8).passwordStrength().build();
        expect((result[0] as any).value).toBe(8);
    });
});

// ---------------------------------------------------------------------------
// 3. rule().integer().numberRange(0, 120).build()
// ---------------------------------------------------------------------------
describe('RuleBuilder — age / integer field chain', () => {
    it('produces Integer then NumberRange', () => {
        const result = rule().integer().numberRange(0, 120).build();
        expect(types(result)).toEqual([ValidationType.Integer, ValidationType.NumberRange]);
    });

    it('NumberRange carries [min, max] tuple', () => {
        const result = rule().integer().numberRange(0, 120).build();
        expect((result[1] as any).value).toEqual([0, 120]);
    });
});

// ---------------------------------------------------------------------------
// 4. rule().fileType([TypeFile.PDF]).fileSize(FileSize['5MB']).build()
// ---------------------------------------------------------------------------
describe('RuleBuilder — file field chain', () => {
    it('produces FileType then FileSize', () => {
        const result = rule().fileType([TypeFile.PDF]).fileSize(FileSize['5MB']).build();
        expect(types(result)).toEqual([ValidationType.FileType, ValidationType.FileSize]);
    });

    it('FileType rule carries the correct mime types array', () => {
        const result = rule().fileType([TypeFile.PDF, TypeFile.DOCX]).build();
        expect((result[0] as any).value).toEqual([TypeFile.PDF, TypeFile.DOCX]);
    });

    it('FileSize rule carries the numeric byte value', () => {
        const result = rule().fileSize(FileSize['5MB']).build();
        expect(typeof (result[0] as any).value).toBe('number');
        expect((result[0] as any).value).toBe(FileSize['5MB']);
    });
});

// ---------------------------------------------------------------------------
// 5. rule().arrayMinLength(1).arrayMaxLength(10).build()
// ---------------------------------------------------------------------------
describe('RuleBuilder — tags / array field chain', () => {
    it('produces ArrayMinLength then ArrayMaxLength', () => {
        const result = rule().arrayMinLength(1).arrayMaxLength(10).build();
        expect(types(result)).toEqual([ValidationType.ArrayMinLength, ValidationType.ArrayMaxLength]);
    });

    it('ArrayMinLength carries min value', () => {
        const result = rule().arrayMinLength(1).build();
        expect((result[0] as any).value).toBe(1);
    });

    it('ArrayMaxLength carries max value', () => {
        const result = rule().arrayMaxLength(10).build();
        expect((result[0] as any).value).toBe(10);
    });
});

// ---------------------------------------------------------------------------
// 6. Builder with async rule (asyncPattern)
// ---------------------------------------------------------------------------
describe('RuleBuilder — async rule', () => {
    it('asyncPattern appends an AsyncPattern rule', () => {
        const asyncFn = async (value: string) => value !== 'taken';
        const result = rule().required().asyncPattern(asyncFn, 'Username is taken').build();
        expect(types(result)).toEqual([ValidationType.Required, ValidationType.AsyncPattern]);
    });

    it('asyncPattern rule carries the async function reference', () => {
        const asyncFn = async (_value: string) => true;
        const result = rule().asyncPattern(asyncFn).build();
        expect((result[0] as any).asyncFn).toBe(asyncFn);
    });
});

// ---------------------------------------------------------------------------
// 7. Builder with matchField and requiredIf
// ---------------------------------------------------------------------------
describe('RuleBuilder — cross-field validators', () => {
    it('matchField produces a MatchField rule with the target field name', () => {
        const result = rule().required().matchField('password', 'Passwords must match').build();
        expect(types(result)).toContain(ValidationType.MatchField);
        const matchRule = result.find((r) => r.type === ValidationType.MatchField);
        expect((matchRule as any).field).toBe('password');
        expect(matchRule!.message).toBe('Passwords must match');
    });

    it('requiredIf produces a RequiredIf rule carrying the condition function', () => {
        const condition = (form: any) => form.role === 'admin';
        const result = rule().requiredIf(condition).build();
        expect(result[0].type).toBe(ValidationType.RequiredIf);
        expect((result[0] as any).condition).toBe(condition);
    });
});

// ---------------------------------------------------------------------------
// 8. Chaining: order of validators in the output array is preserved
// ---------------------------------------------------------------------------
describe('RuleBuilder — chaining order preservation', () => {
    it('rule order in output matches the order methods were called', () => {
        const result = rule()
            .required()
            .minLength(3)
            .maxLength(50)
            .email()
            .noWhitespace()
            .build();
        expect(types(result)).toEqual([
            ValidationType.Required,
            ValidationType.MinLength,
            ValidationType.MaxLength,
            ValidationType.Email,
            ValidationType.NoWhitespace,
        ]);
    });

    it('and() appends rules from another builder in order', () => {
        const base = rule().required().minLength(5);
        const extra = rule().email().maxLength(100);
        const result = base.and(extra).build();
        expect(types(result)).toEqual([
            ValidationType.Required,
            ValidationType.MinLength,
            ValidationType.Email,
            ValidationType.MaxLength,
        ]);
    });
});

// ---------------------------------------------------------------------------
// 9. Empty builder: rule().build() → empty array
// ---------------------------------------------------------------------------
describe('RuleBuilder — empty builder', () => {
    it('rule().build() returns an empty array', () => {
        expect(rule().build()).toEqual([]);
    });

    it('RuleBuilder.create().build() also returns an empty array', () => {
        expect(RuleBuilder.create().build()).toEqual([]);
    });

    it('empty build result has length 0', () => {
        expect(rule().build()).toHaveLength(0);
    });
});

// ---------------------------------------------------------------------------
// 10. Integration: builder output used directly with ValiValid engine
// ---------------------------------------------------------------------------
describe('RuleBuilder — integration with ValiValid engine', () => {
    it('email validation fails for invalid email', () => {
        const engine = new ValiValid([
            { field: 'email', validations: rule().required().email().build() },
        ]);
        const errors = engine.validateSync({ email: 'not-an-email' } as any);
        expect(Array.isArray(errors.email)).toBe(true);
        expect(errors.email!.length).toBeGreaterThan(0);
    });

    it('email validation passes for valid email', () => {
        const engine = new ValiValid([
            { field: 'email', validations: rule().required().email().build() },
        ]);
        const errors = engine.validateSync({ email: 'user@example.com' } as any);
        expect(errors.email).toBeNull();
    });

    it('required fails when value is empty', () => {
        const engine = new ValiValid([
            { field: 'name', validations: rule().required().build() },
        ]);
        const errors = engine.validateSync({ name: '' } as any);
        expect(errors.name).not.toBeNull();
    });

    it('integer + numberRange rejects out-of-range values', () => {
        const engine = new ValiValid([
            { field: 'age', validations: rule().integer().numberRange(0, 120).build() },
        ]);
        const errors = engine.validateSync({ age: 150 } as any);
        expect(errors.age).not.toBeNull();
    });

    it('integer + numberRange passes for valid values', () => {
        const engine = new ValiValid([
            { field: 'age', validations: rule().integer().numberRange(0, 120).build() },
        ]);
        const errors = engine.validateSync({ age: 25 } as any);
        expect(errors.age).toBeNull();
    });

    it('minLength + passwordStrength fails for weak password', () => {
        const engine = new ValiValid([
            { field: 'password', validations: rule().minLength(8).passwordStrength().build() },
        ]);
        const errors = engine.validateSync({ password: 'abc' } as any);
        expect(errors.password).not.toBeNull();
        expect(errors.password!.length).toBeGreaterThanOrEqual(2);
    });

    it('arrayMinLength enforces minimum array length', () => {
        const engine = new ValiValid([
            { field: 'tags', validations: rule().arrayMinLength(1).arrayMaxLength(10).build() },
        ]);
        const errors = engine.validateSync({ tags: [] } as any);
        expect(errors.tags).not.toBeNull();
    });

    it('arrayMinLength passes for non-empty array within range', () => {
        const engine = new ValiValid([
            { field: 'tags', validations: rule().arrayMinLength(1).arrayMaxLength(10).build() },
        ]);
        const errors = engine.validateSync({ tags: ['ts', 'react'] } as any);
        expect(errors.tags).toBeNull();
    });

    it('or() with email/phone branches passes for valid email', () => {
        const engine = new ValiValid([
            {
                field: 'contact',
                validations: rule().required().or([rule().email(), rule().phone()]).build(),
            },
        ]);
        const errors = engine.validateSync({ contact: 'user@example.com' } as any);
        expect(errors.contact).toBeNull();
    });

    it('dateFormat validation fails for wrong format', () => {
        const engine = new ValiValid([
            {
                field: 'dob',
                validations: rule().dateFormat(DateFormat['YYYY-MM-DD']).build(),
            },
        ]);
        const errors = engine.validateSync({ dob: '31/12/1990' } as any);
        expect(errors.dob).not.toBeNull();
    });

    it('dateFormat validation passes for correct format', () => {
        const engine = new ValiValid([
            {
                field: 'dob',
                validations: rule().dateFormat(DateFormat['YYYY-MM-DD']).build(),
            },
        ]);
        const errors = engine.validateSync({ dob: '1990-12-31' } as any);
        expect(errors.dob).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// 11. or() builder — guard conditions
// ---------------------------------------------------------------------------
describe('RuleBuilder — or() guard conditions', () => {
    it('or() with empty branches array throws', () => {
        expect(() => rule().or([])).toThrow('[ValiValid] or(): branches array must not be empty.');
    });

    it('or() with an empty branch (no rules) throws', () => {
        expect(() => rule().or([rule()])).toThrow();
    });
});

// ---------------------------------------------------------------------------
// 12. withMessage() override
// ---------------------------------------------------------------------------
describe('RuleBuilder — withMessage()', () => {
    it('withMessage() overrides the most recently added rule message', () => {
        const result = rule().required().withMessage('This field is mandatory').build();
        expect(result[0]).toHaveProperty('message', 'This field is mandatory');
    });

    it('withMessage() only affects the last rule', () => {
        const result = rule().required().email().withMessage('Bad email').build();
        expect(result[0]).not.toHaveProperty('message', 'Bad email');
        expect(result[1]).toHaveProperty('message', 'Bad email');
    });

    it('withMessage() throws when no rule has been added yet', () => {
        expect(() => rule().withMessage('msg')).toThrow('[ValiValid] withMessage(): no rule added yet.');
    });
});
