import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "UI kit/Table",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { day: "Day 1", topic: "Understanding sleep", status: "Done" },
  { day: "Day 2", topic: "Your sleep diary", status: "Done" },
  { day: "Day 3", topic: "Wind-down routine", status: "In progress" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Sleep Tight, first three days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.day}>
            <TableCell>{r.day}</TableCell>
            <TableCell>{r.topic}</TableCell>
            <TableCell>{r.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
