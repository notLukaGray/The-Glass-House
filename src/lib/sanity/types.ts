import { Rule } from "@sanity/types";
export interface SanityField {
  name: string;
  title: string;
  type: string;
  fieldset?: string;
  validation?: (rule: Rule) => Rule;
  description?: string;
  options?: Record<string, unknown>;
  hidden?: (params: { parent: Record<string, unknown> }) => boolean;
  components?: Record<string, unknown>;
  readOnly?: boolean;
  fields?: SanityField[];
  initialValue?: unknown;
  of?: Array<{ type: string; [key: string]: unknown }>;
  to?: Array<{ type: string }>;
}
