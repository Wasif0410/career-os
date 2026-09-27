"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { waitlistTargets } from "@/lib/site";

export type WaitlistState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; field?: "email" | "target"; values: { email: string; target: string } };

const targetValues = waitlistTargets.map((t) => t.value) as [string, ...string[]];

const schema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  target: z.enum(targetValues).optional(),
  source: z.string().max(40).optional(),
  // Honeypot. Real people never see or fill this field.
  website: z.string().max(0).optional(),
});

function read(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value !== "" ? value : undefined;
}

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  // Echoed back on errors so the form keeps what the visitor typed.
  const values = { email: read(formData, "email") ?? "", target: read(formData, "target") ?? "" };

  const parsed = schema.safeParse({
    email: values.email,
    target: read(formData, "target"),
    source: read(formData, "source"),
    website: read(formData, "website"),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    if (issue?.path[0] === "website") {
      // Quietly accept bot submissions so they don't retry.
      return { status: "success", message: "You're on the list." };
    }
    if (issue?.path[0] === "target") {
      return { status: "error", field: "target", message: "Pick a target from the list.", values };
    }
    return { status: "error", field: "email", message: "Enter a valid email address, like you@school.ca.", values };
  }

  const { email, target, source } = parsed.data;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[waitlist] Supabase not configured; skipping insert for", email);
      return { status: "success", message: `You're on the list. We'll email ${email} when your spot opens.` };
    }
    console.error("[waitlist] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing");
    return { status: "error", message: "Sign-ups aren't working right now. Try again in a few minutes.", values };
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("waitlist").insert({ email, target: target ?? null, source: source ?? null });

  if (error) {
    if (error.code === "23505") {
      return { status: "success", message: `${email} is already on the list. We'll be in touch.` };
    }
    console.error("[waitlist] insert failed", error);
    return { status: "error", message: "Sign-ups aren't working right now. Try again in a few minutes.", values };
  }

  await sendConfirmation(email);

  return { status: "success", message: `You're on the list. We'll email ${email} when your spot opens.` };
}

/** Best-effort confirmation email. A failed email never fails the sign-up. */
async function sendConfirmation(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: email,
        subject: "You're on the Career OS waitlist",
        text: [
          "Thanks for joining the Career OS waitlist.",
          "",
          "We're opening Career OS in waves so every student gets real attention from the coaches.",
          "We'll email you as soon as your spot opens.",
          "",
          "In the meantime, our free guides are a good place to start.",
          "",
          "Wasif & Abishek",
          "Career OS",
        ].join("\n"),
      }),
    });
    if (!res.ok) console.error("[waitlist] confirmation email failed", res.status, await res.text());
  } catch (err) {
    console.error("[waitlist] confirmation email failed", err);
  }
}
