import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export type FieldDef = {
  key: string;
  label?: string;
  type?: "text" | "number" | "email" | "select" | "textarea";
  options?: string[]; 
};

interface EmployeeFormDynamicProps {
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  onCancel?: () => void;
  fieldDefinitions?: FieldDef[];
}

const defaultDepartments = [
  "MERCHANDISING",
  "MANAGEMENT",
  "IT",
  "CAD_ROOM",
  "SAMPLE_FABRIC",
  "SAMPLE_SEWING",
];

const defaultStatuses = ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"];

const EmployeeFormDynamic = ({ initialData, onSubmit, onCancel, fieldDefinitions }: EmployeeFormDynamicProps) => {
  const [data, setData] = useState<Record<string, any>>({ ...initialData });
  const [submitting, setSubmitting] = useState(false);

  const keys = fieldDefinitions && fieldDefinitions.length > 0
    ? fieldDefinitions.map(f => f.key)
    : // prefer common order when not provided
      [
        "customId",
        "name",
        "email",
        "phoneNumber",
        "designation",
        "department",
        "status",
      ].filter(k => k in data || initialData[k] !== undefined);

  const handleChange = (key: string, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="py-6">
        <div className="grid gap-4 py-4">
          {keys.map((key) => {
            const def = fieldDefinitions?.find(f => f.key === key);
            const label = def?.label ?? key;
            const type = def?.type ?? (key === "email" ? "email" : "text");
            // special handling for department/status when no def provided
            if ((def?.type === "select") || key === "department") {
              const options = def?.options ?? defaultDepartments;
              return (
                <div className="grid grid-cols-4 items-center gap-4" key={key}>
                  <Label className="col-span-1">{label}</Label>
                  <div className="col-span-3">
                    <Select value={String(data[key] ?? "")} onValueChange={(v) => handleChange(key, v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            }

            if (key === "status") {
              return (
                <div className="grid grid-cols-4 items-center gap-4" key={key}>
                  <Label className="col-span-1">{label}</Label>
                  <div className="col-span-3">
                    <Select value={String(data[key] ?? "")} onValueChange={(v) => handleChange(key, v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultStatuses.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            }

            // default text/number/email
            return (
              <div className="grid grid-cols-4 items-center gap-4" key={key}>
                <Label className="col-span-1">{label}</Label>
                <div className="col-span-3">
                  <Input
                    id={key}
                    type={type === "number" ? "number" : "text"}
                    value={data[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          {onCancel && (
            <Button variant="outline" className="mr-2" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeFormDynamic;
