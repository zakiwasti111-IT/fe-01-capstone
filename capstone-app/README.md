# AI Profile Builder

A production-ready frontend application that helps users build professional profiles with AI assistance. Built with Next.js, TypeScript, Tailwind CSS, and the Gemini API.

## 🔗 Live Demo

[https://fe-01-capstone-gjno.vercel.app](https://fe-01-capstone-gjno.vercel.app)

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/fe-01-capstone.git
cd fe-01-capstone/capstone-app
npm install
npm run dev
```

Open [**http://localhost:3000/settings**](http://localhost:3000/settings)

## 🏗️ Architecture

| File/Directory | Purpose |
|---|---|
| **`src/app/settings/page.tsx`** | Main settings form with accessible validation |
| **`src/app/api/generate-bio/route.ts`** | Server-side API route that calls the Gemini API |
| **`src/components/__tests__/`** | Unit tests for form validation and AI button |
| **`.env.local`** | Local environment variables (API key — not pushed to Git) |
| **`.env.example`** | Template for required environment variables |

## 🤖 AI Integration

**Feature:** AI-Powered Professional Bio Generator

**How it works:**

1. User fills in their name, role, and interests in the Settings form.
2. They click **"Generate Bio with AI"**.
3. The form calls **`/api/generate-bio`**, a Next.js server-side API route.
4. The API route calls the Gemini API with a carefully crafted prompt.
5. The generated bio is displayed in the textarea for the user to edit or accept.

**Prompt used:**

```text
You are a professional bio writer. Write a concise, professional bio (2-3 sentences)
for the following person:
Name: {name}
Role: {role}
Interests: {interests}

Write only the bio text. No quotes, no labels. Make it suitable for LinkedIn.
```

**Why this approach:**

- The API call is made server-side, keeping the API key secret.
- The user can always edit the AI output — no forced acceptance.
- Clear error states if the AI call fails.

## ♿ Accessibility

- All form fields have associated **`<label>`** elements.
- **`aria-invalid`** and **`aria-describedby`** are used for error announcements.
- The AI button is properly disabled with the **`disabled`** attribute.
- Focus is managed with native HTML form behavior.
- Tested with keyboard-only navigation.
- Color contrast meets WCAG 2.1 AA standards.

### One Improvement Made from Accessibility Audit

Based on the Lighthouse accessibility audit, I noticed that the error message text
did not meet minimum contrast requirements. I updated the error text color from
gray-400 to gray-600, raising the contrast ratio from 2.8:1 to 4.6:1, passing WCAG AA.

## 🧪 Testing

Run tests:

```bash
npm run test:run
```

Tests cover:

- Form field rendering
- Validation error display
- AI button disabled state
- Valid form submission

## ⚠️ Known Limitations

- AI bio generation requires a valid Gemini API key.
- The Gemini API may have rate limits depending on the account and API plan.
- No persistent storage — settings are not saved to a database.
- Bio generation works best with English names and roles.

## 🔮 Future Improvements

- Add database persistence (e.g., Supabase, Prisma + PostgreSQL).
- Add user authentication to save profiles.
- Support multiple languages for bio generation.
- Add more AI features (skills summary, achievement highlights).
