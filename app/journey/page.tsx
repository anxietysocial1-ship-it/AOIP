import type { Metadata } from "next";
import { Suspense } from "react";

import { JourneyHeader } from "@/components/journey/journey-header";
import { JourneyExperience } from "@/components/journey/journey-experience";

export const metadata: Metadata = {
  title: "Opportunity Journey — AOIP",
  description:
    "Answer a few intelligent questions and AOIP maps the government opportunities you qualify for.",
};

export default function JourneyPage() {
  return (
    <>
      <JourneyHeader />
      <main>
        <Suspense fallback={null}>
          <JourneyExperience />
        </Suspense>
      </main>
    </>
  );
}
