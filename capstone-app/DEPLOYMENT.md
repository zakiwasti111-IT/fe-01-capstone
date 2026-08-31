# Deployment Checklist

## Pre-Deployment
- [x] Code reviewed and tested locally
- [x] All tests pass (`npm run test:run`)
- [x] No secrets in repository (.env.local is gitignored)
- [x] Environment variables set in Vercel dashboard

## Deployment
- [x] Connected to GitHub repository
- [x] Root directory set to `capstone-app`
- [x] Environment variables configured
- [x] Preview deployments enabled on every push
- [x] Deployment completed successfully

## Post-Deployment
- [x] Live URL verified (https://...)
- [x] AI feature tested on live site
- [x] Form submission tested
- [x] Mobile responsiveness confirmed
- [x] No console errors

## Rollback Plan
If the deployment breaks:
1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. If that fails, `git revert` the breaking commit and push

## Monitoring
- Vercel provides build logs and error tracking
- API route errors are logged server-side
- No third-party monitoring set up (future improvement)