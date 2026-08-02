# AI-Assisted Development Log

## 1. Prompts Used During Development

### Prompt 1 – Generate React Settings Form

Create a React functional component called SettingsForm.

Requirements:
- Use useState for managing form state
- Fields: name (required), email (must be valid format), password (minimum 8 characters)
- Show inline error messages below each field
- Prevent submission if validation fails
- Show success message when form is valid
- No external libraries
- Use clean, readable structure
- Create a separate CSS file called SettingsForm.css

---

## 2. How AI Assisted During Implementation

AI (Gemini CLI) was used as a development assistant to generate the initial structure of the React settings form component. It helped create:

- The functional React component using `useState`
- Form state management logic
- Validation logic for name, email, and password fields
- Inline error message handling
- Basic form structure and layout
- Initial CSS styling structure

Using AI significantly reduced the time required to write boilerplate React code and validation setup. Instead of building the component from scratch, I was able to generate a working foundation quickly and then focus on reviewing, improving, and refining the implementation.

AI was especially helpful in organizing state management and structuring the component logic clearly.

---

## 3. Manual Improvements and Refactoring After Reviewing AI Code

After reviewing the AI-generated implementation, I made several manual improvements to improve correctness, scalability, and overall code quality.

### Improved Validation Robustness

The AI-generated password validation did not trim whitespace before checking length. This allowed inputs containing only spaces to pass validation. I updated the validation logic to consistently trim all inputs before checking conditions to ensure accurate validation.

### Refactored Validation Logic for Scalability

The AI manually validated each field inside `validateForm`, which would not scale well if additional fields were added. I refactored the function to dynamically iterate over `formData` keys, making the validation logic more maintainable and extensible for future expansion.

### Improved Email Validation Handling

The AI trimmed input when checking for emptiness but did not trim before running the regex test. I updated the validation function to normalize (trim) input values before applying the regex pattern to ensure correct validation behavior.

### Improved User Experience by Resetting Form After Success

The AI implementation did not clear form inputs after successful submission. I added a form reset after successful validation to improve usability and clearly reflect completion of the action.

### Improved Code Structure Using a Switch Statement

The AI used multiple `if/else` condition blocks for field validation. I replaced these with a `switch` statement inside `validateField` to improve readability, organization, and maintainability of the validation logic.

---

## 4. Reflection on AI-Assisted Development

This assignment demonstrated that AI is effective for generating structured boilerplate and initial implementations, but manual review is essential. While the AI-generated code was functional, it required refinement to improve robustness, scalability, and user experience.

The process reinforced the importance of critically reviewing AI-generated code rather than accepting it as final. AI served as a productivity tool, but careful evaluation and refactoring were necessary to ensure production-quality standards.