import { GlassLocalizationInput } from "../../../components/GlassLocalizationInput";

const seo = {
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "glassLocaleString",
      components: { input: GlassLocalizationInput },
      options: {
        fieldType: "string",
      },
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "glassLocaleString",
      components: { input: GlassLocalizationInput },
      options: {
        fieldType: "string",
      },
    },
    { name: "metaImage", title: "Meta Image", type: "url" },
  ],
};

export default seo;
