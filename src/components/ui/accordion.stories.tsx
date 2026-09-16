import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "UI kit/Accordion",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is this covered by insurance?</AccordionTrigger>
        <AccordionContent>Most plans cover an initial assessment.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How long is a programme?</AccordionTrigger>
        <AccordionContent>Programmes typically run 2 to 4 weeks.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
