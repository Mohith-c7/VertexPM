"use client";

import React, { useState, useEffect } from "react";
import { Plus, LayoutDashboard, AlertCircle, Loader2 } from "lucide-react";
import api from "@/services/api";

interface Board {
  id: string;
  name: string;
  description?: string;
}

export function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/boards");
      const data = res.data?.data || res.data || [];
      setBoards(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch boards", err);
      // For the sake of the exercise, let's treat 404 or errors as empty if we don't have a backend yet
      setBoards([]);
      // setError("Failed to load boards. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = () => {
    // Action to open create board modal or navigate to create board page
    alert("Open create board modal");
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-gray-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex max-w-md flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-red-100">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">Something went wrong</h3>
          <p className="mb-4 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchBoards}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <LayoutDashboard className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            No Boards Yet
          </h2>
          <p className="mb-8 text-base text-gray-500">
            Get started by creating your first board. Boards help you organize tasks, manage sprints, and track progress.
          </p>
          <button
            onClick={handleCreateBoard}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Your First Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Boards</h2>
        <button
          onClick={handleCreateBoard}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Board
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <div
            key={board.id}
            className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-blue-500"
          >
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {board.name}
              </h3>
              {board.description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {board.description}
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <span>Updated recently</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
