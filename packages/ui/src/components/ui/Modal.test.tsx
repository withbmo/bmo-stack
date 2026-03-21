import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

// Radix Dialog uses Portals — jsdom handles them but we need a special attribute
// to suppress the Radix "missing description" warning in tests.
// https://github.com/radix-ui/primitives/issues/1344

function renderModal(props?: Partial<React.ComponentProps<typeof Modal>>) {
    return render(
        <Modal isOpen={true} onClose={vi.fn()} {...props}>
            <p>Modal body content</p>
        </Modal>
    );
}

describe('Modal', () => {
    // ─── Visibility ─────────────────────────────────────────────────────────────

    it('renders children when isOpen is true', () => {
        renderModal();
        expect(screen.getByText('Modal body content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={vi.fn()}>
                <p>Should be hidden</p>
            </Modal>
        );
        expect(screen.queryByText('Should be hidden')).not.toBeInTheDocument();
    });

    // ─── Title ──────────────────────────────────────────────────────────────────

    it('renders the title when provided', () => {
        renderModal({ title: 'CONFIRM DELETE' });
        expect(screen.getByText('CONFIRM DELETE')).toBeInTheDocument();
    });

    it('does not render a title element when title is omitted', () => {
        renderModal({ title: undefined });
        // No dialog title element should be present
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    // ─── Close button ───────────────────────────────────────────────────────────

    it('renders the close button', () => {
        renderModal();
        expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const onClose = vi.fn();
        renderModal({ onClose });
        await userEvent.click(screen.getByRole('button', { name: 'Close modal' }));
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('disables the close button when isLoading is true', () => {
        renderModal({ isLoading: true });
        expect(screen.getByRole('button', { name: 'Close modal' })).toBeDisabled();
    });

    it('does not call onClose when isLoading and close button is clicked', async () => {
        const onClose = vi.fn();
        renderModal({ onClose, isLoading: true });
        await userEvent.click(screen.getByRole('button', { name: 'Close modal' }));
        expect(onClose).not.toHaveBeenCalled();
    });

    // ─── Keyboard ───────────────────────────────────────────────────────────────

    it('calls onClose when Escape is pressed (handled by Radix)', async () => {
        const onClose = vi.fn();
        renderModal({ onClose });
        await userEvent.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call onClose on Escape when isLoading', async () => {
        const onClose = vi.fn();
        renderModal({ onClose, isLoading: true });
        await userEvent.keyboard('{Escape}');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('exposes dialog semantics while open', () => {
        renderModal({ title: 'Deploy project' });

        const dialog = screen.getByRole('dialog');
        const title = screen.getByText('Deploy project');

        expect(dialog).toHaveAttribute('aria-labelledby', title.id);
        expect(title.id).toBeTruthy();
    });

    it('calls onClose when the overlay is clicked', async () => {
        const onClose = vi.fn();
        renderModal({ onClose });

        const overlay = document.body.querySelector('[data-state="open"][class*="backdrop-blur-sm"]');
        expect(overlay).toBeTruthy();

        await userEvent.click(overlay as Element);

        expect(onClose).toHaveBeenCalledOnce();
    });
});
