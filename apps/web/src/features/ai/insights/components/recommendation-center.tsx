import React from 'react';
import { InsightRecommendation } from '../services/ai-insights.service';
import { RecommendationCard } from './recommendation-card';
import { Lightbulb } from 'lucide-react';

interface Props {
  recommendations: InsightRecommendation[];
}

export const RecommendationCenter: React.FC<Props> = ({ recommendations }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 col-span-full">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">AI Recommendations</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(rec => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
};
