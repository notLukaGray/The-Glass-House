# TODO - Portfolio Website Improvements

## 🚨 **CRITICAL** (Must do first - prevents issues)

### **Easy**

- [x] **Strict TypeScript Configuration**

  - Flip `tsconfig.json` to `"strict": true`
  - Fix any remaining type issues that emerge
  - Add `noUnusedLocals` and `noUnusedParameters`
  - **Why**: Prevents bugs early, makes everything else safer

- [x] **Sanity Schema Organization**

  - Combine scattered schema arrays into single `schemaTypes/index.ts`
  - Fix "symbol has already been declared" build errors
  - Add proper exports and imports
  - **Why**: Prevents build failures, cleaner architecture

- [x] **Prettier + Pre-commit Hook**
  - Install Prettier: `npm install --save-dev prettier`
  - Add `.prettierrc` with consistent formatting rules
  - Install Husky: `npm install --save-dev husky lint-staged`
  - Set up pre-commit hook to run Prettier + ESLint
  - **Why**: Eliminates formatting debates, ensures consistent code

### **Hard**

- [ ] **Runtime Data Validation with Zod**
  - Install Zod: `npm install zod`
  - Create validation schemas for Sanity data
  - Add validation to all data fetching functions
  - Create fallback `<MissingModule />` component
  - **Why**: Prevents runtime errors from schema mismatches

## 🔧 **PRIORITY** (High impact, enables other work)

### **Easy**

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

### **Hard**

- [ ] **Storybook Setup** (Makes component work much easier)
  - Install Storybook: `npx storybook@latest init`
  - Create stories for key components
  - Set up visual regression testing
  - **Why**: Safer UI changes, easier component development, prevents regressions

## 🎯 **CORE** (Essential for maintainability)

### **Easy**

- [x] **Component Conventions**

  - Choose: PascalCase.tsx vs index.tsx-in-folder
  - Install eslint-plugin-simple-import-sort
  - Enforce consistent import ordering
  - **Why**: Cleaner codebase, easier navigation

- [x] **API Route Security**

  - Add unit tests for `/api/auth` route
  - Test with mock user data
  - Add proper error handling and validation
  - **Why**: Ensures authentication doesn't break silently

- [ ] **Basic E2E Testing**
  - Install Playwright: `npm install --save-dev @playwright/test`
  - Create basic happy-path test (visit /, expect hero text)
  - Add test to CI pipeline
  - **Why**: Catches routing and rendering issues

### **Hard**

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

## ✨ **POLISH** (Nice to have, improves experience)

### **Easy**

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

### **Hard**

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

## 📚 **DOCUMENTATION** (When you have time)

### **Easy**

- [x] **API Documentation**
  - Document all API routes
  - Add JSDoc comments to key functions
  - Create API usage examples
  - **Why**: Easier maintenance and onboarding

### **Hard**

- [ ] **Development Guidelines**
  - Create CONTRIBUTING.md
  - Document component patterns
  - Add code style guidelines
  - **Why**: Consistent development practices

## 🎯 **RECOMMENDED ORDER FOR TOMORROW**

### **Morning (Priority Easy)**

1. GitHub Actions CI/CD
2. PurgeCSS Configuration
3. Secret Scanning

### **Afternoon (Priority Hard + Core Easy)**

4. Storybook Setup (makes everything else easier)
5. Runtime Data Validation with Zod
6. Basic E2E Testing

### **Future Sessions**

- Core Hard items
- Polish items as needed
- Documentation when you have time

## ✅ **COMPLETED TODAY**

### **Major Infrastructure & Security**

- ✅ **NextAuth Integration & Security**
  - Fixed missing SessionProvider causing CLIENT_FETCH_ERROR
  - Resolved middleware conflicts intercepting /api/auth calls
  - Moved NextAuth API handler to correct location (`[...nextauth]`)
  - Fixed environment variable corruption issues
  - Added rate limiting to NextAuth authorize function
  - Implemented proper password hashing and validation
  - Created comprehensive auth utilities with bcrypt

- ✅ **Error Handling & Resilience**
  - Created global React ErrorBoundary component
  - Improved error messages and user feedback
  - Added proper error handling throughout codebase
  - Implemented fallback mechanisms for failed data fetches

- ✅ **Code Quality & Formatting**
  - Integrated Prettier with ESLint for consistent formatting
  - Applied strict linting rules with zero warnings/errors
  - Cleaned up comments and improved code organization
  - Fixed all TypeScript strict mode issues

### **Documentation & Architecture**

- ✅ **Comprehensive Documentation**
  - Added detailed JSDoc comments to ~20 core files
  - Documented all API routes with validation and error handling
  - Created human-like documentation explaining architecture decisions
  - Covered ~70-80% of critical logic with detailed explanations
  - Documented security considerations and performance optimizations

- ✅ **Backend Infrastructure Optimization**
  - Consolidated redundant API routes (SVG, image, video → single dynamic route)
  - Created shared Sanity client utility to eliminate duplication
  - Implemented shared SVG normalization utility
  - Removed test pages and debug routes (development cruft)
  - Optimized portfolio queries and data fetching patterns

### **Code Cleanup & Optimization**

- ✅ **Removed Redundancies**
  - Deleted legacy hash-passwords.js script
  - Removed unused password variables
  - Consolidated asset handling into single dynamic route
  - Eliminated duplicate Sanity client creation across routes
  - Removed special test page handling

- ✅ **Type Safety & Performance**
  - Fixed TypeScript strict overload issues in Sanity client
  - Applied precise type assertions to bypass overload checking
  - Ensured all API routes use shared utilities
  - Maintained generic type safety throughout optimizations

### **GitHub & Deployment**

- ✅ **Repository Management**
  - Successfully pushed clean codebase to GitHub
  - Verified no AI references in codebase (clean search results)
  - Committed 166 files with comprehensive improvements
  - Repository: `https://github.com/notLukaGray/portfolio.git`

### **Files Created/Modified**

- ✅ **New Files**: ErrorBoundary, SessionProviderWrapper, auth utilities, shared clients
- ✅ **Modified**: All API routes, data handlers, authentication system
- ✅ **Deleted**: Legacy scripts, redundant routes, test pages
- ✅ **Documented**: Complete backend infrastructure with JSDoc

---

**Note**: The Critical and Priority items will give you the most stability and prevent future issues. Storybook is marked as Priority Hard because it will make all future component work much easier and safer.
