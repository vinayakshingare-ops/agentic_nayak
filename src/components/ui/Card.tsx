import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 transition-all duration-200",
          hoverEffect && "hover:shadow-card hover:border-emerald-200 hover:-translate-y-0.5",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
