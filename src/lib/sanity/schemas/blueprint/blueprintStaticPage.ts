import { createBaseBlueprintSchema } from "./baseBlueprintSchema";

const blueprintStaticPage = createBaseBlueprintSchema(
  "blueprintStaticPage",
  "Static Page Blueprint",
  "static page",
  [
    {
      name: "collectionSource",
      title: "Collection Source",
      type: "string",
      fieldset: "main",
      description:
        "Defines the source collection this blueprint pulls from (e.g. 'page', 'about')",
    },
  ],
  [
    {
      name: "content",
      title: "Content",
      options: { collapsible: true, collapsed: false },
    },
  ],
);

export default blueprintStaticPage;
