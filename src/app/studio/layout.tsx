import { FoundationProvider } from "@/lib/sanity/components/FoundationProvider";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FoundationProvider>
      <div
        style={{
          margin: 0,
          padding: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </FoundationProvider>
  );
}
