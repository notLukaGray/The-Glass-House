# The Glass House

The Glass House is my antidote to the "design → dev → content → repeat" relay race. Instead of juggling files, comments, and last-minute margin tweaks, everyone works on the same living pages. The project is still in active development. No public license yet, but the vision is clear: keep creativity flowing, keep handoffs minimal, and keep tech headaches to a dull buzz.

Designs still start in Figma; they simply land here without the usual gymnastics.

---

## Why It Exists

1. A designer perfects a layout in Figma.
2. A developer squints at that layout and turns it into code.
3. The content team waits their turn, then begs for tiny changes.
4. Every tweak restarts the cycle.

Days vanish debating twelve-pixel paddings. The Glass House trims that fat. Designers, editors, and developers shape real pages in real time. Minus the ticket ping-pong.

---

## The Five-Layer Stack

| Layer          | Responsibility                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Blueprints** | Routes, metadata, SEO, and page-level config.                                                                              |
| **Scaffolds**  | Overall layout logic and scroll behavior.                                                                                  |
| **Wings**      | Large page zones: columns, hero bands, full-screen sections.                                                               |
| **Modules**    | Reusable blocks such as hero sections, galleries, or contact forms; includes _casting variables_ for fine-grained control. |
| **Elements**   | Text, images, buttons, video. The smallest building pieces.                                                                |

Each layer can override the one below it; flexibility without spaghetti.

_See [STRUCTURE.md](./STRUCTURE.md) for a full technical breakdown of every layer and type in the system._

---

## Current Highlights

### Component Library in the Browser

Grab a hero, drop a gallery, clone a content section. Everything updates instantly.

### Real-Time Layout Tweaks

Drag margins, snap alignment guides, set breakpoints, adjust _casting variables_ on the fly. No more "bump it two pixels" commits.

### Structured, Versioned, Localized

All content fields are schema-validated, version-controlled, and ready for multiple languages out of the gate.

### Collaboration Without Collisions

Multiple editors can work side by side. Live cursors, change history, and friendly conflict handling keep toes un-stepped-on.

### Layout Experiments on the Fly

Duplicate a page, rearrange modules, ship both versions, check the numbers.

### Shared Styling Rules

Colors, type scales, and spacing tokens live in one place; rogue styling stays out.

### Glass Casting System

Granular control over layout and positioning at every level. Each component exposes _casting variables_ that can be fine-tuned without touching code - width, height, alignment, spacing, transforms, and more.

### Glass Localization with Accessibility Generation

Dynamic multi-language support that automatically generates ARIA labels, alt text, and accessibility attributes. Content is accessible by default, with computed fields that ensure compliance without manual intervention.

---

## Under the Hood

- **Backend:** Sanity CMS with custom schemas
- **Frontend:** Next.js, React, and TypeScript
- **Styles:** Tailwind paired with our own design tokens
- **Data:** PostgreSQL via Prisma
- **Auth:** NextAuth with role-based control
- **Deploy:** Vercel for instantaneous previews and clean rollbacks

Everything is API-first, fully typed, and open for extension. Plugging in a custom module feels like adding batteries, not rewiring the house.

---

## Roadmap

| Phase                             | Goal                          | Details                                                                                                                         | Status         |
| --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **1. Backend Bootstrapping**      | Get the engine running        | Finalize schemas, auth, localization, versioning, and expose clean APIs.                                                        | 🚧 in progress |
| **2. Frontend Assembly**          | Make pages actually render    | Build scaffolds, wings, modules, and elements in Next.js. Connect them to the backend and publish a real site.                  | queued         |
| **3. Visual Editor & SDK (Beta)** | Hand the controls to everyone | Ship a drag-and-drop editor, live preview canvas, alignment helpers, and an SDK for third-party components; open a closed beta. | future         |

---

## Who Wins

- **Content Teams:** Publish in hours, not sprints.
- **Designers:** Keep your system intact. No endless handoff docs.
- **Developers:** Build components once; stop babysitting margin tweaks. Strong typing means fewer "works on my machine" mysteries.
- **Stakeholders:** Faster launches, lower costs, fewer headaches.

---

## Access

The Glass House is not public yet. We are still sanding rough edges. If you want to peek under the hood, reach out to Luka Gray. Early feedback is appreciated; patience is a must.

---

## CLI Commands

### Reset Admin Password

Forgot my password, so I thought you would too. If you ever need to reset the admin password from the command line:

```sh
npx tsx src/lib/db/cli.ts change-admin-password
```

You'll be prompted for a new password, and the admin account will be updated securely.
