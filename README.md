# Portfolio CMS

This is a portfolio and content management system built with Next.js 15+ and Sanity Studio v3. It's designed for developers and designers who want a modern, secure, and flexible site for their work.

## What's Included

- Next.js 15+ (App Router, server components, Tailwind CSS)
- Sanity Studio v3 for content management
- Modular sections for portfolio and pages
- Handles images, SVGs, videos, and 3D models
- Secure authentication (bcrypt, rate limiting, input validation)
- Role-based access (admin and user)
- Multilingual support (localeString fields)
- Ready for Vercel, Netlify, or your own server

## Getting Started

1. **Clone the repository:**
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
   - Add your Sanity and authentication credentials:
     ```env
     SANITY_PROJECT_ID=your-sanity-project-id
     SANITY_DATASET=your-dataset
     SANITY_API_VERSION=2023-05-22
     SANITY_TOKEN=your-sanity-token
     NEXTAUTH_SECRET=your-random-secret
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Open your browser:**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - CMS: [http://localhost:3000/studio](http://localhost:3000/studio) (admin login required)

## Authentication and Security

- Passwords are hashed with bcrypt
- Login attempts are rate-limited
- User input is validated
- Sessions use JWT tokens
- Admin routes are protected by middleware
- API routes require authentication
- CSRF protection is handled by NextAuth

**Default admin user is created automatically on first setup:**

- Username: `admin`
- Password: `ChangeMe123!`
- Email: `admin@example.com`

**Change the default password after your first login.**

## Deployment

### Deploying to Vercel

1. **Install the Vercel CLI:**
   ```sh
   npm i -g vercel
   ```
2. **Deploy:**
   ```sh
   npm run deploy
   # or for preview
   npm run deploy:preview
   ```
3. **Set environment variables in the Vercel dashboard:**
   - `DATABASE_URL` (your production database URL)
   - `NEXTAUTH_SECRET` (32+ character secret)
   - `NEXTAUTH_URL` (your deployed site URL)
   - Sanity variables if you use Sanity

4. **Set up your production database (Neon, Supabase, etc.)**
5. **Visit `/setup` on your deployed site to create the admin user.**
6. **Login at `/login` and access the studio at `/studio`.**

**If you run into issues:**

- Double-check your environment variables
- Make sure your database is reachable
- Visit `/setup` to trigger admin creation if needed

### Other Deployment Options

- You can deploy to Netlify or your own server
- Make sure all environment variables are set
- Use a strong `NEXTAUTH_SECRET` in production

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm run start` – Start the production server
- `npm run lint` – Run ESLint
- `npm run manage-users` – Manage users in the database
- `npm run deploy` – Deploy to Vercel (production)
- `npm run deploy:preview` – Deploy to Vercel (preview)

## Development Notes

- Use the `/setup` page to create or reset the admin user
- All authentication is handled through the database (no hardcoded users)
- Sanity Studio is available at `/studio` for admin users
- The codebase is fully type-checked and linted

## License

NO LICENSE AT THIS TIME

---

Maintained by Luka Gray. If you have questions or want to contribute, open an issue or pull request.

# Sun Jun 22 22:50:35 CDT 2025
