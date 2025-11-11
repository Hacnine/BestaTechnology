import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../../redux/api/userApi";
import { useGetEmployeesQuery } from "../../redux/api/employeeApi";
import { Employee } from "@/types/employee";
import toast from "react-hot-toast";
import RoleStats from "./RoleStats";
import UserTable from "./UserTable";
import UserForm from "./UserForm";

const userRoles = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "MANAGEMENT",
    label: "Management",
  },
  {
    value: "MERCHANDISER",
    label: "Merchandiser",
  },
  {
    value: "CAD",
    label: "CAD",
  },
  {
    value: "SAMPLE_FABRIC",
    label: "Sample Fabric",
  },
  {
    value: "SAMPLE_ROOM",
    label: "Sample Room",
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    role: "",
    status: "Active",
  });
  // New states for employee selection in add dialog
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data: users, isLoading } = useGetUsersQuery({
    search: searchTerm,
    role: roleFilter === "all" ? "" : roleFilter,
    page,
  });

  const [createUser, { isLoading: isCreating, isSuccess: isCreated }] =
    useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating, isSuccess: isUpdated }] =
    useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  // Query for searching employees in add dialog
  const { data: employeeData, isLoading: isEmployeeLoading } =
    useGetEmployeesQuery(
      {
        search: employeeSearchTerm,
        page: 1,
      },
      { skip: !employeeSearchTerm }
    );
  const employeeSearchResults = employeeData?.data || [];

  // Add User handler
  const handleAddUser = async (form: any, selectedEmployee: any) => {
    if (!selectedEmployee || !form.userName || !form.password || !form.role) {
      toast.error("Please select an employee and fill all required fields.");
      return;
    }
    try {
      await createUser({
        employeeEmail: selectedEmployee.email,
        userName: form.userName,
        password: form.password,
        role: form.role,
      }).unwrap();
      setIsAddDialogOpen(false);
      toast.success(`${form.userName} has been successfully added.`);
    } catch (err: any) {
      console.log(err)
      toast.error(err?.data?.error || "Failed to add user.");
    }
  };

  // Edit User handler
  const handleEditUser = async (form: any) => {
    try {
      await updateUser({ id: editingUser.id, ...form }).unwrap();
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast.success(`User information has been successfully updated.`);
    } catch (err) {
      toast.error(`Failed to update user.`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success(`User has been successfully deleted.`);
    } catch (err) {
      toast.error(`Failed to delete user.`);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId).unwrap();
      toast.success(`User status has been updated.`);
    } catch (err) {
      toast.error(`Failed to update status.`);
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };

  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage users, roles and permissions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setIsAddDialogOpen((prev) => !prev)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Inline Add User Form */}
      {isAddDialogOpen && (
        <Card className="p-4">
          <UserForm
            mode="add"
            onSubmit={handleAddUser}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </Card>
      )}

      {/* User Statistics */}
      <RoleStats />

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {searchTerm && (
              <Button variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Inline Edit User Form */}
      {isEditDialogOpen && (
        <Card className="p-4">
          <UserForm
            mode="edit"
            initialData={formData}
            onSubmit={handleEditUser}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingUser(null);
            }}
          />
        </Card>
      )}
      {/* Users Table */}
      <UserTable
        users={users?.data || []}
        isLoading={isLoading}
        searchTerm={searchTerm}
        openEditDialog={openEditDialog}
        handleDeleteUser={handleDeleteUser}
        pagination={users?.pagination}
        onPageChange={setPage}
      />
    </div>
  );
}

export default UserManagement;
