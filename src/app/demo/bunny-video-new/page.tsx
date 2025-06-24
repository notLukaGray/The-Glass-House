import { getVideoAssets } from "@/lib/handlers/videoHandler";
import VideoPlayer from "@/components/ui/VideoPlayer";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export default async function BunnyVideoNewDemo() {
  // Get all video assets
  const videos = await getVideoAssets();

  // Use the first video for demo (you can change this to a specific video ID)
  const demoVideo = videos[0];

  if (!demoVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Videos Found</h1>
          <p className="text-gray-600">
            Please add a video asset in Sanity Studio with source type
            &quot;Bunny Stream&quot;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Bunny Video New Architecture Demo
        </h1>

        {}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Video Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Title:</strong> {demoVideo.title?.en || "No title"}
            </div>
            <div>
              <strong>Source Type:</strong> {demoVideo.sourceType}
            </div>
            <div>
              <strong>Library ID:</strong>{" "}
              {demoVideo.libraryId || "Not extracted"}
            </div>
            <div>
              <strong>Video GUID:</strong>{" "}
              {demoVideo.videoGuid || "Not extracted"}
            </div>
            <div>
              <strong>CDN Domain:</strong>{" "}
              {demoVideo.cdnDomain || "Not extracted"}
            </div>
            <div>
              <strong>Direct Play URL:</strong>
              <div className="break-all text-xs mt-1">
                {demoVideo.bunnyVideoUrl || "No URL"}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Iframe Player</h2>
          <VideoPlayer
            video={demoVideo}
            autoplay={false}
            loop={false}
            muted={false}
            responsive={true}
          />
          {demoVideo.caption?.en && (
            <p className="mt-4 text-gray-600 text-center">
              {demoVideo.caption.en}
            </p>
          )}
        </div>

        {}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Background Video (Autoplay)
          </h2>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <BackgroundVideo
              video={demoVideo}
              quality="720p"
              overlay={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {demoVideo.title?.en || "Background Video"}
                    </h3>
                    <p className="text-lg opacity-90">
                      {demoVideo.description?.en || "Autoplay background video"}
                    </p>
                  </div>
                </div>
              }
              overlayOpacity={0.4}
            />
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">All Available Videos</h2>
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video._id} className="border rounded-lg p-4">
                <h3 className="font-semibold">
                  {video.title?.en || "No title"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {video.description?.en || "No description"}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  <span className="mr-4">Type: {video.sourceType}</span>
                  <span className="mr-4">Order: {video.order}</span>
                  {video.cdnDomain && <span>CDN: ✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
