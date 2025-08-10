import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  const base =
    "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition active:scale-[.98]";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      : "hover:bg-neutral-100 dark:hover:bg-neutral-900";
  return <button className={cn(base, styles, className)} {...props} />;
}
