# The Glass House - System Architecture

## Overview

The Glass House is a modular page composition system with a hierarchical architecture that enables the creation of sophisticated, interactive web experiences. The system is built on five core concepts that work together to create flexible, powerful page layouts.

## Core Architecture

```
Blueprints → Scaffolds → Wings → Modules → Elements
```

Each level builds upon the previous, creating a flexible system for page composition.

---

## Blueprints

Blueprints define what the page is and how it gets rendered — includes routing, slug, and content source.

### Blueprint Types

#### **entryPage**

A dynamically routed page that renders based on a collection and slug — e.g. blog post, portfolio piece.

#### **redirector**

Blueprint that handles server/client redirects, often used for shortlinks, aliases, or campaign routing.

#### **staticPage**

A page with a fixed route and predefined content — e.g. /about, /contact, /terms.

#### **collectionIndex**

Displays a list or grid of entries from a specific collection — e.g. blog roll, portfolio archive.

#### **landingPage**

A high-impact marketing page often detached from primary site nav — e.g. product launch, campaign.

#### **errorPage**

Blueprint for 404s or 500s, styled and branded to match the rest of the site.

#### **settingsPage**

An internal-facing page used to configure global site options — typically hidden from public nav.

#### **multiStepPage**

Blueprint for a step-by-step flow — onboarding, forms, wizards, etc.

#### **authPage**

Pages handling authentication — login, register, forgot password, etc.

### Blueprint Metadata

#### **slug**

The path segment this blueprint renders at — unique per page or entry.

#### **title**

Human-readable title for CMS editors, used in listings or admin UIs.

#### **collectionSource**

Defines the source collection or document type this blueprint pulls from — e.g. 'blogPost', 'project', 'product'. Used to route and query content appropriately.

#### **scaffold**

Specifies the page layout mode this blueprint uses — determines overall spatial behavior and available wings.

#### **theme**

Overrides default site theming with a local token set — useful for campaign or partner pages.

#### **seo**

Search engine configuration — title, description, social image, canonical tags, etc.

#### **redirect**

Optional redirect path or logic — if set, page will immediately reroute.

#### **accessControl**

Defines if page is public, gated, or requires specific roles (auth, admin, etc).

#### **fallback**

Optional fallback behavior if content is missing — can show default state, redirect, or throw error.

#### **published**

Boolean flag used to hide/show the page from production without deleting it.

#### **schedule**

Optional start/end dates for time-based publishing — useful for events or promos.

---

## Scaffolds

The structural layout framework of a page — controls scroll type, transitions, and page-wide behavior.

### Scaffold Types

#### **verticalStack**

Default scroll-down layout where wings are stacked top to bottom in natural document flow.

#### **horizontalScroll**

Wings are arranged left-to-right, with horizontal scroll behavior — often used for portfolios or immersive stories.

#### **viewportStep**

Full-screen snap-to sections; each wing becomes a 'step' that fills the screen and advances on scroll.

#### **freeformCanvas**

Wings are placed freely on an infinite canvas — absolute or manual placement with x/y control.

#### **sceneSwitcher**

Only one wing shown at a time; used for onboarding flows, slideshows, or interactive storytelling.

#### **depthStack**

Wings are layered in z-space with parallax, blurring, or scaling effects — simulating depth.

#### **portalFlow**

One scaffold loads another through transition — e.g. portals, modal flows, or full layout swaps.

#### **gridMatrix**

Wings arranged inside a spatial grid — used for dashboards, interactive data zones, or creative showcases.

#### **storyRail**

Linear narrative with fixed scroll speed — wings animate in and out like storybook pages.

#### **fixedShell**

Header/footer or nav stays fixed, while wings scroll beneath — common for web apps or persistent UIs.

#### **stackedReveal**

New wings push or reveal older ones underneath — great for tactile, unfolding interactions.

#### **splitAxis**

Split viewport where two wings operate independently (e.g., left scrolls while right is pinned).

#### **stageCarousel**

One wing visible at a time with manual or auto transitions — good for feature callouts or hero sections.

#### **timelineFlow**

Wings unlock or progress based on scroll or interaction — used for timelines, case studies, or step-based flows.

#### **pinnedMap**

Wings unlock based on scroll over a map or large fixed visual — like guided location storytelling.

#### **navigationGrid**

Wings positioned in a 2D grid with directional nav (keyboard, swipe, buttons).

#### **animatedShell**

The scaffold itself animates (rotate, scale, shift) while wings stay visually consistent — immersive pages.

#### **conditionalScene**

Different wings load based on logic — user data, device type, or prior action.

#### **gestureSwitch**

Wings change via swipes, gestures, or drag motions — great for mobile or immersive interactions.

### Scaffold Metadata

#### **scrollType**

Defines scroll behavior — vertical, horizontal, snap, gesture, or none.

#### **transitionMode**

How wings switch — fade, slide, scale, morph, or 3D transitions.

#### **canvasBounds**

For freeform scaffolds — defines width/height or bounding rules.

#### **navigationStyle**

Optional UI overlays like dots, arrows, scrollbars, or none.

#### **zBehavior**

Controls stacking of wings — flat, layered, overlapping, or depth-based.

#### **persistence**

Whether previous wings persist in DOM (good for animation continuity) or get destroyed on switch.

#### **entryRule**

Defines how wings enter — instant, on scroll, after delay, or trigger-based.

#### **exitRule**

Defines how wings exit — fade, slide out, collapse, or replaced.

#### **scrollLock**

Enables or disables scroll locking per wing or scaffold.

#### **scenePreload**

Whether to preload all wings or lazy-load as needed.

#### **snapAxis**

For snap-based scaffolds — define snap points along x or y.

#### **shellStyle**

Controls appearance and animation of any persistent wrapper (e.g. nav bar, frame, sidebar).

#### **backgroundBehavior**

Defines how background behaves during scaffold transitions — static, fade, shift, or morph.

#### **sceneMemory**

Remembers last seen wing or resets to start every load — used for onboarding vs. interactive flows.

#### **motionControl**

Global animation control — synced, async, manual trigger, or scroll-tied.

#### **interactionFlow**

Defines logic-based flow between wings (e.g. quiz paths, conditionals, or data-driven forks).

#### **gestureSensitivity**

For gesture-based scaffolds — threshold of movement before scene switch fires.

#### **accessibilityRules**

Additional rules to ensure transitions and layout shifts meet WCAG standards.

#### **breakpointBehavior**

Overrides layout rules on specific screen sizes — can swap scaffold type completely.

---

## Wings

Spatial zones within a scaffold that organize modules — flexible containers like columns, carousels, or full-screen sections.

### Wing Types

#### **singleColumn**

One module stacked per row, ideal for editorial or linear flow pages.

#### **twoColumn**

Two side-by-side modules, balanced or ratio-controlled, often used for content + image.

#### **threeColumn**

Three columns, typically equal width; best for data, cards, or step breakdowns.

#### **asymmetricSplit**

Offset columns with controlled ratios (e.g. 65/35), useful for storytelling.

#### **centeredContent**

A narrow max-width wing centered both horizontally and vertically — hero, CTA, or intro block.

#### **fullScreen**

Wing stretches to fill viewport; used for immersive content or intro modules.

#### **scrollingZone**

A vertical stack where modules animate or respond to scroll (fade, pin, transform).

#### **carouselTrack**

Horizontal scroll section (snap or free) for modules like cards or image strips.

#### **masonry**

Pinterest-style waterfall layout — uneven vertical stacking of modules.

#### **gridLayout**

Explicit column/row layout defined by metadata, flexible for dashboards or media-heavy layouts.

#### **angledBreak**

A section with a skewed edge to visually divide content — top or bottom can angle in or out.

#### **maskedSection**

A container wing with a clip-path or SVG mask, used to soften or break hard edges.

#### **parallaxLayered**

Layered module depths scrolling at different speeds to simulate 3D movement.

#### **revealBehind**

Sticky or fixed module on top of another that reveals as you scroll.

#### **interactiveReveal**

Content appears or expands on interaction rather than scroll (hover, click, drag).

#### **floatingIslands**

Modules float freely in space — absolute or fixed positioning with intent.

#### **backgroundScroller**

Wing with a background that transforms (color, image, gradient, video) based on scroll.

#### **stickyFrame**

Module stays pinned within the wing for part or all of scroll duration.

#### **fullBleedTransition**

Image or video module takes over screen edge-to-edge during scroll.

#### **pinnedSplit**

One module scrolls, one pins — often used in explainer flows or longform storytelling.

#### **slideGallery**

A horizontal sequence of full-width modules, each snapped or transitioned into view.

#### **breakoutZone**

A module expands or overflows into adjacent zones (e.g. image breaks column or screen bounds).

#### **interactiveMask**

Reveal content through gesture or scroll-controlled masks — ideal for immersive visuals.

#### **perspectiveScroll**

3D-tilted effect applied to layers/modules as user scrolls, simulating camera depth.

#### **stackedScroller**

Each module overlaps the last slightly, revealing a cascade as you scroll.

#### **curvedScrollPath**

A wing that animates modules along a bezier scroll path (experimental).

#### **shapeDrivenSection**

A background shape defines the contour and motion of the modules inside.

### Wing Metadata

#### **alignment**

Controls content alignment inside the wing (start, center, end, stretch).

#### **gap**

Spacing between child modules (numeric or tokenized).

#### **padding**

Internal spacing from wing edge to content.

#### **background**

Applies color, gradient, video, or image as background.

#### **overflow**

Defines content clipping behavior (visible, hidden, scroll).

#### **width**

Set to full, contained, or custom width.

#### **height**

Auto, fixed px, vh-based, or dynamic to module content.

#### **zIndex**

Stacking context to control layer order relative to other wings.

#### **scrollBehavior**

Defines how the wing behaves during scroll: normal, pinned, parallax, scrub, reveal, etc.

#### **entryAnimation**

Defines entry transitions for wing itself or its child modules.

#### **angle**

For angled or skewed wings — numeric value in degrees (positive or negative).

#### **clipPath**

Defines a CSS clip-path or mask path (string, svg, polygon, etc).

#### **scrollOffset**

Offset value used to time scroll-triggered animations or locks.

#### **parallaxDepth**

Depth ratio for layers inside parallax wings (0–1 scale).

#### **snapPoints**

Used in horizontal wings — defines snapping behavior and logic.

#### **backgroundTransition**

Defines type of background change (fade, slide, morph).

#### **breakpointRules**

Overrides for layout per screen size — can define alt wings if needed.

#### **motionSync**

Determines whether child modules animate independently or together.

#### **interactionLock**

Locks all interaction within wing during animation, used in immersive content.

#### **maskType**

Static, scroll-linked, or interactive (if using SVG or canvas masks).

#### **containerBehavior**

Tells the wing whether to behave like a container, flow stack, or freeform zone.

---

## Modules

Self-contained content blocks — reusable UI units like forms, galleries, videos, or CTAs.

### Module Types

#### **heroImage**

Full-width image section typically used at the top of a page to introduce content with optional overlay text.

#### **videoEmbed**

Module for embedding hosted video players like Vimeo or YouTube with responsive styling and poster image support.

#### **galleryViewer**

Interactive lightbox gallery allowing users to browse image collections.

#### **carousel**

Horizontal slider with pagination or arrows to display multiple items in sequence.

#### **imageGrid**

Responsive grid layout for showcasing a set of images with uniform styling.

#### **mediaOverlay**

Layered content with media in the background and text or UI overlaid on top.

#### **lottieScroller**

Scroll-linked animation using Lottie or Motion JSON files for immersive transitions.

#### **productShowcase**

Highlight block for product images, names, and CTA in a structured layout.

#### **modelViewer3D**

Interactive 3D viewer embedded into the page with user controls and autoplay settings.

#### **splitMediaText**

Two-column layout that pairs media with descriptive text for balanced presentation.

#### **fullscreenImage**

Background image module occupying the entire viewport with text anchoring support.

#### **slideshowReveal**

Sequential slide-based content transitions, ideal for storytelling or feature reveals.

#### **headlineBlock**

Text-forward module with large heading, subhead, and optional decorative line or image.

#### **quoteBlock**

Pull quote layout with attribution and design embellishments.

#### **statBlock**

Numeric statistics display with labels, often used to show achievements or KPIs.

#### **accordion**

Collapsible content blocks that expand or hide additional details.

#### **faqStack**

Grouped accordion-style list focused on answering common questions.

#### **textScroller**

Text content that scrolls horizontally or vertically on interaction or auto-play.

#### **captionBlock**

Small text block intended to accompany media or secondary callouts.

#### **countdown**

Live updating countdown timer with end-date input and style customization.

#### **formBasic**

Standard form module with input fields, labels, and submit button.

#### **formMultiStep**

Paginated form experience with progress indicators for multi-part submission.

#### **formNewsletter**

Simplified input form to collect email addresses for subscriptions.

#### **surveyModule**

Dynamic questionnaire module with logic-based flow and result display.

#### **contactForm**

Dedicated form with name, email, message, and contact preferences.

#### **scrollLock**

Full-screen layout that fixes content in place during scroll events.

#### **scrollReveal**

Trigger-based animation system for revealing components as they enter viewport.

#### **draggableGrid**

Interactive UI with repositionable tiles or blocks within a constrained layout.

#### **hoverParallax**

Depth-based effect where layers move in response to cursor position.

#### **tabsSwitcher**

Tab navigation with corresponding content areas that toggle on selection.

#### **infiniteScroller**

Continuous content loader that fetches or animates more content as user scrolls.

#### **ctaBanner**

Call-to-action block with text and buttons, typically placed mid or bottom page.

#### **featureComparison**

Table or card-based layout comparing features between offerings.

#### **columns**

Flexible multi-column layout that supports stacking and reordering responsively.

#### **cardsRow**

Row of styled cards used to highlight features, services, or content previews.

#### **infoTiles**

Modular blocks with icon, heading, and text to summarize concepts or data.

#### **buttonStack**

Vertical or horizontal group of related call-to-action buttons.

#### **sectionDivider**

Thematic or visual break between content zones on a page.

#### **spacerBlock**

Invisible or styled empty block to push content apart vertically or horizontally.

#### **backgroundWrapper**

Module that wraps other components with background color, image, or video.

#### **mapEmbed**

Interactive map module using services like Google Maps or Mapbox.

#### **debugView**

Developer-only view for inspecting layout, spacing, or props live.

#### **anchorLinker**

Scroll anchor module that links to other parts of the page on click.

#### **themeToggle**

Switch element to toggle between predefined theme states (e.g. dark/light).

#### **languageSwitcher**

Dropdown or inline toggle for changing site language or locale.

#### **visibilityGate**

Conditional render block that shows or hides content based on device, user state, or query param.

### Module Metadata

#### **transition**

Controls how the module animates into or out of view.

#### **lockToZone**

Defines whether the module is restricted to a specific layout area.

#### **responsiveBehavior**

Customizes stacking, scaling, or visibility across breakpoints.

#### **allowMultiple**

Flag for permitting this module to be reused multiple times per page.

#### **themeVariant**

Module-specific overrides for color, typography, or layout based on active theme.

#### **customId**

Human-readable identifier for linking or analytics purposes.

#### **scrollTrigger**

Defines behavior when module enters the viewport on scroll.

---

## Elements

Atomic UI pieces — text, images, buttons, and form inputs that modules are built from.

### Element Types

#### **textSingleLine**

Short, inline string for titles or labels.

#### **textBlock**

Multi-line rich text area for paragraphs or formatted content.

#### **image**

Single static image element with optional alt text and styling.

#### **video**

Embedded video player element, supports external or hosted video.

#### **audio**

Audio player element with play/pause and optional transcript.

#### **vector**

SVG or vector-based graphical element for scalable icons or shapes.

#### **icon**

Small, often symbolic image used to indicate function or status.

#### **button**

Interactive UI element that triggers an action or navigation.

#### **inputField**

Text input area for user interaction, typically in forms.

#### **checkbox**

Binary selector for toggling on/off or true/false states.

#### **radioButton**

Single-select option in a grouped choice set.

#### **toggleSwitch**

Styled toggle element to switch between binary states.

#### **selectDropdown**

Dropdown UI for selecting one option from a list.

#### **datePicker**

Calendar input component to select a date.

#### **fileUploader**

UI control for uploading a local file.

#### **3dModel**

Embedded 3D model viewer, supporting rotation and zoom.

#### **canvas**

HTML canvas element for custom or dynamic drawing.

#### **divider**

Horizontal or vertical visual separation line.

### Element Metadata

#### **ariaLabel**

Accessibility text for screen readers to describe the element.

#### **themeToken**

Reference to theme styling like colors or typography.

#### **id**

Unique identifier used for referencing or linking elements.

#### **debug**

Flag for debugging visibility or test logging.

#### **dataBinding**

Connects the element's value or content to structured data.

#### **responsiveRules**

Defines how the element should adapt across breakpoints.

---

## Implementation Notes

### Technology Stack

- **CMS**: Sanity
- **Framework**: Next.js
- **Database**: Prisma + Neon
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js

### Development Phases

1. **Foundation**: Element system and basic modules
2. **Core**: Wing and scaffold systems
3. **Advanced**: Interactive features and animations
4. **Editor**: Visual page builder interface

### Key Principles

- **Modularity**: Each component is self-contained and reusable
- **Flexibility**: System supports both simple and complex layouts
- **Performance**: Optimized for fast loading and smooth interactions
- **Accessibility**: Built with WCAG standards in mind
- **Extensibility**: Easy to add new components and behaviors
