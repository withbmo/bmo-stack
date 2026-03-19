import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    // Center the trigger button
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/** A basic controlled modal wired to a trigger button. */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="CONFIRM ACTION">
          <p className="text-text-secondary text-sm">
            Are you sure you want to proceed? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};

/** Wide variant — good for forms or detailed content. */
export const Wide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Wide Modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="CREATE PROJECT" variant="wide">
          <div className="flex flex-col gap-4">
            <Input id="name" label="Project Name" placeholder="my-awesome-project" />
            <Input
              id="desc"
              label="Description"
              multiline
              rows={3}
              hint="Optional, max 200 chars."
            />
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button>Create</Button>
          </div>
        </Modal>
      </>
    );
  },
};

/** Loading state — close button and backdrop click are disabled. */
export const Loading: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Loading Modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="SAVING…" isLoading>
          <p className="text-text-secondary text-sm">Submitting, please wait…</p>
          <div className="flex justify-end mt-6">
            <Button isLoading>Saving</Button>
          </div>
        </Modal>
      </>
    );
  },
};
