"use client";

import Link from "next/link";
import { useProjectStore } from "@/store/projectStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface DashboardSidebarProps {
  projectId: string;
}

export function DashboardSidebar({ projectId }: DashboardSidebarProps) {
  // For now, we'll just have static links.
  // In future, we might use a state to highlight the active link.
  const links = [
    { name: "Papers", href: `/dashboard/${projectId}/papers` },
    { name: "Research Questions", href: `/dashboard/${projectId}/questions` },
    { name: "Relationships", href: `/dashboard/${projectId}/relationships` },
  ];

  return (
    <nav className="flex flex-col space-y-1 p-4 border-r">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start"
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
