import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, Plus, Users, Edit } from "lucide-react";
import EmployeeFormDynamic from "@/components/admin/EditDynamicForm";
import {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} from "@/redux/api/employeeApi";

const departments = [
  "MERCHANDISING",
  "MANAGEMENT",
  "IT",
  "CAD_ROOM",
  "SAMPLE_FABRIC",
  "SAMPLE_SEWING",
];

interface Employee {
  id: string;
  customId: string;
  phoneNumber: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: string;
}

interface EmployeeFormData {
  customId: string;
  phoneNumber: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: string;
}

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    customId: "",
    phoneNumber: "",
    name: "",
    email: "",
    designation: "",
    department: "",
    status: "ACTIVE",
  });
  

  // RTK Query hooks
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const { data, error, isLoading } = useGetEmployeesQuery({
    page,
    search: searchTerm,
    department: departmentFilter !== "all" ? departmentFilter : "",
  }); 
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  // Extract data
  const employees: Employee[] = data?.data || [];
  const pagination = data?.pagination || {};

  // Handle add employee (accepts submitted data from dynamic form)
  const handleAddEmployee = async (submittedData: EmployeeFormData) => {
    try {
      await createEmployee(submittedData).unwrap();
      setFormData({
        customId: "",
        phoneNumber: "",
        name: "",
        email: "",
        designation: "",
        department: "",
        status: "ACTIVE",
      });
      setIsAddDialogOpen(false);
      toast.success(`${submittedData.name} has been successfully added.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add employee.");
    }
  };

  // Open edit dialog and populate formData
  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      customId: employee.customId || "",
      phoneNumber: employee.phoneNumber || "",
      name: employee.name || "",
      email: employee.email || "",
      designation: employee.designation || "",
      department: employee.department || "",
      status: employee.status || "ACTIVE",
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit/save employee - accepts submitted data from dynamic form
  const handleEditEmployee = async (submittedData: EmployeeFormData) => {
    if (!editingEmployee) return;
    try {
      await updateEmployee({ id: editingEmployee.id, ...submittedData }).unwrap();
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      toast.success(`${submittedData.name} has been successfully updated.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update employee.");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    employeeId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateEmployee({
        id: employeeId,
        status: newStatus,
      }).unwrap();
      toast.success(`Employee status changed to ${newStatus.toLowerCase()}.`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update employee status.");
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on search change
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Employee Management
          </h1>
          <p className="text-muted-foreground">
            Manage employees, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen((prev) => !prev)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
      {/* Add Employee Form (dynamic component) */}
      {isAddDialogOpen && (
        <EmployeeFormDynamic
          initialData={formData}
          onCancel={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddEmployee}
          fieldDefinitions={[
            { key: "customId", label: "Custom ID", type: "text" },
            { key: "name", label: "Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phoneNumber", label: "Phone Number", type: "text" },
            { key: "designation", label: "Designation", type: "text" },
            { key: "department", label: "Department", type: "select", options: departments },
            { key: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"] },
          ]}
        />
      )}

      {/* Edit Employee Form (dynamic component) */}
      {isEditDialogOpen && (
        <EmployeeFormDynamic
          initialData={formData}
          onCancel={() => { setIsEditDialogOpen(false); setEditingEmployee(null); }}
          onSubmit={handleEditEmployee}
          fieldDefinitions={[
            { key: "customId", label: "Custom ID", type: "text" },
            { key: "name", label: "Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phoneNumber", label: "Phone Number", type: "text" },
            { key: "designation", label: "Designation", type: "text" },
            { key: "department", label: "Department", type: "select", options: departments },
            { key: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"] },
          ]}
        />
      )}

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by custom ID, email, phone, department, or designation..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
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

      {/* Employees Table */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent" />
            <span>Employees ({pagination?.totalEmployees || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          {error && (
            <div className="text-red-500">
              Error: {"Failed to load employees"}
            </div>
          )}
          {!isLoading && !error && employees.length === 0 && (
            <div>
              No employees found
              {pagination?.search ? ` for "${pagination.search}"` : ""}.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" text-nowrap">Custom ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className=" text-nowrap">Phone Number</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <div className=" min-w-full text-center flex items-center justify-center-safe">Loading employees...</div>}
              {employees.map((employee: Employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.customId}</TableCell>
                  <TableCell className=" capitalize">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell className=" capitalize">{employee.designation}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "ACTIVE" ? "secondary" : "destructive"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(employee.id, employee.status)
                        }
                        disabled={isUpdating}
                      >
                        {employee.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination?.totalEmployees > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalEmployees
                )}{" "}
                of {pagination.totalEmployees} employees
                {pagination?.search ? ` (search: "${pagination.search}")` : ""}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeManagement;