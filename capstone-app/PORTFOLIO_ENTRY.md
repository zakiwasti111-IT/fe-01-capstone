# Portfolio Entry

## Project brief

AI Profile Builder is a production-ready Next.js application that helps users create professional profile bios with AI assistance. Users enter their name, role, interests, and preferred tone, then the application sends the request securely to a server-side API route that uses the Gemini API to generate a concise bio. The generated bio is displayed in an editable textarea so the user can review and modify it before using it. The project was built with Next.js, TypeScript, Tailwind CSS, Zod, and the Gemini API, and was deployed on Vercel.

## Live URL

[AI Profile Builder](https://fe-01-capstone-gjno.vercel.app)

## Repo URL

[GitHub Repository](https://github.com/zakiwasti111-IT/fe-01-capstone.git)

## Testing evidence

![Testing evidence](./screenshots/testing.png)

The application was tested for form rendering, validation behavior, required-field handling, AI button disabled state, valid form submission, and successful bio generation.

## Lighthouse + a11y audit evidence + the one fix you made

![Lighthouse and accessibility audit](./screenshots/lighthouse.png)

One accessibility improvement made was ensuring that the form controls have associated `<label>` elements and appropriate ARIA attributes such as `aria-describedby` for accessible status and help messaging. The AI generation button also uses the native `disabled` attribute while generation is in progress or when required fields are incomplete.

## Deployment/rollback notes

The application is deployed to Vercel from the `capstone/ai-bio-builder` branch. The Gemini API key is stored as a Vercel environment variable rather than being exposed in the frontend. The AI generation endpoint runs server-side through `/api/generate-bio`, keeping the API key out of client-side code. If a deployment introduces a problem, the previous working Vercel deployment can be restored through Vercel's deployment management tools, or the problematic commit can be reverted and pushed to the deployment branch.

## Reflection summary

This project provided practical experience building and deploying a full-stack Next.js feature that combines a frontend form with a server-side AI integration. One of the main lessons was the importance of environment variables and deployment-specific configuration when moving an application from local development to production. Debugging the Gemini integration also demonstrated the value of checking server-side deployment logs rather than relying only on generic frontend errors. The project also reinforced the importance of accessibility, validation, error handling, and allowing users to edit AI-generated content rather than treating generated output as final.