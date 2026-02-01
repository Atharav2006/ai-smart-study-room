# 🚀 Deployment Guide for AI Smart Study Room

Your project is configured and ready for deployment! Follow these steps to get your app live.

## ✅ Prerequisites Breakdown
- **Frontend**: Configured for Netlify (using `netlify.toml`)
- **Backend**: Configured for Render (using `render.yaml`)
- **Database**: Already running on Supabase

---

## Step 1: Push Code to GitHub
You need to get your code onto GitHub so the hosting providers can access it.

1. **Create a new repository** on [GitHub](https://github.com/new).
   - Name it something like `ai-smart-study-room`.
   - **Do NOT** check "Initialize with README" (keeps it empty).

2. **Push your local code** by running these commands in your VS Code terminal:

   ```bash
   # Replace YOUR_USERNAME with your actual GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/ai-smart-study-room.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy Backend (Render)
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Blueprints**.
3. Connect your GitHub account and select the `ai-smart-study-room` repository.
4. Render will automatically detect the `render.yaml` file and set everything up.
5. Click **Apply** / **Create Resources**.
   - *Note: It may take a few minutes to build.*
6. Once live, **copy the Backend URL** (e.g., `https://ai-smart-study-backend.onrender.com`).

---

## Step 3: Connect Frontend (Netlify)
1. Go to [app.netlify.com](https://app.netlify.com/).
2. Click **Add new site** -> **Import from an existing project**.
3. Select **GitHub** and choose your `ai-smart-study-room` repository.
4. Netlify will detect the settings from `netlify.toml`.
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
5. Click **Deploy ai-smart-study-room**.

---

## Step 4: Final Configuration
Once both are live, you need to connect them:

1. **Update Frontend Environment**:
   - Go to Netlify Site Settings -> **Environment variables**.
   - Add/Update `VITE_API_URL` with your **Render Backend URL** (from Step 2).
   - *Example:* `https://ai-smart-study-backend.onrender.com/api/v1`
   - **Trigger a new deploy** on Netlify for this to take effect.

2. **Update Backend Environment** (if needed):
   - In Render Dashboard -> Environment, ensure `SUPABASE_URL` and `SUPABASE_KEY` are set (they should be auto-filled from `render.yaml` placeholders, but verify).

🎉 **Done! Your AI Smart Study Room is now public!**
