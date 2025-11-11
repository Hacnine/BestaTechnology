import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Search, 
  Download, 
  Filter,
  Calendar,
  User,
  FileEdit,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

const auditLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 10:30:25",
    user: "Sarah Chen",
    userRole: "Merchandiser",
    action: "CREATE",
    resource: "TNA Plan",
    resourceId: "TNA-2024-001",
    description: "Created new TNA plan for Order #ORD-2024-456",
    ipAddress: "192.168.1.105",
    userAgent: "Chrome/120.0.0.0",
    status: "Success"
  },
  {
    id: 2,
    timestamp: "2024-01-15 10:25:12",
    user: "Mike Johnson",
    userRole: "CAD Designer",
    action: "UPDATE",
    resource: "CAD File",
    resourceId: "CAD-2024-089",
    description: "Updated pattern files for Style ABC-123",
    ipAddress: "192.168.1.112",
    userAgent: "Chrome/120.0.0.0",
    status: "Success"
  },
  {
    id: 3,
    timestamp: "2024-01-15 10:20:45",
    user: "Admin User",
    userRole: "Admin",
    action: "DELETE",
    resource: "User Account",
    resourceId: "USER-456",
    description: "Deleted inactive user account for John Smith",
    ipAddress: "192.168.1.100",
    userAgent: "Firefox/121.0.0.0",
    status: "Success"
  },
  {
    id: 4,
    timestamp: "2024-01-15 10:15:33",
    user: "Lisa Wang",
    userRole: "Sample Room",
    action: "UPLOAD",
    resource: "Sample File",
    resourceId: "SAMPLE-2024-234",
    description: "Uploaded proto sample images for approval",
    ipAddress: "192.168.1.118",
    userAgent: "Safari/17.2.0",
    status: "Success"
  },
  {
    id: 5,
    timestamp: "2024-01-15 10:10:15",
    user: "David Kim",
    userRole: "Management",
    action: "APPROVE",
    resource: "TNA Task",
    resourceId: "TASK-2024-567",
    description: "Approved fabric selection for Order #ORD-2024-002",
    ipAddress: "192.168.1.108",
    userAgent: "Chrome/120.0.0.0",
    status: "Success"
  },
  {
    id: 6,
    timestamp: "2024-01-15 09:55:42",
    user: "Emma Rodriguez",
    userRole: "Sample Fabric",
    action: "LOGIN",
    resource: "System",
    resourceId: "LOGIN-SESSION",
    description: "User logged into the system",
    ipAddress: "192.168.1.125",
    userAgent: "Chrome/120.0.0.0",
    status: "Success"
  },
  {
    id: 7,
    timestamp: "2024-01-15 09:45:28",
    user: "Unknown User",
    userRole: "Unknown",
    action: "LOGIN_FAILED",
    resource: "System",
    resourceId: "FAILED-LOGIN",
    description: "Failed login attempt with email: hacker@test.com",
    ipAddress: "203.45.67.89",
    userAgent: "Unknown",
    status: "Failed"
  },
  {
    id: 8,
    timestamp: "2024-01-15 09:30:18",
    user: "Sarah Chen",
    userRole: "Merchandiser",
    action: "EXPORT",
    resource: "Report",
    resourceId: "RPT-2024-012",
    description: "Exported TNA progress report for Q1 2024",
    ipAddress: "192.168.1.105",
    userAgent: "Chrome/120.0.0.0",
    status: "Success"
  }
];

const actionStats = [
  { action: "CREATE", count: 156, color: "bg-success" },
  { action: "UPDATE", count: 289, color: "bg-accent" },
  { action: "DELETE", count: 23, color: "bg-destructive" },
  { action: "LOGIN", count: 445, color: "bg-primary" },
  { action: "EXPORT", count: 67, color: "bg-warning" },
  { action: "APPROVE", count: 134, color: "bg-muted" }
];

export function AuditLogs() {
  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Monitor all system activities and user actions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
      </div>

      {/* Action Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actionStats.map((stat) => (
          <Card key={stat.action} className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{stat.action}</p>
                  <p className="text-lg font-bold text-foreground">{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search logs..." 
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">CREATE</SelectItem>
                <SelectItem value="update">UPDATE</SelectItem>
                <SelectItem value="delete">DELETE</SelectItem>
                <SelectItem value="login">LOGIN</SelectItem>
                <SelectItem value="export">EXPORT</SelectItem>
                <SelectItem value="approve">APPROVE</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by User Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="merchandiser">Merchandiser</SelectItem>
                <SelectItem value="cad">CAD Designer</SelectItem>
                <SelectItem value="fabric">Sample Fabric</SelectItem>
                <SelectItem value="sample">Sample Room</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-accent" />
            <span>Recent Activity Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{log.user}</div>
                      <Badge variant="outline" className="text-xs">
                        {log.userRole}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={`flex items-center space-x-1 w-fit ${
                        log.action === "CREATE" ? "border-success text-success" :
                        log.action === "UPDATE" ? "border-accent text-accent" :
                        log.action === "DELETE" ? "border-destructive text-destructive" :
                        log.action === "LOGIN" ? "border-primary text-primary" :
                        log.action === "LOGIN_FAILED" ? "border-destructive text-destructive" :
                        "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {log.action === "CREATE" && <Plus className="w-3 h-3" />}
                      {log.action === "UPDATE" && <FileEdit className="w-3 h-3" />}
                      {log.action === "DELETE" && <Trash2 className="w-3 h-3" />}
                      {log.action === "LOGIN" && <User className="w-3 h-3" />}
                      {log.action === "LOGIN_FAILED" && <XCircle className="w-3 h-3" />}
                      {log.action === "APPROVE" && <CheckCircle className="w-3 h-3" />}
                      {log.action === "UPLOAD" && <Plus className="w-3 h-3" />}
                      {log.action === "EXPORT" && <Download className="w-3 h-3" />}
                      <span>{log.action}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{log.resource}</div>
                      <div className="text-xs text-muted-foreground">{log.resourceId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-foreground truncate" title={log.description}>
                      {log.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={log.status === "Success" ? "default" : "destructive"}
                      className={`flex items-center space-x-1 w-fit ${
                        log.status === "Success" ? "bg-gradient-success" : ""
                      }`}
                    >
                      {log.status === "Success" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{log.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}