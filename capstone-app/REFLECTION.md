# Capstone Reflection

## What Was Hardest?

Setting up the AI integration was the most challenging part. Not because of the API itself, but because of the decisions around it: where to call the API (client vs server), how to handle errors gracefully, how to keep the API key secret, and how to make the AI feature feel useful rather than gimmicky. Balancing the AI feature with accessibility was also tricky — ensuring screen readers announce the AI status without being annoying, and making sure users can always override the AI output.

## What Would You Do Differently?

I would have started with the AI integration earlier. I spent a lot of time building the settings form infrastructure before thinking about how AI would fit in. If I started over, I would have mapped out the user problem first (writer's block when writing a bio) and then designed the AI feature to solve that specific problem from day one. I would also have set up a proper CI/CD pipeline with automated tests running on every push instead of running tests manually.

## One Thing That Surprised Me

I was surprised by how much the AI feature improved just by refining the prompt. The first version of the bio generator produced generic, fluffy bios. After tweaking the prompt to be more specific about tone, length, and context, the quality improved dramatically. This taught me that prompt engineering is not a one-time setup — it is an iterative process that requires testing and refinement, much like any other part of the application.

## What I Learned About Accessibility

Building accessible forms is not just about adding ARIA labels. The most important lesson from this project was that good accessibility starts with good UX design. When the form is clear, logical, and predictable, accessibility almost takes care of itself. Native HTML elements do most of the heavy lifting. ARIA is there to fill gaps, not to replace semantic HTML.

## What I Learned About Deployment

"Deploying early and often" is not just a best practice — it changes how you think about your code. When I knew the app was live, I became much more careful about what I committed. I started thinking about error handling, environment variables, and edge cases in a way I never did when the app only existed locally. The deployment checklist forced me to think through failure scenarios I would have otherwise ignored.