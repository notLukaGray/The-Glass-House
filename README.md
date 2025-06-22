# Portfolio CMS

A modern, modular portfolio and content management system built with **Next.js 15+** and **Sanity Studio v3**.

## Features

- ⚡️ **Next.js 15+** (App Router, server components, Tailwind CSS)
- 🗂️ **Sanity Studio v3** for content management
- 🧩 **Modular, dynamic sections** for portfolio and pages
- 🖼️ **Asset handling** for images, SVGs, videos, and 3D models
- 🔒 **Secure authentication** (bcrypt hashing, rate limiting, input validation)
- 🛡️ **Role-based access control** (admin/user roles)
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
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```

4. **Create secure user accounts:**

   ```sh
   node scripts/hash-passwords.js
   ```

   This will prompt you for user details and output a secure AUTH_USERS configuration.

5. **Run the dev server:**

   ```sh
   npm run dev
   ```

6. **Access the app:**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - CMS: [http://localhost:3000/studio](http://localhost:3000/studio) (admin login required)

## Security Features

### Authentication

- **Password hashing** with bcrypt (12 salt rounds)
- **Rate limiting** (5 attempts per 15 minutes)
- **Input validation** (username/password requirements)
- **Session management** with JWT tokens
- **Role-based access control**

### Protection

- **Middleware protection** for admin routes
- **API route security** with authentication checks
- **CSRF protection** (built into NextAuth)
- **Secure session handling**

### Best Practices

- **Never commit `.env.local`** or secrets to GitHub
- **Use strong passwords** (minimum 8 chars, letters + numbers)
- **Rotate passwords regularly**
- **Monitor login attempts** in production logs

## Authentication Setup

### Creating Users

1. Run the password hashing script:

   ```sh
   node scripts/hash-passwords.js
   ```

2. Follow the prompts to create a user account

3. Copy the generated AUTH_USERS configuration to your `.env.local`

### User Roles

- **admin**: Full access to Sanity Studio and protected routes
- **user**: Basic authenticated access

### Environment Variables

```env
# Required for authentication
NEXTAUTH_SECRET=your-32-character-secret
AUTH_USERS=[{"id":"1","name":"Admin","username":"admin","password":"$2a$12$...","role":"admin","createdAt":"2024-01-01T00:00:00.000Z"}]
```

## Deployment

- Deploy to Vercel, Netlify, or your own server
- Make sure to set all environment variables in your deployment platform
- Use a strong NEXTAUTH_SECRET in production
- Consider using a database for user management in production

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `node scripts/hash-passwords.js` - Create secure user accounts

### Authentication Hooks

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

function MyComponent() {
  const { isAuthenticated, isAdmin, login, logout } = useAuth();

  // Use authentication utilities
}
```

### Protected Routes

```tsx
// Server-side protection
const session = await getServerSession(authOptions);
if (!session) {
  redirect("/login");
}

// Client-side protection
const { requireAuth, requireRole } = useAuth();
requireRole("admin", () => {
  // Admin-only code
});
```

## License

MIT (or your preferred license)

---

**Made with ❤️ by Luka Gray**
