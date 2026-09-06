import React from "react";
import { Card } from "./Card";
import { clsx } from "clsx";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  targetText?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  progressPercent?: number;
  progressBarColor?: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: "emerald" | "amber" | "blue" | "rose";
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  targetText,
  icon,
  iconBgColor = "bg-emerald-50 text-emerald-600",
  progressPercent,
  progressBarColor = "bg-emerald-500",
  subtitle,
  badgeText,
  badgeVariant = "emerald",
  onClick,
  className,
}) => {
  const badgeStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <Card
      hoverEffect={!!onClick}
      onClick={onClick}
      className={clsx(
        "flex flex-col justify-between",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center font-medium shadow-sm",
              iconBgColor
            )}
          >
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </h4>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {value}
              </span>
              {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
            </div>
          </div>
        </div>

        {badgeText && (
          <span
            className={clsx(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              badgeStyles[badgeVariant]
            )}
          >
            {badgeText}
          </span>
        )}
      </div>

      {(progressPercent !== undefined || targetText || subtitle) && (
        <div className="mt-4 pt-2 border-t border-slate-100">
          {progressPercent !== undefined && (
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
              <div
                className={clsx("h-full rounded-full transition-all duration-500", progressBarColor)}
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          )}
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            {targetText && <span>{targetText}</span>}
            {subtitle && <span className="text-slate-600">{subtitle}</span>}
          </div>
        </div>
      )}
    </Card>
  );
};
