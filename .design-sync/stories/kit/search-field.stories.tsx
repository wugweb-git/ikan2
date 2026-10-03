import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField } from "@/components/kit/search-field";

/* `type="search"` so phones offer a Search key; the explicit clear button covers the
 * platforms that do not draw their own, and only appears once there is something to clear.
 * The label is always present for screen readers even though the field shows a placeholder. */

const meta = { title: "Kit/SearchField", component: SearchField } satisfies Meta<
  typeof SearchField
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: "", onChange: () => {}, label: "Search questions" },
  render: function Empty(args) {
    const [v, setV] = useState("");
    return <SearchField {...args} value={v} onChange={setV} />;
  },
};

export const Filled: Story = {
  args: { value: "sleep", onChange: () => {}, label: "Search questions" },
};
