"use client";

import React, { useState, useEffect } from 'react';
import { Attachment } from '../types';
import { workItemsApi } from '../services/api';
import { Download, File, Trash2, Upload } from 'lucide-react';

export const AttachmentsPanel = ({ workItemId }: { workItemId: string }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workItemsApi.getAttachments(workItemId)
      .then(data => setAttachments(data))
      .catch(err => {
        console.error(err);
        setAttachments([
          {
            id: 'att1',
            workItemId,
            fileName: 'design_spec.pdf',
            fileUrl: '#',
            fileSize: 1024 * 1024 * 2.5,
            uploadedById: 'u1',
            uploadedBy: { id: 'u1', name: 'Alice Smith' },
            createdAt: new Date().toISOString(),
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [workItemId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Attachments</h3>
        <label className="cursor-pointer flex items-center space-x-1 text-sm text-blue-600 font-medium hover:text-blue-700">
          <Upload className="w-4 h-4" />
          <span>Upload</span>
          <input type="file" className="hidden" />
        </label>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading attachments...</div>
      ) : attachments.length === 0 ? (
        <div className="text-sm text-slate-500 italic">No attachments yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {attachments.map(att => (
            <div key={att.id} className="flex items-center p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5" />
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate" title={att.fileName}>{att.fileName}</p>
                <p className="text-xs text-slate-500">{(att.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded"><Download className="w-4 h-4" /></button>
                <button className="p-1.5 text-slate-400 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
