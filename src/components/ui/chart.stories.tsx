import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./chart";

const meta = {
  title: "UI kit/Chart",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const data = [
  { day: "Mon", hours: 6.2 },
  { day: "Tue", hours: 7.1 },
  { day: "Wed", hours: 5.8 },
  { day: "Thu", hours: 7.4 },
  { day: "Fri", hours: 6.9 },
];

const config = {
  hours: { label: "Hours slept", color: "var(--accent-strong)" },
} satisfies ChartConfig;

export const Default: Story = {
  render: () => (
    <ChartContainer config={config} className="h-56 w-96">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
