"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { curriculum } from "@/lib/curriculum";
import Sidebar from "@/components/layout/Sidebar";
import ModuleView from "@/app/learn/[moduleId]/ModuleView";

export default function LearnLayout({ children: _ }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameSlug = pathname.split("/").pop() ?? "";
  const [clientSlug, setClientSlug] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentSlug = clientSlug ?? pathnameSlug;

  const handleNavigate = (slug: string) => {
    setClientSlug(slug);
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
