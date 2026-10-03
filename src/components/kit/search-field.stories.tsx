import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField } from "./search-field";

/* type="search" so phones show a Search key. The clear button appears only once there is
 * something to clear. */

const meta = { title: "Kit/SearchField", component: SearchField } satisfies Meta<
  typeof SearchField
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "", onChange: () => {}, label: "Search questions" },
  render: function Default(args) {
    const [v, setV] = useState("");
    return <SearchField {...args} value={v} onChange={setV} />;
  },
};

export const Filled: Story = {
  args: { value: "sleep", onChange: () => {}, label: "Search questions" },
};
