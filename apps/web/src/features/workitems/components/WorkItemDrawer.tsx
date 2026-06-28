"use client";

import React, { useEffect, useState } from 'react';
import { useWorkItemDrawer } from '../context/WorkItemDrawerContext';
import { X, AlignLeft, MessageSquare, Activity as ActivityIcon, Paperclip, Link2, MoreHorizontal, CheckCircle2, CircleDashed, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkItemDetails } from './WorkItemDetails';
import { CommentsPanel } from './CommentsPanel';
import { ActivityTimeline } from './ActivityTimeline';
import { AttachmentsPanel } from './AttachmentsPanel';
import { DependenciesPanel } from './DependenciesPanel';
import { workItemsApi } from '../services/api';
import { WorkItem } from '../types';

export const WorkItemDrawer = () => {
  const { isOpen, activeWorkItemId, closeDrawer } = useWorkItemDrawer();
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity' | 'attachments' | 'dependencies'>('details');
  const [workItem, setWorkItem] = useState<WorkItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeWorkItemId) {
      setLoading(true);
      // Mocking fetch or using real if possible
      workItemsApi.getWorkItem(activeWorkItemId)
        .then(data => setWorkItem(data))
        .catch(err => {
          console.error(err);
          // Fallback mock data for design preview
          setWorkItem({
            id: activeWorkItemId,
            title: 'Implement OAuth2 Authentication',
            description: 'We need to implement OAuth2 for Google and GitHub logins. Ensure the tokens are stored securely in HTTP-only cookies.',
            type: 'Story',
            priority: 'High',
            status: 'In Progress',
            assigneeId: 'u1',
            reporterId: 'u2',
            labels: ['backend', 'security'],
            dueDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, activeWorkItemId]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" 
        onClick={closeDrawer} 
      />
      <div className={`fixed inset-y-0 right-0 w-[800px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-slate-200`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3 text-sm text-slate-500">
            <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md text-xs">{workItem?.id || 'TASK-123'}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{workItem?.type || 'Task'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeDrawer} className="text-slate-500 hover:text-slate-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Main scrollable area */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-slate-900 mb-4">{workItem?.title}</h1>
                </div>

                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                
                <div className="mt-6">
                  {activeTab === 'details' && <WorkItemDetails workItem={workItem} />}
                  {activeTab === 'comments' && <CommentsPanel workItemId={activeWorkItemId!} />}
                  {activeTab === 'activity' && <ActivityTimeline workItemId={activeWorkItemId!} />}
                  {activeTab === 'attachments' && <AttachmentsPanel workItemId={activeWorkItemId!} />}
                  {activeTab === 'dependencies' && <DependenciesPanel workItemId={activeWorkItemId!} />}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-72 bg-slate-50 border-l border-slate-200 p-6 overflow-y-auto">
               <WorkItemSidebar workItem={workItem} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Tabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: any) => void }) => {
  const tabs = [
    { id: 'details', label: 'Details', icon: AlignLeft },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: ActivityIcon },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'dependencies', label: 'Links', icon: Link2 },
  ];

  return (
    <div className="flex space-x-1 border-b border-slate-200">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
              isActive 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

const WorkItemSidebar = ({ workItem }: { workItem: WorkItem | null }) => {
  return (
    <div className="space-y-6 text-sm">
      <SidebarSection title="Status">
        <div className="flex items-center space-x-2 text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-slate-50">
          <CircleDashed className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{workItem?.status || 'In Progress'}</span>
        </div>
      </SidebarSection>
      
      <SidebarSection title="Assignee">
        <div className="flex items-center space-x-2 text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-slate-50">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
            {workItem?.assignee?.name?.[0] || 'U'}
          </div>
          <span className="font-medium">{workItem?.assignee?.name || 'Unassigned'}</span>
        </div>
      </SidebarSection>

      <SidebarSection title="Priority">
        <div className="flex items-center space-x-2 text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-slate-50">
          <span className="font-medium">{workItem?.priority || 'Medium'}</span>
        </div>
      </SidebarSection>

      <SidebarSection title="Labels">
        <div className="flex flex-wrap gap-2">
          {workItem?.labels?.map(label => (
            <span key={label} className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-medium">
              {label}
            </span>
          )) || <span className="text-slate-500 italic">None</span>}
        </div>
      </SidebarSection>
      
      <SidebarSection title="Due Date">
        <div className="flex items-center space-x-2 text-slate-700">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{workItem?.dueDate ? new Date(workItem.dueDate).toLocaleDateString() : 'No date'}</span>
        </div>
      </SidebarSection>
    </div>
  );
};

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div>
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
    {children}
  </div>
);
