import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
    // ─── Rendering ──────────────────────────────────────────────────────────────

    it('renders a bare input by default', () => {
        render(<Input placeholder="Type here" />);
        expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('renders a textarea when multiline is true', () => {
        render(<Input multiline placeholder="Write something" />);
        expect(screen.getByPlaceholderText('Write something').tagName).toBe('TEXTAREA');
    });

    // ─── Label / Hint / Error ───────────────────────────────────────────────────

    it('renders a label when label prop is provided', () => {
        render(<Input id="email" label="Email address" />);
        expect(screen.getByText('Email address')).toBeInTheDocument();
        // label should be associated with the input
        const label = screen.getByText('Email address') as HTMLLabelElement;
        expect(label.htmlFor).toBe('email');
    });

    it('renders hint text below the input', () => {
        render(<Input id="key" hint="Never share this." />);
        expect(screen.getByText('Never share this.')).toBeInTheDocument();
    });

    it('renders errorMessage instead of hint when both are provided', () => {
        render(<Input id="user" hint="Helper" errorMessage="Username taken" error />);
        expect(screen.queryByText('Helper')).not.toBeInTheDocument();
        expect(screen.getByText('Username taken')).toBeInTheDocument();
    });

    it('sets aria-invalid when error is true', () => {
        render(<Input id="field" error />);
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links hint to input via aria-describedby', () => {
        render(<Input id="myfield" hint="Some hint" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('aria-describedby', 'myfield-description');
        expect(screen.getByText('Some hint')).toHaveAttribute('id', 'myfield-description');
    });

    // ─── Interaction ────────────────────────────────────────────────────────────

    it('accepts typed input', async () => {
        render(<Input placeholder="Type here" />);
        const input = screen.getByPlaceholderText('Type here');
        await userEvent.type(input, 'hello');
        expect(input).toHaveValue('hello');
    });

    // ─── Disabled ───────────────────────────────────────────────────────────────

    it('is disabled when disabled prop is set', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
