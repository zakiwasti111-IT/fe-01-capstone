import React, { useState } from 'react';
import './SettingsForm.css';

const SettingsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

const validateField = (fieldName, rawValue) => {
  const value = rawValue.trim();
  let error = '';

  switch (fieldName) {
    case 'name':
      if (!value) {
        error = 'Name is required.';
      }
      break;

    case 'email':
      if (!value) {
        error = 'Email is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address.';
        }
      }
      break;

    case 'password':
      if (!value) {
        error = 'Password is required.';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters long.';
      }
      break;

    default:
      break;
  }

  return error;
};

const validateForm = () => {
  const newErrors = {};

  Object.keys(formData).forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      newErrors[field] = error;
    }
  });

  return newErrors;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (isSubmitted || errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }

    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const formErrors = validateForm();
    setErrors(formErrors);

if (Object.keys(formErrors).length === 0) {
  setSuccessMessage('Settings updated successfully!');
  setFormData({
    name: '',
    email: '',
    password: ''
  });
  setErrors({});
} else {
  setSuccessMessage('');
}
};

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <h2>Account Settings</h2>
          <p>Manage and update your profile details.</p>
        </div>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="settings-form">
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <span className="error-message" id="name-error">
                {errors.name}
              </span>
            )}
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <span className="error-message" id="email-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">
              Password <span className="required-star">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Minimum 8 characters"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <span className="error-message" id="password-error">
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;