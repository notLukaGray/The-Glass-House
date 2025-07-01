import React from "react";
import Image from "next/image";
import { useModule } from "../../lib/sanity/hooks/useSanityData";
import {
  getLocalizedContent,
  generateAriaLabel,
  getModuleClasses,
  processModuleData,
} from "../../lib/frontend/helpers";

interface HeroImageModuleProps {
  moduleId: string;
  language?: string;
  fallbackLanguage?: string;
}

export const HeroImageModule: React.FC<HeroImageModuleProps> = ({
  moduleId,
  language = "en",
  fallbackLanguage = "en",
}) => {
  const { data: moduleData, loading, error } = useModule(moduleId);

  if (loading) {
    return (
      <div className="glass-module glass-module--loading">
        <div className="glass-module__skeleton">
          <div className="glass-module__skeleton-header"></div>
          <div className="glass-module__skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (error || !moduleData) {
    return (
      <div className="glass-module glass-module--error">
        <div className="glass-module__error">
          <p>Failed to load hero image module</p>
          {error && <p className="glass-module__error-details">{error}</p>}
        </div>
      </div>
    );
  }

  const processed = processModuleData(moduleData);
  if (!processed) return null;

  const { type, id, title, description, layout, behavior, theme, content } =
    processed;

  // Properly type the content object
  const headline = content.headline as
    | { content?: Record<string, string> }
    | undefined;
  const backgroundImage = content.backgroundImage as
    | {
        altText?: Record<string, string>;
        image?: { asset?: { url: string } };
      }
    | undefined;
  const ctaButton = content.ctaButton as
    | {
        text?: Record<string, string>;
        url?: string;
        variant?: string;
        size?: string;
        title?: string;
      }
    | undefined;

  // Extract element content
  const headlineText = headline?.content
    ? getLocalizedContent(headline.content, language, fallbackLanguage)
    : "";

  const imageAlt = backgroundImage?.altText
    ? getLocalizedContent(backgroundImage.altText, language, fallbackLanguage)
    : "";

  const buttonText = ctaButton?.text
    ? getLocalizedContent(ctaButton.text, language, fallbackLanguage)
    : "";

  // Generate accessibility attributes
  const ariaLabel = generateAriaLabel(title, description, "Hero Image");
  const moduleClasses = getModuleClasses(layout, behavior, theme);

  return (
    <section
      className={moduleClasses}
      aria-label={ariaLabel}
      data-module-id={id}
      data-module-type={type}
    >
      {}
      {backgroundImage?.image && backgroundImage.image.asset?.url && (
        <div className="glass-module__background">
          <Image
            src={backgroundImage.image.asset.url}
            alt={imageAlt}
            className="glass-module__background-image"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      {}
      <div className="glass-module__content">
        <div className="glass-module__container">
          {}
          {headlineText && (
            <h1 className="glass-module__headline">{headlineText}</h1>
          )}

          {}
          {ctaButton && buttonText && (
            <div className="glass-module__cta">
              <a
                href={ctaButton.url || "#"}
                className={`glass-button glass-button--${
                  ctaButton.variant || "primary"
                } glass-button--${ctaButton.size || "medium"}`}
                aria-label={ctaButton.title || buttonText}
              >
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroImageModule;
