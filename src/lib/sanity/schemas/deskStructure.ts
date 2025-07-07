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
                .title("3D Models")
                .child(
                  S.documentTypeList("element3D").title("3D Model Elements"),
                ),
              S.listItem()
                .title("Audio")
                .child(
                  S.documentTypeList("elementAudio").title("Audio Elements"),
                ),
              S.listItem()
                .title("Buttons")
                .child(
                  S.documentTypeList("elementButton").title("Button Elements"),
                ),
              S.listItem()
                .title("Canvas")
                .child(
                  S.documentTypeList("elementCanvas").title("Canvas Elements"),
                ),
              S.listItem()
                .title("Dividers")
                .child(
                  S.documentTypeList("elementDivider").title(
                    "Divider Elements",
                  ),
                ),
              S.listItem()
                .title("Images")
                .child(
                  S.documentTypeList("elementImage").title("Image Elements"),
                ),
              S.listItem()
                .title("SVG Icons")
                .child(
                  S.documentTypeList("elementSVG").title("SVG Icon Elements"),
                ),
              S.listItem()
                .title("Text (Block)")
                .child(
                  S.documentTypeList("elementTextBlock").title(
                    "Text Block Elements",
                  ),
                ),
              S.listItem()
                .title("Text (Rich Text)")
                .child(
                  S.documentTypeList("elementRichText").title(
                    "Text (Rich Text) Elements",
                  ),
                ),
              S.listItem()
                .title("Text (Single)")
                .child(
                  S.documentTypeList("elementTextSingleLine").title(
                    "Text (Single) Elements",
                  ),
                ),
              S.listItem()
                .title("Videos")
                .child(
                  S.documentTypeList("elementVideo").title("Video Elements"),
                ),
              S.listItem()
                .title("Widgets")
                .child(
                  S.documentTypeList("elementWidget").title("Widget Elements"),
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
              S.listItem()
                .title("Text Blocks")
                .child(
                  S.documentTypeList("moduleTextBlock").title(
                    "Text Block Modules",
                  ),
                ),
              S.listItem()
                .title("Images")
                .child(
                  S.documentTypeList("moduleImage").title("Image Modules"),
                ),
              S.listItem()
                .title("Dynamic Backgrounds")
                .child(
                  S.documentTypeList("moduleDynamicBackground").title(
                    "Dynamic Background Modules",
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
                .title("Test Casting Wings")
                .child(
                  S.documentTypeList("wingsTestCasting").title(
                    "Test Casting Wings",
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
                .title("Test Casting Scaffolds")
                .child(
                  S.documentTypeList("scaffoldTestCasting").title(
                    "Test Casting Scaffolds",
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
