import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Locked } from "./locked";

describe("Locked", () => {
  it("shows the content when the tier includes the feature", () => {
    render(
      <Locked user={{ tier: "pro" }} feature="plan">
        <p>Your plan</p>
      </Locked>,
    );
    expect(screen.getByText("Your plan")).toBeVisible();
    expect(screen.queryByRole("link", { name: /unlock/i })).not.toBeInTheDocument();
  });

  it("hides the content from assistive tech and links to pricing when locked", () => {
    render(
      <Locked user={{ tier: "free" }} feature="plan">
        <p>Your plan</p>
      </Locked>,
    );
    expect(screen.getByRole("link", { name: /unlock with pro/i })).toHaveAttribute("href", "/pricing");
    expect(screen.queryByText("Your plan")?.closest("[aria-hidden]")).not.toBeNull();
  });

  it("names the Elite tier for Elite-only features", () => {
    render(
      <Locked user={{ tier: "pro" }} feature="resume.coachReview">
        <p>Coach review</p>
      </Locked>,
    );
    expect(screen.getByRole("link", { name: /unlock with elite/i })).toBeInTheDocument();
  });

  it("blurs the preview instead of the real content when one is given", () => {
    render(
      <Locked user={{ tier: "free" }} feature="plan" preview={<p>Example plan</p>}>
        <p>Private plan</p>
      </Locked>,
    );
    expect(screen.getByText("Example plan")).toBeInTheDocument();
    expect(screen.queryByText("Private plan")).not.toBeInTheDocument();
  });
});
