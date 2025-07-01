import type { StructureBuilder } from "sanity/desk";

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
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
            ]),
        ),
    ]);

export default deskStructure;
