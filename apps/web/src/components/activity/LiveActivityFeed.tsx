'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRealtime } from '../../hooks/useRealtime';
import { format, isToday, isYesterday } from 'date-fns';
import { Loader2 } from 'lucide-react';

export interface ActivityEvent {
  id: string;
  type: string; // e.g., 'comment_added', 'status_changed', 'assigned'
  message: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

interface GroupedActivity {
  dateLabel: string;
  events: ActivityEvent[];
}

export function LiveActivityFeed() {
  const { socket } = useRealtime();
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Group activities by date
  const groupedActivities: GroupedActivity[] = React.useMemo(() => {
    const groups: Record<string, ActivityEvent[]> = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      let dateLabel = format(date, 'MMM d, yyyy');
      
      if (isToday(date)) dateLabel = 'Today';
      else if (isYesterday(date)) dateLabel = 'Yesterday';

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(activity);
    });

    return Object.keys(groups).map(label => ({
      dateLabel: label,
      events: groups[label].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }));
  }, [activities]);

  // Infinite scroll intersection observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      loadMoreActivities();
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const loadMoreActivities = async () => {
    setLoading(true);
    // TODO: Replace with actual API call to fetch history
    // const newActivities = await fetchHistory(page);
    // setActivities(prev => [...prev, ...newActivities]);
    // setHasMore(newActivities.length > 0);
    setTimeout(() => {
      setLoading(false);
      setHasMore(false); // Mocking that there is no more data for now
    }, 1000);
  };

  // Realtime subscription
  useEffect(() => {
    if (!socket) return;

    const onNewActivity = (activity: ActivityEvent) => {
      setActivities(prev => [activity, ...prev]);
    };

    socket.on('activity:new', onNewActivity);

    return () => {
      socket.off('activity:new', onNewActivity);
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {groupedActivities.map((group) => (
          <div key={group.dateLabel} className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 bg-white/90 backdrop-blur-sm py-1 z-10">
              {group.dateLabel}
            </h4>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {group.events.map((event) => (
                <div key={event.id} className="relative flex items-start justify-between space-x-3">
                  <div className="flex items-center space-x-3 z-10">
                    {event.actor.avatarUrl ? (
                      <img src={event.actor.avatarUrl} alt={event.actor.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium text-xs border-2 border-white shadow-sm">
                        {event.actor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium text-slate-900">{event.actor.name}</span>{' '}
                      <span className="text-slate-500">{event.message}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 shrink-0 mt-1 whitespace-nowrap z-10 bg-white px-1">
                    {format(new Date(event.timestamp), 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div ref={loaderRef} className="py-4 flex justify-center">
          {loading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
          {!loading && !hasMore && activities.length > 0 && (
            <span className="text-xs text-slate-400">End of history</span>
          )}
          {!loading && activities.length === 0 && (
            <div className="text-center py-10">
              <span className="text-sm text-slate-500">No activity yet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
