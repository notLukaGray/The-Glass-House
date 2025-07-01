import type { StructureBuilder } from "sanity/desk";

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("The Glass House")
    .items([
      // Foundations - Base configuration
      S.listItem()
        .title("Foundations")
        .child(
          S.list()
            .title("Foundations")
            .items([
              S.listItem()
                .title("Localization Foundation")
                .child(
                  S.document()
                    .schemaType("foundationLocalization")
                    .documentId("foundationLocalization"),
                ),
              S.listItem()
                .title("Behavior Foundation")
                .child(
                  S.document()
                    .schemaType("foundationBehavior")
                    .documentId("foundationBehavior"),
                ),
              S.listItem()
                .title("Design Foundation")
                .child(
                  S.document()
                    .schemaType("foundationDesign")
                    .documentId("foundationDesign"),
                ),
              S.listItem()
                .title("Theme Foundation")
                .child(
                  S.document()
                    .schemaType("foundationTheme")
                    .documentId("foundationTheme"),
                ),
            ]),
        ),

      // Elements - Smallest building blocks
      S.listItem()
        .title("Elements")
        .child(
          S.list()
            .title("Elements")
            .items([
              S.listItem()
                .title("Images")
                .child(
                  S.documentTypeList("elementImage").title("Image Elements"),
                ),
              S.listItem()
                .title("Text (Single Line)")
                .child(
                  S.documentTypeList("elementTextSingleLine").title(
                    "Single Line Text Elements",
                  ),
                ),
              S.listItem()
                .title("Text (Block)")
                .child(
                  S.documentTypeList("elementTextBlock").title(
                    "Text Block Elements",
                  ),
                ),
              S.listItem()
                .title("Rich Text")
                .child(
                  S.documentTypeList("elementRichText").title(
                    "Rich Text Elements",
                  ),
                ),
              S.listItem()
                .title("Buttons")
                .child(
                  S.documentTypeList("elementButton").title("Button Elements"),
                ),
              S.listItem()
                .title("SVG Icons")
                .child(
                  S.documentTypeList("elementSVG").title("SVG Icon Elements"),
                ),
            ]),
        ),

      // Modules - Content blocks composed of elements
      S.listItem()
        .title("Modules")
        .child(
          S.list()
            .title("Modules")
            .items([
              S.listItem()
                .title("Hero Images")
                .child(
                  S.documentTypeList("moduleHeroImage").title(
                    "Hero Image Modules",
                  ),
                ),
            ]),
        ),

      // Wings - Organize modules within scaffolds
      S.listItem()
        .title("Wings")
        .child(
          S.list()
            .title("Wings")
            .items([
              S.listItem()
                .title("Full Screen Wings")
                .child(
                  S.documentTypeList("wingsFullScreen").title(
                    "Full Screen Wings",
                  ),
                ),
            ]),
        ),

      // Scaffolds - Control overall layout and behavior
      S.listItem()
        .title("Scaffolds")
        .child(
          S.list()
            .title("Scaffolds")
            .items([
              S.listItem()
                .title("Fixed Shell Scaffolds")
                .child(
                  S.documentTypeList("scaffoldFixedShell").title(
                    "Fixed Shell Scaffolds",
                  ),
                ),
            ]),
        ),

      // Blueprints - Define what a page is and its content source
      S.listItem()
        .title("Blueprints")
        .child(
          S.list()
            .title("Blueprints")
            .items([
              S.listItem()
                .title("Static Pages")
                .child(
                  S.documentTypeList("blueprintStaticPage").title(
                    "Static Page Blueprints",
                  ),
                ),
            ]),
        ),

      // Divider
      S.divider(),

      // Legacy/Other content types
      S.listItem()
        .title("Other Content")
        .child(
          S.list()
            .title("Other Content")
            .items([
              S.listItem()
                .title("SEO Settings")
                .child(S.documentTypeList("seo").title("SEO Settings")),
              S.listItem()
                .title("Orderable Documents")
                .child(
                  S.documentTypeList("orderableDocumentList").title(
                    "Orderable Document Lists",
                  ),
                ),
            ]),
        ),
    ]);

export default deskStructure;
