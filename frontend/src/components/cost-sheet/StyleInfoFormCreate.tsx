import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import { useCheckStyleQuery } from "@/redux/api/costSheetApi";
import { useState } from "react";
import url from "@/config/urls";
import StyleCustomFields from "./StyleCustomFields.tsx";

interface StyleInfoFormCreateProps {
  form: UseFormReturn<any>;
}

const StyleInfoFormCreate = ({ form }: StyleInfoFormCreateProps) => {
  const stylePattern = /^[A-Za-z0-9-]+$/;
  const values = form.watch();
  const styleValue = form.watch("style");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: styleCheckData } = useCheckStyleQuery(styleValue, {
    skip: !styleValue || !stylePattern.test(styleValue),
    refetchOnMountOrArgChange: true,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      form.setValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    console.log("Removing image");
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("image", null);
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="pt-5">
          <Label htmlFor="image">Style Image</Label>
          <span className="text-red-500">*</span>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                key={selectedImage ? "file-selected" : "file-empty"}
              />
              <Label
                htmlFor="image"
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4" />
                {selectedImage ? selectedImage.name : "Upload Image"}
              </Label>
              {selectedImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
        <div className="pt-5">
          <Label htmlFor="style">
            Style <span className="text-red-500">*</span>
          </Label>
          <Input
            id="style"
            value={values?.style ?? ""}
            onChange={(e) => {
              const filteredValue = e.target.value.replace(
                /[^A-Za-z0-9-]/g,
                ""
              );
              form.setValue("style", filteredValue);
            }}
            className="uppercase"
            placeholder="Enter style code"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="item">
            Item <span className="text-red-500">*</span>
          </Label>
          <Input
            id="item"
            value={values?.item ?? ""}
            onChange={(e) => form.setValue("item", e.target.value)}
            placeholder="e.g., Baby Jogging Tops"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="group">
            Group <span className="text-red-500">*</span>
          </Label>
          <Input
            id="group"
            value={values?.group ?? ""}
            onChange={(e) => form.setValue("group", e.target.value)}
            placeholder="e.g., Boys"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="size">
            Size <span className="text-red-500">*</span>
          </Label>
          <Input
            id="size"
            value={values?.size ?? ""}
            onChange={(e) => form.setValue("size", e.target.value)}
            placeholder="e.g., 03/SS26"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="fabricType">
            Fabric Type <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fabricType"
            value={values?.fabricType ?? ""}
            onChange={(e) => form.setValue("fabricType", e.target.value)}
            placeholder="e.g., Fleece, 85% Cotton"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="gsm">
            GSM <span className="text-red-500">*</span>
          </Label>
          <Input
            id="gsm"
            value={values?.gsm ?? ""}
            onChange={(e) => form.setValue("gsm", e.target.value)}
            placeholder="e.g., 320"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="color">
            Color <span className="text-red-500">*</span>
          </Label>
          <Input
            id="color"
            value={values?.color ?? ""}
            onChange={(e) => form.setValue("color", e.target.value)}
            placeholder="e.g., 01X"
          />
        </div>

        <div className="pt-5">
          <Label htmlFor="buyer">
            Buyer <span className="text-red-500">*</span>
          </Label>
          <Input
            id="buyer"
            value={values?.buyer ?? ""}
            onChange={(e) => form.setValue("buyer", e.target.value)}
            placeholder="Enter buyer name"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="brand">
            Brand <span className="text-red-500">*</span>
          </Label>
          <Input
            id="brand"
            value={values?.brand ?? ""}
            onChange={(e) => form.setValue("brand", e.target.value)}
            placeholder="Enter brand name"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="qty">Quantity</Label>
          <Input
            id="qty"
            value={values?.qty ?? ""}
            onChange={(e) => form.setValue("qty", e.target.value)}
            placeholder="Enter quantity"
          />
        </div>
          <div className="pt-5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={values?.name ?? ""}
              onChange={(e) => form.setValue("name", e.target.value)}
              placeholder="Optional merchandiser name"
            />
          </div>
      </div>

      {/* Style custom fields (styleRows) - simple add/remove list */}
      <div className="mt-4">
        <StyleCustomFields form={form} />
      </div>

      {/* Style validation alerts */}
      {styleCheckData?.exists === true && (
        <Alert className="border-warning bg-warning/10">
          <AlertCircle className="h-4 w-4 text-orange-700" />
          <AlertDescription className="text-warning-foreground text-orange-700">
            This style is already created by merchandiser {" "}
            <strong>{styleCheckData.creatorName}</strong>
             {" "} in this year.
          </AlertDescription>
        </Alert>
      )}

      {styleCheckData?.exists === false && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-green-700" />
          <AlertDescription className="text-green-700">
            Style is available. You can proceed with creating the cost sheet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StyleInfoFormCreate;

