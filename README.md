# Marriage Biodata Website

A beautiful, traditional-style marriage biodata website for sharing with prospective families.

## How to Update Your Biodata

Edit **`data.json`** — that's the only file you need to change. Update the values with your real information:

- **personal**: Name, DOB, height, rashi, gotra, etc.
- **education**: Qualification, college, university
- **career**: Job title, company, income
- **family**: Parents' details, siblings
- **contact**: Phone, email, address
- **partnerPreference**: What you're looking for
- **aboutMe**: A short paragraph about yourself

### Adding Your Photo

1. Add your photo file (e.g., `photo.jpg`) to this folder
2. In `data.json`, set `"photo": "photo.jpg"`

## Free Hosting on GitHub Pages

### Step 1: Create a GitHub Account
- Go to [github.com](https://github.com) and sign up (free)

### Step 2: Create a Repository
- Click **"New repository"**
- Name it: `my-biodata` (or anything you like)
- Keep it **Public**
- Click **Create repository**

### Step 3: Upload Files
- Click **"uploading an existing file"** link
- Drag and drop ALL files from this folder:
  - `index.html`
  - `style.css`
  - `script.js`
  - `data.json`
  - Your photo file
- Click **"Commit changes"**

### Step 4: Enable GitHub Pages
- Go to repository **Settings** → **Pages**
- Under "Source", select **"Deploy from a branch"**
- Branch: **main**, folder: **/ (root)**
- Click **Save**
- Your site will be live at: `https://YOUR-USERNAME.github.io/my-biodata/`

### Step 5: Update Anytime
- Edit `data.json` directly on GitHub (click the file → pencil icon → edit → commit)
- Changes go live in ~1 minute

## Alternative: Netlify (Drag & Drop)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up free (use GitHub or email)
3. Drag and drop this entire folder onto the deploy area
4. Get your free link instantly!
5. To update: just drag and drop again with updated files

## Local Preview

To preview locally, you need a simple server (because of the JSON fetch):

```bash
# Using Python
python3 -m http.server 8000

# Then open http://localhost:8000
```
