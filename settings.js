/**
 * Pure Validation Functions
 */

/**
 * Validates the name field.
 * @param {string} name 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateName(name) {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Name is required.' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates the email field.
 * @param {string} email 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required.' };
  }
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (trimmed.includes('..') || !emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates the password field.
 * @param {string} password 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long.' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates all settings form inputs.
 * @param {{ name: string, email: string, password: string }} fields 
 * @returns {{ isValid: boolean, errors: { name: string, email: string, password: string } }}
 */
export function validateForm(fields) {
  const nameResult = validateName(fields.name);
  const emailResult = validateEmail(fields.email);
  const passwordResult = validatePassword(fields.password);

  const isValid = nameResult.isValid && emailResult.isValid && passwordResult.isValid;

  return {
    isValid,
    errors: {
      name: nameResult.error,
      email: emailResult.error,
      password: passwordResult.error
    }
  };
}

/**
 * DOM Binding & UI Logic (Browser Environment)
 */
export function initForm() {
  if (typeof document === 'undefined') return;

  const form = document.getElementById('settingsForm');
  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      group: document.getElementById('nameGroup'),
      validator: validateName
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      group: document.getElementById('emailGroup'),
      validator: validateEmail
    },
    password: {
      input: document.getElementById('password'),
      error: document.getElementById('passwordError'),
      group: document.getElementById('passwordGroup'),
      validator: validatePassword
    }
  };

  const formStatus = document.getElementById('formStatus');
  const togglePasswordBtn = document.getElementById('togglePassword');

  // Utility to set field validation state in UI
  const setFieldError = (fieldKey, errorMessage) => {
    const field = fields[fieldKey];
    if (!field || !field.group) return;

    if (errorMessage) {
      field.group.classList.add('has-error');
      if (field.error) field.error.textContent = errorMessage;
      if (field.input) field.input.setAttribute('aria-invalid', 'true');
    } else {
      field.group.classList.remove('has-error');
      if (field.error) field.error.textContent = '';
      if (field.input) field.input.setAttribute('aria-invalid', 'false');
    }
  };

  // Field level live validation handlers
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field.input) return;

    // Validate on blur
    field.input.addEventListener('blur', () => {
      const result = field.validator(field.input.value);
      setFieldError(key, result.error);
    });

    // Clear error on input if currently showing error
    field.input.addEventListener('input', () => {
      if (field.group.classList.contains('has-error')) {
        const result = field.validator(field.input.value);
        setFieldError(key, result.error);
      }
      if (formStatus) {
        formStatus.classList.remove('success');
        formStatus.style.display = 'none';
      }
    });
  });

  // Password visibility toggle
  if (togglePasswordBtn && fields.password.input) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = fields.password.input.type === 'password';
      fields.password.input.type = isPassword ? 'text' : 'password';
      togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
      name: fields.name.input ? fields.name.input.value : '',
      email: fields.email.input ? fields.email.input.value : '',
      password: fields.password.input ? fields.password.input.value : ''
    };

    const validationResult = validateForm(formData);

    // Apply inline errors to DOM
    Object.keys(validationResult.errors).forEach((key) => {
      setFieldError(key, validationResult.errors[key]);
    });

    if (!validationResult.isValid) {
      // Focus first field with error for accessibility
      const firstErrorKey = Object.keys(validationResult.errors).find(
        (key) => validationResult.errors[key]
      );
      if (firstErrorKey && fields[firstErrorKey].input) {
        fields[firstErrorKey].input.focus();
      }
      if (formStatus) {
        formStatus.classList.remove('success');
        formStatus.style.display = 'none';
      }
      return;
    }

    // Success state
    if (formStatus) {
      formStatus.textContent = '✓ Settings updated successfully!';
      formStatus.classList.add('success');
      formStatus.style.display = 'block';
    }
  });
}

// Auto-initialize when DOM is ready in browser environment
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
}
