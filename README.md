# 💈 ZERO TO HERO SALON — Luxury Grooming Web App (Vercel Ready)

A full-stack **MERN** web application built for **ZERO TO HERO SALON** with a signature **Black + Gold** luxury aesthetic, optimized specifically for **mobile screens** and pre-configured for **1-click deployment on Vercel** using free web app domains (`*.vercel.app`) with **Zero Localhost Dependencies**.

---

## 🚀 Instant Vercel Deployment (No Domain Required)

This project is configured to run **100% online in the cloud** with **Zero Localhost Dependencies**. You do **not** need a custom domain—Vercel automatically gives you a free HTTPS domain (e.g. `https://zero-to-hero-salon.vercel.app`).

### Option 1: Deploy Directly via Vercel CLI (Recommended & Easiest)
Open PowerShell in this project folder and run:
```powershell
npx vercel
```
1. Press `Enter` to confirm the project setup.
2. Select your Vercel account.
3. Link to existing project? Answer `N` (No).
4. Project name: `zero-to-hero-salon` (or your preferred name).
5. In which directory is your code located? `./` (press `Enter`).
6. Want to modify these settings? Answer `N` (No) — Vercel will automatically detect `vercel.json`!
7. To deploy directly to production:
```powershell
npx vercel --prod
```
Your app will be live instantly on your free Vercel web app URL: `https://your-app-name.vercel.app`!

---

### Option 2: Deploy via GitHub + Vercel Web Dashboard
1. Upload this folder to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite** or **Other**.
5. Click **Deploy**. Vercel will execute `npm run vercel-build` and deploy both the serverless API (`/api/*`) and the React SPA frontend.

---

## ☁️ Zero-Localhost Online Architecture

In local development, apps traditionally rely on `mongodb://localhost:27017`. In serverless cloud deployments like Vercel, there is no local database daemon. 

This project solves that with an **Autonomous Dual-Engine Data Layer (`server/models/dbAdapter.js`)**:
1. **Cloud Database (MongoDB Atlas)**: If you provide `MONGODB_URI` in Vercel's Environment Variables (e.g., free MongoDB Atlas cluster `mongodb+srv://...`), the app connects to Atlas with connection pooling.
2. **Zero-Config Cloud Fallback**: If no `MONGODB_URI` is provided, the backend automatically operates on an **in-memory data engine** pre-populated with:
   - All 7 core salon services
   - 4 master barbers with ratings & specialties
   - Admin credentials (`admin@zerotohero.com` / `admin123`)
   - Today's sample appointments and sales metrics
   
*Result: The web application is 100% functional the second it is deployed online!*

---

## 📱 Mobile-First UI Optimizations

The application UI has been optimized for mobile screens:

- **Mobile Viewport & Touch Ergonomics**: All interactive elements adhere to the 44px+ touch-target standard, with auto-zoom disabled on iOS (`font-size: 16px` form inputs) and `-webkit-overflow-scrolling: touch`.
- **Dynamic Mobile Stepper**: On screens `< 650px`, the 5-step booking wizard collapses into a streamlined mobile progress bar with real-time step headers (`Step 2 of 5: Select Services`), leaving full screen space for selections.
- **Responsive Time Slot Grid**: Slots automatically format into a 3-column touch-friendly grid on mobile phones.
- **Card-Based Admin Dashboard**: On mobile viewports, the Admin Appointments table and KPI analytics convert to stacked touch cards with horizontal-swipeable tabs.
- **1-Tap Mobile UPI Intent**: Dynamic QR code scales responsively, and mobile UPI app triggers allow direct opening in Google Pay, PhonePe, and Paytm.
- **Safe-Area Mobile Floating CTA**: The floating "BOOK APPOINTMENT" button adapts to mobile navigation bars using `env(safe-area-inset-bottom)`.

---

## ✂️ Core Services Catalog
- **Hair Cut** (₹250 | 30 mins)
- **Trim** (₹150 | 20 mins)
- **Shave** (₹120 | 20 mins)
- **Facial** (₹650 | 45 mins)
- **D-Tan** (₹400 | 30 mins)
- **Hair Spa** (₹750 | 50 mins)
- **Colouring** (₹850 | 60 mins)

---

## 🔑 Default Admin Credentials
- **Portal URL**: `/admin/login`
- **Email**: `admin@zerotohero.com`
- **Password**: `admin123`
*(A 1-click "Quick Auto-Fill Demo Credentials" button is included on the login screen for instant access)*

---

## 💻 Local Development (Optional)

If running locally on your computer:
1. **Start Backend**: `cd server && npm start` (port 5000)
2. **Start Frontend**: `cd client && npm run dev` (port 3000)
