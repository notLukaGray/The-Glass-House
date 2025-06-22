# TODO - Portfolio Website Improvements

## 🚨 **CRITICAL** (Must do first - prevents issues)

### **Easy**

- [ ] **Strict TypeScript Configuration**

  - Flip `tsconfig.json` to `"strict": true`
  - Fix any remaining type issues that emerge
  - Add `noUnusedLocals` and `noUnusedParameters`
  - **Why**: Prevents bugs early, makes everything else safer

- [ ] **Sanity Schema Organization**

  - Combine scattered schema arrays into single `schemaTypes/index.ts`
  - Fix "symbol has already been declared" build errors
  - Add proper exports and imports
  - **Why**: Prevents build failures, cleaner architecture

- [ ] **Prettier + Pre-commit Hook**
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

- [ ] **Component Conventions**

  - Choose: PascalCase.tsx vs index.tsx-in-folder
  - Install eslint-plugin-simple-import-sort
  - Enforce consistent import ordering
  - **Why**: Cleaner codebase, easier navigation

- [ ] **API Route Security**

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

- [ ] **Loading States & Error Boundaries**
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

- [ ] **API Documentation**
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

### **Morning (Critical + Priority Easy)**

1. Strict TypeScript Configuration
2. Sanity Schema Organization
3. Prettier + Pre-commit Hook
4. GitHub Actions CI/CD
5. PurgeCSS Configuration

### **Afternoon (Priority Hard + Core Easy)**

6. Storybook Setup (makes everything else easier)
7. Runtime Data Validation with Zod
8. Component Conventions
9. API Route Security

### **Future Sessions**

- Core Hard items
- Polish items as needed
- Documentation when you have time

## ✅ **COMPLETED TODAY**

### **Major Infrastructure**

- ✅ Re-enabled strict linting and type checking
- ✅ Fixed all TypeScript errors across codebase
- ✅ Resolved circular dependency issues
- ✅ Implemented proper server/client data fetching separation
- ✅ Created modular data layer (`src/_lib/data/`)
- ✅ Separated server-side and client-side handlers
- ✅ Fixed SSL protocol errors in client-side fetching
- ✅ Enhanced theme system with proper initialization
- ✅ Added comprehensive error handling and fallback mechanisms

### **Code Quality**

- ✅ Removed unused interfaces and variables
- ✅ Fixed explicit `any` types with proper annotations
- ✅ Cleaned up unused parameters in API routes
- ✅ Enhanced TypeScript strict mode compliance
- ✅ All ESLint rules passing
- ✅ Production build successful

### **Architecture**

- ✅ Updated all pages to use server-side data fetching during SSR
- ✅ Fixed component-test page to avoid circular dependencies
- ✅ Enhanced portfolio pages with proper asset handling
- ✅ Improved user page with better type safety
- ✅ Added performance monitoring components

### **Files Created/Modified**

- ✅ Created 15+ new files for data layer and handlers
- ✅ Modified 20+ existing files for better architecture
- ✅ Added comprehensive CHANGELOG.md
- ✅ Updated TODO.md with organized roadmap

---

**Note**: The Critical and Priority items will give you the most stability and prevent future issues. Storybook is marked as Priority Hard because it will make all future component work much easier and safer.
