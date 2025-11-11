import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import url from "@/config/urls";
import toast from "react-hot-toast";
import { useGetMerchandisersQuery } from "@/redux/api/merchandiserApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCreateTNAMutation, useUpdateTNAMutation } from "@/redux/api/tnaApi";
import { useGetBuyersQuery } from "@/redux/api/buyerApi";

interface TnaFormProps {
  onSuccess: () => void;
  initialValues?: Partial<
    TnaFormState & {
      id?: string;
      itemImage?: string;
      merchandiser?: { id: string; userName?: string }; // <-- add this
    }
  >;
  onEdit?: (values: any) => Promise<void>;
}
interface TnaFormState {
  buyerId: number | ""; 
  style: string;
  itemName: string;
  sampleSendingDate: string;
  orderDate: string;
  userId: number | "";
  status: string;
  sampleType: string;
}
interface Buyer {
  id: string;
  name: string;
}
interface Merchandiser {
  id: number | string;
  name: string;
}

export default function TnaForm({
  onSuccess,
  initialValues,
  onEdit,
}: TnaFormProps) {
  const [form, setForm] = useState<TnaFormState>({
    buyerId: "",
    style: "",
    itemName: "",
    sampleSendingDate: "",
    orderDate: "",
    userId: "", 
    status: "ACTIVE",
    sampleType: "",
  });
  const [createTna, { isLoading }] = useCreateTNAMutation();
  const [updateTna, { isLoading: isUpdating }] = useUpdateTNAMutation();
  const { data: buyersResponse } = useGetBuyersQuery({});
  const { data: merchandisers } = useGetMerchandisersQuery({});
console.log(merchandisers)

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const buyers = buyersResponse?.data ?? [];

  // Autofill form when editing
  useEffect(() => {
    if (initialValues) {
      setForm({
        buyerId:
          initialValues.buyerId !== undefined && initialValues.buyerId !== null
            ? Number(initialValues.buyerId)
            : "",
        style: initialValues.style || "",
        itemName: initialValues.itemName || "",
        sampleSendingDate: initialValues.sampleSendingDate
          ? initialValues.sampleSendingDate.slice(0, 10)
          : "",
        orderDate: initialValues.orderDate
          ? initialValues.orderDate.slice(0, 10)
          : "",
        userId:
          initialValues.merchandiser?.id !== undefined &&
          initialValues.merchandiser?.id !== null
            ? Number(initialValues.merchandiser.id)
            : initialValues.userId !== undefined &&
              initialValues.userId !== null
            ? Number(initialValues.userId)
            : "",
        status: initialValues.status || "ACTIVE",
        sampleType: initialValues.sampleType || "",
      });
      setExistingImage(initialValues.itemImage || null);
      setEditMode(true);
    } else {
      setEditMode(false);
      setExistingImage(null);
      setImageFile(null);
      setForm({
        buyerId: "",
        style: "",
        itemName: "",
        sampleSendingDate: "",
        orderDate: "",
        userId: "",
        status: "ACTIVE",
        sampleType: "",
      });
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For buyerId and userId, convert string to integer before storing in state
  const handleSelectChange = (name: keyof TnaFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: name === "buyerId" || name === "userId" ? Number(value) : value,
    }));
  };

  // Change handleImageChange to only store the file, not upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setExistingImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = existingImage || "";
    try {
      // If new image selected, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch(`${url.BASE_URL}/tnas/upload-image`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await res.json();
        if (data.imageUrl) {
          imageUrl = data.imageUrl;
        } else {
          toast.error("Image upload failed");
          setUploading(false);
          return;
        }
      } else if (!editMode) {
        toast.error("Please select an image before submitting.");
        setUploading(false);
        return;
      }

      const payload = {
        ...form,
        itemImage: imageUrl,
        sampleSendingDate: new Date(form.sampleSendingDate).toISOString(),
        orderDate: new Date(form.orderDate).toISOString(),
      };

      if (editMode && initialValues?.id) {
        // Update mode
        if (onEdit) {
          await onEdit(payload);
        } else {
          await updateTna({ id: initialValues.id, ...payload }).unwrap();
        }
        toast.success("TNA updated successfully");
      } else {
        // Create mode
        await createTna(payload).unwrap();
        toast.success("TNA created successfully");
      }

      setForm({
        buyerId: "",
        style: "",
        itemName: "",
        sampleSendingDate: "",
        orderDate: "",
        userId: "",
        status: "ACTIVE",
        sampleType: "",
      });
      setImageFile(null);
      setExistingImage(null);
      setEditMode(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to submit TNA");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">Buyer</label>
        <Select
          value={form.buyerId !== "" ? String(form.buyerId) : ""}
          onValueChange={(v) => handleSelectChange("buyerId", v)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select buyer" />
          </SelectTrigger>
          <SelectContent>
            {buyers.map((buyer: Buyer) => (
              <SelectItem key={buyer.id} value={String(buyer.id)}>
                {buyer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Style</label>
        <Input
          name="style"
          value={form.style}
          onChange={handleChange}
          placeholder="Enter style"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Item Name</label>
        <Input
          name="itemName"
          value={form.itemName}
          onChange={handleChange}
          placeholder="Enter item name"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Image</label>
        <div
          className={cn(
            "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 bg-muted/40 transition hover:bg-muted/60",
            uploading ? "opacity-70 pointer-events-none" : ""
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 2 }}
            key={imageFile ? imageFile.name : existingImage || "empty"}
            ref={(input) => {
              if (!imageFile && !existingImage && input) input.value = "";
            }}
          />
          {!imageFile && !existingImage ? (
            <div className="flex  items-center justify-center h-[5px] ">
              <svg
                width="32"
                height="12"
                fill="none"
                className="mb-2 text-muted-foreground"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 16V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="2"
                  y="16"
                  width="20"
                  height="6"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="11"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-xs text-muted-foreground">
                Click or drag to upload image
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : existingImage
                    ? existingImage
                    : ""
                }
                alt="Item"
                className="max-h-32 rounded shadow border"
              />
              {/* <Button
                type="button"
                variant="outline"
                size="sm"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFile(null);
                  setExistingImage(null);
                }}
                disabled={uploading}
              >
                Remove
              </Button> */}
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">File Receive Date</label>
        <Input
          name="orderDate"
          type="date"
          value={form.orderDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Sample Sending Date</label>
        <Input
          name="sampleSendingDate"
          type="date"
          value={form.sampleSendingDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Merchandiser</label>
        <Select
          value={form.userId !== "" ? String(form.userId) : ""}
          onValueChange={(v) => handleSelectChange("userId", v)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select merchandiser" />
          </SelectTrigger>
          <SelectContent>
            {merchandisers?.map((user: Merchandiser) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Sample Type</label>
        <Select
          value={form.sampleType}
          onValueChange={(v) => handleSelectChange("sampleType", v)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sample type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DVP">DVP</SelectItem>
            <SelectItem value="PP1">PP1</SelectItem>
            <SelectItem value="PP2">PP2</SelectItem>
            <SelectItem value="PP3">PP3</SelectItem>
            <SelectItem value="PP4">PP4</SelectItem>
            <SelectItem value="PP5">PP5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Status</label>
        <Select
          value={form.status}
          onValueChange={(v) => handleSelectChange("status", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 flex justify-center">
        <Button
          className="w-[400px] self-end"
          type="submit"
          disabled={isLoading || isUpdating || uploading}
        >
          {editMode ? "Update TNA" : "Submit TNA Form"}
        </Button>
      </div>
    </form>
  );
}
