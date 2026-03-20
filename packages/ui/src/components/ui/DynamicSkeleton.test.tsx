import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DynamicSkeletonProvider, DynamicSlot, DynamicValue } from './DynamicSkeleton';

describe('DynamicSkeleton', () => {
    it('renders fallback skeleton content when provider is loading', () => {
        const { container } = render(
            <DynamicSkeletonProvider loading>
                <DynamicValue>Runtime count</DynamicValue>
            </DynamicSkeletonProvider>
        );

        expect(screen.queryByText('Runtime count')).not.toBeInTheDocument();
        expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it('renders slot content when loading is false', () => {
        render(
            <DynamicSkeletonProvider loading={false}>
                <DynamicSlot skeleton={<span>Loading</span>}>
                    <span>Ready</span>
                </DynamicSlot>
            </DynamicSkeletonProvider>
        );

        expect(screen.getByText('Ready')).toBeInTheDocument();
        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });
});
