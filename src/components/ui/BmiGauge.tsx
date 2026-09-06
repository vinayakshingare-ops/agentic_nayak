import React from "react";
import { BmiCategory } from "@/types";

interface BmiGaugeProps {
  bmi: number;
  category: BmiCategory;
  categoryLabel: string;
  minHealthyWeight?: number;
  maxHealthyWeight?: number;
  showDisclaimer?: boolean;
}

export const BmiGauge: React.FC<BmiGaugeProps> = ({
  bmi,
  category,
  categoryLabel,
  minHealthyWeight,
  maxHealthyWeight,
  showDisclaimer = true,
}) => {
  // Map BMI (range 15 to 40) to percentage (0% to 100%)
  const clampedBmi = Math.min(40, Math.max(15, bmi || 22));
  const needlePercent = ((clampedBmi - 15) / (40 - 15)) * 100;

  const categoryBadgeColors: Record<BmiCategory, string> = {
    underweight: "bg-sky-50 text-sky-700 border-sky-200",
    normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overweight: "bg-amber-50 text-amber-800 border-amber-200",
    obese: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {bmi > 0 ? bmi.toFixed(1) : "--"}
          </span>
          <span className="text-xs text-slate-500 ml-1.5 font-medium">BMI</span>
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${categoryBadgeColors[category]}`}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Visual Multi-segment Bar */}
      <div className="relative pt-2 pb-5">
        <div className="h-3 w-full rounded-full overflow-hidden flex shadow-inner">
          <div className="w-[14%] bg-sky-400" title="Underweight (<18.5)" />
          <div className="w-[26%] bg-emerald-500" title="Normal range (18.5 - 24.9)" />
          <div className="w-[20%] bg-amber-400" title="Overweight (25.0 - 29.9)" />
          <div className="w-[40%] bg-rose-400" title="Obesity (30.0+)" />
        </div>

        {/* Needle Marker */}
        {bmi > 0 && (
          <div
            className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-700 ease-out"
            style={{ left: `${needlePercent}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-md ring-2 ring-white" />
            <div className="w-0.5 h-3.5 bg-slate-900" />
          </div>
        )}

        {/* Range Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium px-0.5">
          <span>&lt; 18.5</span>
          <span className="text-emerald-700 font-semibold">18.5 – 24.9 Normal</span>
          <span>25 – 29.9</span>
          <span>30+</span>
        </div>
      </div>

      {minHealthyWeight && maxHealthyWeight && (
        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 mb-2">
          <span className="font-semibold text-slate-800">Healthy reference weight:</span>{" "}
          {minHealthyWeight} – {maxHealthyWeight} kg
        </div>
      )}

      {showDisclaimer && (
        <p className="text-[11px] text-slate-600 leading-relaxed italic">
          * BMI is a population screening indicator and does not differentiate muscle mass from fat.
          It is not a medical diagnosis.
        </p>
      )}
    </div>
  );
};
