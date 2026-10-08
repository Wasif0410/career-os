/** The largest resume we take. A one or two page PDF without photos is far smaller. */
export const MAX_RESUME_BYTES = 2 * 1024 * 1024;

export type FileCheck = { ok: true } | { ok: false; reason: string };

/** Checks a picked or dropped file before anything is uploaded: a PDF, not empty, at most 2 MB. */
export function checkResumeFile(file: Pick<File, "name" | "type" | "size">): FileCheck {
  const pdf = file.type === "application/pdf" || (!file.type && file.name.toLowerCase().endsWith(".pdf"));
  if (!pdf) return { ok: false, reason: "That isn't a PDF. Export your resume as a PDF and try again." };
  if (file.size === 0) return { ok: false, reason: "That file is empty." };
  if (file.size > MAX_RESUME_BYTES)
    return { ok: false, reason: "That PDF is over 2 MB. Export it again without images." };
  return { ok: true };
}

/** "148 KB", "1.4 MB" */
export function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
