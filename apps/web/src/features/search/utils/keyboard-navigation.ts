import { KeyboardEvent } from 'react';

export interface KeyboardNavigationOptions {
  itemCount: number;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onEnter: (index: number) => void;
  onEscape: () => void;
}

export const handleKeyboardNavigation = (
  e: KeyboardEvent,
  options: KeyboardNavigationOptions
) => {
  const { itemCount, selectedIndex, onSelectIndex, onEnter, onEscape } = options;

  if (itemCount === 0 && e.key !== 'Escape') {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      onSelectIndex(selectedIndex < itemCount - 1 ? selectedIndex + 1 : 0);
      break;
    case 'ArrowUp':
      e.preventDefault();
      onSelectIndex(selectedIndex > 0 ? selectedIndex - 1 : itemCount - 1);
      break;
    case 'Enter':
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < itemCount) {
        onEnter(selectedIndex);
      }
      break;
    case 'Escape':
      e.preventDefault();
      onEscape();
      break;
  }
};
