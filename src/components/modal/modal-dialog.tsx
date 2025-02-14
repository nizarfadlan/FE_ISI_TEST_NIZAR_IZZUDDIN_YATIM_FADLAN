import { useModalDialog } from "@/hooks/useModalDialog";
import { useOutSideClick } from "@/hooks/useOutSideClick";
import { cn } from "@/utils";
import { useState, useEffect, useRef } from "react";

export function ModalDialog() {
  const { isOpen, title, content, closeModal } = useModalDialog();
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutSideClick(wrapperRef, closeModal, isOpen, false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 200);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        ref={wrapperRef}
        className={cn(
          "w-full max-w-md transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-200",
          isOpen ? "scale-100" : "scale-90",
        )}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="mt-2 text-sm text-gray-600">{content}</div>
      </div>
    </div>
  );
}
