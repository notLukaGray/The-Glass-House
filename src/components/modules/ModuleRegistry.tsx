import React from "react";
import { HeroImageModule } from "./HeroImageModule";
import { useSanityData } from "../../lib/sanity/hooks/useSanityData";

// Module type mapping
const MODULE_COMPONENTS = {
  moduleHeroImage: HeroImageModule,
  // Add more modules here as they're created
  // moduleTextBlock: TextBlockModule,
  // moduleGallery: GalleryModule,
  // etc.
} as const;

type ModuleType = keyof typeof MODULE_COMPONENTS;

interface ModuleRegistryProps {
  moduleId: string;
  moduleType: ModuleType;
  language?: string;
  fallbackLanguage?: string;
}

export const ModuleRegistry: React.FC<ModuleRegistryProps> = ({
  moduleId,
  moduleType,
  language = "en",
  fallbackLanguage = "en",
}) => {
  const ModuleComponent = MODULE_COMPONENTS[moduleType];

  if (!ModuleComponent) {
    return (
      <div className="glass-module glass-module--unknown">
        <div className="glass-module__error">
          <p>Unknown module type: {moduleType}</p>
        </div>
      </div>
    );
  }

  return (
    <ModuleComponent
      moduleId={moduleId}
      language={language}
      fallbackLanguage={fallbackLanguage}
    />
  );
};

// Auto-detection version that fetches module data
interface AutoModuleRegistryProps {
  moduleId: string;
  language?: string;
  fallbackLanguage?: string;
}

export const AutoModuleRegistry: React.FC<AutoModuleRegistryProps> = ({
  moduleId,
  language = "en",
  fallbackLanguage = "en",
}) => {
  const {
    data: moduleData,
    loading,
    error,
  } = useSanityData({
    query: `*[_id == $moduleId][0] {
      _id,
      _type
    }`,
    params: { moduleId },
    cacheKey: `module-type-${moduleId}`,
  });

  if (loading) {
    return (
      <div className="glass-module glass-module--loading">
        <div className="glass-module__skeleton">
          <div className="glass-module__skeleton-header"></div>
        </div>
      </div>
    );
  }

  if (error || !moduleData) {
    return (
      <div className="glass-module glass-module--error">
        <div className="glass-module__error">
          <p>Failed to load module</p>
          {error && <p className="glass-module__error-details">{error}</p>}
        </div>
      </div>
    );
  }

  const moduleType = (moduleData as Record<string, unknown>)
    ._type as ModuleType;

  return (
    <ModuleRegistry
      moduleId={moduleId}
      moduleType={moduleType}
      language={language}
      fallbackLanguage={fallbackLanguage}
    />
  );
};

export default ModuleRegistry;
