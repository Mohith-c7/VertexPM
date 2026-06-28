"use client";

import React, { useState } from 'react';
import { WorkItem } from '../types';
import { Button } from '@/components/ui/button';

export const WorkItemDetails = ({ workItem }: { workItem: WorkItem | null }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(workItem?.description || '');

  const handleSave = () => {
    // In real app, call API to save
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-900">Description</h3>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              className="w-full min-h-[200px] p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono text-slate-800"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Add a description..."
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => {
                setDesc(workItem?.description || '');
                setIsEditing(false);
              }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div 
            className="prose prose-sm max-w-none text-slate-700 p-3 rounded-md hover:bg-slate-50 cursor-pointer min-h-[100px] border border-transparent hover:border-slate-200 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            {desc ? (
              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(desc) }} />
            ) : (
              <span className="text-slate-400 italic">Add a description...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Extremely naive markdown formatter for preview. 
// Real app would use marked or react-markdown.
function formatMarkdown(text: string) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n$/gim, '<br />')
    .replace(/\n/gim, '<br />');
}
