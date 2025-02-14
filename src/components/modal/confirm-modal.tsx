import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { cn } from "@/utils";
import { useState, useEffect } from "react";
import { Button } from "../button";

export function ConfirmModal() {
  const {
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    closeDialog,
  } = useConfirmDialog();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 200); // Delay agar animasi keluar berjalan dulu
    }
  }, [isOpen]);

  if (!show) return null; // Hindari render saat tidak diperlukan

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "w-full max-w-md transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-200",
          isOpen ? "scale-100" : "scale-90",
        )}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <div className="mt-4 flex justify-end space-x-3">
          <Button
            onClick={() => {
              closeDialog();
              onCancel?.();
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={() => {
              closeDialog();
              onConfirm?.();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
