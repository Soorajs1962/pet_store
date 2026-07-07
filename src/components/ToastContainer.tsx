"use client";

import { useApp } from "@/context/AppContext";
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center justify-between w-full p-4 rounded-xl shadow-lg border border-border-brand bg-white/95 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && (
                <CheckCircle className="w-5 h-5 text-accent shrink-0" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-blue-500 shrink-0" />
              )}
              {toast.type === "error" && (
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              )}
              <p className="text-sm font-medium text-primary select-none leading-tight">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
