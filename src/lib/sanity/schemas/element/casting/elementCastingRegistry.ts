import { elementTextSingleLineCastingFields } from "../elementTextSingleLine";
import { elementImageCastingFields } from "../elementImage";
import { elementTextBlockCastingFields } from "../elementTextBlock";
import { elementRichTextCastingFields } from "../elementRichText";
import { elementButtonCastingFields } from "../elementButton";
import { elementSVGCastingFields } from "../elementSVG";

export const elementCastingRegistry: Record<string, unknown[]> = {
  elementTextSingleLine: elementTextSingleLineCastingFields,
  elementTextBlock: elementTextBlockCastingFields,
  elementRichText: elementRichTextCastingFields,
  elementImage: elementImageCastingFields,
  elementButton: elementButtonCastingFields,
  elementSVG: elementSVGCastingFields,
  // Add more mappings as you create new elements
};
