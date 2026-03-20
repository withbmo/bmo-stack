import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

describe('Tabs', () => {
    it('renders only the active content', () => {
        render(
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">Overview panel</TabsContent>
                <TabsContent value="logs">Logs panel</TabsContent>
            </Tabs>
        );

        expect(screen.getByText('Overview panel')).toBeInTheDocument();
        expect(screen.queryByText('Logs panel')).not.toBeInTheDocument();
    });

    it('changes tab content when a trigger is clicked', async () => {
        const user = userEvent.setup();

        render(
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">Overview panel</TabsContent>
                <TabsContent value="logs">Logs panel</TabsContent>
            </Tabs>
        );

        await user.click(screen.getByRole('tab', { name: 'Logs' }));

        expect(screen.getByText('Logs panel')).toBeInTheDocument();
        expect(screen.queryByText('Overview panel')).not.toBeInTheDocument();
    });
});
