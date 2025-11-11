import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useCreateDepartmentMutation } from "@/redux/api/merchandiserApi";

interface DepartmentFormProps {
  onSuccess: () => void;
}
interface DepartmentFormState {
  name: string;
  contactPerson: string;
}

export default function DepartmentForm({ onSuccess }: DepartmentFormProps) {
  const [form, setForm] = useState<DepartmentFormState>({ name: "", contactPerson: "" });
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createDepartment(form).unwrap();
      toast.success("Department created successfully");
      setForm({ name: "", contactPerson: "" });
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to create department");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Department Name</label>
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter department name" required />
      </div>
      <div>
        <label className="text-sm font-medium">Contact Person</label>
        <Input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Enter contact person" required />
      </div>
      <Button type="submit" disabled={isLoading}>Create Department</Button>
    </form>
  );
}
