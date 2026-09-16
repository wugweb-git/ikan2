import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen, ChartNoAxesColumn, House, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";

/* The shadcn sidebar kit — a desktop-style collapsible side nav. The app itself uses a mobile
 * bottom nav (see App/IkanShell) instead, so this is unused in production; mapped here since
 * the folder is being kept. */

const meta = {
  title: "UI kit/Sidebar",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { title: "Home", icon: House },
  { title: "Programmes", icon: Sparkles },
  { title: "Assessments", icon: ChartNoAxesColumn },
  { title: "Journal", icon: BookOpen },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-3 py-2 text-[14px] font-semibold">iKAN</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigate</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 p-4">
          <SidebarTrigger />
          <p className="text-[14px] text-muted-foreground">Toggle the sidebar</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
