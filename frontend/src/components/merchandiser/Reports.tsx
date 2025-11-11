import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  Eye,
  FileText,
  DollarSign,
  Target,
  Users
} from "lucide-react";
import { VariancePill } from "@/components/ui/variance-pill";
import SampleTnaTable from "./SampleTnaTable";

const reports = [
  {
    id: 1,
    name: "Pre vs Post Costing Variance",
    description: "Compare estimated vs actual costs across all orders",
    category: "Costing",
    icon: BarChart3,
    lastRun: "2024-01-15",
    schedule: "Weekly",
    status: "Ready",
    variance: -8.5
  },
  {
    id: 2,
    name: "Profit Analysis by Buyer",
    description: "Profitability breakdown by customer",
    category: "Profitability",
    icon: DollarSign,
    lastRun: "2024-01-14",
    schedule: "Daily",
    status: "Processing",
    variance: 12.3
  },
  {
    id: 3,
    name: "Contribution Margin Leaderboard",
    description: "Top performing orders by contribution percentage",
    category: "Performance",
    icon: Target,
    lastRun: "2024-01-13",
    schedule: "Daily",
    status: "Ready",
    variance: 5.7
  },
  {
    id: 4,
    name: "Order Status Distribution",
    description: "Current status of all orders in the system",
    category: "Operations",
    icon: FileText,
    lastRun: "2024-01-15",
    schedule: "Real-time",
    status: "Ready",
    variance: 0
  },
  {
    id: 5,
    name: "Net Profit Trend Analysis",
    description: "Profit trends over time with forecasting",
    category: "Profitability",
    icon: TrendingUp,
    lastRun: "2024-01-12",
    schedule: "Weekly",
    status: "Ready",
    variance: 15.2
  },
  {
    id: 6,
    name: "Buyer Performance Dashboard",
    description: "Comprehensive buyer analysis and metrics",
    category: "Customer",
    icon: Users,
    lastRun: "2024-01-14",
    schedule: "Weekly",
    status: "Ready",
    variance: -2.1
  }
];

const categoryColors = {
  "Costing": "bg-blue-100 text-blue-800 border-blue-200",
  "Profitability": "bg-green-100 text-green-800 border-green-200",
  "Performance": "bg-purple-100 text-purple-800 border-purple-200",
  "Operations": "bg-orange-100 text-orange-800 border-orange-200",
  "Customer": "bg-pink-100 text-pink-800 border-pink-200"
};

const statusColors = {
  "Ready": "bg-green-100 text-green-800 border-green-200",
  "Processing": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Error": "bg-red-100 text-red-800 border-red-200"
};

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Reports"
        description="Business intelligence and analytics reports"
      />
      <SampleTnaTable/>
      {/* Filters */}
      {/* <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="costing">Costing</SelectItem>
                <SelectItem value="profitability">Profitability</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="7days">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}

      {/* Reports Grid */}
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const IconComponent = report.icon;
          
          return (
            <Card 
              key={report.id} 
              className="shadow-soft hover:shadow-medium transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <Badge className={categoryColors[report.category as keyof typeof categoryColors]}>
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                    {report.status}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {report.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Last run: {report.lastRun}
                  </div>
                  <div className="text-muted-foreground">
                    {report.schedule}
                  </div>
                </div>

                {report.variance !== 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <VariancePill value={report.variance} size="sm" />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    disabled={report.status === "Processing"}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={report.status === "Processing"}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div> */}

      {/* Quick Insights */}
      {/* <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-success/10 rounded-lg border border-success/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success">18.5%</div>
                  <div className="text-sm text-muted-foreground">Average Net Profit</div>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </div>
            
            <div className="p-4 bg-gradient-surface rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">92</div>
                  <div className="text-sm text-muted-foreground">Reports Generated</div>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            
            <div className="p-4 bg-gradient-surface rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">-5.2%</div>
                  <div className="text-sm text-muted-foreground">Avg Cost Variance</div>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}