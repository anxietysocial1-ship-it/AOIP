import type { Metadata } from "next";

import { AdminConsole } from "@/components/admin/admin-console";
import { JourneyHeader } from "@/components/journey/journey-header";

export const metadata: Metadata = {
  title: "Admin — GOP",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <JourneyHeader />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
        <AdminConsole />
      </main>
    </>
  );
}
