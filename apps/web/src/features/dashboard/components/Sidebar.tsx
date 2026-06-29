"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
} from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams() as { id?: string; projectId?: string };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Boards", href: "/boards", icon: KanbanSquare },
    ...(params.id && params.projectId ? [{ name: "AI Insights", href: `/workspaces/${params.id}/projects/${params.projectId}/insights`, icon: Sparkles }] : []),
    { name: "Automation", href: "/settings/automation", icon: Zap },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div
      className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header / Workspace Switcher */}
      <div className="flex h-16 items-center px-3 border-b border-gray-200 relative">
        <div className={`flex-1 overflow-hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
          <WorkspaceSwitcher />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={!isOpen ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          {isOpen ? (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Collapse</span>
            </div>
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
