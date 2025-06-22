// Shared types for portfolio sections and related content

/**
 * Represents a resolved section of a portfolio or page.
 * This is a generic type for any section, with at least a _key and _type.
 * Additional properties are allowed for flexibility.
 */
export interface ResolvedSection {
  _key: string;
  _type: string;
  [key: string]: unknown;
}
