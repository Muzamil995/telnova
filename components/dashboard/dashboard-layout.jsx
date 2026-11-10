import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { RecentTickets } from "@/components/dashboard/recent-tickets";
import { C, HL, BD } from "@/components/landing/tokens";

export function DashboardLayout({ user }) {
  return (
    <div style={{ backgroundColor: C.surface, minHeight: "100vh" }}>
      <DashboardHeader user={user} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 sm:px-8">
        <div className="mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ ...HL, color: C.primary }}
          >
            Support Dashboard
          </h1>
          <p
            className="text-sm mt-1.5"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            Chat with our AI agent or review your recent support tickets.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <ChatInterface />
          <RecentTickets />
        </div>
      </main>
    </div>
  );
}
