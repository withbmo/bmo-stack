import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Boxes, Database } from 'lucide-react';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('overview');

    return (
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="overview">
            <Boxes size={14} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events">
            <Bell size={14} />
            Events
          </TabsTrigger>
          <TabsTrigger value="storage">
            <Database size={14} />
            Storage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="border border-border-dim bg-bg-panel p-6">
          Shared tab primitives for reusable navigation patterns.
        </TabsContent>
        <TabsContent value="events" className="border border-border-dim bg-bg-panel p-6">
          Activity stream, status panels, and segmented workflows all build on this API.
        </TabsContent>
        <TabsContent value="storage" className="border border-border-dim bg-bg-panel p-6">
          Content panes render only for the active value.
        </TabsContent>
      </Tabs>
    );
  },
};
