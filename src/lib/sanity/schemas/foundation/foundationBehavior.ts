import { Rule } from "@sanity/types";

const foundationBehavior = {
  name: "foundationBehavior",
  title: "Behavior Foundation",
  type: "document",
  description: "Module behavior and animation configuration",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Behavior Foundation",
      readOnly: true,
      hidden: true,
    },
    {
      name: "scrollBehaviors",
      title: "Scroll Behaviors",
      type: "array",
      description: "Behaviors that trigger on scroll events",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Behavior Name",
              type: "string",
              description:
                "Unique identifier for this behavior (e.g., fadeIn, slideUp)",
              validation: (rule: Rule) => rule.required(),
            },
            {
              name: "title",
              title: "Display Title",
              type: "string",
              description: "Human-readable name for this behavior",
              validation: (rule: Rule) => rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              description: "What this behavior does",
            },
            {
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Enter", value: "enter" },
                  { title: "Exit", value: "exit" },
                  { title: "Scroll", value: "scroll" },
                  { title: "Parallax", value: "parallax" },
                ],
              },
              initialValue: "enter",
            },
            {
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
              description: "Enable or disable this behavior",
            },
            {
              name: "defaultProps",
              title: "Default Properties",
              type: "object",
              description: "Default configuration for this behavior",
              fields: [
                {
                  name: "duration",
                  title: "Duration (ms)",
                  type: "number",
                  initialValue: 500,
                },
                {
                  name: "delay",
                  title: "Delay (ms)",
                  type: "number",
                  initialValue: 0,
                },
                {
                  name: "easing",
                  title: "Easing",
                  type: "string",
                  options: {
                    list: [
                      { title: "Linear", value: "linear" },
                      { title: "Ease In", value: "easeIn" },
                      { title: "Ease Out", value: "easeOut" },
                      { title: "Ease In Out", value: "easeInOut" },
                    ],
                  },
                  initialValue: "easeOut",
                },
              ],
            },
          ],
          preview: {
            select: {
              name: "name",
              title: "title",
              category: "category",
              enabled: "enabled",
            },
            prepare({
              name,
              title,
              category,
              enabled,
            }: {
              name: string;
              title: string;
              category: string;
              enabled: boolean;
            }) {
              return {
                title: title || name,
                subtitle: `${category} behavior - ${enabled ? "Enabled" : "Disabled"}`,
              };
            },
          },
        },
      ],
      initialValue: [
        {
          name: "fadeIn",
          title: "Fade In",
          description: "Fade the module in when it enters the viewport",
          category: "enter",
          enabled: true,
          defaultProps: {
            duration: 500,
            delay: 0,
            easing: "easeOut",
          },
        },
        {
          name: "slideUp",
          title: "Slide Up",
          description:
            "Slide the module up from below when it enters the viewport",
          category: "enter",
          enabled: true,
          defaultProps: {
            duration: 600,
            delay: 0,
            easing: "easeOut",
          },
        },
        {
          name: "parallax",
          title: "Parallax",
          description: "Move the module at a different speed than the scroll",
          category: "parallax",
          enabled: true,
          defaultProps: {
            duration: 0,
            delay: 0,
            easing: "linear",
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare() {
      return {
        title: "Behavior Foundation",
        subtitle: "Module behavior and animation settings",
      };
    },
  },
};

export default foundationBehavior;
