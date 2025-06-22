import type { StructureBuilder } from "sanity/desk";

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // --- Content Group ---
      S.listItem()
        .title("About Page")
        .child(S.documentTypeList("about").title("About Page")),
      S.listItem()
        .title("User")
        .child(S.documentTypeList("user").title("User")),
      S.listItem()
        .title("Blog Post")
        .child(S.documentTypeList("blogMeta").title("Blog Post")),
      S.listItem()
        .title("Category")
        .child(S.documentTypeList("category").title("Category")),
      S.listItem()
        .title("Global Banner")
        .child(S.documentTypeList("globalBanner").title("Global Banner")),
      S.listItem()
        .title("Page")
        .child(S.documentTypeList("pageMeta").title("Page")),
      S.listItem()
        .title("Project")
        .child(S.documentTypeList("projectMeta").title("Project")),
      S.listItem()
        .title("Route")
        .child(S.documentTypeList("route").title("Route")),
      S.listItem().title("Tag").child(S.documentTypeList("tag").title("Tag")),

      S.divider(),

      // --- Sections Group ---
      S.listItem()
        .title("Sections")
        .child(S.documentTypeList("section").title("Sections")),

      S.divider(),

      // --- Assets Group ---
      S.listItem()
        .title("Photo Asset")
        .child(S.documentTypeList("assetPhoto").title("Photo Asset")),
      S.listItem()
        .title("SVG Asset")
        .child(S.documentTypeList("assetSVG").title("SVG Asset")),
      S.listItem()
        .title("Video Asset")
        .child(S.documentTypeList("assetVideo").title("Video Asset")),
      S.listItem()
        .title("3D Model Asset")
        .child(S.documentTypeList("asset3d").title("3D Model Asset")),

      S.divider(),

      // --- Settings/Other Group ---
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Website/Platform")
        .child(S.documentTypeList("website").title("Website/Platform")),
    ]);

export default deskStructure;
