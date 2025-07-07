export { default as castRefObject } from "../element/casting/castRefObject";
export { default as castRefImageObject } from "../element/casting/castRefImageObject";
export { default as castRefHeadlineObject } from "../element/casting/castRefHeadlineObject";
export { default as castRefBodyTextObject } from "../element/casting/castRefBodyTextObject";
export { default as castRefButtonObject } from "../element/casting/castRefButtonObject";
export { default as castRefVectorObject } from "../element/casting/castRefVectorObject";
export { default as castRefDividerObject } from "../element/casting/castRefDividerObject";
export { default as castRefModuleObject } from "../wings/casting/castRefModuleObject";
export { default as castRefWingObject } from "../scaffold/casting/castRefWingObject";
export { default as githubApiRefObject } from "./module/objectModuleWidgetGithub";
export { dotGridBackgroundRefObject } from "./module/objectModuleDynamicBackgroundDotGrid";
export { objectElementVideoEmbed } from "./element/objectElementVideoEmbed";
export { objectElementVideoCDN } from "./element/objectElementVideoCDN";
export { objectElementVideoDirect } from "./element/objectElementVideoDirect";

// Export all objects as an array
import castRefObject from "../element/casting/castRefObject";
import castRefImageObject from "../element/casting/castRefImageObject";
import castRefHeadlineObject from "../element/casting/castRefHeadlineObject";
import castRefBodyTextObject from "../element/casting/castRefBodyTextObject";
import castRefButtonObject from "../element/casting/castRefButtonObject";
import castRefVectorObject from "../element/casting/castRefVectorObject";
import castRefDividerObject from "../element/casting/castRefDividerObject";
import castRefModuleObject from "../wings/casting/castRefModuleObject";
import castRefWingObject from "../scaffold/casting/castRefWingObject";
import githubApiRefObject from "./module/objectModuleWidgetGithub";
import { dotGridBackgroundRefObject } from "./module/objectModuleDynamicBackgroundDotGrid";
import { objectElementVideoEmbed } from "./element/objectElementVideoEmbed";
import { objectElementVideoCDN } from "./element/objectElementVideoCDN";
import { objectElementVideoDirect } from "./element/objectElementVideoDirect";

export const objects = [
  castRefObject,
  castRefImageObject,
  castRefHeadlineObject,
  castRefBodyTextObject,
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

export default objects;
