import React from 'react';
import { Button } from '@/components/ui/button';

export const AiDiscardButton = ({ onClick, disabled }: { onClick: () => void, disabled?: boolean }) => (
  <Button variant="ghost" onClick={onClick} disabled={disabled}>
    Discard
  </Button>
);
