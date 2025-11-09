"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, MessageSquare, Activity, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/report", label: "Weekly Report", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 w-60 border-r border-neutral-200 bg-[var(--background)]"
      aria-label="Sidebar"
    >
      <div className="flex h-14 items-center gap-2 border-b border-neutral-200 px-4">
        <GraduationCap className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <span className="text-sm font-semibold">CampusOS</span>
      </div>
      <nav className="px-2 py-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4", active ? "text-white" : "text-neutral-600")} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}