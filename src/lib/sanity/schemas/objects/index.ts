export { default as castRefObject } from "../element/casting/castRefObject";
export { default as castRefImageObject } from "../element/casting/castRefImageObject";
export { default as castRefHeadlineObject } from "../element/casting/castRefHeadlineObject";
export { default as castRefBodyTextObject } from "../element/casting/castRefBodyTextObject";
export { default as castRefButtonObject } from "../element/casting/castRefButtonObject";
export { default as castRefVectorObject } from "../element/casting/castRefVectorObject";
export { default as castRefModuleObject } from "../wings/casting/castRefModuleObject";
export { default as castRefWingObject } from "../scaffold/casting/castRefWingObject";

// Export all objects as an array
import castRefObject from "../element/casting/castRefObject";
import castRefImageObject from "../element/casting/castRefImageObject";
import castRefHeadlineObject from "../element/casting/castRefHeadlineObject";
import castRefBodyTextObject from "../element/casting/castRefBodyTextObject";
import castRefButtonObject from "../element/casting/castRefButtonObject";
import castRefVectorObject from "../element/casting/castRefVectorObject";
import castRefModuleObject from "../wings/casting/castRefModuleObject";
import castRefWingObject from "../scaffold/casting/castRefWingObject";

export const objects = [
  castRefObject,
  castRefImageObject,
  castRefHeadlineObject,
  castRefBodyTextObject,
  castRefButtonObject,
  castRefVectorObject,
  castRefModuleObject,
  castRefWingObject,
];

export default objects;
