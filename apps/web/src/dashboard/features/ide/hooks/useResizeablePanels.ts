import { useState } from 'react';
import type { ViewType } from '@/common/types';

export const CHAT_MIN = 200;
export const CHAT_MAX = 420;
export const FILES_MIN = 160;
export const FILES_MAX = 340;
export const EDITOR_MIN = 300;

export function useResizeablePanels() {
  const [activeView, setActiveView] = useState<ViewType>('ide');
  const [chatPanelWidth, setChatPanelWidth] = useState(280);
  const [filesPanelWidth, setFilesPanelWidth] = useState(220);

  return {
    activeView,
    setActiveView,
    chatPanelWidth,
    setChatPanelWidth,
    filesPanelWidth,
    setFilesPanelWidth,
  };
}
