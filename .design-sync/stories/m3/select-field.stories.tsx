import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectField } from "@/components/equip/m3";

/* A native <select> dressed as a TextField, so the platform's own picker opens on a phone
 * rather than a custom menu that has to be scrolled with a thumb. */

const meta = { title: "M3/SelectField", component: SelectField } satisfies Meta<typeof SelectField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "When does it happen?",
    value: "Evening",
    options: ["Morning", "Afternoon", "Evening", "Night"],
    onChange: () => {},
  },
  render: function Default(args) {
    const [v, setV] = useState("Evening");
    return <SelectField {...args} value={v} onChange={setV} />;
  },
};

export const Empty: Story = {
  args: {
    label: "When does it happen?",
    value: "",
    options: ["Morning", "Afternoon", "Evening", "Night"],
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    label: "When does it happen?",
    value: "",
    options: ["Morning", "Afternoon", "Evening", "Night"],
    onChange: () => {},
    error: "Pick a time of day",
  },
};
