// Asset Schemas
// Temporarily commented out schemas that use old localeString types
// import photo from "./assets/photo";
// import svg from "./assets/svg";
// import video from "./assets/video";
// import model3d from "./assets/model3d";

// Document Schemas
// Temporarily commented out schemas that use old localeString/localeText types
// import about from "./documents/about";
// import user from "./documents/user";
// import blog from "./documents/blog";
// import category from "./documents/category";
// import globalBanner from "./documents/globalBanner";
// import page from "./documents/page";
// import project from "./documents/project";
// import route from "./documents/route";
// import settings from "./documents/settings";
// import tag from "./documents/tag";
// import section from "./documents/section";

// Foundation Schemas
import foundationSchemas from "./foundation";

// Object Schemas
// Temporarily commented out blockContent since it references old asset types
// import blockContent from "./objects/blockContent";
// Temporarily commented out schemas that use old localeString/localeText types
// import contactForm from "./objects/contactForm";
import glassLocaleString from "./objects/glassLocaleString";
import glassLocaleText from "./objects/glassLocaleText";
import glassLocaleRichText from "./objects/glassLocaleRichText";
// import navItem from "./objects/navItem";
import orderableDocumentList from "./objects/orderableDocumentList";
// import pageSections from "./objects/pageSections";
import seo from "./objects/seo";
// import website from "./objects/website";
import {
  castRefObject,
  castRefImageObject,
  castRefHeadlineObject,
  castRefBodyTextObject,
  castRefButtonObject,
  castRefVectorObject,
} from "./objects";

// Element Schemas (The Glass House)
import elements from "./element";

// Module Schemas (The Glass House)
import modules from "./modules";

// Blueprint Schemas (The Glass House)
import blueprintSchemas from "./blueprint";

// Scaffold Schemas (The Glass House)
import scaffoldSchemas from "./scaffold";

// Wing Schemas (The Glass House)
import wingSchemas from "./wings";

export const schemaTypes = [
  // Documents
  // Temporarily commented out schemas that use old localeString/localeText types
  // about,
  // user,
  // blog,
  // category,
  // globalBanner,
  // page,
  // project,
  // route,
  // settings,
  // tag,
  // section,

  // Foundation
  ...foundationSchemas,

  // Assets
  // Temporarily commented out schemas that use old localeString types
  // photo,
  // svg,
  // video,
  // model3d,

  // Objects
  // Temporarily commented out blockContent since it references old asset types
  // blockContent,
  // Temporarily commented out schemas that use old localeString/localeText types
  // contactForm,
  glassLocaleString,
  glassLocaleText,
  glassLocaleRichText,
  // navItem,
  orderableDocumentList,
  seo,
  // ...pageSections,
  // website,

  // Elements (The Glass House) - These use the new localization system
  ...elements,

  // Modules (The Glass House)
  ...modules,

  // Blueprints (The Glass House)
  ...blueprintSchemas,

  // Scaffolds (The Glass House)
  ...scaffoldSchemas,

  // Wings (The Glass House)
  ...wingSchemas,

  castRefObject,
  castRefImageObject,
  castRefHeadlineObject,
  castRefBodyTextObject,
  castRefButtonObject,
  castRefVectorObject,
];
