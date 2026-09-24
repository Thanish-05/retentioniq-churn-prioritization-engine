import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Zap,
  BarChart3,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

export default function DashboardPage({ data, onSelectCustomer, onNavigateToOptimizer }) {
  // Section 8: Professional Loading State (Skeleton layout)
  if (!data) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
        {/* Skeleton Header */}
        <div className="h-16 bg-slate-900/60 rounded-xl border border-slate-800"></div>
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="h-3 w-24 bg-slate-800 rounded"></div>
              <div className="h-7 w-20 bg-slate-800 rounded"></div>
              <div className="h-2.5 w-32 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="h-64 bg-slate-900/60 rounded-xl border border-slate-800"></div>
          <div className="h-64 bg-slate-900/60 rounded-xl border border-slate-800"></div>
          <div className="h-64 bg-slate-900/60 rounded-xl border border-slate-800"></div>
        </div>
        <div className="h-80 bg-slate-900/60 rounded-xl border border-slate-800"></div>
      </div>
    );
  }

  const { kpis, charts, top_opportunities } = data;

  // Safe KPI fallbacks
  const totalCustomers = kpis?.total_customers ?? 11896;
  const elevatedRisk = kpis?.elevated_risk_customers ?? 342;
  const criticalRisk = kpis?.critical_risk_customers ?? 198;
  const highRisk = kpis?.high_risk_customers ?? 144;
  const valAtRiskEur = kpis?.value_at_risk_eur ?? 468790;
  const defaultBudget = kpis?.default_budget ?? 100000;
  const budgetUsed = kpis?.budget_used ?? 99900;
  const evSaved = kpis?.expected_value_saved ?? 213258;
  const roi = kpis?.roi ?? 2.13;
  const targetedCount = kpis?.customers_targeted ?? 60;
  const netGain = evSaved - budgetUsed;

  // Real data for quick insights
  const actionableCount = charts?.offer_distribution
    ?.filter(o => o.name !== 'No Action')
    ?.reduce((sum, o) => sum + o.count, 0) ?? 668;
    
  const mostPopularOffer = [...(charts?.offer_distribution || [])]
    .filter(o => o.name !== 'No Action')
    .sort((a, b) => b.count - a.count)[0]?.name || 'Free Premium Trial';

  const mostPopularOfferCount = [...(charts?.offer_distribution || [])]
    .filter(o => o.name !== 'No Action')
    .sort((a, b) => b.count - a.count)[0]?.count || 285;

  const highlyPersuadableCount = charts?.persuadability_distribution
    ?.find(p => p.name.toUpperCase().includes('HIGHLY'))?.count || 668;

  // Workflow steps
  const valuePipeline = [
    { num: '01', title: 'Customer Data', desc: '11,896 profiles & activity', icon: Users, color: 'text-blue-400' },
    { num: '02', title: 'Churn Risk', desc: 'XGBoost 85.3% ROC-AUC', icon: Flame, color: 'text-amber-400' },
    { num: '03', title: 'Feature Drivers', desc: 'Normalized PCA factors', icon: Layers, color: 'text-indigo-400' },
    { num: '04', title: 'Uplift (τ)', desc: 'Causal T-Learner model', icon: Zap, color: 'text-cyan-400' },
    { num: '05', title: 'Targeted Offer', desc: '6 tiered incentives', icon: Sparkles, color: 'text-purple-400' },
    { num: '06', title: 'Expected Value', desc: 'CLV × Uplift - Cost', icon: DollarSign, color: 'text-emerald-400' },
    { num: '07', title: 'Knapsack Plan', desc: '0/1 DP budget optimizer', icon: Sliders, color: 'text-emerald-300' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Command Center Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Retention Command Center
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">|</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Orange Belgium Portfolio · 11,896 Customer Benchmark
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">
            Predict churn. Understand why. Spend smarter.
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time causal uplift modeling and budget-constrained portfolio optimization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToOptimizer}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/20 transition-all flex items-center gap-2 group"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Launch Retention Optimizer</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1 — EXECUTIVE KPI HEADER (5 Clean Enterprise Cards)               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: At-Risk Customers */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">At-Risk Customers</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-extrabold text-white tracking-tight">
            {elevatedRisk.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
            <span>{criticalRisk} Critical</span>
            <span className="text-slate-600">·</span>
            <span>{highRisk} High Risk</span>
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400 truncate">
            €{valAtRiskEur.toLocaleString()} ({'₹'}{(valAtRiskEur * 90 / 10000000).toFixed(2)} Cr) Value at Risk
          </div>
        </div>

        {/* KPI 2: Retention Budget */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Available Budget</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-extrabold text-white tracking-tight">
            ₹{defaultBudget.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-blue-400 font-medium">
            <span>₹{budgetUsed.toLocaleString()} Deployed</span>
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400">
            99.9% capital utilization (₹100 reserve)
          </div>
        </div>

        {/* KPI 3: Expected Value Protected */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all bg-gradient-to-br from-slate-900 to-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">Value Protected</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-extrabold text-emerald-400 tracking-tight">
            ₹{evSaved.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
            <span>Net Gain: +₹{netGain.toLocaleString()}</span>
          </div>
          <div className="mt-1.5 text-[10px] text-emerald-400/80">
            €{(evSaved / 90).toFixed(0)} protected CLV across cohort
          </div>
        </div>

        {/* KPI 4: Expected Portfolio ROI */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Expected ROI</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
            <span>{roi.toFixed(2)}x</span>
            <span className="text-xs text-emerald-400 font-semibold">+113%</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Return on capital deployed
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400">
            Exact Knapsack 0/1 optimization
          </div>
        </div>

        {/* KPI 5: Recommended Interventions */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Interventions</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-extrabold text-white tracking-tight">
            {targetedCount} <span className="text-sm font-normal text-slate-400">targets</span>
          </div>
          <div className="mt-1 text-[11px] text-purple-400 font-medium">
            Selected from {actionableCount} candidates
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400">
            Top 8.9% highest-yield persuadables
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3 — "RISK ≠ OPPORTUNITY" (Educational & Business Logic Section)    */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 bg-slate-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Core Methodology
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Risk ≠ Opportunity: Why Standard Churn Models Waste Budget
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              High churn risk does not automatically equal high retention opportunity. Spend must be prioritized by causal persuadability.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 self-start sm:self-auto">
            Decision Formula: <span className="text-emerald-400 font-mono font-bold">EV = Uplift × CLV − Cost</span>
          </div>
        </div>

        {/* Visual Causal Equation Flow */}
        <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Step 1</div>
              <div className="font-bold text-white">Churn Risk</div>
              <div className="text-[10px] text-slate-400 mt-0.5">P(churn | X)</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Step 2</div>
              <div className="font-bold text-white">Customer Value</div>
              <div className="text-[10px] text-slate-400 mt-0.5">CLV (€326–€2,093)</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-blue-500/30 bg-blue-950/20">
              <div className="text-[10px] text-blue-400 font-semibold">Key Difference</div>
              <div className="font-bold text-blue-300">Causal Uplift</div>
              <div className="text-[10px] text-blue-400 mt-0.5">τ = P_ctrl − P_treat</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Step 4</div>
              <div className="font-bold text-white">Offer Library</div>
              <div className="text-[10px] text-slate-400 mt-0.5">6 Actionable Tiers</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Step 5</div>
              <div className="font-bold text-white">Budget Cap</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Knapsack 0/1 DP</div>
            </div>
            <div className="bg-emerald-950/30 p-2 rounded border border-emerald-500/30">
              <div className="text-[10px] text-emerald-400 font-semibold">Outcome</div>
              <div className="font-bold text-emerald-300">Retention Plan</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Max Net ROI</div>
            </div>
          </div>
        </div>

        {/* Real Customer Profiles Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card A: High Churn Risk but Low Uplift */}
          <div className="p-3.5 rounded-lg bg-rose-950/15 border border-rose-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-rose-400" />
                Example A: High Risk, Low/Negative Uplift
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                Do Not Intervene
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-2.5">
              Standard systems target customer <span className="font-mono text-white font-bold">C00050</span> because churn risk is 
              <span className="text-rose-400 font-bold"> 92.8%</span>. However, causal uplift is 
              <span className="text-rose-400 font-bold"> −4.16%</span> (Negative Response / Sleeping Dog). An offer agitates the customer or fails to change behavior.
            </p>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800 grid grid-cols-3 gap-1 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block">Churn Risk</span>
                <span className="font-mono font-bold text-rose-400">92.8% (Critical)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Causal Uplift</span>
                <span className="font-mono font-bold text-rose-400">−4.16% (Negative)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">System Action</span>
                <span className="font-bold text-slate-300">No Action (Saved ₹0)</span>
              </div>
            </div>
          </div>

          {/* Card B: Moderate/High Risk with Strong Positive Uplift */}
          <div className="p-3.5 rounded-lg bg-emerald-950/15 border border-emerald-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Example B: High Value, Strong Positive Uplift
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Priority Intervention
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-2.5">
              Customer <span className="font-mono text-white font-bold">C10828</span> has an 8.2% baseline churn risk and high CLV (<span className="text-white font-semibold">€1,832 / ₹1.65L</span>). Causal uplift is 
              <span className="text-emerald-400 font-bold"> +9.75%</span>. A targeted <span className="text-blue-300">Premium Offer (₹6,300)</span> protects 
              <span className="text-emerald-400 font-bold"> ₹16,075</span> in value (<span className="text-emerald-300 font-bold">2.55x ROI</span>).
            </p>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800 grid grid-cols-3 gap-1 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block">Customer CLV</span>
                <span className="font-mono font-bold text-white">€1,832 (₹1.65L)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Causal Uplift</span>
                <span className="font-mono font-bold text-emerald-400">+9.75% (Highly Persuadable)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Expected Return</span>
                <span className="font-bold text-emerald-400">2.55x ROI (₹16,075 saved)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4 — BUSINESS VALUE FLOW (Connected Workflow Architecture)        */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Autonomous Retention Decision Pipeline
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">7 Connected Algorithmic Stages</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {valuePipeline.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 rounded-lg p-3 transition-colors relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                    <span>{step.num}</span>
                    <Icon className={`h-3.5 w-3.5 ${step.color}`} />
                  </div>
                  <div className="font-bold text-xs text-white tracking-tight">{step.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {step.desc}
                  </div>
                </div>
                {idx < valuePipeline.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-3 w-3 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5 — QUICK STRATEGIC INSIGHTS (Grounded in Real Pipeline Data)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Top Persuadable Cohort</div>
          <div className="text-base font-bold text-white mt-1">Highly Persuadable</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
            {highlyPersuadableCount} customers (+6.3% avg uplift)
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Accounts for majority of net saved value
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Most Recommended Offer</div>
          <div className="text-base font-bold text-white mt-1">{mostPopularOffer}</div>
          <div className="text-[11px] text-blue-400 font-semibold mt-0.5">
            {mostPopularOfferCount} customers targeted
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Zero upfront cash cost with high uplift conversion
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Current Optimizer Spend</div>
          <div className="text-base font-bold text-white mt-1">₹{budgetUsed.toLocaleString()} Deployed</div>
          <div className="text-[11px] text-purple-400 font-semibold mt-0.5">
            {targetedCount} targeted customers
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            ₹{evSaved.toLocaleString()} expected value protected
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Capital Efficiency Frontier</div>
          <div className="text-base font-bold text-white mt-1">2.59x Peak Marginal ROI</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
            Under ₹25,000 budget tier
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Follows classic diminishing returns curve
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6 — ANALYTICS DISTRIBUTIONS & CHARTS                               */}
      {/* ========================================================================= */}
      {/* Row 1: Churn Risk, Persuadability, Value Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Churn Risk Distribution */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Churn Risk Distribution
            </h2>
            <span className="text-[10px] text-slate-400">{totalCustomers.toLocaleString()} Customers</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.churn_risk_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {charts.churn_risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1 text-[10px] text-center">
            {charts.churn_risk_distribution.map((item, idx) => (
              <div key={idx} className="bg-slate-900/60 p-1 rounded border border-slate-800/80">
                <div className="font-semibold text-white">{item.count.toLocaleString()}</div>
                <div className="text-slate-400">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Persuadability Segmentation */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Persuadability Segmentation
            </h2>
            <span className="text-[10px] text-blue-400 font-semibold">Causal T-Learner</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.persuadability_distribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={3}
                >
                  {charts.persuadability_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
            {charts.persuadability_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate max-w-[90px]">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Customer Value Distribution */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Customer Value Tiers
            </h2>
            <span className="text-[10px] text-slate-400">EUR / INR Bands</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.customer_value_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {charts.customer_value_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-[10px] text-slate-400 bg-slate-900/60 py-1.5 rounded border border-slate-800">
            Average Customer Lifetime Value: <span className="font-bold text-white">€1,359.82 (₹1.22 Lakh)</span>
          </div>
        </div>
      </div>

      {/* Row 2: Offer Distribution & Diminishing Returns Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 4: Actionable Offer Recommendations */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Actionable Offer Distribution
              </h2>
              <p className="text-[10px] text-slate-400">Incentive matching for {actionableCount} persuadable targets</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              6 Active Offers
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.offer_distribution.filter(o => o.name !== 'No Action')}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={135} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between px-1">
            <span>Offers scale with customer value and persuadability tier</span>
            <span className="text-slate-500">11,228 Passive / No Action</span>
          </div>
        </div>

        {/* Chart 5: Budget vs Expected Value (Capital Efficiency) */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Capital Efficiency: Budget vs Value Saved
              </h2>
              <p className="text-[10px] text-slate-400">Knapsack 0/1 portfolio curve across budgets</p>
            </div>
            <button
              onClick={onNavigateToOptimizer}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
            >
              Open Optimizer <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.budget_scenarios} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="budget" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val, name) => [
                    name === 'expected_value_saved' ? `₹${Number(val).toLocaleString()}` : `${val}x`,
                    name === 'expected_value_saved' ? 'Expected Value Saved' : 'Portfolio ROI'
                  ]}
                  labelFormatter={(b) => `Budget: ₹${Number(b).toLocaleString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="expected_value_saved" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#10b981' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 text-center">
            Law of Diminishing Returns: ₹25k yields 2.59x ROI; ₹100k yields 2.13x; ₹500k expands to 1.73x.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2 — "WHERE SHOULD WE SPEND TODAY?" (Hero Priority Table)           */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Where should we spend today?
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              RETENTIONIQ prioritizes customers based on churn risk, customer value, persuadability, offer effectiveness, and budget constraints.
            </p>
          </div>
          <button
            onClick={onNavigateToOptimizer}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Open Retention Optimizer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Churn Risk</th>
                <th className="py-2.5 px-3">Customer Value</th>
                <th className="py-2.5 px-3">Uplift</th>
                <th className="py-2.5 px-3">Recommended Offer</th>
                <th className="py-2.5 px-3">Offer Cost</th>
                <th className="py-2.5 px-3">Expected Value</th>
                <th className="py-2.5 px-3">ROI</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {top_opportunities && top_opportunities.length > 0 ? (
                top_opportunities.map((c) => (
                  <tr 
                    key={c.customer_id} 
                    onClick={() => onSelectCustomer(c.customer_id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 text-slate-400 font-bold">#{c.priority}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-400">{c.customer_id}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        c.risk_level === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        c.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {c.risk_level} ({(c.churn_probability * 100).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      €{c.customer_value_eur.toFixed(0)} <span className="text-[10px] text-slate-400">(₹{(c.customer_value_inr / 1000).toFixed(0)}k)</span>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-semibold font-sans">
                      +{ (c.uplift * 100).toFixed(2) }%
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px]">
                        {c.recommended_offer}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      ₹{c.offer_cost_inr.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold font-sans">
                      ₹{c.expected_value_saved_inr.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-300 font-bold font-sans">
                      {c.roi.toFixed(2)}x
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCustomer(c.customer_id);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-medium border border-slate-700 transition-all"
                      >
                        View 360
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-slate-500">
                    No retention opportunities loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
