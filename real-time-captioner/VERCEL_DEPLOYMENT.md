# Vercel Deployment Guide for SpeakEasy

## What I Fixed:
1. ✅ Created `vercel.json` - This fixes the 404 routing issue
2. ✅ Created `.env.production` - Template for production environment variables

## Steps to Deploy:

### 1. Push to GitHub
```bash
cd /Users/ramses/Documents/SBUHacks/real-time-captioner
git add .
git commit -m "Add vercel.json for deployment"
git push origin main
```

### 2. In Vercel Dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables:

**Variable Name** | **Value**
--- | ---
`REACT_APP_AUTH0_DOMAIN` | `dev-m71z1z5w3vgzg8av.us.auth0.com`
`REACT_APP_AUTH0_CLIENT_ID` | `kyDLWBhYGcfOxB1sWZt4ZEsaougC4Gwe`
`REACT_APP_AUTH0_AUDIENCE` | `https://dev-m71z1z5w3vgzg8av.us.auth0.com/api/v2/`
`REACT_APP_AUTH0_REDIRECT_URI` | `https://YOUR-APP.vercel.app` (use your actual Vercel URL)
`REACT_APP_GEMINI_API_KEY` | `AIzaSyBhK-4VXxOPP6PLcDrjZfPlF9aCvLC1DR0`
`REACT_APP_GOOGLE_TRANSLATE_API_KEY` | `AIzaSyCfCqZiZVDQ5lPHrPMWDwer9qUFY2lwAiw`

### 3. Update Auth0 Settings:
1. Go to Auth0 Dashboard: https://manage.auth0.com/
2. Go to Applications → Your App
3. Under "Allowed Callback URLs", add:
   ```
   https://YOUR-APP.vercel.app
   ```
4. Under "Allowed Logout URLs", add:
   ```
   https://YOUR-APP.vercel.app
   ```
5. Under "Allowed Web Origins", add:
   ```
   https://YOUR-APP.vercel.app
   ```

### 4. Redeploy on Vercel
After adding environment variables, click "Redeploy" in Vercel

## Why You Got 404:

The 404 error happened because:
- Vercel was trying to find physical files for routes like `/notes`
- React Router handles routing client-side, not server-side
- The `vercel.json` file tells Vercel to always serve `index.html` for all routes
- Then React Router takes over and shows the correct page

## Testing Locally:
```bash
npm run build
npx serve -s build
```
Then visit http://localhost:3000

## What the vercel.json Does:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This tells Vercel: "For any URL, serve index.html and let React Router handle it"
