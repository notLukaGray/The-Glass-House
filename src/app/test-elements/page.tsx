"use client";

import { useState, useEffect } from "react";

interface ComputedFields {
  ariaLabel?: {
    _type: string;
    en?: string;
    es?: string;
  };
  altText?: {
    _type: string;
    en?: string;
    es?: string;
  };
  customId?: string;
}

interface Element {
  _id: string;
  _type: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
  text?: Record<string, string>;
  buttonText?: Record<string, string>;
  richTextContent?: Record<string, unknown[]>;
  imageUpload?: unknown;
  imageUrl?: string;
  svgString?: string;
  svgFile?: unknown;
  computedFields?: ComputedFields;
  customId?: string;
  debug?: boolean;
}

export default function TestElementsPage() {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchElements = async (type?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = type
        ? `/api/content/elements?type=${type}&limit=5`
        : "/api/content/elements?limit=5";

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch elements");
      }

      setElements(data.elements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  const renderComputedFields = (computedFields?: ComputedFields) => {
    if (!computedFields) {
      return <span className="text-gray-500">No computed fields</span>;
    }

    return (
      <div className="space-y-2">
        <div>
          <strong>ARIA Label:</strong>
          <div className="ml-4">
            {computedFields.ariaLabel?.en && (
              <div>EN: {computedFields.ariaLabel.en}</div>
            )}
            {computedFields.ariaLabel?.es && (
              <div>ES: {computedFields.ariaLabel.es}</div>
            )}
          </div>
        </div>
        <div>
          <strong>Alt Text:</strong>
          <div className="ml-4">
            {computedFields.altText?.en && (
              <div>EN: {computedFields.altText.en}</div>
            )}
            {computedFields.altText?.es && (
              <div>ES: {computedFields.altText.es}</div>
            )}
          </div>
        </div>
        <div>
          <strong>Custom ID:</strong>{" "}
          {computedFields.customId || "Auto-generated"}
        </div>
      </div>
    );
  };

  const renderElementContent = (element: Element) => {
    switch (element._type) {
      case "elementTextSingleLine":
        return (
          <div>
            <strong>Text:</strong>{" "}
            {element.text?.en || element.text?.es || "No text"}
          </div>
        );
      case "elementButton":
        return (
          <div>
            <strong>Button Text:</strong>{" "}
            {element.buttonText?.en ||
              element.buttonText?.es ||
              "No button text"}
          </div>
        );
      case "elementRichText":
        return (
          <div>
            <strong>Rich Text:</strong>{" "}
            {element.richTextContent ? "Content available" : "No content"}
          </div>
        );
      case "elementImage":
        return (
          <div>
            <strong>Image:</strong>{" "}
            {element.imageUpload
              ? "Uploaded"
              : element.imageUrl
                ? "External URL"
                : "No image"}
          </div>
        );
      default:
        return (
          <div>Content: {JSON.stringify(element).substring(0, 100)}...</div>
        );
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Element Computed Fields Test</h1>

      <div className="mb-6 space-x-4">
        <button
          onClick={() => fetchElements()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load All Elements
        </button>
        <button
          onClick={() => fetchElements("elementTextSingleLine")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Load Text Elements
        </button>
        <button
          onClick={() => fetchElements("elementButton")}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Load Button Elements
        </button>
        <button
          onClick={() => fetchElements("elementRichText")}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Load Rich Text Elements
        </button>
      </div>

      {loading && <div className="text-blue-600">Loading elements...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      <div className="space-y-6">
        {elements.map((element) => (
          <div
            key={element._id}
            className="border rounded-lg p-6 bg-white shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{element._type}</h2>
                <p className="text-gray-600">ID: {element._id}</p>
                {element.customId && (
                  <p className="text-gray-600">Custom ID: {element.customId}</p>
                )}
                {element.debug && (
                  <p className="text-orange-600">Debug mode enabled</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Content:</h3>
                {renderElementContent(element)}
                {element.title && (
                  <div className="mt-2">
                    <strong>Title:</strong>{" "}
                    {element.title.en || element.title.es || "No title"}
                  </div>
                )}
                {element.description && (
                  <div className="mt-2">
                    <strong>Description:</strong>{" "}
                    {element.description.en ||
                      element.description.es ||
                      "No description"}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Computed Fields:</h3>
                {renderComputedFields(element.computedFields)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {elements.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500">
          No elements found. Try creating some elements in Sanity Studio first.
        </div>
      )}
    </div>
  );
}
