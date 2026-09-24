import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  UserCheck, 
  Layers, 
  Sliders, 
  Cpu, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, selectedCustomerId }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'risk', label: 'Customer Risk', icon: AlertTriangle },
    { id: 'customer360', label: 'Customer 360', icon: UserCheck, subtitle: selectedCustomerId ? `(${selectedCustomerId})` : '' },
    { id: 'segmentation', label: 'Segmentation', icon: Layers },
    { id: 'optimizer', label: 'Retention Optimizer', icon: Sliders, highlight: true },
    { id: 'insights', label: 'Model Insights', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-[#0a0e17] border-r border-slate-800/80 flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">RETENTION</span>
              <span className="font-black text-lg text-blue-500">IQ</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              RETENTION-ROI ENGINE
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 leading-tight">
          Predict churn. Understand why. Spend smarter.
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Decision Workflow
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <div className="text-left">
                  <span>{item.label}</span>
                  {item.subtitle && (
                    <span className="ml-1.5 text-[10px] text-blue-400/80 font-mono">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {item.highlight && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    HERO
                  </span>
                )}
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Infrastructure Badge */}
      <div className="p-4 border-t border-slate-800/60 bg-[#070b12]">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-[11px] font-semibold text-slate-300">Production Engine</span>
        </div>
        <div className="space-y-1 text-[10px] text-slate-400 font-mono">
          <div className="flex justify-between">
            <span>Model:</span>
            <span className="text-slate-300">XGBoost + T-Learner</span>
          </div>
          <div className="flex justify-between">
            <span>Population:</span>
            <span className="text-slate-300">11,896 Customers</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Connected
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
