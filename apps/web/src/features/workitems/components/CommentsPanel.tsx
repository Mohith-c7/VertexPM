"use client";

import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { workItemsApi } from '../services/api';
import { Button } from '@/components/ui/button';

export const CommentsPanel = ({ workItemId }: { workItemId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    workItemsApi.getComments(workItemId)
      .then(data => setComments(data))
      .catch(err => {
        console.error(err);
        setComments([
          {
            id: 'c1',
            workItemId,
            authorId: 'u1',
            author: { id: 'u1', name: 'Alice Smith' },
            content: 'I have started looking into the OAuth providers.',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'c2',
            workItemId,
            authorId: 'u2',
            author: { id: 'u2', name: 'Bob Jones' },
            content: 'Great, make sure to handle the callback correctly.',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            updatedAt: new Date(Date.now() - 1800000).toISOString(),
            threadId: 'c1',
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [workItemId]);

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      workItemId,
      authorId: 'me',
      author: { id: 'me', name: 'Current User' },
      content: newComment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const rootComments = comments.filter(c => !c.threadId);
  const replies = comments.filter(c => c.threadId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6 mb-6">
        {loading ? (
          <div className="text-sm text-slate-500">Loading comments...</div>
        ) : rootComments.length === 0 ? (
          <div className="text-sm text-slate-500 italic">No comments yet.</div>
        ) : (
          rootComments.map(comment => (
            <CommentThread 
              key={comment.id} 
              comment={comment} 
              replies={replies.filter(r => r.threadId === comment.id)} 
            />
          ))
        )}
      </div>
      
      <div className="mt-auto border-t border-slate-200 pt-4">
        <div className="flex space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-semibold text-xs mt-1">
            CU
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full min-h-[80px] p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800"
            />
            <div className="mt-2 flex justify-end">
              <Button onClick={handlePost} disabled={!newComment.trim()}>Post Comment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentThread = ({ comment, replies }: { comment: Comment, replies: Comment[] }) => {
  return (
    <div className="flex space-x-3">
      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 font-semibold text-xs">
        {comment.author?.name?.[0] || 'U'}
      </div>
      <div className="flex-1 space-y-3">
        <div className="bg-white border border-slate-200 rounded-md p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm text-slate-900">{comment.author?.name}</span>
            <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</div>
        </div>
        
        {replies.length > 0 && (
          <div className="space-y-3 pl-4 border-l-2 border-slate-100">
            {replies.map(reply => (
              <div key={reply.id} className="flex space-x-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 font-semibold text-[10px]">
                  {reply.author?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-md p-2 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900">{reply.author?.name}</span>
                    <span className="text-[10px] text-slate-500">{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-700 whitespace-pre-wrap">{reply.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
