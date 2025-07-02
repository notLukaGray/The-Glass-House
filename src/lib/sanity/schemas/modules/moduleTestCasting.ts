import { createBaseModuleSchema } from "./baseModuleSchema";

// Test module to demonstrate the new modular casting system
export const moduleTestCasting = createBaseModuleSchema(
  "moduleTestCasting",
  "Test Casting Module",
  [
    // Simple content field for testing
    {
      name: "content",
      title: "Content",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          description: "Test title for this module",
        },
        {
          name: "description",
          title: "Description",
          type: "text",
          description: "Test description for this module",
        },
      ],
    },
  ],
  // This will use the default module casting fields from createCastingFields('module')
);

export default moduleTestCasting;
