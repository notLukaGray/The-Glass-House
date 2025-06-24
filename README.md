# The Glass House

The Glass House is a modular frontend framework for combining CMS-driven content, secure authentication, and customizable layout components. Built with Next.js, Sanity, and Prisma, it's designed to support everything from personal portfolios to feature-rich tools like VAELD.

Define your layout components once, and control what renders through Sanity — no redeploys required. It's built for Vercel, but can run anywhere that supports Node.js.

---

## Core Philosophy

- CMS-first: structure and content are managed in Sanity, not hardcoded
- Auth-ready: built-in credential login with secure hashing, rate limits, and middleware protection
- Component-based: frontend blocks are modular and dynamically filled with content
- Deployment-agnostic: Vercel-ready, but portable to any platform
- Future-friendly: built with clean scripts and Prisma extensibility

---

## What's Included

- Next.js 15+ with App Router, server components, Tailwind CSS
- Sanity Studio v3 for content and layout management
- Prisma for flexible, schema-driven auth and future user roles
- Argon2 or bcrypt password hashing
- JWT-based session handling
- Rate-limited login with middleware protection
- Full media support (images, videos, SVGs, 3D files)

---

## Getting Started

1. Clone the repository

   git clone https://github.com/your-username/the-glass-house.git
   cd the-glass-house

2. Install dependencies

   npm install

3. Set up your environment

   Create a `.env.local` file and add values like:

   NEXT_PUBLIC_BASE_URL=http://localhost:3000  
   SANITY_PROJECT_ID=your-sanity-project-id  
   SANITY_DATASET=your-dataset-name  
   SANITY_API_VERSION=2023-05-22  
   SANITY_TOKEN=your-sanity-access-token  
   SANITY_WEBHOOK_SECRET=your-webhook-secret  
   NEXTAUTH_SECRET=your-random-string  
   NEXTAUTH_URL=http://localhost:3000

   Note: Your NEXTAUTH_SECRET should be a long, random string. Do not expose any values via NEXT_PUBLIC unless needed client-side.

4. Run the development server

   npm run dev

5. Open in your browser
   - Main site: http://localhost:3000
   - CMS Studio: http://localhost:3000/studio (login required)

---

## Authentication

- Auth is managed via NextAuth with a single admin account stored in the database
- Passwords are hashed using Argon2 or Bcrypt
- Sessions are JWT-based and scoped by middleware
- Rate limiting is applied on login to prevent brute force
- User creation is handled internally — no hardcoded users or env-based logins
- You can later extend to multi-user access with Prisma if needed

---

## Deployment

### Deploy to Vercel

1. Connect your GitHub repo to Vercel
2. Add the required environment variables in the Vercel dashboard
3. Trigger a deploy or run locally via CLI:

   npm run deploy

4. Once deployed, log in at /login, and manage content at /studio

### Self-host or Netlify

1. Make sure Node 18+ is installed
2. Set the same environment variables locally or in your host's dashboard
3. Build and start your app:

   npm run build  
   npm run start

---

## Available Scripts

- `dev` – Starts the local development server (custom entry via src/lib/dev.ts)
- `build` – Runs `prisma generate` and builds the Next.js app
- `start` – Runs the Next.js production server
- `lint` – Runs Next.js's built-in linter
- `type-check` – Runs TypeScript type checking only
- `setup` – Initializes an admin user in the database via CLI
- `deploy` – Deploys the app to Vercel production
- `deploy:preview` – Deploys the app to a Vercel preview environment

---

## Suggested Use Cases

- Developer portfolio with rich case study content
- AI-powered tools like VAELD with CMS-controlled UI
- Internal dashboards or gated tools
- Launchpad for new SaaS or product sites

---

## License

This project is currently unlicensed and under active development.  
For reuse or contribution, contact Luka Gray directly.

---

Maintained by Luka Gray.
