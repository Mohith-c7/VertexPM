"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, Check, Briefcase, Loader2 } from "lucide-react";
import api from "@/services/api";

interface Workspace {
  id: string;
  name: string;
}

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWorkspaces();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/workspaces");
      const data = res.data?.data || res.data || [];
      setWorkspaces(data);
      if (data.length > 0) {
        setActiveWorkspace(data[0]);
      }
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch workspaces", err);
      // Fallback for UI if API is not fully ready
      const fallback = [{ id: "1", name: "Acme Corp" }];
      setWorkspaces(fallback);
      setActiveWorkspace(fallback[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      const res = await api.post("/workspaces", { name: newWorkspaceName });
      const newWs = res.data?.data || res.data;
      if (newWs) {
        setWorkspaces([...workspaces, newWs]);
        setActiveWorkspace(newWs);
      }
      setNewWorkspaceName("");
      setIsCreating(false);
      setIsOpen(false);
    } catch (err: any) {
      console.error("Failed to create workspace", err);
      alert("Failed to create workspace");
    }
  };

  if (isLoading && workspaces.length === 0) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 truncate">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white flex-shrink-0">
            {activeWorkspace?.name.charAt(0).toUpperCase() || <Briefcase className="h-4 w-4" />}
          </div>
          <span className="truncate">{activeWorkspace?.name || "Select Workspace"}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Workspaces
          </div>
          <div className="max-h-48 overflow-y-auto">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 text-gray-700 text-xs font-bold flex-shrink-0">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{ws.name}</span>
                </div>
                {activeWorkspace?.id === ws.id && (
                  <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-1 pt-1">
            {isCreating ? (
              <form onSubmit={handleCreateWorkspace} className="px-3 py-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Workspace name"
                  className="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2 border"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 font-medium"
                    disabled={!newWorkspaceName.trim()}
                  >
                    Create
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Workspace</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
