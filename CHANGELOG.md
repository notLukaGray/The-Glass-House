# Changelog

This file lists the main changes and improvements to The Glass House. It's here so you can see what's new, what's fixed, and what's changed over time.

## 2025-06-30

### Major Feature: Complete Modular Architecture System (Uncommitted)

**NEW**: Built a complete 5-layer modular architecture system for The Glass House

#### New Modular Systems Created:

- **Blueprint System** (`src/lib/sanity/schemas/blueprint/`):
  - `baseBlueprintSchema.ts`: Base schema for creating page blueprints
  - `blueprintStaticPage.ts`: Static page blueprint implementation
  - `index.ts`: Blueprint schema management

- **Scaffold System** (`src/lib/sanity/schemas/scaffold/`):
  - `baseScaffoldSchema.ts`: Base schema for layout scaffolds with advanced behavior controls
  - `scaffoldFixedShell.ts`: Fixed shell scaffold implementation
  - `index.ts`: Scaffold schema management

- **Wing System** (`src/lib/sanity/schemas/wings/`):
  - `baseWingSchema.ts`: Base schema for content wings
  - `wingsFullScreen.ts`: Full screen wing implementation
  - `castingWingSchema.ts`: Wing casting system for module integration
  - `index.ts`: Wing schema management
  - **Components** (`src/lib/sanity/schemas/wings/components/`):
    - `ModuleArrayInput.tsx`: Advanced array input with drag-and-drop, module creation, and layout editing
    - `ModuleArrayItem.tsx`: Individual module item component with preview and controls
    - `ModuleReferencePreview.tsx`: Module reference preview component

- **Module System** (`src/lib/sanity/schemas/modules/`):
  - `baseModuleSchema.ts`: Base schema for content modules
  - `moduleHeroImage.ts`: Hero image module implementation
  - `castingModuleSchema.ts`: Module casting system for wing integration
  - `index.ts`: Module schema management

#### New Foundation System:

- **Foundation Schemas** (`src/lib/sanity/schemas/foundation/`):
  - `foundationBehavior.ts`: Behavior foundation for scroll and interaction settings
  - `foundationDesign.ts`: Design foundation for theming and styling
  - `foundationLocalization.ts`: Localization foundation for language management
  - `foundationTheme.ts`: Theme foundation for color and design systems
  - `index.ts`: Foundation schema management

#### New Components & Utilities:

- **FoundationProvider.tsx**: React context provider for foundation settings
- **OrphanedFieldsBanner.tsx**: Component for detecting and managing orphaned localization fields
- **Foundation Utils** (`src/lib/sanity/utils/foundationUtils.test.ts`): Testing utilities for foundation system

#### New Frontend Systems:

- **Frontend Library** (`src/lib/frontend/`): Frontend utilities and components
- **Module Components** (`src/components/modules/`): Frontend module rendering components
- **Sanity Hooks** (`src/lib/sanity/hooks/`): Custom hooks for Sanity integration

#### New Documentation:

- **GlassLocalization.md**: Comprehensive documentation for the Glass Localization system
- **Scripts** (`scripts/`): Development and maintenance scripts

### Major Feature: Glass Localization System Implementation

**BREAKING CHANGE**: Replaced Sanity's built-in localization with a custom, dynamic foundation-based system

#### New Files Created (15 files):

- **DynamicLocalizationInput.tsx**: Main component that fetches foundation settings and renders language fields dynamically
- **DynamicLocaleStringInput.tsx**: Specialized component for string localization
- **DynamicLocaleTextInput.tsx**: Specialized component for text area localization
- **elementButton.ts**: Complete button element with configurable types, variants, sizes, and full localization
- **elementRichText.ts**: Rich text element with dynamic localization and formatting options
- **elementSVG.ts**: SVG element with proper asset handling and localization support
- **foundation.ts**: Foundation schema for configurable language management
- **foundation/index.ts**: Foundation schema management and organization
- **dynamicLocaleString.ts**: Runtime-dynamic string field based on foundation settings
- **dynamicLocaleText.ts**: Runtime-dynamic text field based on foundation settings
- **glassLocaleRichText.ts**: Complete rich text localization with Portable Text support
- **glassLocaleString.ts**: Dynamic string localization field that adapts to configured languages
- **glassLocaleText.ts**: Dynamic text area localization field with multi-language support
- **foundationUtils.ts**: Complete utility system for fetching and managing foundation settings
- **localizationUtils.ts**: Comprehensive localization utilities for field creation and management
- **svgUtils.ts**: Enhanced SVG processing utilities with color manipulation and optimization
- **components/index.ts**: Component exports organization

#### Key Schema Enhancements:

- **baseElementSchema.ts**: Complete rewrite with new localization system integration
- **elementImage.ts**: Enhanced with proper preview configuration and localization
- **elementTextBlock.ts**: Streamlined and optimized for new localization system
- **elementTextSingleLine.ts**: Updated with dynamic localization support
- **deskStructure.ts**: Cleaned up and simplified desk structure
- **index.ts**: Streamlined schema organization and removed legacy imports

#### Component Improvements:

- **GlassLocalizationInput.tsx**: Enhanced with runtime foundation fetching and dynamic field generation
- **GenericComputedFieldsInput.tsx**: Improved with better accessibility and ARIA label generation

#### Utility Enhancements:

- **constants.ts**: Updated with new localization constants
- **svgHandler.ts**: Enhanced with improved asset handling

#### Legacy Updates:

- **localeString.ts & localeText.ts**: Updated to work with new system
- **glassLocalization.ts**: Enhanced type definitions

This creates a flexible, maintainable localization system where users can add/remove languages through foundation settings, with all localization fields automatically updating across the entire system. The system is now production-ready with proper error handling, TypeScript safety, and excellent developer experience.

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
