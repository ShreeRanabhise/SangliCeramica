"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Package, FolderTree, Image as ImageIcon, MessageSquare, Tag, LayoutDashboard, Settings, FileText, LayoutTemplate, MapPin, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { signOut } from "@/actions/auth";

const groups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    label: "Catalog",
    items: [
      { title: "Collections", url: "/admin/collections", icon: FolderTree },
      { title: "Categories", url: "/admin/categories", icon: FolderTree },
      { title: "Brands", url: "/admin/brands", icon: Tag },
      { title: "Products", url: "/admin/products", icon: Package },
    ]
  },
  {
    label: "Marketing",
    items: [
      { title: "Carousel", url: "/admin/carousel", icon: LayoutTemplate },
      { title: "Catalogues", url: "/admin/catalogues", icon: FileText },
    ]
  },
  {
    label: "Customers",
    items: [
      { title: "Inquiries", url: "/admin/inquiries", icon: MessageSquare },
    ]
  },
  {
    label: "Content",
    items: [
      { title: "Gallery", url: "/admin/gallery", icon: ImageIcon },
      { title: "Branches", url: "/admin/branches", icon: MapPin },
      { title: "Content", url: "/admin/content", icon: FileText },
    ]
  },
  {
    label: "Settings",
    items: [
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ]
  }
];

export function AppSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center border-b px-6">
        <h2 className="text-lg font-bold tracking-tight">Sangli Ceramica</h2>
      </SidebarHeader>
      
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || (item.url !== "/admin" && pathname.startsWith(item.url + "/"));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={isActive}>
                        <Link href={item.url} className="flex items-center gap-2 w-full">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4 flex flex-row items-center gap-2">
        <Link href="/admin/profile" className="flex-1 flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors outline-none focus:ring-2 focus:ring-ring overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col items-start text-sm truncate flex-1">
            <span className="font-medium">Admin</span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {user?.email || "admin@example.com"}
            </span>
          </div>
        </Link>
        <button 
          onClick={handleSignOut}
          title="Sign Out"
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
