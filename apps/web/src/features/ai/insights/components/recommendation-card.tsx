import React from 'react';
import { InsightRecommendation } from '../services/ai-insights.service';
import { CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

interface Props {
  recommendation: InsightRecommendation;
}

export const RecommendationCard: React.FC<Props> = ({ recommendation }) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'risk': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'optimization': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors">
      <div className="mt-0.5">{getIcon()}</div>
      <div>
        <h4 className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{recommendation.title}</h4>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{recommendation.description}</p>
      </div>
    </div>
  );
};
