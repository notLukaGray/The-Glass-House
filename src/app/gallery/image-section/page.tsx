"use client";

import React from "react";
import ImageSection from "../../../components/content/ImageSection";

const TestImageSection = () => {
  // Test image data
  const testImage = {
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    caption: { en: "Test Caption" },
    altText: { en: "Test Alt Text" },
    description: { en: "Test Description" },
  };

  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8">ImageSection Component Tests</h1>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <ImageSection image={testImage} />
      </section>

      {/* Size Variations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Size Variations</h2>
        <div className="space-y-4">
          <div>
            <div className="font-mono text-xs mb-1">size=&quot;small&quot;</div>
            <ImageSection image={testImage} size="small" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              size=&quot;medium&quot;
            </div>
            <ImageSection image={testImage} size="medium" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">size=&quot;large&quot;</div>
            <ImageSection image={testImage} size="large" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">size=&quot;full&quot;</div>
            <ImageSection image={testImage} size="full" />
          </div>
        </div>
      </section>

      {/* Alignment Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Alignment Tests</h2>
        <div className="space-y-4">
          <div>
            <div className="font-mono text-xs mb-1">
              alignment=&quot;left&quot;
            </div>
            <ImageSection image={testImage} alignment="left" width="300px" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              alignment=&quot;center&quot;
            </div>
            <ImageSection image={testImage} alignment="center" width="300px" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              alignment=&quot;right&quot;
            </div>
            <ImageSection image={testImage} alignment="right" width="300px" />
          </div>
        </div>
      </section>

      {/* Aspect Ratio Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Aspect Ratio Tests</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-xs mb-1">
              aspectRatio=&quot;16:9&quot;
            </div>
            <ImageSection image={testImage} aspectRatio="16:9" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              aspectRatio=&quot;4:3&quot;
            </div>
            <ImageSection image={testImage} aspectRatio="4:3" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              aspectRatio=&quot;1:1&quot;
            </div>
            <ImageSection image={testImage} aspectRatio="1:1" />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              aspectRatio=&quot;3:4&quot;
            </div>
            <ImageSection image={testImage} aspectRatio="3:4" />
          </div>
        </div>
      </section>

      {/* Object Fit Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Object Fit Tests</h2>
        <div className="space-y-4">
          <div>
            <div className="font-mono text-xs mb-1">
              objectFit=&quot;cover&quot;
            </div>
            <ImageSection
              image={testImage}
              objectFit="cover"
              width="300px"
              height="150px"
            />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              objectFit=&quot;contain&quot;
            </div>
            <ImageSection
              image={testImage}
              objectFit="contain"
              width="300px"
              height="150px"
            />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              objectFit=&quot;fill&quot;
            </div>
            <ImageSection
              image={testImage}
              objectFit="fill"
              width="300px"
              height="150px"
            />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              objectFit=&quot;scale-down&quot;
            </div>
            <ImageSection
              image={testImage}
              objectFit="scale-down"
              width="300px"
              height="150px"
            />
          </div>
        </div>
      </section>

      {/* Box Shadow Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Box Shadow Test</h2>
        <div className="bg-white p-4">
          <ImageSection
            image={testImage}
            width="300px"
            height="150px"
            advanced={{ boxShadow: "xl" }}
          />
        </div>
      </section>

      {/* Advanced Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Advanced Features</h2>
        <div className="space-y-4">
          <div>
            <div className="font-mono text-xs mb-1">
              advanced: borderRadius=&quot;lg&quot;
            </div>
            <ImageSection image={testImage} advanced={{ borderRadius: "lg" }} />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              advanced: overlayColor=&quot;#000&quot;, overlayOpacity=0.3
            </div>
            <ImageSection
              image={testImage}
              advanced={{ overlayColor: "#000000", overlayOpacity: 0.3 }}
            />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              advanced: hoverEffect=&quot;zoom&quot;
            </div>
            <ImageSection
              image={testImage}
              advanced={{ hoverEffect: "zoom" }}
            />
          </div>
        </div>
      </section>

      {/* Responsive Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Responsive Tests</h2>
        <div className="space-y-4">
          <div>
            <div className="font-mono text-xs mb-1">
              advanced: hideOnMobile=true
            </div>
            <ImageSection image={testImage} advanced={{ hideOnMobile: true }} />
          </div>
          <div>
            <div className="font-mono text-xs mb-1">
              advanced: hideOnDesktop=true
            </div>
            <ImageSection
              image={testImage}
              advanced={{ hideOnDesktop: true }}
            />
          </div>
        </div>
      </section>

      {/* Link Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Link Test</h2>
        <ImageSection image={testImage} linkUrl="https://example.com" />
      </section>

      {/* Full Bleed Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Full Bleed Test</h2>
        <ImageSection image={testImage} fullBleed />
      </section>

      {/* Custom Dimensions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Dimensions</h2>
        <ImageSection
          image={testImage}
          width="300px"
          height="200px"
          maxWidth="400px"
        />
      </section>
    </div>
  );
};

export default TestImageSection;
