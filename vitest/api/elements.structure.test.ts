import { describe, it, expect } from "vitest";
import * as root from "@/app/api/elements/route";
import * as byType from "@/app/api/elements/[type]/route";
import * as byId from "@/app/api/elements/[type]/[id]/route";

describe("Element API Route Structure", () => {
  it("exports all required handlers from root route", () => {
    expect(root.GET).toBeTruthy();
    expect(root.POST).toBeTruthy();
    expect(root.PUT).toBeTruthy();
    expect(root.DELETE).toBeTruthy();
  });

  it("exports all required handlers from type route", () => {
    expect(byType.GET).toBeTruthy();
    expect(byType.POST).toBeTruthy();
  });

  it("exports all required handlers from id route", () => {
    expect(byId.GET).toBeTruthy();
    expect(byId.PUT).toBeTruthy();
    expect(byId.DELETE).toBeTruthy();
  });
});
