import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhoneField } from "./phone-field";

/* Phone number field with a country flag and code prefix — used on phone sign-in. */

const meta = {
  title: "App/PhoneField",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Default() {
    const [value, setValue] = useState("");
    return (
      <div className="p-4">
        <PhoneField label="Phone number" value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Filled: Story = {
  render: function Filled() {
    const [value, setValue] = useState("+91 98765 43210");
    return (
      <div className="p-4">
        <PhoneField label="Phone number" value={value} onChange={setValue} />
      </div>
    );
  },
};

export const WithError: Story = {
  render: function WithError() {
    const [value, setValue] = useState("+91 987");
    return (
      <div className="p-4">
        <PhoneField
          label="Phone number"
          value={value}
          onChange={setValue}
          error="Enter a 10-digit number starting 6–9"
        />
      </div>
    );
  },
};
