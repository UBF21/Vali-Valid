import { ValidationsConfig, DateFormat, FileSize, TypeFile } from '../types/index';
import { ValidationType } from '../validation/Validators';
import {
    validateRequired, validateMinLength, validateMaxLength, validateExactLength,
    validateEmail, validateUrl, validateAlpha, validateAlphaNumeric,
    validateLowerCase, validateUpperCase, validateNoWhitespace,
    validateContains, validateStartsWith, validateEndsWith,
    validateSlug, validatePasswordStrength, validateHexColor,
    validateIPv4, validateUUID, validateJson, validatePhone,
    validateCreditCard, validateDigitsOnly, validateNumberRange,
    validateNumberPositive, validateNumberNegative, validateInteger,
    validateMultipleOf, validateGreaterThan,
    validateLessThan, validatePrecision, validateOneOf,
    validateNotOneOf, validateIPv6, validateMACAddress,
    validateDataURI, validateMimeType, validateNoHTML,
    validateIBAN, validatePostalCode, validateLatitude,
    validateLongitude, validateSemVer, validateBase64,
    validateArrayMinLength, validateArrayMaxLength, validateArrayUnique,
    validateArrayContains, validateTime,
    validateDateFormat, validateMinDate, validateMaxDate,
    validateFutureDate, validatePastDate, validateDateAfter, validateDateBefore,
    validateAlphaDash, validateNotEmpty, validateJWT, validateFinite, validatePort,
    validateGreaterThanOrEqual, validateLessThanOrEqual, validateArrayExactLength,
    SYNTHETIC_OR,
    SYNTHETIC_NOT,
    SYNTHETIC_IF,
    SYNTHETIC_OPTIONAL,
    SYNTHETIC_NULLABLE,
    SYNTHETIC_BAIL,
} from '../constants/index';

/**
 * Internal function to evaluate a single sync ValidationsConfig rule against a value.
 * Used by OR logic to check if a branch passes.
 */
function evaluateSyncRule(config: ValidationsConfig, value: any): boolean {

    switch (config.type) {
        case ValidationType.Required: return validateRequired(value);
        case ValidationType.MinLength: return validateMinLength(value, config.value);
        case ValidationType.MaxLength: return validateMaxLength(value, config.value);
        case ValidationType.ExactLength: return validateExactLength(value, config.value);
        case ValidationType.Email: return validateEmail(value);
        case ValidationType.Url: return validateUrl(value);
        case ValidationType.Alpha: return validateAlpha(value);
        case ValidationType.AlphaNumeric: return validateAlphaNumeric(value);
        case ValidationType.LowerCase: return validateLowerCase(value);
        case ValidationType.UpperCase: return validateUpperCase(value);
        case ValidationType.NoWhitespace: return validateNoWhitespace(value);
        case ValidationType.Contains: return validateContains(value, config.value);
        case ValidationType.StartsWith: return validateStartsWith(value, config.value);
        case ValidationType.EndsWith: return validateEndsWith(value, config.value);
        case ValidationType.Slug: return validateSlug(value);
        case ValidationType.PasswordStrength: return validatePasswordStrength(value);
        case ValidationType.HexColor: return validateHexColor(value);
        case ValidationType.IPv4: return validateIPv4(value);
        case ValidationType.Json: return validateJson(value);
        case ValidationType.Phone: return validatePhone(value);
        case ValidationType.CreditCard: return validateCreditCard(value);
        case ValidationType.Pattern: return typeof config.value === 'function' ? config.value(value) : config.value.test(value);
        case SYNTHETIC_OR: return typeof config.value === 'function' ? config.value(value) : false;
        case ValidationType.DigitsOnly: return validateDigitsOnly(value);
        case ValidationType.NumberRange: return validateNumberRange(value, config.value[0], config.value[1]);
        case ValidationType.NumberPositive: return validateNumberPositive(value);
        case ValidationType.NumberNegative: return validateNumberNegative(value);
        case ValidationType.Integer: return validateInteger(value);
        case ValidationType.MultipleOf: return validateMultipleOf(value, config.value);
        case ValidationType.GreaterThan: return validateGreaterThan(value, config.value);
        case ValidationType.LessThan: return validateLessThan(value, config.value);
        case ValidationType.Precision: return validatePrecision(value, config.value);
        case ValidationType.OneOf: return validateOneOf(value, config.value);
        case ValidationType.NotOneOf: return validateNotOneOf(value, config.value);
        case ValidationType.ArrayMinLength: return validateArrayMinLength(value, config.value);
        case ValidationType.ArrayMaxLength: return validateArrayMaxLength(value, config.value);
        case ValidationType.ArrayUnique: return validateArrayUnique(value);
        case ValidationType.ArrayContains: return validateArrayContains(value, config.value);
        case ValidationType.Time: return validateTime(value, config.format);
        case ValidationType.NoHTML: return validateNoHTML(value);
        case ValidationType.IBAN: return validateIBAN(value);
        case ValidationType.PostalCode: return validatePostalCode(value, config.country);
        case ValidationType.Latitude: return validateLatitude(value);
        case ValidationType.Longitude: return validateLongitude(value);
        case ValidationType.SemVer: return validateSemVer(value);
        case ValidationType.Base64: return validateBase64(value);
        case ValidationType.IPv6: return validateIPv6(value);
        case ValidationType.MACAddress: return validateMACAddress(value);
        case ValidationType.DataURI: return validateDataURI(value);
        case ValidationType.MimeType: return validateMimeType(value, config.value);
        case ValidationType.DateFormat: return validateDateFormat(value, config.format);
        case ValidationType.MinDate: return validateMinDate(value, config.value);
        case ValidationType.MaxDate: return validateMaxDate(value, config.value);
        case ValidationType.FutureDate: return validateFutureDate(value);
        case ValidationType.PastDate: return validatePastDate(value);
        case ValidationType.DateAfter: return validateDateAfter(value, config.value);
        case ValidationType.DateBefore: return validateDateBefore(value, config.value);
        // v4 — new sync validators
        case ValidationType.AlphaDash: return validateAlphaDash(value);
        case ValidationType.NotEmpty: return validateNotEmpty(value);
        case ValidationType.JWT: return validateJWT(value);
        case ValidationType.Finite: return validateFinite(value);
        case ValidationType.Port: return validatePort(value);
        case ValidationType.GreaterThanOrEqual: return validateGreaterThanOrEqual(value, config.value);
        case ValidationType.LessThanOrEqual: return validateLessThanOrEqual(value, config.value);
        case ValidationType.ArrayExactLength: return validateArrayExactLength(value, config.value);
        case ValidationType.UUID: return validateUUID(value, config.version);
        // DateAfterField / DateBeforeField — pass-through (handled by engine)
        case ValidationType.DateAfterField: return true;
        case ValidationType.DateBeforeField: return true;
        // Synthetic sentinels — pass-through in evaluateSyncRule context
        case SYNTHETIC_NOT: return typeof config.value === 'function' ? config.value(value) : false;
        case SYNTHETIC_IF: return typeof config.thenBranch === 'function' ? config.thenBranch(value) : true;
        case SYNTHETIC_OPTIONAL: return true;
        case SYNTHETIC_NULLABLE: return true;
        case SYNTHETIC_BAIL: return true;
        // Unknown types — fail closed so future additions don't silently pass in or() branches
        default: return false;
    }
}

export class RuleBuilder {
    private _rules: ValidationsConfig[] = [];

    /** Static factory — use rule() instead */
    static create(): RuleBuilder {
        return new RuleBuilder();
    }

    /**
     * Builds and returns the final ValidationsConfig[] array.
     * This is the output that goes into FieldValidationConfig.validations.
     */
    build(): ValidationsConfig[] {
        return [...this._rules];
    }

    /**
     * Merges all rules from another RuleBuilder (explicit AND).
     * Equivalent to chaining — use for composing builders.
     */
    and(other: RuleBuilder): RuleBuilder {
        this._rules.push(...other.build());
        return this;
    }

    /**
     * OR logic: value is valid if it passes ALL rules in at least one branch.
     * Each branch is a RuleBuilder. Uses AsyncPattern to support cross-branch evaluation.
     *
     * Example:
     *   rule().required().or([rule().email(), rule().phone()])
     */
    or(branches: RuleBuilder[], message?: string): RuleBuilder {
        if (branches.length === 0) {
            throw new Error('[ValiValid] or(): branches array must not be empty.');
        }
        const branchBuilds = branches.map(b => b.build());
        // Throw if any branch has no rules — an empty branch can never pass (branchRules.length > 0
        // guard in the predicate prevents vacuous truth), so it is always a programmer error.
        for (let i = 0; i < branchBuilds.length; i++) {
            if (branchBuilds[i].length === 0) {
                throw new Error(`[ValiValid] or(): branch at index ${i} has no rules. ` +
                    `An empty branch can never pass. Add at least one rule to each branch.`);
            }
        }
        // Throw early if any branch contains a type that cannot be evaluated synchronously
        // without a form context (cross-field validators, async validators, file validators).
        const unsupported = new Set<string>([
            ValidationType.MatchField, ValidationType.NotMatchField,
            ValidationType.RequiredIf, ValidationType.RequiredUnless,
            ValidationType.DateRange, ValidationType.AsyncPattern,
            ValidationType.FileDimensions, ValidationType.ImageAspectRatio,
            ValidationType.ImageMinDimensions, ValidationType.ImageMaxDimensions,
            ValidationType.FileType, ValidationType.FileSize,
            ValidationType.ArrayItems,
            ValidationType.DateAfterField, ValidationType.DateBeforeField,
        ] as string[]);
        for (const branch of branchBuilds) {
            for (const r of branch) {
                if (unsupported.has(r.type)) {
                    throw new Error(
                        `[ValiValid] or(): branch contains "${r.type}" which cannot be ` +
                        `evaluated synchronously without form context. Remove it from or() branches.`
                    );
                }
            }
        }
        this._rules.push({
            type: SYNTHETIC_OR,
            message,
            value: (val: any): boolean => {
                return branchBuilds.some(branchRules =>
                    branchRules.length > 0 && branchRules.every(config => evaluateSyncRule(config, val))
                );
            },
        });
        return this;
    }

    // ─── String validators ────────────────────────────────────────────────

    required(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Required, message });
        return this;
    }

    minLength(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MinLength, value, message });
        return this;
    }

    maxLength(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MaxLength, value, message });
        return this;
    }

    exactLength(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ExactLength, value, message });
        return this;
    }

    email(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Email, message });
        return this;
    }

    url(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Url, message });
        return this;
    }

    alpha(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Alpha, message });
        return this;
    }

    alphaNumeric(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.AlphaNumeric, message });
        return this;
    }

    lowerCase(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.LowerCase, message });
        return this;
    }

    upperCase(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.UpperCase, message });
        return this;
    }

    noWhitespace(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NoWhitespace, message });
        return this;
    }

    contains(value: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Contains, value, message });
        return this;
    }

    startsWith(value: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.StartsWith, value, message });
        return this;
    }

    endsWith(value: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.EndsWith, value, message });
        return this;
    }

    slug(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Slug, message });
        return this;
    }

    passwordStrength(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.PasswordStrength, message });
        return this;
    }

    hexColor(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.HexColor, message });
        return this;
    }

    ipv4(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.IPv4, message });
        return this;
    }

    ipv6(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.IPv6, message });
        return this;
    }

    macAddress(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MACAddress, message });
        return this;
    }

    uuid(version?: 1 | 3 | 4 | 5, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.UUID, version, message });
        return this;
    }

    json(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Json, message });
        return this;
    }

    phone(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Phone, message });
        return this;
    }

    creditCard(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.CreditCard, message });
        return this;
    }

    noHTML(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NoHTML, message });
        return this;
    }

    iban(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.IBAN, message });
        return this;
    }

    postalCode(country: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.PostalCode, country, message });
        return this;
    }

    latitude(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Latitude, message });
        return this;
    }

    longitude(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Longitude, message });
        return this;
    }

    semVer(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.SemVer, message });
        return this;
    }

    base64(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Base64, message });
        return this;
    }

    dataURI(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DataURI, message });
        return this;
    }

    pattern(value: RegExp | ((val: any) => boolean), message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Pattern, value, message });
        return this;
    }

    alphaDash(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.AlphaDash, message });
        return this;
    }

    notEmpty(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NotEmpty, message });
        return this;
    }

    jwt(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.JWT, message });
        return this;
    }

    // ─── Numeric validators ───────────────────────────────────────────────

    digitsOnly(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DigitsOnly, message });
        return this;
    }

    numberRange(min: number, max: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NumberRange, value: [min, max], message });
        return this;
    }

    numberPositive(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NumberPositive, message });
        return this;
    }

    numberNegative(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NumberNegative, message });
        return this;
    }

    integer(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Integer, message });
        return this;
    }

    multipleOf(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MultipleOf, value, message });
        return this;
    }

    greaterThan(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.GreaterThan, value, message });
        return this;
    }

    lessThan(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.LessThan, value, message });
        return this;
    }

    precision(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Precision, value, message });
        return this;
    }

    oneOf(value: any[], message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.OneOf, value, message });
        return this;
    }

    notOneOf(value: any[], message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NotOneOf, value, message });
        return this;
    }

    finite(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Finite, message });
        return this;
    }

    port(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Port, message });
        return this;
    }

    greaterThanOrEqual(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.GreaterThanOrEqual, value, message });
        return this;
    }

    lessThanOrEqual(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.LessThanOrEqual, value, message });
        return this;
    }

    // ─── Date validators ──────────────────────────────────────────────────

    dateFormat(format: DateFormat, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DateFormat, format, message });
        return this;
    }

    minDate(value: string | Date, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MinDate, value, message });
        return this;
    }

    maxDate(value: string | Date, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MaxDate, value, message });
        return this;
    }

    futureDate(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.FutureDate, message });
        return this;
    }

    pastDate(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.PastDate, message });
        return this;
    }

    dateAfter(value: string | Date, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DateAfter, value, message });
        return this;
    }

    dateBefore(value: string | Date, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DateBefore, value, message });
        return this;
    }

    dateRange(startField: string, endField: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DateRange, startField, endField, message });
        return this;
    }

    dateAfterField(field: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DateAfterField, field, message });
        return this;
    }

    dateBeforeField(field: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.DateBeforeField, field, message });
        return this;
    }

    time(format?: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.Time, format: format as '24h' | '12h' | undefined, message });
        return this;
    }

    // ─── File validators ──────────────────────────────────────────────────

    fileType(value: TypeFile[], message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.FileType, value, message });
        return this;
    }

    fileSize(value: FileSize, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.FileSize, value, message });
        return this;
    }

    mimeType(value: string[], message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MimeType, value, message });
        return this;
    }

    fileDimensions(width: number, height: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.FileDimensions, value: { width, height }, message });
        return this;
    }

    imageAspectRatio(ratio: { width: number; height: number }, tolerance?: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ImageAspectRatio, value: ratio, tolerance, message });
        return this;
    }

    imageMinDimensions(width?: number, height?: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ImageMinDimensions, value: { width, height }, message });
        return this;
    }

    imageMaxDimensions(width?: number, height?: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ImageMaxDimensions, value: { width, height }, message });
        return this;
    }

    // ─── Array validators ─────────────────────────────────────────────────

    arrayMinLength(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ArrayMinLength, value, message });
        return this;
    }

    arrayMaxLength(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ArrayMaxLength, value, message });
        return this;
    }

    arrayUnique(message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ArrayUnique, message });
        return this;
    }

    arrayContains(value: any, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ArrayContains, value, message });
        return this;
    }

    arrayExactLength(value: number, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.ArrayExactLength, value, message });
        return this;
    }

    arrayItems(validations: ValidationsConfig[] | RuleBuilder, message?: string): RuleBuilder {
        const resolvedValidations = validations instanceof RuleBuilder ? validations.build() : validations;
        const unsupportedTypes = [
            ValidationType.MatchField,
            ValidationType.NotMatchField,
            ValidationType.RequiredIf,
            ValidationType.RequiredUnless,
            ValidationType.DateRange,
            ValidationType.AsyncPattern,
            ValidationType.FileDimensions,
            ValidationType.ImageAspectRatio,
            ValidationType.ImageMinDimensions,
            ValidationType.ImageMaxDimensions,
        ] as string[];
        for (const config of resolvedValidations) {
            if (unsupportedTypes.includes(config.type)) {
                throw new Error(
                    `RuleBuilder.arrayItems(): validator type "${config.type}" is not supported inside arrayItems — ` +
                    `cross-field and async validators cannot operate on individual array items.`
                );
            }
        }
        this._rules.push({ type: ValidationType.ArrayItems, validations: resolvedValidations, message });
        return this;
    }

    // ─── Cross-field validators ───────────────────────────────────────────

    matchField(field: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.MatchField, field, message });
        return this;
    }

    notMatchField(field: string, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.NotMatchField, field, message });
        return this;
    }

    requiredIf(condition: (form: any) => boolean, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.RequiredIf, condition, message });
        return this;
    }

    requiredUnless(condition: (form: any) => boolean, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.RequiredUnless, condition, message });
        return this;
    }

    // ─── Async validators ─────────────────────────────────────────────────

    asyncPattern(asyncFn: (value: any, form: any) => Promise<boolean>, message?: string): RuleBuilder {
        this._rules.push({ type: ValidationType.AsyncPattern, asyncFn, message });
        return this;
    }

    // ─── Meta / modifier helpers ──────────────────────────────────────────

    withMessage(msg: string): RuleBuilder {
        if (this._rules.length === 0) throw new Error('[ValiValid] withMessage(): no rule added yet.');
        (this._rules[this._rules.length - 1] as ValidationsConfig & { message?: string }).message = msg;
        return this;
    }

    not(branch: RuleBuilder, message?: string): RuleBuilder {
        const branchRules = branch.build();
        const forbidden = new Set([
            ValidationType.AsyncPattern,
            ValidationType.DateAfterField,
            ValidationType.DateBeforeField,
            ValidationType.RequiredIf,
            ValidationType.RequiredUnless,
        ]);
        for (const r of branchRules) {
            if (forbidden.has(r.type as ValidationType)) {
                throw new Error(`[ValiValid] .not(): "${r.type}" is not supported inside .not()`);
            }
        }
        const predicate = (val: any) => !branchRules.every((c: ValidationsConfig) => evaluateSyncRule(c, val));
        this._rules.push({ type: SYNTHETIC_NOT, message, value: predicate });
        return this;
    }

    if(condition: (form: any) => boolean, thenBuilder: RuleBuilder, elseBuilder?: RuleBuilder, message?: string): RuleBuilder {
        const thenRules = thenBuilder.build();
        const elseRules = elseBuilder?.build();
        const forbidden = new Set([
            ValidationType.AsyncPattern,
            ValidationType.DateAfterField,
            ValidationType.DateBeforeField,
            ValidationType.RequiredIf,
            ValidationType.RequiredUnless,
        ]);
        for (const r of [...thenRules, ...(elseRules ?? [])]) {
            if (forbidden.has(r.type as ValidationType)) {
                throw new Error(`[ValiValid] .if(): "${r.type}" is not supported inside .if()`);
            }
        }
        const thenBranch = (val: any) => thenRules.every((c: ValidationsConfig) => evaluateSyncRule(c, val));
        const elseBranch = elseRules ? (val: any) => elseRules.every((c: ValidationsConfig) => evaluateSyncRule(c, val)) : undefined;
        this._rules.push({ type: SYNTHETIC_IF, message, condition, thenBranch, elseBranch });
        return this;
    }

    optional(): RuleBuilder {
        this._rules.push({ type: SYNTHETIC_OPTIONAL });
        return this;
    }

    nullable(): RuleBuilder {
        this._rules.push({ type: SYNTHETIC_NULLABLE });
        return this;
    }

    bail(): RuleBuilder {
        this._rules.push({ type: SYNTHETIC_BAIL });
        return this;
    }
}

/**
 * Factory function to create a new RuleBuilder.
 *
 * @example
 * rule().required().email().maxLength(100).build()
 * rule().required().or([rule().email(), rule().phone()]).build()
 */
export function rule(): RuleBuilder {
    return RuleBuilder.create();
}
