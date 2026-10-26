import { describe, expect, it } from "vitest";
import { categorize, docsIndex } from "./components";

describe("categorize", () => {
  it("uses the library's own docs section when it has one", () => {
    expect(categorize("activity-terrain", "https://kokonutui.com/docs/cards/activity-terrain")).toBe("Cards");
    expect(categorize("file-diff", "https://beui.dev/components/agents/file-diff")).toBe("AI & agents");
  });
  it("falls back to the name", () => {
    expect(categorize("halo-button", null)).toBe("Buttons");
    expect(categorize("shader-lens-blur", null)).toBe("Backgrounds & shaders");
    expect(categorize("tabs", "https://ui.shadcn.com/docs/components/radix/tabs")).toBe("Navigation");
  });
});

describe("docsIndex", () => {
  it("prefers component docs pages over other pages with the same slug", () => {
    const xml = "<url><loc>https://x.dev/blog/tabs</loc></url><url><loc>https://x.dev/docs/components/tabs</loc></url>";
    expect(docsIndex(xml).get("tabs")).toBe("https://x.dev/docs/components/tabs");
  });
});
