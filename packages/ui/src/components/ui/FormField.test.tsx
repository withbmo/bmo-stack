import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormField } from './FormField';
import { Input } from './Input';

describe('FormField', () => {
  it('renders label, required marker, and hint text', () => {
    render(
      <FormField
        label="Project name"
        htmlFor="project-name"
        hint="Use a unique name for this project."
        required
      >
        <Input id="project-name" />
      </FormField>
    );

    expect(screen.getByText('Project name')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Use a unique name for this project.')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'project-name-description');
  });

  it('applies aria-invalid and description id to child inputs when showing an error', () => {
    render(
      <FormField label="Repository URL" htmlFor="repo-url" error="Enter a valid repository URL.">
        <Input id="repo-url" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'repo-url-description');
    expect(screen.getByText('Enter a valid repository URL.')).toHaveAttribute(
      'id',
      'repo-url-description'
    );
  });

  it('preserves explicit child accessibility props instead of overwriting them', () => {
    render(
      <FormField label="Token" htmlFor="token" hint="Shared helper text">
        <input id="token" aria-describedby="custom-description" aria-invalid="false" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'custom-description');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});
