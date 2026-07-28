import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateForm
} from './settings.js';

describe('Settings Form Validation', () => {
  describe('Name Validation', () => {
    it('should reject empty or whitespace name', () => {
      const emptyResult = validateName('');
      assert.strictEqual(emptyResult.isValid, false);
      assert.strictEqual(emptyResult.error, 'Name is required.');

      const whitespaceResult = validateName('   ');
      assert.strictEqual(whitespaceResult.isValid, false);
      assert.strictEqual(whitespaceResult.error, 'Name is required.');
    });

    it('should accept valid non-empty name', () => {
      const validResult = validateName('Alex Mercer');
      assert.strictEqual(validResult.isValid, true);
      assert.strictEqual(validResult.error, '');
    });
  });

  describe('Email Validation', () => {
    it('should reject empty email', () => {
      const result = validateEmail('');
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.error, 'Email is required.');
    });

    it('should reject invalid email formats', () => {
      const invalidFormats = [
        'plainaddress',
        '@missinguser.com',
        'user@.com',
        'user@domain',
        'user@domain..com'
      ];

      invalidFormats.forEach((email) => {
        const result = validateEmail(email);
        assert.strictEqual(result.isValid, false, `Expected '${email}' to be invalid`);
        assert.strictEqual(result.error, 'Please enter a valid email address.');
      });
    });

    it('should accept valid email format', () => {
      const validEmails = [
        'user@example.com',
        'john.doe@sub.domain.co.uk',
        'alice+test@company.io'
      ];

      validEmails.forEach((email) => {
        const result = validateEmail(email);
        assert.strictEqual(result.isValid, true, `Expected '${email}' to be valid`);
        assert.strictEqual(result.error, '');
      });
    });
  });

  describe('Password Validation', () => {
    it('should reject empty password', () => {
      const result = validatePassword('');
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.error, 'Password is required.');
    });

    it('should reject passwords shorter than 8 characters', () => {
      const shortPasswords = ['1', '1234567', 'short'];
      shortPasswords.forEach((pw) => {
        const result = validatePassword(pw);
        assert.strictEqual(result.isValid, false, `Expected password '${pw}' to be rejected`);
        assert.strictEqual(result.error, 'Password must be at least 8 characters long.');
      });
    });

    it('should accept passwords with 8 or more characters', () => {
      const validPasswords = ['12345678', 'securePassword123!', 'SuperStrongPass'];
      validPasswords.forEach((pw) => {
        const result = validatePassword(pw);
        assert.strictEqual(result.isValid, true, `Expected password '${pw}' to be valid`);
        assert.strictEqual(result.error, '');
      });
    });
  });

  describe('Full Form Validation (validateForm)', () => {
    it('should return invalid status and errors when inputs are invalid', () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123'
      };

      const result = validateForm(invalidData);
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.errors.name, 'Name is required.');
      assert.strictEqual(result.errors.email, 'Please enter a valid email address.');
      assert.strictEqual(result.errors.password, 'Password must be at least 8 characters long.');
    });

    it('should return valid status and empty error messages when inputs are valid', () => {
      const validData = {
        name: 'Sarah Connor',
        email: 'sarah@skynet.org',
        password: 'password123'
      };

      const result = validateForm(validData);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.errors.name, '');
      assert.strictEqual(result.errors.email, '');
      assert.strictEqual(result.errors.password, '');
    });
  });
});
