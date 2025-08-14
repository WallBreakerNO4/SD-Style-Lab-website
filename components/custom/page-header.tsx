"use client";

import { ModeToggle } from "@/components/custom/mode-toggle";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
  children?: ReactNode;
  rightActions?: ReactNode;
}

export function PageHeader({ children, rightActions }: PageHeaderProps) {
  const pathname = usePathname();
  const isFAQPage = pathname === "/faq";

  return (
    <>
      {/* 固定的顶部工具栏 */}
      <div className="fixed top-4 right-4 z-[60] flex items-center gap-2">
        {!isFAQPage && (
          <Link href="/faq">
            <Button variant="ghost" size="sm" className="gap-2">
              FAQ
              <HelpCircle className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <ModeToggle />
      </div>

      {/* 页面内容区域 */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pr-16">
        <div className="flex-1">
          {children}
        </div>
        {rightActions && (
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {rightActions}
          </div>
        )}
      </header>
    </>
  );
}