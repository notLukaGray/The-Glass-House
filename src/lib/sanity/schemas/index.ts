// Foundation Schemas
import foundationSchemas from "./foundation";

// Object Schemas
import glassLocaleString from "./objects/glass/glassLocaleString";
import glassLocaleText from "./objects/glass/glassLocaleText";
import glassLocaleRichText from "./objects/glass/glassLocaleRichText";
import orderableDocumentList from "./objects/core/orderableDocumentList";
import seo from "./objects/core/seo";
import {
  castRefObject,
  castRefImageObject,
  castRefBodyTextObject,
  castRefHeadlineObject,
  castRefButtonObject,
  castRefVectorObject,
  castRefDividerObject,
  castRefModuleObject,
  castRefWingObject,
  githubApiRefObject,
  dotGridBackgroundRefObject,
  objectElementVideoEmbed,
  objectElementVideoCDN,
  objectElementVideoDirect,
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
  ...foundationSchemas,

  glassLocaleString,
  glassLocaleText,
  glassLocaleRichText,
  orderableDocumentList,
  seo,

  // Elements
  ...elements,

  // Modules
  ...modules,

  // Blueprints
  ...blueprintSchemas,

  // Scaffolds
  ...scaffoldSchemas,

  // Wings
  ...wingSchemas,

  castRefObject,
  castRefImageObject,
  castRefBodyTextObject,
  castRefHeadlineObject,
  castRefButtonObject,
  castRefVectorObject,
  castRefDividerObject,
  castRefModuleObject,
  castRefWingObject,
  githubApiRefObject,
  dotGridBackgroundRefObject,
  objectElementVideoEmbed,
  objectElementVideoCDN,
  objectElementVideoDirect,
];
