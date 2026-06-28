import React from 'react';
import { AutomationWorkspace } from '@/features/automation';

export const metadata = {
  title: 'Automation Experience | VertexPM',
  description: 'Design triggers, conditions, actions, reminders and background tasks for your board workflow.',
};

export default function AutomationSettingsPage() {
  return <AutomationWorkspace />;
}
