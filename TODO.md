# Project Roadmap and Tasks

This file tracks what's done, what's in progress, and what's next for this portfolio CMS.

## What's Done

- TypeScript strict mode and enforcement
- Sanity schemas organized and clean
- Prettier and ESLint on every commit
- Zod runtime data validation
- GitHub Actions lint and build checks
- Tailwind config with style purging
- Secret scanning to prevent leaks
- API authentication secure and tested
- Error boundaries and loading states
- Bundle analysis and optimization
- Environment variable validation with dotenv-safe
- Secure CLI-based admin setup
- Password hashing with bcrypt
- Rate limiting for all API routes
- Comprehensive API input and response validation
- Removed all console.error statements from API routes

## In Progress / Next Up

### High Priority

- Add Storybook for component development
- Add end-to-end tests (Playwright)
- Build shared component library
- Add type guards for dynamic rendering
- Improve Sanity Studio with better icons and previews
- Close all TODO comments in layout.tsx and [slug]/page.tsx
- Implement proper logging instead of console.log

### Medium Priority

- Optimize images and use Next.js Image everywhere
- Review caching and revalidation strategies
- Write CONTRIBUTING.md and dev guidelines
- Add performance monitoring
- Implement error logging and monitoring
- Optimize public assets to reduce bundle size
- Add basic test suite (Vitest or Jest)

### Low Priority

- Add dark mode toggle
- Implement advanced search
- Add analytics and user tracking
- Create admin dashboard
- Add multi-language support
- Implement advanced caching
- Add automated accessibility testing

## Technical Debt

- Create index files for better import organization
- Review and optimize bundle splitting
- Add comprehensive TypeScript types
- Implement error boundaries for major components
- Replace verbose tutorial comments with documentation
- Update Prisma migrations
- Implement image optimization pipeline
- Add service worker for offline functionality
- Optimize Sanity queries
- Add loading states for async operations
- Regular dependency updates and security audits
- Add proper CORS configuration
- Review and update CSP policies
- Implement proper session management
- Add audit logging for admin actions

## Architecture Improvements

- Abstract data layer behind repository pattern
- Modularize component library
- Implement tenant isolation
- Add configuration management
- Implement caching strategies (Redis, CDN)
- Add database connection pooling
- Optimize for horizontal scaling
- Add monitoring and alerting

## How to Help

- Open issues or pull requests for bugs
- Add improvement ideas to GitHub issues
- Follow existing code style and patterns
- Ensure changes pass linting and build checks
- Prioritize security fixes over features
- Add tests for new functionality

---

Last updated: 2025-06-23
