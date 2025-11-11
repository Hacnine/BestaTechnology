import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  FileText,
  ArrowUpRight,
  RefreshCw,
  Settings,
  Plus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BuyerForm from "../merchandiser/BuyerForm";
import { useState } from "react";
import { DepartmentProgress } from "../common/DepartmentProgress";
import TnaSummaryCards from "../merchandiser/TnaSummaryCards";

const statsCards = [
  {
    title: "Total Users",
    value: "247",
    change: "+12",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Active TNAs",
    value: "89",
    change: "+5",
    changeType: "positive" as const,
    icon: ClipboardList,
  },
  {
    title: "On-Time Delivery",
    value: "92%",
    change: "+3%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Overdue Tasks",
    value: "23",
    change: "-8",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
];

const recentActivities = [
  {
    id: 1,
    user: "Sarah Chen",
    role: "Merchandiser",
    action: "Created new TNA for Order #TN-2024-001",
    time: "2 minutes ago",
    type: "create",
  },
  {
    id: 2,
    user: "Abdullah Khan",
    role: "CAD Designer",
    action: "Completed pattern files for Style ABC-123",
    time: "15 minutes ago",
    type: "complete",
  },
  {
    id: 3,
    user: "Lisa Wang",
    role: "Sample Room",
    action: "Submitted proto sample for approval",
    time: "1 hour ago",
    type: "submit",
  },
  {
    id: 4,
    user: "David Kim",
    role: "Management",
    action: "Approved fabric selection for Order #TN-2024-002",
    time: "2 hours ago",
    type: "approve",
  },
];

const departmentProgress = [
  {
    name: "Merchandising",
    completed: 45,
    total: 52,
    percentage: 87,
  },
  {
    name: "CAD Room",
    completed: 32,
    total: 38,
    percentage: 84,
  },
  {
    name: "Sample Fabric",
    completed: 28,
    total: 35,
    percentage: 80,
  },
  {
    name: "Sample Room",
    completed: 41,
    total: 47,
    percentage: 87,
  },
];

export function AdminDashboardOverview() {
  const [openBuyer, setOpenBuyer] = useState(false);
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your Sample TNA
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <TnaSummaryCards/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Progress */}
        <DepartmentProgress />

        {/* Recent Activity */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-accent" />
                <span>Recent Activity</span>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "create"
                        ? "bg-accent/10"
                        : activity.type === "complete"
                        ? "bg-success/10"
                        : activity.type === "submit"
                        ? "bg-warning/10"
                        : "bg-primary/10"
                    }`}
                  >
                    {activity.type === "create" && (
                      <ClipboardList className="w-4 h-4 text-accent" />
                    )}
                    {activity.type === "complete" && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    {activity.type === "submit" && (
                      <Clock className="w-4 h-4 text-warning" />
                    )}
                    {activity.type === "approve" && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.role}
                    </p>
                    <p className="text-sm text-foreground mt-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
