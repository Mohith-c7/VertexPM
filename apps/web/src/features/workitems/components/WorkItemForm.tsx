"use client";

import React from 'react';
// Wait, react-hook-form is installed.
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { WorkItemStatus, WorkItemPriority, WorkItemType } from '../types';

const workItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  type: z.enum(['Epic', 'Story', 'Task', 'Bug']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Backlog', 'Todo', 'In Progress', 'In Review', 'Done']),
  assigneeId: z.string().optional(),
  labels: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
});

type WorkItemFormValues = z.infer<typeof workItemSchema>;

interface WorkItemFormProps {
  initialValues?: Partial<WorkItemFormValues>;
  onSubmit: (data: WorkItemFormValues) => void;
  onCancel: () => void;
}

export const WorkItemForm = ({ initialValues, onSubmit, onCancel }: WorkItemFormProps) => {
  const { register, handleSubmit, control, formState: { errors } } = useHookForm<WorkItemFormValues>({
    resolver: zodResolver(workItemSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      type: initialValues?.type || 'Task',
      priority: initialValues?.priority || 'Medium',
      status: initialValues?.status || 'Todo',
      assigneeId: initialValues?.assigneeId || '',
      labels: initialValues?.labels || [],
      dueDate: initialValues?.dueDate || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            {...register('title')}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Work item title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full min-h-[100px] p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              {...register('type')}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {['Epic', 'Story', 'Task', 'Bug'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              {...register('priority')}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {['Low', 'Medium', 'High', 'Critical'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
