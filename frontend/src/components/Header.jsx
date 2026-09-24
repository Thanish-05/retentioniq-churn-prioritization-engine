import React, { useState } from 'react';
import { Search, Database, RefreshCw, ArrowRight } from 'lucide-react';

export default function Header({ activePage, onSelectCustomer, onRefresh }) {
  const [searchInput, setSearchInput] = useState('');

  const titles = {
    dashboard: { title: 'Executive Overview', subtitle: 'Live retention portfolio performance & key economic KPIs' },
    risk: { title: 'Customer Risk Intelligence', subtitle: 'Granular churn and persuadability ranking across the customer base' },
    customer360: { title: 'Customer 360 View', subtitle: 'Counterfactual intervention analysis & personalized retention offer' },
    segmentation: { title: 'Causal Persuadability Segmentation', subtitle: 'Strategic grouping based on treatment response & lifetime value' },
    optimizer: { title: 'Retention Budget Optimizer', subtitle: 'Dynamic Knapsack capital allocation maximizing net value saved' },
    insights: { title: 'Model Diagnostics & Feature Explainability', subtitle: 'Actual ROC-AUC, PR-AUC, Qini curves & top predictive signals' }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectCustomer(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  const current = titles[activePage] || { title: 'RETENTIONIQ', subtitle: '' };

  return (
    <header className="h-16 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between flex-shrink-0 z-10">
      <div>
        <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          {current.title}
        </h1>
        <p className="text-[11px] text-slate-400">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Fast Customer Lookup */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Jump to Customer (e.g. C10828)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64 pl-8 pr-8 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
          />
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          {searchInput && (
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-semibold text-white transition-all flex items-center gap-0.5"
            >
              Go <ArrowRight className="h-2.5 w-2.5" />
            </button>
          )}
        </form>

        {/* Dataset metadata badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-300">
          <Database className="h-3.5 w-3.5 text-blue-400" />
          <span>Orange Belgium (11,896)</span>
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh active view"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
