"use client";

import { useEffect } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-[12px] flex items-center justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl border border-outline-variant mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display-md text-display-md font-bold text-on-surface">{title}</h3>
            <button
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={onClose}
            >
              <MaterialIcon icon="close" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
