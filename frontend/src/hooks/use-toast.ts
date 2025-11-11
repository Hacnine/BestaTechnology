// hooks/use-toast.ts
import { useState, useCallback } from "react";
import { ToastProps } from "@/components/ui/toast";

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default" }: ToastProps) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000); // auto dismiss
    },
    []
  );

  return { toast, toasts };
}
