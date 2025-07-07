import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { WidgetElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// GitHub API Reference type
export interface GitHubApiRef {
  _type: "githubApiRefObject";
  name?: string;
  description?: string;
  userInfo?: {
    username?: string;
  };
  repositoryConfig?: {
    includeRepos?: boolean;
    specificRepos?: string[];
  };
  displayOptions?: {
    showStats?: boolean;
    showActivity?: boolean;
    showSocial?: boolean;
    showLanguages?: boolean;
  };
}

export type ApiRef = GitHubApiRef;

// Processed API Reference type
export interface ProcessedGitHubApiRef {
  type: "github";
  name?: string;
  description?: string;
  userInfo?: {
    username?: string;
  };
  repositoryConfig?: {
    includeRepos?: boolean;
    specificRepos?: string[];
  };
  displayOptions?: {
    showStats?: boolean;
    showActivity?: boolean;
    showSocial?: boolean;
    showLanguages?: boolean;
  };
  // Computed properties
  hasUsername: boolean;
  hasRepos: boolean;
  hasSpecificRepos: boolean;
  hasDisplayOptions: boolean;
  hasStats: boolean;
  hasActivity: boolean;
  hasSocial: boolean;
  hasLanguages: boolean;
}

export type ProcessedApiRef = ProcessedGitHubApiRef;

// Widget Element type for API
export interface WidgetElement extends ElementWithCasting {
  apiRefs?: ApiRef[];
  refreshInterval?: number;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level widget enhancer that captures ALL schema fields
const enhanceWidgetElement = (element: WidgetElement) => {
  // Process API references array
  const apiRefs: ProcessedApiRef[] =
    element.apiRefs?.map((ref: ApiRef) => {
      if (ref._type === "githubApiRefObject") {
        const githubRef = ref as GitHubApiRef;
        return {
          type: "github" as const,
          name: githubRef.name,
          description: githubRef.description,
          userInfo: githubRef.userInfo,
          repositoryConfig: githubRef.repositoryConfig,
          displayOptions: githubRef.displayOptions,
          // Computed properties
          hasUsername: !!githubRef.userInfo?.username,
          hasRepos: !!githubRef.repositoryConfig?.includeRepos,
          hasSpecificRepos: !!githubRef.repositoryConfig?.specificRepos?.length,
          hasDisplayOptions: !!githubRef.displayOptions,
          hasStats: !!githubRef.displayOptions?.showStats,
          hasActivity: !!githubRef.displayOptions?.showActivity,
          hasSocial: !!githubRef.displayOptions?.showSocial,
          hasLanguages: !!githubRef.displayOptions?.showLanguages,
        };
      }
      // For unknown ref types, return a default processed ref
      return {
        type: "github" as const,
        name: undefined,
        description: undefined,
        userInfo: undefined,
        repositoryConfig: undefined,
        displayOptions: undefined,
        hasUsername: false,
        hasRepos: false,
        hasSpecificRepos: false,
        hasDisplayOptions: false,
        hasStats: false,
        hasActivity: false,
        hasSocial: false,
        hasLanguages: false,
      };
    }) || [];

  // Widget configuration
  const widgetConfig = {
    refreshInterval: element.refreshInterval,
    apiRefs,
  };

  // API analysis
  const apiAnalysis = {
    hasApiRefs: apiRefs.length > 0,
    apiCount: apiRefs.length,
    hasGitHub: apiRefs.some((ref) => ref.type === "github"),
    hasOtherApis: apiRefs.some((ref) => ref.type !== "github"),
    githubRefs: apiRefs.filter((ref) => ref.type === "github"),
    otherRefs: apiRefs.filter((ref) => ref.type !== "github"),
  };

  // GitHub-specific analysis
  const githubAnalysis =
    apiAnalysis.githubRefs.length > 0
      ? {
          refCount: apiAnalysis.githubRefs.length,
          usernames: apiAnalysis.githubRefs
            .map((ref) => ref.userInfo?.username)
            .filter(Boolean),
          hasRepos: apiAnalysis.githubRefs.some((ref) => ref.hasRepos),
          hasSpecificRepos: apiAnalysis.githubRefs.some(
            (ref) => ref.hasSpecificRepos,
          ),
          hasStats: apiAnalysis.githubRefs.some((ref) => ref.hasStats),
          hasActivity: apiAnalysis.githubRefs.some((ref) => ref.hasActivity),
          hasSocial: apiAnalysis.githubRefs.some((ref) => ref.hasSocial),
          hasLanguages: apiAnalysis.githubRefs.some((ref) => ref.hasLanguages),
        }
      : null;

  // Refresh analysis
  const refreshAnalysis = {
    interval: element.refreshInterval,
    isFrequent: (element.refreshInterval ?? 0) <= 5,
    isStandard:
      (element.refreshInterval ?? 0) > 5 &&
      (element.refreshInterval ?? 0) <= 15,
    isInfrequent: (element.refreshInterval ?? 0) > 15,
    hasCustomInterval: element.refreshInterval !== 5,
  };

  return {
    widgetInfo: {
      // Localized content
      title: element.title,
      description: element.description,

      // Widget configuration
      config: widgetConfig,

      // Widget analysis
      analysis: apiAnalysis,
      github: githubAnalysis,
      refresh: refreshAnalysis,

      // Computed properties
      hasWidget: apiAnalysis.hasApiRefs,
      hasApiRefs: apiAnalysis.hasApiRefs,
      hasGitHub: apiAnalysis.hasGitHub,
      hasOtherApis: apiAnalysis.hasOtherApis,
      hasMultipleApis: apiAnalysis.apiCount > 1,
      hasSingleApi: apiAnalysis.apiCount === 1,
      hasGitHubRefs: !!githubAnalysis,
      hasRefreshInterval: !!element.refreshInterval,
      isFrequentRefresh: refreshAnalysis.isFrequent,
      isStandardRefresh: refreshAnalysis.isStandard,
      isInfrequentRefresh: refreshAnalysis.isInfrequent,
      hasCustomRefresh: refreshAnalysis.hasCustomInterval,

      // Advanced
      customId: element.customId,
      debug: element.debug,
      computedFields: element.computedFields,

      // Casting properties
      casting: element.casting,
    },
  };
};

const crud = createElementCrudHandler({
  elementType: "elementWidget",
  schema: WidgetElementSchema,
});

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;

// GET /api/elements/widget - Get elementWidget elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Widget fields
      "refreshInterval",
      "apiRefs[]->",
      "apiRefs[]._type",
      "apiRefs[].name",
      "apiRefs[].description",
      "apiRefs[].userInfo",
      "apiRefs[].repositoryConfig",
      "apiRefs[].displayOptions",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'title', 'description', 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementWidget",
      specificFields,
      params,
    );

    // Process elements with comprehensive widget enhancement
    const enhancedData = processElements(
      elements as WidgetElement[],
      enhanceWidgetElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementWidget",
      "widget",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "widget");
  }
}
