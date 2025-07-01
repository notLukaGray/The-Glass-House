// Base wing schema - basic information every wing needs
export const createBaseWingSchema = (
  wingName: string,
  wingTitle: string,
  additionalFields: unknown[] = [],
) => {
  return {
    name: wingName,
    title: wingTitle,
    type: "document",
    fields: [
      // Additional fields (like modules)
      ...additionalFields,

      // Basic wing info with localization
      {
        name: "title",
        title: "Wing Title",
        type: "glassLocaleString",
        description: "Internal title for this wing",
      },
      {
        name: "description",
        title: "Wing Description",
        type: "glassLocaleText",
        description: "Brief description of what this wing does",
      },
    ],
  };
};
