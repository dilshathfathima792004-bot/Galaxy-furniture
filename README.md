# Galaxy Furniture Website

E-commerce style website with blog + customer inquiry handling for
Galaxy Furniture (Chennai & Karur showrooms).

## Tech Stack
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Frontend: Plain HTML/CSS/JS (in /public)
- Email notifications: Nodemailer

## How to run (step by step)

1. **Install Node.js** from https://nodejs.org (LTS version)

2. **Get a free MongoDB database:**
   - Go to https://cloud.mongodb.com → sign up free
   - Create a cluster → Database → Connect → Drivers → Node.js
   - Copy the connection string

3. **Setup the project:**
   ```
   cd galaxy-furniture
   npm install
   ```
   - Copy `.env.example` to `.env`
   - Paste your MongoDB connection string into `MONGO_URI`
   - Set `ADMIN_KEY` to any secret password you like

4. **Run it:**
   ```
   npm run dev
   ```
   Open http://localhost:3000

5. **Add products:**
   - Go to http://localhost:3000/admin.html
   - Login with your ADMIN_KEY
   - Add products (with photos) and blog posts
   - View customer inquiries there too

## Pages
- `/` — Home with showrooms & featured products
- `/products.html` — Product catalog with category filters
- `/blog.html` — Blog posts
- `/contact.html` — Inquiry form (saves to DB + optional email)
- `/admin.html` — Admin panel (products, blogs, inquiries)

## Optional: email notifications
- Use a Gmail **App Password** (not your normal password) in `.env`

## Later: deploy
- Host free on Render/Railway → buy a domain (~₹500/yr) → point it there


## Deploy to Vercel (get your own live link like dardek-website.vercel.app)

**Step 1 — Put the project on GitHub:**
1. Create a free account at github.com
2. Click **New Repository** → name it `galaxy-furniture` → Create
3. On your laptop, in the project folder:
   ```
   git init
   git add .
   git commit -m "galaxy furniture website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/galaxy-furniture.git
   git push -u origin main
   ```

**Step 2 — Deploy on Vercel:**
1. Go to vercel.com → sign up **with your GitHub account**
2. Click **Add New → Project** → import `galaxy-furniture`
3. Before deploying, go to **Environment Variables** and add:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `ADMIN_KEY` = your secret admin password
   - `EMAIL_USER` and `EMAIL_PASS` (optional)
4. Click **Deploy** → wait ~1 minute

**Step 3 — Your link is ready! 🎉**
Vercel gives you: `https://galaxy-furniture.vercel.app`
(You can rename it in Settings → Domains, e.g. `galaxytf.vercel.app` — free)

**Then buy a custom domain** (galaxytf.com ~₹500/yr from GoDaddy/Hostinger)
and attach it in Vercel → Settings → Domains.

### One limitation on free Vercel
Uploaded product photos are stored temporarily (serverless filesystem).
For permanent image storage, connect free Cloudinary later — ask when you reach that step.
