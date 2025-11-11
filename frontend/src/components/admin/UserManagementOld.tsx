import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const users = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    phone: "+1 234 567 8901",
    role: "Merchandiser",
    department: "Merchandising",
    status: "Active",
    lastLogin: "2024-01-15 10:30 AM",
    joinDate: "2023-03-15"
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 234 567 8902",
    role: "CAD Designer",
    department: "CAD Room",
    status: "Active",
    lastLogin: "2024-01-15 09:15 AM",
    joinDate: "2023-06-20"
  },
  {
    id: 3,
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    phone: "+1 234 567 8903",
    role: "Sample Specialist",
    department: "Sample Room",
    status: "Active",
    lastLogin: "2024-01-14 04:45 PM",
    joinDate: "2023-01-10"
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@company.com",
    phone: "+1 234 567 8904",
    role: "Manager",
    department: "Management",
    status: "Active",
    lastLogin: "2024-01-15 11:00 AM",
    joinDate: "2022-08-05"
  },
  {
    id: 5,
    name: "Emma Rodriguez",
    email: "emma.rodriguez@company.com",
    phone: "+1 234 567 8905",
    role: "Fabric Coordinator",
    department: "Sample Fabric",
    status: "Inactive",
    lastLogin: "2024-01-10 02:20 PM",
    joinDate: "2023-11-12"
  }
];

const roleStats = [
  { role: "Admin", count: 3, color: "bg-primary" },
  { role: "Management", count: 8, color: "bg-accent" },
  { role: "Merchandiser", count: 45, color: "bg-success" },
  { role: "CAD Designer", count: 12, color: "bg-warning" },
  { role: "Sample Fabric", count: 18, color: "bg-destructive" },
  { role: "Sample Room", count: 23, color: "bg-muted" }
];

export function UserManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles and permissions</p>
        </div>
        <Button className="bg-gradient-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {roleStats.map((stat) => (
          <Card key={stat.role} className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{stat.role}</p>
                  <p className="text-lg font-bold text-foreground">{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search users by name, email, or role..." 
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Role" />
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent" />
            <span>All Users ({users.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {user.role}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{user.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === "Active" ? "default" : "secondary"}
                      className={user.status === "Active" ? "bg-gradient-success" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.joinDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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