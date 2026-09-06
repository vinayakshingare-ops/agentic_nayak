import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "emerald" | "blue" | "amber" | "rose" | "purple" | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "emerald",
  size = "md",
  dot = false,
  ...props
}) => {
  const variantStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    blue: "bg-sky-50 text-sky-700 border-sky-200/60",
    amber: "bg-amber-50 text-amber-800 border-amber-200/60",
    rose: "bg-rose-50 text-rose-700 border-rose-200/60",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const dotColors = {
    emerald: "bg-emerald-500",
    blue: "bg-sky-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    purple: "bg-purple-500",
    neutral: "bg-slate-500",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs font-medium px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full border font-medium",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};
