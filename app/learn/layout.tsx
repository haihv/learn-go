"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { curriculum } from "@/lib/curriculum";
import Sidebar from "@/components/layout/Sidebar";
import ModuleView from "@/app/learn/[moduleId]/ModuleView";

export default function LearnLayout({ children: _ }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // Derive the slug from the URL only — keeping it in local state desyncs
  // the view from the address bar on TopBar/keyboard/back navigation.
  const currentSlug = pathname.split("/").pop() ?? "";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (slug: string) => {
    router.push(`/learn/${slug}`);
  };

  const toggleSidebar = () => setSidebarCollapsed((v) => !v);

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      <Sidebar
        modules={curriculum}
        currentSlug={currentSlug}
        onNavigate={handleNavigate}
        onCollapse={toggleSidebar}
        collapsed={sidebarCollapsed}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentSlug && (
          <ModuleView
            slug={currentSlug}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
          />
        )}
      </main>
    </div>
  );
}
