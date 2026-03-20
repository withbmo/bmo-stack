import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

describe('Accordion', () => {
    it('renders default open content', () => {
        render(
            <Accordion defaultValue="first">
                <AccordionItem value="first">
                    <AccordionTrigger value="first">First</AccordionTrigger>
                    <AccordionContent value="first">First content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        expect(screen.getByText('First content')).toBeInTheDocument();
    });

    it('toggles to a different item when clicked', async () => {
        const user = userEvent.setup();

        render(
            <Accordion defaultValue="first">
                <AccordionItem value="first">
                    <AccordionTrigger value="first">First</AccordionTrigger>
                    <AccordionContent value="first">First content</AccordionContent>
                </AccordionItem>
                <AccordionItem value="second">
                    <AccordionTrigger value="second">Second</AccordionTrigger>
                    <AccordionContent value="second">Second content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        await user.click(screen.getByRole('button', { name: 'Second' }));

        expect(screen.getByText('Second content')).toBeInTheDocument();
        expect(screen.queryByText('First content')).not.toBeInTheDocument();
    });
});
