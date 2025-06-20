import { getSvgAssets, getColoredSvg } from '@/lib/handlers/clientHandlers';
import { getVideoAsset } from '@/lib/handlers/clientHandlers';
import VideoPlayer from '@/components/ui/VideoPlayer';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  try {
    const [assets, videoAsset] = await Promise.all([
      getSvgAssets(),
      getVideoAsset({ id: "1984b8e8-2731-47e6-b709-b3eb9074468a" }).catch(() => null)
    ]);
    
    if (!assets.length && !videoAsset) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
          <h1 className="text-4xl font-bold">No assets found</h1>
        </main>
      );
    }

    return (
      <main className="min-h-screen p-20 bg-black">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Asset Gallery</h1>
        
        {videoAsset && (
          <div className="mb-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">{videoAsset.title.en}</h2>
              <VideoPlayer asset={videoAsset} className="aspect-video" />
              <p className="mt-4 text-gray-400">{videoAsset.description.en}</p>
            </div>
          </div>
        )}
        
        {assets.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">SVGs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {assets.map((asset) => {
                const coloredSvg = getColoredSvg(asset.svgData, asset.color);
                return (
                  <div key={asset._id} className="flex flex-col items-center p-6 bg-zinc-900 rounded-lg shadow-lg border border-zinc-800">
                    <div className="w-48 h-48 flex items-center justify-center">
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ 
                          __html: coloredSvg.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"')
                        }} 
                      />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-white">{asset.title.en}</h2>
                    <p className="mt-2 text-gray-400 text-center">{asset.description.en}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Color: #{asset.color}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error('Error loading gallery:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
        <h1 className="text-4xl font-bold">Error loading gallery</h1>
        <p className="mt-4 text-gray-400">Please try again later.</p>
      </main>
    );
  }
}