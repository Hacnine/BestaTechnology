import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useGetEmployeesQuery } from "../../redux/api/employeeApi";
import { Employee } from "@/types/employee";

const userRoles = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGEMENT", label: "Management" },
  { value: "MERCHANDISER", label: "Merchandiser" },
  { value: "CAD", label: "CAD" },
  { value: "SAMPLE_FABRIC", label: "Sample Fabric" },
  { value: "SAMPLE_ROOM", label: "Sample Room" },
];

interface UserFormProps {
  mode: "add" | "edit";
  initialData?: any;
  onSubmit: (form: any, selectedEmployee?: Employee | null) => void;
  onCancel: () => void;
}

export default function UserForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [form, setForm] = useState(
    initialData || {
      userName: "",
      email: "",
      role: "",
      status: "Active",
      password: "",
    }
  );
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const { data: employeeData, isLoading: isEmployeeLoading } =
    useGetEmployeesQuery(
      {
        search: employeeSearchTerm,
        page: 1,
      },
      { skip: !employeeSearchTerm }
    );
  const employeeSearchResults = employeeData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setForm({ ...form, role });
  };

  const handleSelectEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEmployeeSearchTerm("");
    setForm({ ...form, email: employee.email });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add") {
      onSubmit(form, selectedEmployee);
    } else {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "add" && (
        <div>
          <Label htmlFor="employeeSearch">
            Search Employee by Email or Custom ID
          </Label>
          <Input
            id="employeeSearch"
            placeholder="Enter email or custom ID..."
            value={employeeSearchTerm}
            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
          />
          {isEmployeeLoading && (
            <p className="text-sm text-muted-foreground">Searching...</p>
          )}
          {employeeSearchResults.length > 0 && !selectedEmployee && (
            <div className="max-h-40 overflow-y-auto border rounded-md">
              {employeeSearchResults.map((employee: any) => (
                <div
                  key={employee.id}
                  className="p-2 hover:bg-blue-200 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelectEmployee(employee)}
                >
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.email} - {employee.customId}
                    </div>
                  </div>
                  {selectedEmployee?.id === employee.id && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {selectedEmployee && (
            <div className="p-3 bg-accent/50 rounded-md">
              <p className="text-sm">
                Selected: {selectedEmployee.name} ({selectedEmployee.email})
              </p>
            </div>
          )}
        </div>
      )}
      <div>
        <Label htmlFor="userName">Custom Username</Label>
        <Input
          id="userName"
          name="userName"
          placeholder="Enter custom username"
          value={form.userName}
          onChange={handleChange}
        />
      </div>
      {mode === "add" && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
      )}
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={form.role} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {userRoles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">{mode === "add" ? "Submit Form" : "Save"}</Button>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
