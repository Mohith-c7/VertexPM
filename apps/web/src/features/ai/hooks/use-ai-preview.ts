import { useState } from 'react';

export const useAiPreview = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const openPreview = (content: string) => {
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewContent('');
  };

  return { isPreviewOpen, previewContent, openPreview, closePreview };
};
