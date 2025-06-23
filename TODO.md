# Project Roadmap and Tasks

This file tracks what's done, what's in progress, and what's next for this portfolio CMS. If you're contributing or just curious, here's where things stand.

## What's Done

### Core Infrastructure

- TypeScript is strict and enforced
- Sanity schemas are organized and clean
- Prettier and ESLint run on every commit
- Zod is used for runtime data validation
- GitHub Actions runs lint and build checks on every PR
- Tailwind config is set up to purge unused styles
- Secret scanning is in place to prevent leaks
- API authentication is secure and tested
- Error boundaries and loading states are in place
- Bundle analysis and optimization are done
- Most documentation is up to date

### Recent Accomplishments (2024-2025)

- Fixed Sanity environment variable validation and error handling
- Resolved Next.js image domain configuration issues
- Fixed Content Security Policy (CSP) violations and domain allowlisting
- Updated CSP to include all required external domains (GitHub API, Unsplash, W3Schools, Cloudinary)
- Performed comprehensive code audit and cleanup
- Removed duplicate utility functions and centralized sanitization
- Eliminated redundant re-exports and over-engineered lazy loading
- Restored and updated component-test directory with current asset handlers
- Reorganized component structure (moved performance components to features, ErrorBoundary to layout)
- Removed all .DS_Store files from project structure
- Fixed all import paths and build issues
- Verified linting and build processes are working correctly

### Code Quality Improvements

- Centralized Sanity client with automatic data sanitization
- Removed manual sanitization from API routes (now handled automatically)
- Cleaned up duplicate utility functions
- Improved component organization and logical grouping
- Fixed all TypeScript and ESLint errors
- Optimized import structure and removed unused dependencies

## Critical Security Issues (Fix Immediately)

### Authentication & Authorization

- **Default Admin Creation**: `ensureDefaultAdmin()` auto-creates admin/admin123 and logs credentials - anyone hitting /api/setup owns the site
  - Make first-run flow interactive
  - Pull default credentials from environment variables
  - Lock the setup route after successful initialization
- **Password Storage**: Password field still plain String in Prisma schema
  - Enforce hashing before database insert
  - Annotate model with `@map("password_hash")` to prevent raw value queries
  - Implement proper password validation and strength requirements

### Rate Limiting & Security

- **In-Memory Rate Limiting**: Current Map-based limiter crashes on server restarts and ignores multi-instance deployments
  - Replace with Redis-backed rate limiter
  - Or implement NextAuth's built-in throttling
  - Add proper rate limiting to all API routes
- **Secret Management**: Environment variables lack validation and rotation
  - Add dotenv-safe to prevent booting without required secrets
  - Rotate all sample secrets in documentation
  - Implement secret rotation strategy
  - Add environment variable validation on startup

### Type Safety & Edge Runtime

- **Edge Runtime Compatibility**: Prisma client not edge-safe in edge routes
  - Bundle lightweight driver (neon-serverless or drizzle-edge)
  - Or move edge routes to Node runtime
  - Ensure all edge functions are properly typed

## In Progress / Next Up

### High Priority

- Add Storybook for component development and visual testing
- Add basic end-to-end tests (Playwright or similar)
- Build a shared component library (Button, Card, etc.)
- Add type guards for all dynamic rendering
- Improve Sanity Studio with better icons, previews, and field descriptions
- **Close all TODO comments** in layout.tsx, [slug]/page.tsx, and generated Prisma types
- **Add comprehensive error handling** with typed error responses for all API routes
- **Implement proper logging** instead of console.log statements

### Medium Priority

- Optimize all images and use Next.js Image everywhere
- Review and improve caching and revalidation strategies
- Write CONTRIBUTING.md and more dev guidelines
- Add performance monitoring in production
- Implement proper error logging and monitoring
- **Optimize public assets** (fonts, SVGs) to reduce bundle size
- **Add basic test suite** (Vitest or Jest) for critical functionality

### Low Priority / Future Enhancements

- Add dark mode toggle functionality
- Implement advanced search functionality
- Add analytics and user behavior tracking
- Create admin dashboard for content management
- Add multi-language support
- Implement advanced caching strategies
- Add automated accessibility testing

## Technical Debt & Maintenance

### Code Organization

- Consider creating index files for better import organization
- Review and optimize bundle splitting
- Add more comprehensive TypeScript types
- Implement proper error boundaries for all major components
- **Replace verbose tutorial comments** with maintainable documentation
- **Update Prisma migrations** - current ones dated 20250623 suggest they were generated once and never revisited

### Performance

- Implement proper image optimization pipeline
- Add service worker for offline functionality
- Optimize Sanity queries for better performance
- Add proper loading states for all async operations
- **Optimize bundle size** - public fonts and SVGs are unoptimized

### Security

- Regular dependency updates and security audits
- Implement rate limiting for API routes
- Add proper CORS configuration
- Review and update CSP policies regularly
- **Add input validation** for all user inputs
- **Implement proper session management**
- **Add audit logging** for admin actions

## Architecture Improvements

### Multi-Tenant Support

- Abstract data layer behind repository pattern
- Modularize component library for reusability
- Implement tenant isolation and data separation
- Add configuration management for different brands/sites

### Scalability

- Implement proper caching strategies (Redis, CDN)
- Add database connection pooling
- Optimize for horizontal scaling
- Add monitoring and alerting infrastructure

## How to Help or Suggest

- If you spot a bug or want to help, open an issue or pull request
- If you have ideas for improvements, add them here or in GitHub issues
- Follow the existing code style and patterns
- Ensure all changes pass linting and build checks
- **Prioritize security fixes** over feature development
- **Add tests** for any new functionality

## Progress Summary

The core infrastructure is solid and production-ready. Recent work has significantly improved code quality, security, and maintainability. However, critical security vulnerabilities need immediate attention before production deployment. The focus should be on security hardening, testing, and developer experience improvements.

---

Last updated: 2025-06-23
