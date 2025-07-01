import { Rule } from "@sanity/types";
import { SanityField } from "../../types";
import {
  createLocalizedStringField,
  createLocalizedTextField,
} from "../../utils/localizationUtils";

// Common scaffold metadata fields that can be reused
export const createScrollTypeField = (
  fieldName: string = "scrollType",
  title: string = "Scroll Type",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Vertical", value: "vertical" },
      { title: "Horizontal", value: "horizontal" },
      { title: "Snap", value: "snap" },
      { title: "Gesture", value: "gesture" },
      { title: "None", value: "none" },
    ],
  },
  initialValue: "vertical",
  fieldset,
  description: description || "Defines the scroll behavior for this scaffold",
});

export const createTransitionModeField = (
  fieldName: string = "transitionMode",
  title: string = "Transition Mode",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Fade", value: "fade" },
      { title: "Slide", value: "slide" },
      { title: "Scale", value: "scale" },
      { title: "Morph", value: "morph" },
      { title: "3D", value: "3d" },
    ],
  },
  initialValue: "fade",
  fieldset,
  description: description || "How wings switch between each other",
});

export const createNavigationStyleField = (
  fieldName: string = "navigationStyle",
  title: string = "Navigation Style",
  description?: string,
  fieldset: string = "ui",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "None", value: "none" },
      { title: "Dots", value: "dots" },
      { title: "Arrows", value: "arrows" },
      { title: "Scrollbar", value: "scrollbar" },
      { title: "Progress Bar", value: "progress" },
    ],
  },
  initialValue: "none",
  fieldset,
  description: description || "Optional UI overlays for navigation",
});

export const createZBehaviorField = (
  fieldName: string = "zBehavior",
  title: string = "Z-Stacking Behavior",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Flat", value: "flat" },
      { title: "Layered", value: "layered" },
      { title: "Overlapping", value: "overlapping" },
      { title: "Depth-Based", value: "depth" },
    ],
  },
  initialValue: "flat",
  fieldset,
  description: description || "Controls stacking of wings in z-space",
});

export const createPersistenceField = (
  fieldName: string = "persistence",
  title: string = "Persistence",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "boolean",
  initialValue: false,
  fieldset,
  description:
    description ||
    "Whether previous wings persist in DOM (good for animation continuity)",
});

export const createEntryRuleField = (
  fieldName: string = "entryRule",
  title: string = "Entry Rule",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Instant", value: "instant" },
      { title: "On Scroll", value: "scroll" },
      { title: "After Delay", value: "delay" },
      { title: "Trigger-Based", value: "trigger" },
    ],
  },
  initialValue: "instant",
  fieldset,
  description: description || "Defines how wings enter the viewport",
});

export const createExitRuleField = (
  fieldName: string = "exitRule",
  title: string = "Exit Rule",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Fade", value: "fade" },
      { title: "Slide Out", value: "slide" },
      { title: "Collapse", value: "collapse" },
      { title: "Replaced", value: "replaced" },
    ],
  },
  initialValue: "fade",
  fieldset,
  description: description || "Defines how wings exit the viewport",
});

export const createScrollLockField = (
  fieldName: string = "scrollLock",
  title: string = "Scroll Lock",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "boolean",
  initialValue: false,
  fieldset,
  description:
    description || "Enables or disables scroll locking per wing or scaffold",
});

export const createScenePreloadField = (
  fieldName: string = "scenePreload",
  title: string = "Scene Preload",
  description?: string,
  fieldset: string = "performance",
): SanityField => ({
  name: fieldName,
  title,
  type: "boolean",
  initialValue: false,
  fieldset,
  description:
    description || "Whether to preload all wings or lazy-load as needed",
});

export const createSnapAxisField = (
  fieldName: string = "snapAxis",
  title: string = "Snap Axis",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "X Axis", value: "x" },
      { title: "Y Axis", value: "y" },
      { title: "Both", value: "both" },
    ],
  },
  initialValue: "y",
  fieldset,
  description:
    description || "For snap-based scaffolds — define snap points along x or y",
});

export const createShellStyleField = (
  fieldName: string = "shellStyle",
  title: string = "Shell Style",
  description?: string,
  fieldset: string = "styling",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Default", value: "default" },
      { title: "Minimal", value: "minimal" },
      { title: "Floating", value: "floating" },
      { title: "Full Bleed", value: "fullBleed" },
    ],
  },
  initialValue: "default",
  fieldset,
  description:
    description ||
    "Controls appearance of any persistent wrapper (nav bar, frame, sidebar)",
});

export const createBackgroundBehaviorField = (
  fieldName: string = "backgroundBehavior",
  title: string = "Background Behavior",
  description?: string,
  fieldset: string = "styling",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Static", value: "static" },
      { title: "Fade", value: "fade" },
      { title: "Shift", value: "shift" },
      { title: "Morph", value: "morph" },
    ],
  },
  initialValue: "static",
  fieldset,
  description:
    description || "Defines how background behaves during scaffold transitions",
});

export const createSceneMemoryField = (
  fieldName: string = "sceneMemory",
  title: string = "Scene Memory",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "boolean",
  initialValue: false,
  fieldset,
  description:
    description || "Remembers last seen wing or resets to start every load",
});

export const createMotionControlField = (
  fieldName: string = "motionControl",
  title: string = "Motion Control",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Synced", value: "synced" },
      { title: "Async", value: "async" },
      { title: "Manual Trigger", value: "manual" },
      { title: "Scroll-Tied", value: "scroll" },
    ],
  },
  initialValue: "synced",
  fieldset,
  description: description || "Global animation control for the scaffold",
});

export const createGestureSensitivityField = (
  fieldName: string = "gestureSensitivity",
  title: string = "Gesture Sensitivity",
  description?: string,
  fieldset: string = "behavior",
): SanityField => ({
  name: fieldName,
  title,
  type: "number",
  initialValue: 50,
  validation: (rule: Rule) => rule.min(0).max(100),
  fieldset,
  description:
    description || "Threshold of movement before scene switch fires (0-100)",
});

export const createAccessibilityRulesField = (
  fieldName: string = "accessibilityRules",
  title: string = "Accessibility Rules",
  description?: string,
  fieldset: string = "accessibility",
): SanityField => ({
  name: fieldName,
  title,
  type: "object",
  fieldset,
  description:
    description || "Additional rules to ensure transitions meet WCAG standards",
  fields: [
    {
      name: "reducedMotion",
      title: "Respect Reduced Motion",
      type: "boolean",
      initialValue: true,
      description: "Disable animations when user prefers reduced motion",
    },
    {
      name: "focusManagement",
      title: "Focus Management",
      type: "boolean",
      initialValue: true,
      description: "Ensure proper focus management during transitions",
    },
    {
      name: "announceChanges",
      title: "Announce Changes",
      type: "boolean",
      initialValue: true,
      description: "Announce scene changes to screen readers",
    },
  ],
});

export const createBreakpointBehaviorField = (
  fieldName: string = "breakpointBehavior",
  title: string = "Breakpoint Behavior",
  description?: string,
  fieldset: string = "responsive",
): SanityField => ({
  name: fieldName,
  title,
  type: "object",
  fieldset,
  description: description || "Overrides layout rules on specific screen sizes",
  fields: [
    {
      name: "mobile",
      title: "Mobile Override",
      type: "string",
      options: {
        list: [
          { title: "Use Default", value: "default" },
          { title: "Vertical Stack", value: "verticalStack" },
          { title: "Single Column", value: "singleColumn" },
        ],
      },
      description: "Layout behavior on mobile devices",
    },
    {
      name: "tablet",
      title: "Tablet Override",
      type: "string",
      options: {
        list: [
          { title: "Use Default", value: "default" },
          { title: "Vertical Stack", value: "verticalStack" },
          { title: "Two Column", value: "twoColumn" },
        ],
      },
      description: "Layout behavior on tablet devices",
    },
  ],
});

// Base scaffold schema creator
export const createBaseScaffoldSchema = (
  scaffoldName: string,
  scaffoldTitle: string,
  scaffoldType: string,
  additionalFields: SanityField[] = [],
  additionalFieldsets: Array<{
    name: string;
    title: string;
    options?: { collapsible?: boolean; collapsed?: boolean };
  }> = [],
) => {
  const baseFields = [
    createLocalizedStringField(
      "title",
      "Title",
      `Human-readable title for the ${scaffoldType} (required)`,
      "main",
      (rule: Rule) => rule.required(),
    ),
    createLocalizedTextField(
      "description",
      "Description",
      `Brief description of the ${scaffoldType} behavior`,
      "main",
    ),
    createScrollTypeField(),
    createTransitionModeField(),
    createNavigationStyleField(),
    createZBehaviorField(),
    createPersistenceField(),
    createEntryRuleField(),
    createExitRuleField(),
    createScrollLockField(),
    createScenePreloadField(),
    createSnapAxisField(),
    createShellStyleField(),
    createBackgroundBehaviorField(),
    createSceneMemoryField(),
    createMotionControlField(),
    createGestureSensitivityField(),
    createAccessibilityRulesField(),
    createBreakpointBehaviorField(),
    ...additionalFields,
  ];

  const baseFieldsets = [
    {
      name: "main",
      title: "Main",
      options: { collapsible: false, collapsed: false },
    },
    {
      name: "behavior",
      title: "Behavior",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "ui",
      title: "UI",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "styling",
      title: "Styling",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "performance",
      title: "Performance",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "accessibility",
      title: "Accessibility",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "responsive",
      title: "Responsive",
      options: { collapsible: true, collapsed: true },
    },
    ...additionalFieldsets,
  ];

  return {
    name: scaffoldName,
    title: scaffoldTitle,
    type: "document",
    fieldsets: baseFieldsets,
    fields: baseFields,
    preview: {
      select: {
        title: "title.en",
        description: "description.en",
        scrollType: "scrollType",
      },
      prepare({
        title,
        description,
        scrollType,
      }: {
        title?: string;
        description?: string;
        scrollType?: string;
      }) {
        return {
          title: title || "Untitled Scaffold",
          subtitle: description || `${scrollType || "vertical"} scroll`,
        };
      },
    },
  };
};
