import SidebarShell from "@/components/SidebarShell";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell>{children}</SidebarShell>;
}
