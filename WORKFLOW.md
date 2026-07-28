# AI Workflow Comparison: Vague vs Structured Prompt

## Overview

This exercise compared two approaches to AI-assisted development by building the same feature — a settings form with validation — using two different prompting styles. The first round used a single vague prompt, while the second round used a structured prompt with constraints, file references, and a verification requirement.

## Round One: Vague Prompt

The vague prompt (“Create a simple settings form with validation in JavaScript.”) produced a significantly over-engineered result. The AI generated three files: `index.html`, `app.js`, and `styles.css`. The JavaScript file alone was over 500 lines long and included additional features such as navigation tabs, password strength indicators, theme toggling, avatar randomization, and UI state management that were never requested.

While the output appeared impressive, it required substantial review effort. Many features were unrelated to the assignment scope, making the code harder to reason about. The validation logic was embedded inside a large controller structure, increasing complexity. The AI also assumed element IDs and layout structure without clear constraints, which required manual inspection to confirm consistency.

One mistake I identified was that the form logic was tightly coupled to specific DOM elements and assumed the presence of UI components that were not explicitly required. This increased fragility and review time.

## Round Two: Structured Prompt

The structured prompt specified exact file names (`settings.html`, `settings.js`, `settings.css`), required fields (name, email, password), constraints (semantic HTML, labels, inline errors, no external libraries), and included a verification step requiring a `settings.test.js` file.

The result was much more focused. Only the requested fields were implemented. Each input had associated `<label>` elements, improving accessibility. Validation was clearly separated and easier to review. The inclusion of `settings.test.js` introduced a verification layer that did not exist in round one.

Edge case handling was more deliberate in round two. The prompt constraint requiring blocked submission ensured proper `preventDefault()` usage and explicit validation checks.

## Comparison and Review Effort

Although round two took longer to write due to the detailed prompt, it required significantly less review and cleanup time. Round one felt faster initially but demanded more manual auditing due to scope creep and unnecessary complexity.

The structured workflow improved correctness, reduced overengineering, increased accessibility compliance, and made validation behavior easier to verify.

## Conclusion

This exercise demonstrated that precise prompting with constraints and verification steps leads to more maintainable, testable, and reviewable output. The explore-plan-code loop in round two resulted in higher quality code and less total effort compared to the vague one-shot approach.