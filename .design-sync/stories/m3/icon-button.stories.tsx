import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/equip/m3";

/* A 48dp tap target with no visible box until touched. `label` is required and becomes the
 * accessible name, because the icon alone never is one. */

const meta = { title: "M3/IconButton", component: IconButton } satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Back", children: <ArrowLeft className="h-5 w-5" /> },
};

export const InARow: Story = {
  args: { label: "Back", children: <ArrowLeft className="h-5 w-5" /> },
  render: () => (
    <div className="flex items-center gap-1">
      <IconButton label="Back">
        <ArrowLeft className="h-5 w-5" />
      </IconButton>
      <IconButton label="Edit entry">
        <Pencil className="h-5 w-5" />
      </IconButton>
      <IconButton label="Delete entry">
        <Trash2 className="h-5 w-5" />
      </IconButton>
      <IconButton label="More">
        <MoreVertical className="h-5 w-5" />
      </IconButton>
    </div>
  ),
};
