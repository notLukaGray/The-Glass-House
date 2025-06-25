import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import * as nextNavigation from "next/navigation";

// This file verifies that the test setup is working correctly
describe("Test Setup Verification", () => {
  it("should pass basic assertions", () => {
    expect(true).toBe(true);
  });

  it("should render a div with testing library", () => {
    render(
      React.createElement("div", { "data-testid": "test-div" }, "Hello World"),
    );
    expect(screen.getByTestId("test-div")).toBeInTheDocument();
  });

  it("should have Next.js mocks working", () => {
    // Test that our mocks are working by checking if the mock exists
    expect(nextNavigation.useRouter).toBeDefined();
    expect(typeof nextNavigation.useRouter).toBe("function");
  });
}); 