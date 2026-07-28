/**
 * Account Settings Form Controller & Validation Engine
 * Stack: Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element References
  const form = document.getElementById('settingsForm');
  const navButtons = document.querySelectorAll('.settings-nav .nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const unsavedBadge = document.getElementById('unsavedBadge');
  const errorSummary = document.getElementById('formErrorSummary');
  const errorSummaryMessage = document.getElementById('errorSummaryMessage');
  const resetBtn = document.getElementById('resetBtn');
  const randomizeAvatarBtn = document.getElementById('randomizeAvatarBtn');
  const avatarImg = document.getElementById('avatarImg');
  const bioInput = document.getElementById('bio');
  const bioCounter = document.getElementById('bioCounter');
  
  // Password Elements
  const currentPasswordInput = document.getElementById('currentPassword');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const strengthContainer = document.getElementById('strengthContainer');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const togglePasswordBtns = document.querySelectorAll('.toggle-password-btn');

  // Input Fields to Validate
  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      tabId: 'profileTab',
      validate: (value) => {
        if (!value.trim()) return 'Full Name is required.';
        if (!/^[a-zA-Z\s'-]{2,50}$/.test(value.trim())) {
          return 'Full Name must be 2-50 characters and contain only letters and spaces.';
        }
        return '';
      }
    },
    username: {
      input: document.getElementById('username'),
      error: document.getElementById('usernameError'),
      tabId: 'profileTab',
      validate: (value) => {
        if (!value.trim()) return 'Username is required.';
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(value.trim())) {
          return 'Username must be 3-20 characters (alphanumeric and underscores only).';
        }
        return '';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      tabId: 'securityTab',
      validate: (value) => {
        if (!value.trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address (e.g. name@domain.com).';
        }
        return '';
      }
    },
    currentPassword: {
      input: currentPasswordInput,
      error: document.getElementById('currentPasswordError'),
      tabId: 'securityTab',
      validate: (value) => {
        const newPass = newPasswordInput.value;
        if (newPass && !value) {
          return 'Current password is required to set a new password.';
        }
        return '';
      }
    },
    newPassword: {
      input: newPasswordInput,
      error: document.getElementById('newPasswordError'),
      tabId: 'securityTab',
      validate: (value) => {
        if (!value) return ''; // Optional unless filled
        if (value.length < 8) return 'Password must be at least 8 characters long.';
        const strength = calculatePasswordStrength(value);
        if (strength.score < 3) {
          return 'Password is too weak. Meet at least 3 criteria below.';
        }
        return '';
      }
    },
    confirmPassword: {
      input: confirmPasswordInput,
      error: document.getElementById('confirmPasswordError'),
      tabId: 'securityTab',
      validate: (value) => {
        const newPass = newPasswordInput.value;
        if (newPass && value !== newPass) {
          return 'Passwords do not match.';
        }
        return '';
      }
    },
    bio: {
      input: bioInput,
      error: document.getElementById('bioError'),
      tabId: 'profileTab',
      validate: (value) => {
        if (value.length > 160) {
          return 'Bio cannot exceed 160 characters.';
        }
        return '';
      }
    }
  };

  // Capture Initial Form State for Dirty Checking & Resets
  let initialState = captureFormState();

  /* ==========================================================================
     INIT & EVENT LISTENERS
     ========================================================================== */
  function init() {
    setupTabNavigation();
    setupThemeToggle();
    setupFieldValidation();
    setupPasswordStrengthMeter();
    setupPasswordToggleVisibility();
    setupBioCounter();
    setupAvatarGenerator();
    setupDirtyChecking();
    setupFormSubmission();
    setupFormReset();
  }

  /* ==========================================================================
     TAB NAVIGATION
     ========================================================================== */
  function setupTabNavigation() {
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab');
        switchTab(targetTabId);
      });
    });
  }

  function switchTab(tabId) {
    navButtons.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));

    const targetNav = document.getElementById(`nav-${tabId}`);
    const targetPane = document.getElementById(tabId);

    if (targetNav && targetPane) {
      targetNav.classList.add('active');
      targetPane.classList.add('active');
    }
  }

  /* ==========================================================================
     THEME TOGGLE SYSTEM (Light / Dark)
     ========================================================================== */
  function setupThemeToggle() {
    // Check saved local theme preference or fallback to system preference
    const savedTheme = localStorage.getItem('app-theme') || 
                       (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('app-theme', newTheme);
      showToast('Theme Changed', `Switched to ${newTheme} mode.`, 'info');
    });
  }

  /* ==========================================================================
     FIELD VALIDATION ENGINE
     ========================================================================== */
  function setupFieldValidation() {
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      
      // Real-time validation on blur
      field.input.addEventListener('blur', () => {
        validateSingleField(key);
      });

      // Clear error state on active typing
      field.input.addEventListener('input', () => {
        const formGroup = field.input.closest('.form-group');
        if (formGroup && formGroup.classList.contains('error')) {
          validateSingleField(key);
        }
        
        // Dynamic re-validation of dependent fields
        if (key === 'newPassword') {
          if (confirmPasswordInput.value) validateSingleField('confirmPassword');
          if (currentPasswordInput.value || newPasswordInput.value) validateSingleField('currentPassword');
        }
      });
    });
  }

  function validateSingleField(key) {
    const field = fields[key];
    const errorMessage = field.validate(field.input.value);
    const formGroup = field.input.closest('.form-group');

    if (!formGroup) return !errorMessage;

    if (errorMessage) {
      formGroup.classList.remove('success');
      formGroup.classList.add('error');
      if (field.error) field.error.textContent = errorMessage;
      return false;
    } else {
      formGroup.classList.remove('error');
      // Apply success border only if field has content (or is required)
      if (field.input.value.trim() !== '') {
        formGroup.classList.add('success');
      } else {
        formGroup.classList.remove('success');
      }
      if (field.error) field.error.textContent = '';
      return true;
    }
  }

  function validateAllFields() {
    let isValid = true;
    let firstInvalidKey = null;

    Object.keys(fields).forEach(key => {
      const fieldValid = validateSingleField(key);
      if (!fieldValid) {
        isValid = false;
        if (!firstInvalidKey) firstInvalidKey = key;
      }
    });

    return { isValid, firstInvalidKey };
  }

  /* ==========================================================================
     PASSWORD STRENGTH METER & TOGGLES
     ========================================================================== */
  function setupPasswordStrengthMeter() {
    newPasswordInput.addEventListener('input', () => {
      const val = newPasswordInput.value;
      if (!val) {
        strengthContainer.classList.add('hidden');
        return;
      }

      strengthContainer.classList.remove('hidden');
      const strength = calculatePasswordStrength(val);
      updateStrengthUI(strength);
    });
  }

  function calculatePasswordStrength(password) {
    const rules = {
      ruleLength: password.length >= 8,
      ruleUpper: /[A-Z]/.test(password),
      ruleNumber: /[0-9]/.test(password),
      ruleSpecial: /[^A-Za-z0-9]/.test(password)
    };

    const passedCount = Object.values(rules).filter(Boolean).length;
    return { score: passedCount, rules };
  }

  function updateStrengthUI(strength) {
    const { score, rules } = strength;
    
    // Update individual rule list indicators
    Object.keys(rules).forEach(ruleId => {
      const el = document.getElementById(ruleId);
      if (el) {
        if (rules[ruleId]) {
          el.classList.add('valid');
          el.querySelector('i').className = 'fa-solid fa-circle-check';
        } else {
          el.classList.remove('valid');
          el.querySelector('i').className = 'fa-regular fa-circle-check';
        }
      }
    });

    // Strength Meter Progress & Label Colors
    let width = (score / 4) * 100;
    let color = 'var(--danger)';
    let text = 'Weak';

    if (score === 2) {
      color = 'var(--warning)';
      text = 'Fair';
    } else if (score === 3) {
      color = '#3B82F6'; // Blue
      text = 'Good';
    } else if (score === 4) {
      color = 'var(--success)';
      text = 'Strong';
    }

    strengthBar.style.width = `${width}%`;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Password Strength: ${text}`;
    strengthText.style.color = color;
  }

  function setupPasswordToggleVisibility() {
    togglePasswordBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input || input.tagName !== 'INPUT') return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        }
      });
    });
  }

  /* ==========================================================================
     BIO CHARACTER COUNTER
     ========================================================================== */
  function setupBioCounter() {
    function updateCounter() {
      const len = bioInput.value.length;
      bioCounter.textContent = `${len} / 160`;
      
      if (len >= 150) {
        bioCounter.className = 'char-counter warning';
      } else if (len > 160) {
        bioCounter.className = 'char-counter exceeded';
      } else {
        bioCounter.className = 'char-counter';
      }
    }

    bioInput.addEventListener('input', updateCounter);
    updateCounter();
  }

  /* ==========================================================================
     AVATAR GENERATOR
     ========================================================================== */
  function setupAvatarGenerator() {
    const seeds = ['Antigravity', 'Cyberpunk', 'Quantum', 'Nebula', 'Sparkle', 'Astro', 'Matrix', 'Vortex'];
    
    randomizeAvatarBtn.addEventListener('click', () => {
      const randomSeed = seeds[Math.floor(Math.random() * seeds.length)] + Math.floor(Math.random() * 1000);
      avatarImg.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
      markAsDirty();
    });
  }

  /* ==========================================================================
     DIRTY STATE CHECKING (UNSAVED CHANGES)
     ========================================================================== */
  function captureFormState() {
    const formData = new FormData(form);
    const state = {};
    for (let [key, value] of formData.entries()) {
      state[key] = value;
    }
    state['avatarSrc'] = avatarImg.src;
    return state;
  }

  function setupDirtyChecking() {
    form.addEventListener('input', checkDirtyState);
    form.addEventListener('change', checkDirtyState);
  }

  function checkDirtyState() {
    const currentState = captureFormState();
    const isDirty = JSON.stringify(currentState) !== JSON.stringify(initialState);
    
    if (isDirty) {
      unsavedBadge.classList.remove('hidden');
    } else {
      unsavedBadge.classList.add('hidden');
    }
  }

  function markAsDirty() {
    unsavedBadge.classList.remove('hidden');
  }

  /* ==========================================================================
     FORM SUBMISSION
     ========================================================================== */
  function setupFormSubmission() {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const { isValid, firstInvalidKey } = validateAllFields();

      if (!isValid && firstInvalidKey) {
        // Find which tab contains the error
        const errorField = fields[firstInvalidKey];
        if (errorField && errorField.tabId) {
          switchTab(errorField.tabId);
        }

        // Show global summary banner
        errorSummary.classList.remove('hidden');
        errorSummaryMessage.textContent = `Fix the errors in the ${getTabName(errorField.tabId)} section before saving.`;

        // Focus invalid element
        errorField.input.focus();

        showToast('Validation Error', 'Please correct highlighted errors in the form.', 'error');
        return;
      }

      // Hide error summary if previously shown
      errorSummary.classList.add('hidden');

      // Simulate API Save Request
      const submitBtn = document.getElementById('submitBtn');
      const originalContent = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;

        // Reset baseline state
        initialState = captureFormState();
        unsavedBadge.classList.add('hidden');

        // Clear password fields for safety after save
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
        strengthContainer.classList.add('hidden');
        
        // Remove success classes from password fields
        ['currentPassword', 'newPassword', 'confirmPassword'].forEach(k => {
          const group = fields[k].input.closest('.form-group');
          if (group) group.classList.remove('success', 'error');
        });

        showToast('Settings Saved', 'Your account preferences have been updated successfully.', 'success');
      }, 1200);
    });
  }

  function getTabName(tabId) {
    switch (tabId) {
      case 'profileTab': return 'Profile';
      case 'securityTab': return 'Account & Security';
      case 'notificationsTab': return 'Notifications';
      case 'preferencesTab': return 'Preferences';
      default: return 'Form';
    }
  }

  /* ==========================================================================
     FORM RESET
     ========================================================================== */
  function setupFormReset() {
    resetBtn.addEventListener('click', () => {
      form.reset();

      // Reset avatar
      avatarImg.src = initialState.avatarSrc || 'https://api.dicebear.com/7.x/bottts/svg?seed=Antigravity';

      // Clear all error/success styles
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const group = field.input.closest('.form-group');
        if (group) group.classList.remove('error', 'success');
        if (field.error) field.error.textContent = '';
      });

      // Clear Password strength container & summary
      strengthContainer.classList.add('hidden');
      errorSummary.classList.add('hidden');

      // Reset Bio counter
      const len = bioInput.value.length;
      bioCounter.textContent = `${len} / 160`;
      bioCounter.className = 'char-counter';

      // Reset dirty state
      unsavedBadge.classList.add('hidden');

      showToast('Form Reset', 'All settings have been restored to initial state.', 'info');
    });
  }

  /* ==========================================================================
     TOAST NOTIFICATION ENGINE
     ========================================================================== */
  function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-message">${escapeHTML(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close Notification">&times;</button>
    `;

    // Close button event
    toast.querySelector('.toast-close').addEventListener('click', () => {
      removeToast(toast);
    });

    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(toast);
    }, 4000);
  }

  function removeToast(toast) {
    if (toast.classList.contains('fadeOut')) return;
    toast.classList.add('fadeOut');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Initialize Application
  init();
});
