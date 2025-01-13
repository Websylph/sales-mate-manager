import { Box, LayoutDashboard, DollarSign, PackageSearch, Receipt, PieChart } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Store Manager",
    url: "/",
    icon: Box,
  },
  {
    title: "Sales",
    url: "/sales",
    icon: DollarSign,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: PackageSearch,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: Receipt,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: PieChart,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-black data-[mobile=true]:bg-black">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-bold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={location.pathname === item.url 
                      ? "bg-white/10 text-white font-bold" 
                      : "text-white/80 hover:text-white hover:bg-white/10 font-bold"}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}