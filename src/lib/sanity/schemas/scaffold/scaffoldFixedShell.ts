import { createBaseScaffoldSchema } from "./baseScaffoldSchema";

const scaffoldFixedShell = createBaseScaffoldSchema(
  "scaffoldFixedShell",
  "Fixed Shell Scaffold",
  "fixed shell",
  [
    {
      name: "wings",
      title: "Wings",
      type: "array",
      of: [
        {
          name: "wing",
          title: "Wing",
          type: "reference",
          to: [{ type: "wingsFullScreen" }],
        },
      ],
      fieldset: "content",
      description: "Wings that scroll beneath the fixed header/footer",
    },
  ],
  [
    {
      name: "content",
      title: "Content",
      options: { collapsible: false, collapsed: false },
    },
  ],
);

export default scaffoldFixedShell;
