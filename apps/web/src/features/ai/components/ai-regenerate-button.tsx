import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AiRegenerateButton = ({ onClick, isLoading }: { onClick: () => void, isLoading?: boolean }) => (
  <Button variant="outline" onClick={onClick} disabled={isLoading} className="flex items-center space-x-2">
    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
    <span>Regenerate</span>
  </Button>
);
