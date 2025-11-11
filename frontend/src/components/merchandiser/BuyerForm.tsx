import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useGetDepartmentsQuery } from "@/redux/api/merchandiserApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateBuyerMutation } from "@/redux/api/buyerApi";

interface BuyerFormProps {
  onSuccess: () => void;
}
interface BuyerFormState {
  name: string;
  country: string;
  buyerDepartmentId: string;
}
interface Department {
  id: string;
  name: string;
}

export default function BuyerForm() {
  const [form, setForm] = useState<BuyerFormState>({ name: "", country: "", buyerDepartmentId: "" });
  const [createBuyer, { isLoading }] = useCreateBuyerMutation({});
  const { data: departments } = useGetDepartmentsQuery({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setForm((prev) => ({ ...prev, buyerDepartmentId: value === "none" ? "" : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createBuyer({ ...form, buyerDepartmentId: form.buyerDepartmentId || null }).unwrap();
      toast.success("Buyer created successfully");
      setForm({ name: "", country: "", buyerDepartmentId: "" });
      // onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to create buyer");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Buyer Name</label>
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter buyer name" required />
      </div>
      <div>
        <label className="text-sm font-medium">Country</label>
        <Input name="country" value={form.country} onChange={handleChange} placeholder="Enter country" required />
      </div>
      <div>
        <label className="text-sm font-medium">Department</label>
        <Select value={form.buyerDepartmentId} onValueChange={handleDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select department (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Department</SelectItem>
            {departments?.data?.map((dept: Department) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading}>Submit Form</Button>
    </form>
  );
}
