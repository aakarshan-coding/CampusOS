"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

const tabs = [
  { href: "/chat", label: "Chat" },
  { href: "/activities", label: "Activities" },
  { href: "/report", label: "Weekly Report" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
            <span aria-label="CampusOS brand">CampusOS</span>
          </div>
          <nav aria-label="Primary" className="flex items-center gap-1">
            {tabs.map((t) => {
              const active = pathname?.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={cn(
                    "rounded-2xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400",
                    active ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
                  )}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}