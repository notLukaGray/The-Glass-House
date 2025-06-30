# Changelog

This file lists the main changes and improvements to The Glass House. It's here so you can see what's new, what's fixed, and what's changed over time.

## 2025-06-30

### Major Feature: Glass Localization System

- **Complete Localization Overhaul**: Implemented a dynamic, foundation-based localization system that replaces Sanity's built-in localization with a custom, flexible solution
- **Foundation Schema**: Created `foundation` document type for core system settings including configurable language options
- **Dynamic Language Management**: Users can now add/remove languages through the foundation settings, with all localization fields automatically updating
- **Custom Field Types**: Implemented three new custom Sanity field types:
  - `glassLocaleString`: For localized string fields (titles, labels, etc.)
  - `glassLocaleText`: For localized text areas (descriptions, captions, etc.)
  - `glassLocaleRichText`: For localized rich text content with Portable Text
- **Runtime Dynamic Components**: Created custom React components that fetch foundation settings at runtime and dynamically render language fields
- **TypeScript Integration**: Full TypeScript support with proper typing for all localization utilities and components
- **Schema Integration**: Updated all element schemas (button, image, rich text, etc.) to use the new localization system
- **Utility Functions**: Built comprehensive utility functions for reading foundation settings and generating dynamic field configurations
- **Studio Integration**: Integrated foundation schema into Sanity Studio desk structure under Settings section

### Technical Improvements

- **Code Quality**: Fixed all TypeScript linting errors, removed unused imports, and ensured proper type safety throughout
- **Performance**: Optimized component rendering with proper dependency arrays and equality checks
- **Error Handling**: Fixed schema errors and runtime issues including undefined type props and missing field properties
- **Build Success**: All files pass ESLint and Prettier formatting, with successful development server startup

### Schema Enhancements

- **Button Schema**: Enhanced with configurable dropdowns for type, variant, and size with proper default values
- **Rich Text Schema**: Implemented true dynamic localization with multiple language fields created based on foundation settings
- **Image Schema**: Fixed preview configuration and added proper localization support
- **Base Element Schema**: Updated to support the new localization system while maintaining backward compatibility

### Development Experience

- **Auto-Generation**: Improved ARIA label and alt text auto-generation with better deep equality checks
- **Conditional Fields**: Enhanced conditional visibility logic for media and text fields
- **Field Organization**: Improved field ordering and default value references for better UX
- **Studio UX**: Better organization of fields and improved user experience in Sanity Studio

### Critical Security Fixes (2025-06-25)

- **Fixed client-side secret exposure**: Removed `env` object from `next.config.mjs` that was bundling `SANITY_TOKEN` and other secrets into the client-side JavaScript bundle. All secrets now only accessed server-side.
- **Database connection optimization**: Implemented PrismaClient singleton pattern to prevent connection pool exhaustion during development hot reloads and production scaling.
- **Password input security**: Replaced `readline` with `prompt-sync` in admin CLI setup to hide password input when typing, preventing shoulder surfing attacks.
- **Performance improvement**: Migrated from `bcryptjs` (JavaScript implementation) to native `bcrypt` for faster and more secure password hashing.

- **Removed deprecated config:**
  - Deleted `devIndicators` from `next.config.mjs` (removed in Next.js 13.5+, only triggers warnings).

- **Environment variable validation:**
  - Replaced custom environment validation with `envalid` in `src/lib/env.ts` for type-safe, declarative, and user-friendly env checks.
  - The app now fails fast and clearly if required environment variables are missing or malformed.

- **Explicit crypto import:**
  - Updated `src/lib/auth/utils.ts` to explicitly import `randomUUID` from `crypto` and use it in `generateSessionId`.
  - Ensures compatibility with all Node.js and Edge runtimes.

- **Prisma postinstall automation:**
  - Added `"postinstall": "prisma generate"` to `package.json` scripts.
  - Guarantees Prisma client is always generated after dependency install, preventing missing-client errors on fresh clones or CI.

- **Testing infrastructure setup:**
  - Added Vitest, Testing Library, and comprehensive test configuration with proper Next.js mocks.
  - Created `vitest/` directory structure with verification tests and API route tests.
  - Implemented proper test setup with Next.js router and image mocks for reliable component testing.
  - Added test scripts to package.json for development and CI integration.

- **Caching implementation:**
  - Added ISR (Incremental Static Regeneration) with `revalidate` to key Sanity API routes for improved performance.
  - Fixed Sanity middleware matcher to exclude all studio routes, preventing conflicts with caching.
  - Implemented proper cache headers and revalidation strategies for content API endpoints.

### Major Improvements (2025-06-24)

- **Component Enhancements:**
  - Improved VideoSection and ImageSection for better sizing, aspect ratio, and responsive behavior.
  - Bunny video integration is now fully working and reliable for all supported sources.
  - Fixed alignment, box shadow, and border radius issues for both video and image components.
  - Simplified overlay and hover logic for cleaner visuals and easier maintenance.
  - Updated TextSection and other content components for consistency and flexibility.

- **Environment & Setup:**
  - Created a comprehensive `.env.example` file with all required variables and clear instructions.
  - Ensured `.env.example` is tracked in git and available for CI and new developers.
  - Audited and documented all environment variables used throughout The Glass House.
  - Improved install and setup instructions in the README for a smoother onboarding experience.

- **Script & Tooling Cleanup:**
  - Removed unused database scripts for deleting, listing, and counting users.
  - Kept only the essential setup script for initializing the admin user and database.
  - Cleaned up related CLI and database files to remove unnecessary code.
  - Updated ESLint and Prettier configs for consistency and code quality.

- **API & User Management:**
  - Removed user management endpoints (list/delete) from the admin API route for security and simplicity.
  - Kept only user creation, password update, and role update actions for admin setup.

- **Continuous Integration & Deployment:**
  - Ensured GitHub Actions workflows run lint and build checks on every push and pull request.
  - Updated project and Vercel settings to require passing checks before deployment.
  - Added guidance for setting up branch protection and required checks on GitHub.

- **General Cleanup:**
  - Improved documentation and removed outdated references.
  - Streamlined project structure and removed unnecessary files.

## 2025-06-23

### Bug Fixes

- **CSP Violations**: Fixed Content Security Policy to allow external domains (GitHub API, Unsplash, W3Schools, Cloudinary)
- **Build Errors**: Resolved missing Sanity chunks in build by cleaning cache and reinstalling dependencies
- **Environment Variables**: Improved Sanity environment variable configuration and validation
- **Next.js 15 Compatibility**: Added proper error and not-found pages for Next.js 15+ app router
- **Code Formatting**: Fixed all Prettier and ESLint formatting issues throughout the codebase
- **Node.js Compatibility**: Added engines specification to enforce Node.js 20+ and npm 10+ for Vercel deployment

### Improvements

- **Package Updates**: Updated all packages to latest compatible versions
- **Error Handling**: Added comprehensive error pages with proper navigation
- **Build Process**: Improved build reliability and dependency management
- **Security**: Enhanced CSP configuration for better security while allowing required external resources

### Technical Details

- Added `src/app/error.tsx` and `src/app/not-found.tsx` for proper error handling
- Updated `package.json` with engines field for Node.js version enforcement
- Fixed import formatting and TypeScript type issues
- Resolved all linting warnings and errors
- Improved build cache management

## 2025-06-22

### Major Infrastructure Overhaul

- **Homepage Restoration**: Fixed DotGrid, TextPressure, and all features with proper CSP and settings fallbacks
- **Build System**: Added Prisma generate to build script for Vercel deployment
- **Next.js 15**: Fixed async params in dynamic route pages for Next.js 15 compatibility
- **Package Management**: Regenerated package-lock.json with clean npm cache
- **Deployment**: Triggered fresh Vercel deployment with infrastructure improvements

### Database & Authentication

- **Complete Infrastructure Overhaul**: Database auth, admin system, deployment automation
- **GitHub Actions**: Added CI/CD workflow for automated deployments
- **Dependencies**: Optimized dependencies and enhanced build infrastructure
- **Backend Infrastructure**: Clean, documented, and optimized backend infrastructure

## 2025-06-21

### Major Refactor

- **Strict Linting**: Implemented comprehensive ESLint and TypeScript rules
- **Type Safety**: Enhanced type safety throughout the application
- **Modular Data Layer**: Reorganized data handling for better maintainability
- **SSR/Client Separation**: Improved server-side rendering and client-side code separation
- **Theme System**: Fixed theme-related issues and improved theme handling
- **Error Handling**: Added comprehensive error handling throughout the application

## 2025-06-20

### Production Readiness

- **GitHub Integration**: Refactored GitHub API calls to work directly from server components
- **Build Configuration**: Updated build configuration and fixed all build issues
- **API Routes**: Implemented secure server-side API routes for all data fetching
- **Handler System**: Complete handler system refactor with type safety
- **Page Updates**: Updated all pages to use new API routes and handlers
- **Studio Configuration**: Updated Sanity Studio configuration and layout
- **Code Cleanup**: Removed old file structure and legacy code

### Diagnostic & Debugging

- Added diagnostic logging for Vercel debugging
- Fixed unused imports in GitHub API route

## 2025-06-18

### Environment & Build Fixes

- **Environment Variables**: Fixed environment variables and added support for NEXT*PUBLIC* Sanity env vars
- **Build Process**: Disabled ESLint and TypeScript checks during build to resolve build issues
- **Dependencies**: Fixed dependency issues and conflicts
- **Theme System**: Implemented theme system and improved loading experience
- **ESLint Configuration**: Added ESLint configuration to handle linting errors

## 2025-06-16

### Project Structure & Sanity Integration

- **Project Reorganization**: Renamed test to gallery, moved components showcase to \_components
- **Sanity Schemas**: Refactored Sanity schemas, Studio UI, and frontend for modular sections
- **Asset Handling**: Improved asset handling and editor UX
- **Custom Desk Structure**: Added logical sidebar grouping (Content, Assets, Settings, Sections)
- **Section Management**: Moved pageSections to reusable section document type
- **Frontend Updates**: Dereference and flatten section references, render all section objects
- **Portable Text**: Implemented @portabletext/react with custom block/asset handlers

## 2025-06-15

### Major Framework Updates

- **Tailwind v4 Migration**: Migrated to official Tailwind v4.1+ setup with postcss.config.mjs
- **Next.js 15 Compatibility**: Fixed dynamic route params and null state handling
- **Type Safety**: Ensured all asset and section types are type-safe
- **Build Configuration**: Updated package.json and lock for latest dependencies
- **Component System**: Fixed PortfolioSectionRenderer and home page for Tailwind compatibility

### Authentication & Performance

- **Revalidation**: Added revalidation and optimize Sanity client
- **TypeScript Types**: Added proper TypeScript types for Sanity components
- **Section Mapping**: Ensured all section components are properly mapped
- **Login System**: Fixed login page with Suspense wrapper for Next.js 15+ compatibility

### Development Experience

- **Build Relaxation**: Temporarily relaxed TypeScript and ESLint build errors for Vercel deploy
- **Homepage Updates**: Updated homepage with timer and commit message
- **Component Properties**: Enhanced components and Tailwind properties

## 2025-06-14

### Project Foundation

- **Initial Setup**: Created Next.js portfolio with Sanity CMS and NextAuth
- **Project Documentation**: Updated README with project details and setup instructions
- **License**: Updated LICENSE file
- **Authentication**: Enforced auth for locked portfolios, added caching, and updated auth export
- **Portfolio System**: Implemented secure portfolio access with authentication requirements

---

If you want to see more details or older changes, check the commit history on GitHub.
