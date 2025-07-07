import { elementTextSingleLineCastingFields } from "../elementTextSingleLine";
import { elementImageCastingFields } from "../elementImage";
import { elementTextBlockCastingFields } from "../elementTextBlock";
import { elementRichTextCastingFields } from "../elementRichText";
import { elementButtonCastingFields } from "../elementButton";
import { elementSVGCastingFields } from "../elementSVG";
import { elementDividerCastingFields } from "../elementDivider";
import { elementWidgetCastingFields } from "../elementWidget";

export const elementCastingRegistry: Record<string, unknown[]> = {
  elementTextSingleLine: elementTextSingleLineCastingFields,
  elementTextBlock: elementTextBlockCastingFields,
  elementRichText: elementRichTextCastingFields,
  elementImage: elementImageCastingFields,
  elementButton: elementButtonCastingFields,
  elementSVG: elementSVGCastingFields,
  elementDivider: elementDividerCastingFields,
  elementWidget: elementWidgetCastingFields,
  // Add more mappings as you create new elements
};
