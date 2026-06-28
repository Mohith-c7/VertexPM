"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WorkItemDrawerContextType {
  isOpen: boolean;
  activeWorkItemId: string | null;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
}

const WorkItemDrawerContext = createContext<WorkItemDrawerContextType | undefined>(undefined);

export const WorkItemDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWorkItemId, setActiveWorkItemId] = useState<string | null>(null);

  const openDrawer = (id: string) => {
    setActiveWorkItemId(id);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => setActiveWorkItemId(null), 300); // Wait for transition
  };

  return (
    <WorkItemDrawerContext.Provider value={{ isOpen, activeWorkItemId, openDrawer, closeDrawer }}>
      {children}
    </WorkItemDrawerContext.Provider>
  );
};

export const useWorkItemDrawer = () => {
  const context = useContext(WorkItemDrawerContext);
  if (!context) {
    throw new Error('useWorkItemDrawer must be used within a WorkItemDrawerProvider');
  }
  return context;
};
