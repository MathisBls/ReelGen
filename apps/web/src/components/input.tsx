import { cn } from "@/lib/utils";
import React from "react";

export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-black dark:border-neutral-700 dark:bg-neutral-900"
      )}
      {...props}
    />
  );
}
