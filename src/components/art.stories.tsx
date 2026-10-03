import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Art } from "@/lib/resources";
import { Avatar, Illustration } from "./art";

const meta = {
  title: "App/Art",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const arts: Art[] = [
  "stress",
  "burnout",
  "work",
  "anxiety",
  "mood",
  "sleep",
  "measure",
  "checkup",
  "wellbeing",
  "confidence",
  "resilience",
  "worry",
  "lowmood",
];

export const AllIllustrations: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 p-4">
      {arts.map((a) => (
        <div key={a} className="overflow-hidden rounded-[16px]">
          <div className="aspect-video">
            <Illustration art={a} />
          </div>
          <p className="mt-1 text-center text-[12px] text-muted-foreground">{a}</p>
        </div>
      ))}
    </div>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4 p-4">
      <Avatar text="Vedanshu Srivastava" hue={210} size={72} />
      <Avatar text="Admin" hue={20} size={56} />
      <Avatar text="Priya" hue={340} size={40} />
      <Avatar
        text="Photo"
        hue={140}
        size={56}
        photo="https://this-domain-does-not-exist.example/broken.jpg"
      />
    </div>
  ),
};
