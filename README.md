# The Glass House

**The Glass House** is a next-generation modular page composition system for building sophisticated, interactive web experiences.  
It combines a CMS-first approach (Sanity), modern frontend (Next.js), and a unique, hierarchical architecture that empowers both developers and content editors to create anything from simple portfolios to immersive, app-like sites—without redeploys.

---

## System Architecture

The Glass House is built on a flexible, five-layer architecture:

```
Blueprints → Scaffolds → Wings → Modules → Elements
```

- **Blueprints:** Define what a page is, its route, and content source (e.g. blog post, landing page, error page).
- **Scaffolds:** Control the overall layout and spatial behavior (vertical stack, horizontal scroll, viewport step, etc).
- **Wings:** Organize modules within a scaffold—think columns, carousels, or full-screen sections.
- **Modules:** Reusable content blocks (galleries, forms, hero images, carousels, etc).
- **Elements:** The smallest building blocks—text, images, buttons, and more—that modules are composed from.

This hierarchy enables maximum flexibility, reusability, and editor control.

---

## Roadmap

**Phase 1: Foundation (In Progress)**

- [ ] **Element system:** In progress—building out a full library of elements (text, image, button, etc) with localization and accessibility
- [x] Modular schema for Sanity Studio
- [x] Secure authentication (NextAuth, Prisma)
- [x] Basic modules (hero, gallery, text block)
- [x] Theme and typography system

**Phase 2: Core**

- [ ] Wing and scaffold system for advanced layouts
- [ ] Dynamic page blueprints (routing, slugs, collection sources)
- [ ] Editor-friendly UI for composing pages

**Phase 3: Advanced**

- [ ] Interactive features (animations, scroll effects, parallax)
- [ ] Advanced modules (forms, 3D, Lottie, etc)
- [ ] Accessibility and performance enhancements

**Phase 4: Editor**

- [ ] Visual page builder interface
- [ ] Live preview and drag-and-drop editing
- [ ] Role-based access and collaboration

---

### Project Standards

- TypeScript everywhere, with strict type safety
- Linting and formatting enforced (ESLint, Prettier)
- Modular, maintainable, and well-documented code

---

_See [STRUCTURE.md](./STRUCTURE.md) for a full technical breakdown of every layer and type in the system._

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

   # Required for all environments

   NEXT_PUBLIC_BASE_URL=http://localhost:3000  
   SANITY_PROJECT_ID=your-sanity-project-id  
   SANITY_DATASET=your-dataset-name  
   SANITY_API_VERSION=2023-05-22  
   SANITY_TOKEN=your-sanity-access-token  
   NEXTAUTH_SECRET=your-random-string-at-least-32-characters
   DATABASE_URL=your-database-connection-string

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
