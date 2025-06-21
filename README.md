# Portfolio CMS

A modern, modular portfolio and content management system built with **Next.js 15+** and **Sanity Studio v3**.

## Features

- ⚡️ **Next.js 15+** (App Router, server components, Tailwind CSS)
- 🗂️ **Sanity Studio v3** for content management
- 🧩 **Modular, dynamic sections** for portfolio and pages
- 🖼️ **Asset handling** for images, SVGs, videos, and 3D models
- 🔒 **Custom authentication** (username/password, role-based access)
- 🛡️ **/studio route protected** by middleware (admin-only)
- 🌍 **Multilingual-ready** (localeString fields)
- 🚀 **Ready for deployment** (Vercel, Netlify, or custom)

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/notLukaGray/portfolio.git
   cd portfolio
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` (create if missing)
   - Add your Sanity and auth credentials:
     ```env
     SANITY_PROJECT_ID=your-sanity-project-id
     SANITY_DATASET=your-dataset
     SANITY_API_VERSION=2023-05-22
     SANITY_TOKEN=your-sanity-token
     NEXTAUTH_SECRET=your-random-secret
     AUTH_USERS=[{"id":1,"name":"Admin","username":"admin","password":"adminpass","role":"admin"}]
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```
4. **Run the dev server:**
   ```sh
   npm run dev
   ```
5. **Access the app:**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - CMS: [http://localhost:3000/studio](http://localhost:3000/studio) (admin login required)

## Security Notes
- **Never commit `.env.local` or secrets to GitHub!**
- Only users with `role: "admin"` can access `/studio`.
- All authentication is handled server-side with NextAuth.js and middleware.

## Deployment
- Deploy to Vercel, Netlify, or your own server.
- Make sure to set all environment variables in your deployment platform.
- For production, set `NEXT_PUBLIC_BASE_URL` to your actual domain (e.g., `https://yourdomain.com`).

## License
MIT (or your preferred license)

---

**Made with ❤️ by Luka Gray**