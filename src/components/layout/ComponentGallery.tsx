import ImageSection from "../content/ImageSection";
import VideoSection from "../content/VideoSection";
import IconSection from "../content/IconSection";
import AvatarSection from "../content/AvatarSection";
import { VideoAsset } from "@/lib/handlers/clientHandlers";

export default function ComponentsTestPage() {
  // Mock/test data for each component
  const mockImage = {
    url: "/file.svg",
    caption: { en: "A sample image caption." },
  };
  const mockVideo = {
    _id: "mock-id",
    _type: "assetVideo",
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: "mock-rev",
    title: { _type: "localeString", en: "Mock Video" },
    description: { _type: "localeString", en: "A sample video description." },
    caption: { _type: "localeString", en: "A sample video caption." },
    order: 1,
    poster: "/file.svg",
    sourceType: "cdn",
    cdnSdUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    cdn1kUrl: "",
    cdn2kUrl: "",
    cdn4kUrl: "",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  } as VideoAsset;
  const mockIcon = {
    svgData:
      '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#6366F1"/><text x="24" y="29" text-anchor="middle" font-size="16" fill="#fff">SVG</text></svg>',
  };
  const mockAvatar = {
    url: "/window.svg",
  };

  return (
    <main className="max-w-2xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Component Gallery</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">ImageSection</h2>
        <ImageSection image={mockImage} fullBleed={false} showCaption={true} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">VideoSection</h2>
        <VideoSection
          video={mockVideo}
          autoplay={false}
          loop={false}
          showCaption={true}
        />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">IconSection</h2>
        <IconSection
          icon={mockIcon}
          heading={{ en: "Sample Icon" }}
          description={{ en: "This is a sample SVG icon." }}
        />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">AvatarSection</h2>
        <AvatarSection
          avatar={mockAvatar}
          heading={{ en: "Sample Avatar" }}
          description={{ en: "This is a sample avatar image." }}
        />
      </section>
    </main>
  );
}
