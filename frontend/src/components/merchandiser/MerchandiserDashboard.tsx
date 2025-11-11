import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Filter,
} from "lucide-react";
import { useGetTNASummaryCardQuery, useGetDepartmentProgressV2Query } from "@/redux/api/tnaApi";
import TnaSummaryCards from "./TnaSummaryCards";
import { DepartmentProgress } from "../common/DepartmentProgress";

const tnaCardConfig = [
  {
    status: "On Track",
    key: "onProcess",
    color: "bg-gradient-success",
    textColor: "text-success",
    icon: <CheckCircle className="w-6 h-6 text-white" />,
  },
  {
    status: "Completed",
    key: "completed",
    color: "bg-gradient-accent",
    textColor: "text-warning",
    icon: <AlertTriangle className="w-6 h-6 text-white" />,
  },
  {
    status: "Overdue",
    key: "overdue",
    color: "bg-destructive",
    textColor: "text-destructive",
    icon: <XCircle className="w-6 h-6 text-white" />,
  },
];

export function MerchandiserDashboard() {
  const { data: summaryCardData } = useGetTNASummaryCardQuery({});

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            TNA Progress Monitoring
          </h1>
          <p className="text-muted-foreground">
            Track and monitor Time & Action progress across all orders
          </p>
        </div>
      </div>

      {/* TNA Overview Cards */}

      <TnaSummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Progress */}
        <DepartmentProgress/>

        {/* Quick Stats */}
        {/* <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span>Timeline Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">67</div>
                <div className="text-sm text-muted-foreground">
                  Total Active TNAs
                </div>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <div className="text-2xl font-bold text-success">23</div>
                <div className="text-sm text-muted-foreground">
                  Completed This Week
                </div>
              </div>
              <div className="text-center p-4 bg-warning/5 rounded-lg">
                <div className="text-2xl font-bold text-warning">12</div>
                <div className="text-sm text-muted-foreground">
                  Due This Week
                </div>
              </div>
              <div className="text-center p-4 bg-destructive/5 rounded-lg">
                <div className="text-2xl font-bold text-destructive">7</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card> */}

      </div>
    </div>
  );
}
 