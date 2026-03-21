import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

const OPTIONS = [
    { value: '', label: 'Choose project...' },
    { value: 'api', label: 'API Service' },
    { value: 'worker', label: 'Worker' },
];

describe('Select', () => {
    it('renders placeholder when no value is selected', () => {
        render(
            <div className="relative">
                <Select defaultValue="">
                    <SelectTrigger>
                        <SelectValue placeholder="Choose project..." options={OPTIONS} />
                    </SelectTrigger>
                    <SelectContent>
                        {OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );

        expect(screen.getByRole('button', { name: /choose project/i })).toBeInTheDocument();
    });

    it('updates displayed value when an option is selected', async () => {
        const user = userEvent.setup();

        render(
            <div className="relative">
                <Select defaultValue="">
                    <SelectTrigger>
                        <SelectValue placeholder="Choose project..." options={OPTIONS} />
                    </SelectTrigger>
                    <SelectContent>
                        {OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );

        await user.click(screen.getByRole('button', { name: /choose project/i }));
        await user.click(screen.getByRole('option', { name: 'API Service' }));

        expect(screen.getByRole('button', { name: /api service/i })).toBeInTheDocument();
    });

    it('closes the listbox after an option is selected', async () => {
        const user = userEvent.setup();

        render(
            <div className="relative">
                <Select defaultValue="">
                    <SelectTrigger>
                        <SelectValue placeholder="Choose project..." options={OPTIONS} />
                    </SelectTrigger>
                    <SelectContent>
                        {OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );

        await user.click(screen.getByRole('button', { name: /choose project/i }));
        expect(screen.getByRole('listbox')).toBeInTheDocument();

        await user.click(screen.getByRole('option', { name: 'Worker' }));

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes when escape is pressed', async () => {
        const user = userEvent.setup();

        render(
            <div className="relative">
                <Select defaultValue="">
                    <SelectTrigger>
                        <SelectValue placeholder="Choose project..." options={OPTIONS} />
                    </SelectTrigger>
                    <SelectContent>
                        {OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );

        await user.click(screen.getByRole('button', { name: /choose project/i }));
        await user.keyboard('{Escape}');

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
});
