"use client";
import { usePathname, useRouter } from "next/navigation";
import { curriculum } from "@/lib/curriculum";
import Sidebar from "@/components/layout/Sidebar";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentSlug = pathname.split("/").pop() ?? "";

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      <Sidebar
        modules={curriculum}
        currentSlug={currentSlug}
        onNavigate={(slug) => router.push(`/learn/${slug}`)}
      />
      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
    </div>
  );
}
