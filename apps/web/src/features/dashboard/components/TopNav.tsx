"use client";

import React, { useState } from "react";
import { Search, Bell, Menu, User } from "lucide-react";

interface TopNavProps {
  toggleSidebar: () => void;
}

export function TopNav({ toggleSidebar }: TopNavProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-900"
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Placeholder for workspace name if not in sidebar, but usually sidebar handles workspace switcher. Let's add a breadcrumb or title here if needed */}
        <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-gray-50"
            placeholder="Search..."
          />
        </div>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
          >
            <User className="h-5 w-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Your Profile
              </a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="#logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
