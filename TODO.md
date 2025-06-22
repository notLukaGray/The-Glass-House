# TODO - Portfolio Website Improvements

## CRITICAL (Must do first - prevents issues)

### Easy

- [x] **Strict TypeScript Configuration**

  - Flip `tsconfig.json` to `"strict": true`
  - Fix any remaining type issues that emerge
  - Add `noUnusedLocals` and `noUnusedParameters`
  - **Why**: Prevents bugs early, makes everything else safer
  - **Completed**: Zero TypeScript errors, strict mode enabled

- [x] **Sanity Schema Organization**

  - Combine scattered schema arrays into single `schemaTypes/index.ts`
  - Fix "symbol has already been declared" build errors
  - Add proper exports and imports
  - **Why**: Prevents build failures, cleaner architecture
  - **Completed**: Clean architecture, no build errors

- [x] **Prettier + Pre-commit Hook**
  - Install Prettier: `npm install --save-dev prettier`
  - Add `.prettierrc` with consistent formatting rules
  - Install Husky: `npm install --save-dev husky lint-staged`
  - Set up pre-commit hook to run Prettier + ESLint
  - **Why**: Eliminates formatting debates, ensures consistent code
  - **Completed**: Consistent formatting, zero lint warnings

### Hard

- [ ] **Runtime Data Validation with Zod**
  - Install Zod: `npm install zod`
  - Create validation schemas for Sanity data
  - Add validation to all data fetching functions
  - Create fallback `<MissingModule />` component
  - **Why**: Prevents runtime errors from schema mismatches

## PRIORITY (High impact, enables other work)

### Easy

- [ ] **GitHub Actions CI/CD**

  - Create `.github/workflows/ci.yml`
  - Run `npm run lint && npm run build` on every PR
  - Cache `.next/cache` for faster builds
  - **Why**: Prevents broken code from being merged

- [ ] **PurgeCSS Configuration**

  - Update `tailwind.config.js` content paths
  - Add all component folders to content array
  - Test that unused classes are purged in production
  - **Why**: Smaller bundle sizes, better performance

- [ ] **Secret Scanning**
  - Install git-secrets or similar
  - Add pre-commit hook to scan for secrets
  - Move hardcoded AUTH_USERS to environment variables
  - **Why**: Prevents accidental secret commits

### Hard

- [ ] **Storybook Setup** (Makes component work much easier)
  - Install Storybook: `npx storybook@latest init`
  - Create stories for key components
  - Set up visual regression testing
  - **Why**: Safer UI changes, easier component development, prevents regressions

## CORE (Essential for maintainability)

### Easy

- [x] **Component Conventions**

  - Choose: PascalCase.tsx vs index.tsx-in-folder
  - Install eslint-plugin-simple-import-sort
  - Enforce consistent import ordering
  - **Why**: Cleaner codebase, easier navigation
  - **Completed**: Clean codebase organization

- [x] **API Route Security**

  - Add unit tests for `/api/auth` route
  - Test with mock user data
  - Add proper error handling and validation
  - **Why**: Ensures authentication doesn't break silently
  - **Completed**: NextAuth with rate limiting, proper validation

- [ ] **Basic E2E Testing**
  - Install Playwright: `npm install --save-dev @playwright/test`
  - Create basic happy-path test (visit /, expect hero text)
  - Add test to CI pipeline
  - **Why**: Catches routing and rendering issues

### Hard

- [ ] **Shared Component Library**

  - Create `SectionWrapper` component for consistent spacing
  - Add animation entry and breakpoint handling
  - Create reusable UI components (Button, Card, etc.)
  - **Why**: Reduces repetition, ensures consistency

- [ ] **Type Guards for Rendering**
  - Add proper `_type` guards in component loops
  - Make render switches 100% type-safe
  - Add exhaustive type checking
  - **Why**: Prevents runtime errors, better DX

## POLISH (Nice to have, improves experience)

### Easy

- [ ] **Tailwind Design System Lock-in**

  - Move all design tokens to `tailwind.config.js`
  - Define custom colors, fonts, spacing in config
  - Remove ad-hoc hex codes from components
  - Add typography plugin for rich text
  - **Why**: Consistent design, easier maintenance

- [ ] **Sanity Studio Improvements**

  - Add icons and previews to schema fields
  - Improve drag/drop experience
  - Add better field descriptions and validation
  - **Why**: Better content management experience

- [x] **Loading States & Error Boundaries**
  - Add loading states to all async operations
  - Improve error boundaries and fallback UI
  - Add keyboard navigation support
  - **Why**: Better user experience
  - **Completed**: Global ErrorBoundary, improved error handling

### Hard

- [ ] **Bundle Analysis & Optimization**

  - Install `@next/bundle-analyzer`
  - Analyze production bundle size
  - Identify and optimize large dependencies
  - **Why**: Better performance, smaller bundles

- [ ] **Image Optimization**

  - Review all image components
  - Ensure proper Next.js Image usage
  - Add loading strategies and placeholders
  - **Why**: Better Core Web Vitals

- [ ] **Caching Strategy**
  - Review and optimize caching headers
  - Add proper revalidation strategies
  - Implement ISR where appropriate
  - **Why**: Better performance and SEO

## DOCUMENTATION (When you have time)

### Easy

- [x] **API Documentation**
  - Document all API routes
  - Add JSDoc comments to key functions
  - Create API usage examples
  - **Why**: Easier maintenance and onboarding
  - **Completed**: ~20 files documented, ~70-80% coverage

### Hard

- [ ] **Development Guidelines**
  - Create CONTRIBUTING.md
  - Document component patterns
  - Add code style guidelines
  - **Why**: Consistent development practices

## RECOMMENDED ORDER FOR TOMORROW

### Morning (Priority Easy)

1. GitHub Actions CI/CD
2. PurgeCSS Configuration
3. Secret Scanning

### Afternoon (Priority Hard + Core Easy)

4. Storybook Setup (makes everything else easier)
5. Runtime Data Validation with Zod
6. Basic E2E Testing

### Future Sessions

- Core Hard items
- Polish items as needed
- Documentation when you have time

## PROGRESS SUMMARY

**Completed**: 6/15 items (40%)

- All Critical items (3/3) - 100%
- Core Easy items (2/3) - 67%
- Polish Easy items (1/3) - 33%
- Documentation Easy items (1/1) - 100%

**Remaining**: 9 items

- Priority items (3) - GitHub Actions, PurgeCSS, Secret Scanning
- Core items (3) - E2E Testing, Component Library, Type Guards
- Polish items (5) - Design System, Studio Improvements, Bundle Analysis, Image Optimization, Caching
- Documentation items (1) - Development Guidelines

---

**Note**: The Critical and Priority items will give you the most stability and prevent future issues. Storybook is marked as Priority Hard because it will make all future component work much easier and safer.
