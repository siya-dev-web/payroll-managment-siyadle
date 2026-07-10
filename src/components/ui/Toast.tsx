"use client";

import { useEffect } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, show, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onHide, duration]);

  return (
    <div
      className={`fixed bottom-10 right-10 z-50 transition-all duration-300 pointer-events-none ${
        show ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <div className="bg-inverse-surface text-on-primary px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
        <MaterialIcon icon="check_circle" className="text-primary-fixed" />
        <span className="font-label-md">{message}</span>
      </div>
    </div>
  );
}
