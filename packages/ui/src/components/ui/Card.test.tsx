import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
    it('renders children', () => {
        render(<Card>Content</Card>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('forwards HTML attributes', () => {
        render(
            <Card data-testid="panel" id="runtime-card">
                Panel
            </Card>
        );

        const card = screen.getByTestId('panel');
        expect(card).toHaveAttribute('id', 'runtime-card');
    });

    it('applies the selected variant and padding classes', () => {
        render(
            <Card data-testid="panel" variant="interactive" padding="lg">
                Panel
            </Card>
        );

        const card = screen.getByTestId('panel');
        expect(card.className).toContain('hover:border-border-highlight');
        expect(card.className).toContain('p-8');
    });
});
