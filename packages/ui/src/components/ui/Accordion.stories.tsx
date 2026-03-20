import type { Meta, StoryObj } from '@storybook/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Primitives/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion defaultValue="tokens">
      <AccordionItem value="tokens">
        <AccordionTrigger value="tokens">Foundations and tokens</AccordionTrigger>
        <AccordionContent value="tokens">
          Semantic colors, typography, spacing, radius, shadow, z-index, and motion all belong in
          the foundation layer.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="primitives">
        <AccordionTrigger value="primitives">Primitive contracts</AccordionTrigger>
        <AccordionContent value="primitives">
          Shared primitives should own accessibility, interaction, and stable API design.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
