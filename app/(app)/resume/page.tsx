import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canAccess } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  demoCoachReview,
  demoResumeDoc,
  demoResumeFile,
  demoResumeFixes,
  demoResumeVersions,
  demoSkillDemand,
  demoSkimNote,
} from "@/lib/mock/resume";
import { demoJobMatchCount, demoResumeScore } from "@/lib/mock/student";
import { ResumeHeader } from "./_components/resume-header";
import { Review } from "./_components/review";
import { ScoreBand } from "./_components/score-band";
import { CoachTile, ProgressTile, SkillsTile } from "./_components/tiles";

export const metadata: Metadata = { title: "Resume" };

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/*
 * The resume report, built around the resume itself. The score band says
 * where it stands; the review below puts each fix on the exact lines it means
 * (or shows what a recruiter's 7-second skim lands on); the tiles at the end
 * cover the skills the student's matches ask for, progress across versions
 * and the coach review.
 *
 * Free sees the score, the categories and the top fix. The other fixes are
 * left out on the server, not just hidden, and come with Pro.
 */
export default async function ResumePage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  const fullReport = canAccess(user, "resume.fullReport");
  const fixes = fullReport ? demoResumeFixes : demoResumeFixes.slice(0, 1);
  const locked = fullReport
    ? []
    : demoResumeFixes.slice(1).map(({ rank, category, gain }) => ({ rank, category, gain }));
  const potential = Math.min(100, demoResumeScore.overall + demoResumeFixes.reduce((n, f) => n + f.gain, 0));
  const [current, previous] = demoResumeVersions;

  return (
    <div className="@container mx-auto max-w-[1280px] space-y-6">
      <ResumeHeader
        target={user.target}
        file={{ ...demoResumeFile, version: current.number, scoredOn: current.date }}
      />

      <ScoreBand
        score={demoResumeScore}
        change={current.change ?? 0}
        since={previous?.date ?? current.date}
        scoredOn={current.date}
        potential={potential}
        style={delay(0.08)}
      />

      <Review fixes={fixes} locked={locked} doc={demoResumeDoc} skimNote={demoSkimNote} style={delay(0.16)} />

      <div className="grid gap-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
        <SkillsTile skills={demoSkillDemand} matches={demoJobMatchCount} locked={!fullReport} style={delay(0.22)} />
        <ProgressTile versions={demoResumeVersions} style={delay(0.28)} />
        <div className="@2xl:col-span-2 @5xl:col-span-1">
          <CoachTile review={demoCoachReview} unlocked={canAccess(user, "resume.coachReview")} style={delay(0.34)} />
        </div>
      </div>
    </div>
  );
}
