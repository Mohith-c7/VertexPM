import React from 'react';
import { Activity } from 'lucide-react';
import { HealthScore } from './health-score';

interface Props {
  score: number;
  status: string;
}

export const ProjectHealth: React.FC<Props> = ({ score, status }) => {
  return (
    <HealthScore score={score} status={status} />
  );
};
