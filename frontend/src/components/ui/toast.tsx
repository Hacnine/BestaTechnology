// components/ui/toast.tsx
import { createContext, useContext } from "react";
import { useToast as useToastHook } from "@/hooks/use-toast";
// components/ui/toast.tsx

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast, toasts } = useToastHook();

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded shadow ${t.variant === "destructive" ? "bg-red-500 text-white" : "bg-white border"}`}
          >
            {t.title && <div className="font-bold">{t.title}</div>}
            {t.description && <div>{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
