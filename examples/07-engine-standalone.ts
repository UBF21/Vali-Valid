/**
 * Example 07 — ValiValid engine standalone (no React)
 *
 * Demonstrates:
 * - Using ValiValid class directly (Node.js / server-side)
 * - validateSync for fast inline checks
 * - validateAsync for full pipeline
 * - Dynamic rule management without hooks
 * - Unit-test style assertions
 */

import { ValiValid, ValidationType, DateFormat } from 'vali-valid';

// ─── 1. Simple sync validation ────────────────────────────────────────────────

type UserDto = {
  username: string;
  email: string;
  age: number;
  website: string;
};

const userValidator = new ValiValid<UserDto>([
  {
    field: 'username',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 3 },
      { type: ValidationType.MaxLength, value: 20 },
      { type: ValidationType.Slug },
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
    field: 'age',
    isNumber: true,
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.NumberRange, value: [18, 120] },
      { type: ValidationType.Integer },
    ],
  },
  {
    field: 'website',
    validations: [
      { type: ValidationType.Url },
    ],
  },
]);

const validUser = userValidator.validateSync({
  username: 'john-doe',
  email: 'john@example.com',
  age: 30,
  website: 'https://johndoe.dev',
});
console.log('Valid user errors:', validUser);
// → {} (no errors)

const invalidUser = userValidator.validateSync({
  username: 'J',          // too short
  email: 'not-an-email',
  age: 15,                // below range
  website: 'no-protocol',
});
console.log('Invalid user errors:', invalidUser);
// → { username: '...', email: '...', age: '...', website: '...' }


// ─── 2. Single field validation ───────────────────────────────────────────────

console.log('\n─ Single field checks ─');
console.log(userValidator.validateFieldSync('email', 'bad'));        // error message
console.log(userValidator.validateFieldSync('email', 'ok@ok.com')); // null
console.log(userValidator.validateFieldSync('age', 17));             // error message
console.log(userValidator.validateFieldSync('age', 25));             // null


// ─── 3. Async validation (server-side check) ──────────────────────────────────

type ProductDto = {
  sku: string;
  price: number;
};

// Simulate a DB check
async function skuExists(sku: string): Promise<boolean> {
  const existingSKUs = ['PROD-001', 'PROD-002', 'PROD-003'];
  return !existingSKUs.includes(sku.toUpperCase());
}

const productValidator = new ValiValid<ProductDto>([
  {
    field: 'sku',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Pattern, value: (v) => /^[A-Z0-9-]{4,10}$/.test(v), message: 'SKU must be 4-10 uppercase letters/numbers/dashes.' },
      {
        type: ValidationType.AsyncPattern,
        message: 'SKU already exists in the database.',
        asyncFn: (value) => skuExists(value),
      },
    ],
  },
  {
    field: 'price',
    isDecimal: true,
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.NumberPositive },
    ],
  },
]);

(async () => {
  console.log('\n─ Async product validation ─');

  const newProduct = await productValidator.validateAsync({ sku: 'NEW-PROD', price: 29.99 });
  console.log('New product errors:', newProduct); // → {} (SKU is available)

  const existingProduct = await productValidator.validateAsync({ sku: 'PROD-001', price: 0 });
  console.log('Existing product errors:', existingProduct);
  // → { sku: 'SKU already exists...', price: 'Only positive numbers...' }
})();


// ─── 4. Dynamic rule management ──────────────────────────────────────────────

type InvoiceForm = {
  clientName: string;
  vatNumber: string;
  amount: number;
};

const invoiceValidator = new ValiValid<InvoiceForm>([
  {
    field: 'clientName',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 2 },
    ],
  },
  {
    field: 'amount',
    isDecimal: true,
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.NumberPositive },
      { type: ValidationType.MultipleOf, value: 0.01 }, // valid money format
    ],
  },
]);

// Add VAT number requirement based on customer type
function setBusinessCustomer(isBusinessCustomer: boolean) {
  if (isBusinessCustomer) {
    invoiceValidator.addFieldValidation('vatNumber', [
      { type: ValidationType.Required, message: 'VAT number is required for business customers.' },
      { type: ValidationType.ExactLength, value: 9 },
      { type: ValidationType.AlphaNumeric },
    ]);
  } else {
    invoiceValidator.clearFieldValidations('vatNumber');
  }
}

console.log('\n─ Dynamic rules: individual field ─');

setBusinessCustomer(false);
const personalErrors = invoiceValidator.validateFieldSync('vatNumber', '');
console.log('Personal customer, empty VAT:', personalErrors); // null (no rules)

setBusinessCustomer(true);
const businessErrors = invoiceValidator.validateFieldSync('vatNumber', '');
console.log('Business customer, empty VAT:', businessErrors); // 'VAT number is required...'

const businessValid = invoiceValidator.validateFieldSync('vatNumber', 'AB1234567');
console.log('Business customer, valid VAT:', businessValid); // null


// ─── 5. Date validation ───────────────────────────────────────────────────────

type EventDto = {
  title: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
};

const eventValidator = new ValiValid<EventDto>([
  {
    field: 'title',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.MinLength, value: 5 },
    ],
  },
  {
    field: 'startDate',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.DateFormat, format: DateFormat['YYYY-MM-DD'] },
      { type: ValidationType.FutureDate },
    ],
  },
  {
    field: 'endDate',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.DateFormat, format: DateFormat['YYYY-MM-DD'] },
      { type: ValidationType.MinDate, value: '2025-01-01' },
    ],
  },
  {
    field: 'registrationDeadline',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.DateFormat, format: DateFormat['YYYY-MM-DD'] },
      { type: ValidationType.PastDate, message: 'Registration deadline must already be in the past (event already started).' },
    ],
  },
]);

console.log('\n─ Date validation ─');
console.log(eventValidator.validateFieldSync('startDate', '1990-01-01')); // 'The date must be in the future.'
console.log(eventValidator.validateFieldSync('startDate', '2027-06-15')); // null
console.log(eventValidator.validateFieldSync('endDate', 'not-a-date'));   // format error
