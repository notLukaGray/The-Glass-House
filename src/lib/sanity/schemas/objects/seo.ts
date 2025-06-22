const seo = {
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    { name: "metaTitle", title: "Meta Title", type: "localeString" },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "localeString",
    },
    { name: "metaImage", title: "Meta Image", type: "url" },
  ],
};

export default seo;
