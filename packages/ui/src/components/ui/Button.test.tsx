import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
    // ─── Rendering ──────────────────────────────────────────────────────────────

    it('renders children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with default type="button" to avoid accidental form submission', () => {
        render(<Button variant="secondary">Submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('passes through custom className', () => {
        render(<Button className="custom-class">Styled</Button>);
        // primary variant wraps in a div; the button itself should have the class
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('custom-class');
    });

    // ─── Variants ───────────────────────────────────────────────────────────────

    it.each(['secondary', 'ghost', 'danger'] as const)(
        'renders %s variant without the nexus wrapper div',
        (variant) => {
            const { container } = render(<Button variant={variant}>Btn</Button>);
            // Only primary gets the wrapper div
            expect(container.querySelector('.nexus-shadow-btn-wrapper')).toBeNull();
        }
    );

    it('renders primary variant with the nexus shadow wrapper', () => {
        const { container } = render(<Button variant="primary">Btn</Button>);
        expect(container.querySelector('.nexus-shadow-btn-wrapper')).toBeInTheDocument();
    });

    // ─── States ─────────────────────────────────────────────────────────────────

    it('is disabled when disabled prop is set', async () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when isLoading is true', async () => {
        render(<Button isLoading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows spinner icon when isLoading', () => {
        render(<Button isLoading>Loading</Button>);
        // Lucide renders an svg for Loader2
        expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('does not call onClick when disabled', async () => {
        const onClick = vi.fn();
        render(<Button disabled onClick={onClick}>Click</Button>);
        await userEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('calls onClick when enabled', async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        await userEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    // ─── asChild ────────────────────────────────────────────────────────────────

    it('renders an anchor via asChild', () => {
        render(
            <Button asChild variant="secondary">
                <a href="/docs">Docs</a>
            </Button>
        );
        const link = screen.getByRole('link', { name: 'Docs' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/docs');
    });

    // ─── fullWidth ───────────────────────────────────────────────────────────────

    it('applies full-width class when fullWidth is true', () => {
        const { container } = render(<Button fullWidth>Wide</Button>);
        expect(container.querySelector('.nexus-shadow-btn-wrapper.block')).toBeInTheDocument();
    });
});
