import { UseFormReturn } from "react-hook-form";
import StyleInfoFormCreate from "./StyleInfoFormCreate";
import StyleInfoFormEdit from "./StyleInfoFormEdit";
import StyleInfoFormShow from "./StyleInfoFormShow";

interface StyleInfoFormProps {
  form?: UseFormReturn<any>;
  mode?: "show" | "create" | "edit";
  data?: any;
}

const StyleInfoForm = ({
  form,
  mode = "edit",
  data = {},
}: StyleInfoFormProps) => {
  if (mode === "show") {
    return <StyleInfoFormShow data={data} />;
  }

  if (mode === "create" && form) {
    return <StyleInfoFormCreate form={form} />;
  }

  if (mode === "edit" && form) {
    return <StyleInfoFormEdit form={form} />;
  }

  return null;
};

export default StyleInfoForm;
