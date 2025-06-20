"use client";

import React from "react";
import dynamic from "next/dynamic";
import TextPressure from "@/components/features/TextPressure";

const DotGrid = dynamic(() => import("@/components/features/DotGrid"), { ssr: false });

function TimerClient({ commitTime, commitMessage }: { commitTime: string | null, commitMessage?: string | null }) {
  const [since, setSince] = React.useState<string>("");
  React.useEffect(() => {
    if (!commitTime) return;
    const commitDate = new Date(commitTime);
    function update() {
      const now = new Date();
      const diff = Math.floor((now.getTime() - commitDate.getTime()) / 1000);
      const days = Math.floor(diff / (24 * 3600));
      const hours = Math.floor((diff % (24 * 3600)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      setSince(`${days}d ${hours}h ${minutes}m`);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [commitTime]);
  return (
    <div className="fixed top-[75%] left-1/2 -translate-x-1/2 bg-black px-6 py-3 rounded border border-white/10 font-mono text-white text-sm tracking-wider shadow-lg flex flex-col items-center gap-1 min-w-[260px]">
      <div className="opacity-70 text-xs">Last Github Commit</div>
      {commitMessage && (
        <div className="text-xs font-mono" style={{ color: '#8f4d89' }}>
          {commitMessage.length > 30 ? `${commitMessage.slice(0, 30)}...` : commitMessage}
        </div>
      )}
      <div>{commitTime ? since : "..."}</div>
    </div>
  );
}

export default function HomePageClient({ commitTime, commitMessage }: { commitTime: string | null, commitMessage?: string | null }) {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Base Layer - DotGrid */}
      <div className="absolute inset-0 bg-black" style={{ overflow: 'hidden' }}>
        <DotGrid
          dotSize={2}
          gap={12}
          baseColor="#24061e"
          activeColor="#ff00ea"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Content Layer - Centered */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center">
          {/* Under Construction Text */}
          <div className="w-screen max-w-[900px] flex items-center justify-center px-4">
            <TextPressure
              text="UNDER CONSTRUCTION"
              fontFamily="Compressa VF"
              fontUrl="https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
              width={true}
              weight={true}
              italic={true}
              alpha={false}
              flex={true}
              stroke={true}
              scale={false}
              textColor="#FFFFFF"
              strokeColor="#000000"
              minFontSize={100}
            />
          </div>
          <div className="text-white text-center text-light text-xl tracking-widest uppercase mt-12" style={{ fontFamily: 'Compressa VF' }}>
            COME BACK SOON
          </div>
        </div>

        {/* Timer */}
        <TimerClient commitTime={commitTime} commitMessage={commitMessage} />
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'Compressa VF';
          src: url('https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2');
          font-style: normal;
        }
      `}</style>
    </main>
  );
} 