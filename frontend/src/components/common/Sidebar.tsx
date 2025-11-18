import {
  LayoutDashboard,
  Users,
  Settings,
  Activity,
  FileText,
  ClipboardList,
  Shield,
  Bell,
  Building2,
  ChevronLeft,
  TrendingUp,
  IdCardIcon,
  Package,
  ShoppingCart,
  BarChart3,
  Barcode,
  Airplay,
  GitCommitHorizontal,
  Rows4,
  Webhook,
  SquareDashedKanban,
  Receipt,
  User,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { APP_ROUTES } from "@/routes/APP_ROUTES";
import { useUser } from "@/redux/slices/userSlice";

const navigationItemsMap: Record<string, any[]> = {
  ADMIN: [
    {
      title: "Dashboard",
      href: `${APP_ROUTES.admin_dashboard}`,
      icon: LayoutDashboard,
    },
    {
      title: "Employee Management",
      href: `${APP_ROUTES.admin_employee}`,
      icon: IdCardIcon,
    },
    {
      title: "User Management",
      href: `${APP_ROUTES.admin_user}`,
      icon: Users,
    },
    {
      title: "Buyer Management",
      href: `${APP_ROUTES.admin_buyer}`,
      icon: Barcode,
    },

    {
      title: "Reports",
      href: `${APP_ROUTES.admin_reports}`,
      icon: FileText,
    },
    {
      title: "Cost Sheet",
      href: `${APP_ROUTES.admin_cost_sheet}`,
      icon: Receipt,
    },
  ],
  MERCHANDISER: [
    {
      title: "Dashboard",
      href: `${APP_ROUTES.merchandiser_dashboard}`,
      icon: LayoutDashboard,
    },
    {
      title: "Sample TNA",
      href: `${APP_ROUTES.sample_tna}`,
      icon: Rows4,
    },
    {
      title: "Reports",
      href: `${APP_ROUTES.merchandiser_reports}`,
      icon: ClipboardList,
    },
    { title: "Cost Sheet", href: `${APP_ROUTES.cost_sheet}`, icon: Receipt },
  ],
  MANAGEMENT: [
    {
      title: "Dashboard",
      href: `${APP_ROUTES.management_dashboard}`,
      icon: ClipboardList,
    },
    {
      title: "Cost Sheet",
      href: `${APP_ROUTES.management_cost_sheet}`,
      icon: Receipt,
    },
    {
      title: "Trim & Accessories",
      href: `${APP_ROUTES.management_trims_edit}`,
      icon: Package,
    },
  ],
  CAD: [
    {
      title: "CAD Designs",
      href: `${APP_ROUTES.cad}`,
      icon: Airplay,
    },
  ],
  SAMPLE_FABRIC: [
    {
      title: "Fabric Booking",
      href: `${APP_ROUTES.sample_fabric}`,
      icon: GitCommitHorizontal,
    },
  ],
  SAMPLE_ROOM: [
    {
      title: "Sample Room Dashboard",
      href: "/sample-room/dashboard",
      icon: Webhook,
    },
  ],
};

const settingsItemsMap: Record<string, any[]> = {
  ADMIN: [
    {
      title: "Notifications",
      href: `${APP_ROUTES.admin_notifications}`,
      icon: Bell,
    },
  ],
  CAD: [
    {
      title: "Notifications",
      href: `${APP_ROUTES.admin_notifications}`,
      icon: Bell,
    },
  ],
};

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItemProps {
  item: any;
  collapsed: boolean;
  iconSize?: string;
}

function NavItem({ item, collapsed, iconSize = "w-5 h-5" }: NavItemProps) {
  return (
    <NavLink
      key={item.href}
      to={item.href}
      end={item.href === "/"}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          collapsed ? "justify-center" : "space-x-3",
          "hover:bg-sidebar-hover hover:text-white",
          isActive
            ? "bg-sidebar-active text-white shadow-lg"
            : "text-sidebar-foreground"
        )
      }
    >
      <item.icon className={cn("flex-shrink-0", iconSize)} />
      {!collapsed && <span>{item.title}</span>}
    </NavLink>
  );
}

export function Sidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { user } = useUser();

  const location = useLocation();
  console.log(user?.role);
  const navigationItems = navigationItemsMap[user?.role] || [];
  const settingsItems = settingsItemsMap[user?.role] || [];
  return (
    <div
      className={cn(
        "relative bg-sidebar text-sidebar-foreground border-r border-border h-screen overflow-y-auto animate__animated",
        collapsed ? "w-16 " : "min-w-68 animate__slideInLeft animate__faster"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-hover">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="  flex items-center justify-center">
              <img className="size-10" src="/images/logo.webp" alt="" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-nowrap">Dashboard</h2>
              {/* <p className="text-xs text-sidebar-foreground/70">Admin Panel</p> */}
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-hover"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Settings Section */}
        {settingsItems.length > 0 && (
          <div className="mt-8">
            {!collapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                  Settings
                </h3>
              </div>
            )}
            <nav className="space-y-1">
              {settingsItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  iconSize={collapsed ? "w-5 h-5" : "w-4 h-4"}
                />
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="ml-2 p-4 border-t border-sidebar-hover ">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
                <User />
              </div>
              <div className="flex-1 min-w-0 ">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <LogoutButton collapsed={collapsed} />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 ">
            <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
              <User />
            </div>
            <LogoutButton collapsed={collapsed} />
          </div>
        )}
      </div>
    </div>
  );
}
