import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartPulse } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="text-white text-base font-bold">Vitalis Health</span>
          </div>
          <p className="text-slate-400 max-w-md leading-relaxed text-xs">
            Vitalis is an evidence-informed personal wellness companion designed to help you
            understand your body, personalize daily nutrition, build active habits, and track
            sustainable progress.
          </p>

          <div className="flex items-center gap-2 mt-4 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy-First Architecture • Your Health Data Remains Yours</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
            Features
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Personal Dashboard
              </Link>
            </li>
            <li>
              <Link href="/diet" className="hover:text-white transition-colors">
                7-Day & 30-Day Diet Engine
              </Link>
            </li>
            <li>
              <Link href="/progress" className="hover:text-white transition-colors">
                Progress Analytics & BMI
              </Link>
            </li>
            <li>
              <Link href="/grocery" className="hover:text-white transition-colors">
                Smart Grocery List
              </Link>
            </li>
            <li>
              <Link href="/assistant" className="hover:text-white transition-colors">
                AI Health Assistant
              </Link>
            </li>
          </ul>
        </div>

        {/* Medical & Trust Notice */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
            Health Guidance Notice
          </h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Vitalis Health provides general wellness, lifestyle, and nutrition calculations
            (including BMI and Mifflin-St Jeor estimates). It does NOT provide medical
            diagnosis, medical treatment, or prescription services. Always consult a qualified
            healthcare professional for specific medical conditions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} Vitalis Health Technologies. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 transition-colors">Evidence-Informed</span>
          <span>•</span>
          <span className="hover:text-slate-300 transition-colors">HIPAA Conscious Design</span>
          <span>•</span>
          <span className="hover:text-slate-300 transition-colors">No Crash Diets</span>
        </div>
      </div>
    </footer>
  );
};
