### High Priority

- [ ] Add error boundaries and improve error handling throughout the app
- [ ] Add loading states for all async operations
- [ ] Improve SEO meta tags and sitemap generation
- [ ] Audit and document all environment variables (keep .env.example up to date)
- [ ] Continue improving component flexibility and consistency (especially for content sections)
- [ ] Add more robust form validation and user feedback
- [ ] Ensure accessibility (a11y) best practices across all components
- [ ] Add more tests (unit, integration, and e2e)
- [ ] Look into Redis options

### Medium Priority

- [ ] Add dark mode toggle and theme improvements
- [ ] Optimize image handling and use Next.js Image everywhere
- [ ] Set up proper CI/CD pipeline for all environments
- [ ] Add performance monitoring and logging
- [ ] Add internationalization (i18n) support
- [ ] Improve search functionality
- [ ] Add more documentation and code comments

### Low Priority

- [ ] Add subtle animations and transitions for better UX
- [ ] Improve keyboard navigation and accessibility
- [ ] Add print styles and offline support
- [ ] Add social sharing and newsletter signup
- [ ] Add contact form and blog functionality

## Completed (2025-06-24)

- Improved VideoSection and ImageSection for better sizing, aspect ratio, and responsive behavior
- Bunny video integration is now fully working and reliable for all supported sources
- Fixed alignment, box shadow, and border radius issues for both video and image components
- Simplified overlay and hover logic for cleaner visuals
- Updated TextSection and other content components for consistency
- Created and documented a comprehensive .env.example file
- Cleaned up unused scripts and database CLI commands
- Removed user management endpoints from admin API route
- Updated ESLint and Prettier configs
- Improved README and onboarding instructions
- Ensured GitHub Actions and Vercel deploys only run on passing checks

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
