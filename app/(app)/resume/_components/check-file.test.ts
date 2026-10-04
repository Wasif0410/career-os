import { describe, expect, it } from "vitest";
import { MAX_RESUME_BYTES, checkResumeFile, formatSize } from "./check-file";

const file = (name: string, type: string, size: number) => ({ name, type, size });

describe("checkResumeFile", () => {
  it("accepts a PDF up to 2 MB", () => {
    expect(checkResumeFile(file("resume.pdf", "application/pdf", 150_000))).toEqual({ ok: true });
    expect(checkResumeFile(file("resume.pdf", "application/pdf", MAX_RESUME_BYTES))).toEqual({ ok: true });
  });

  it("accepts a .pdf name when the browser gives no type", () => {
    expect(checkResumeFile(file("Resume.PDF", "", 90_000))).toEqual({ ok: true });
  });

  it("turns away other file types", () => {
    const result = checkResumeFile(file("resume.docx", "application/vnd.openxmlformats", 40_000));
    expect(result.ok).toBe(false);
  });

  it("turns away empty and oversized files", () => {
    expect(checkResumeFile(file("resume.pdf", "application/pdf", 0)).ok).toBe(false);
    expect(checkResumeFile(file("resume.pdf", "application/pdf", MAX_RESUME_BYTES + 1)).ok).toBe(false);
  });
});

describe("formatSize", () => {
  it("shows kilobytes under a megabyte and megabytes above", () => {
    expect(formatSize(151_552)).toBe("148 KB");
    expect(formatSize(1_468_006)).toBe("1.4 MB");
  });
});
