import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sliders, 
  Wallet, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Layers,
  PieChart as PieIcon,
  Percent,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceDot,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { optimizeBudget, fetchBudgetScenarios } from '../api';

export default function OptimizerPage({ onSelectCustomer }) {
  const [budget, setBudget] = useState(100000);
  const [result, setResult] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, SELECTED, NOT_SELECTED
  const debounceRef = useRef(null);

  // Load scenarios for the diminishing returns curve
  useEffect(() => {
    async function loadScenarios() {
      try {
        const scens = await fetchBudgetScenarios();
        setScenarios(scens);
      } catch (err) {
        console.error('Failed to load budget scenarios:', err);
      }
    }
    loadScenarios();
  }, []);

  // Run optimization whenever budget changes
  const runOptimization = async (targetBudget) => {
    setOptimizing(true);
    setError(null);
    try {
      const res = await optimizeBudget(targetBudget);
      setResult(res);
    } catch (err) {
      console.error('Optimization error:', err);
      setError('Optimization service temporarily unavailable. Please retry.');
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runOptimization(budget);
    }, 150);
    return () => clearTimeout(debounceRef.current);
  }, [budget]);

  // Section 4: What-If Scenarios
  const scenarioPresets = [
    {
      name: 'Conservative',
      budget: 50000,
      label: '₹50,000',
      tagline: 'High-ROI Core (20 Persuadables)',
      expectedRoi: '2.31x',
      desc: 'Focuses strictly on the highest-density persuadables with maximum capital efficiency.'
    },
    {
      name: 'Balanced (Baseline)',
      budget: 100000,
      label: '₹1,00,000',
      tagline: 'Optimal Balance (60 Customers)',
      expectedRoi: '2.13x',
      desc: 'Maximizes aggregate net value protected while sustaining >2.1x portfolio ROI.'
    },
    {
      name: 'Aggressive Expansion',
      budget: 200000,
      label: '₹2,00,000',
      tagline: 'Wide Reach (145 Customers)',
      expectedRoi: '1.98x',
      desc: 'Broadens retention coverage across all tier-1 and tier-2 persuadable accounts.'
    }
  ];

  const quickPresets = [25000, 50000, 100000, 200000, 500000];

  // Dynamic offer distribution derived exclusively from live selected customers
  const offerDistribution = useMemo(() => {
    if (!result || !result.selected_customers) return [];
    const counts = {};
    const selectedList = result.selected_customers.filter(c => c.selection_status === 'SELECTED');
    selectedList.forEach(c => {
      const off = c.recommended_offer || 'Unknown';
      counts[off] = (counts[off] || 0) + 1;
    });
    const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      count,
      color: palette[idx % palette.length]
    })).sort((a, b) => b.count - a.count);
  }, [result]);

  // Real customer examples for Section 6 (Risk != Opportunity in Optimizer)
  const realSelectedCustomer = useMemo(() => {
    if (!result || !result.selected_customers) return null;
    return result.selected_customers.find(c => c.selection_status === 'SELECTED' && c.uplift > 0.05) ||
           result.selected_customers.find(c => c.selection_status === 'SELECTED');
  }, [result]);

  const realUnselectedCustomer = useMemo(() => {
    if (!result || !result.selected_customers) return null;
    return result.selected_customers.find(c => c.selection_status === 'NOT SELECTED' && c.churn_probability >= 0.05) ||
           result.selected_customers.find(c => c.selection_status === 'NOT SELECTED');
  }, [result]);

  // Filtered priority table candidates
  const filteredCustomers = useMemo(() => {
    if (!result || !result.selected_customers) return [];
    if (statusFilter === 'SELECTED') {
      return result.selected_customers.filter(c => c.selection_status === 'SELECTED');
    }
    if (statusFilter === 'NOT_SELECTED') {
      return result.selected_customers.filter(c => c.selection_status === 'NOT SELECTED');
    }
    return result.selected_customers;
  }, [result, statusFilter]);

  const toggleExpand = (customerId) => {
    setExpandedCustomerId(prev => prev === customerId ? null : customerId);
  };

  const budgetUsedPct = result && result.budget > 0 
    ? Math.min(100, (result.budget_used / result.budget) * 100) 
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* SECTION 1 — HERO HEADER                                                   */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              Budget-Constrained Decision Engine
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3" /> Exact 0/1 Knapsack Dynamic Programming
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            Retention Optimizer
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Allocate a fixed retention budget to the customers and offers with the highest expected value. 
            RETENTIONIQ balances churn risk, customer value, uplift, offer effectiveness, and intervention cost.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setBudget(100000)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Baseline (₹1 Lakh)</span>
          </button>
        </div>
      </div>

      {/* Error state banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => runOptimization(budget)}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold"
          >
            Retry Optimization
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2 — DECISION SUMMARY (5 Real Optimizer KPIs)                       */}
      {/* ========================================================================= */}
      {!result && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="h-3 w-20 bg-slate-800/80 rounded"></div>
              <div className="h-7 w-24 bg-slate-800/80 rounded"></div>
              <div className="h-2.5 w-32 bg-slate-800/80 rounded"></div>
            </div>
          ))}
        </div>
      )}
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Metric 1: Retention Budget */}
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Retention Budget</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono tracking-tight">
              ₹{result.budget.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-blue-400 font-medium">
              Input Capital Constraint
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">
              ₹{(result.budget / 100000).toFixed(2)} Lakh total budget cap
            </div>
          </div>

          {/* Metric 2: Customers Selected */}
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Customers Selected</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono tracking-tight">
              {result.customers_targeted} <span className="text-sm font-normal text-slate-400">targeted</span>
            </div>
            <div className="mt-1 text-[11px] text-purple-400 font-medium">
              Optimal Interventions
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">
              Selected out of 303 active candidates
            </div>
          </div>

          {/* Metric 3: Allocated Spend */}
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Allocated Spend</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-400 font-mono tracking-tight">
              ₹{result.budget_used.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 font-medium">
              {budgetUsedPct.toFixed(1)}% Capital Utilized
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">
              ₹{result.remaining_budget.toLocaleString()} unallocated reserve
            </div>
          </div>

          {/* Metric 4: Expected Value Protected */}
          <div className="glass-card rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/15">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300">Expected Value Saved</span>
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-400 font-mono tracking-tight">
              ₹{result.expected_value_saved.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-300 font-medium">
              Net Gain: +₹{(result.expected_value_saved - result.budget_used).toLocaleString()}
            </div>
            <div className="mt-0.5 text-[10px] text-emerald-400/80">
              Total CLV saved above offer costs
            </div>
          </div>

          {/* Metric 5: Expected ROI */}
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Expected ROI</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-1.5">
              <span>{result.roi}x</span>
              <span className="text-xs text-emerald-400 font-bold font-sans">
                +{((result.roi - 1) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 text-[11px] text-indigo-400 font-medium">
              Return Per Rupee Deployed
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">
              ₹{result.roi} generated per ₹1 spent
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3 & 4 — BUDGET CENTERPIECE & WHAT-IF SCENARIOS                    */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-6 border border-blue-500/30 shadow-xl bg-slate-900/90 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Centerpiece Control
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                How should we allocate the budget?
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Slide or choose a scenario to recalculate the optimal Knapsack 0/1 portfolio in real time.
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Budget:</span>
            <span className="text-3xl font-black text-white font-mono">
              ₹{budget.toLocaleString()}
            </span>
            {optimizing && (
              <span className="text-xs font-sans text-blue-400 font-medium animate-pulse flex items-center gap-1 ml-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                Recalculating...
              </span>
            )}
          </div>
        </div>

        {/* Section 4: What-If Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {scenarioPresets.map((scen) => {
            const isSelected = budget === scen.budget;
            return (
              <button
                key={scen.budget}
                onClick={() => setBudget(scen.budget)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{scen.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {scen.label}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-1.5 flex items-center justify-between">
                  <span>{scen.tagline}</span>
                  <span>{scen.expectedRoi} ROI</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {scen.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Budget Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-blue-400" />
              Continuous Knapsack Budget Slider
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Other Presets:</span>
              {quickPresets.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                    budget === b
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  ₹{b >= 100000 ? `${b / 100000}L` : `${b / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>₹10,000 (Min)</span>
            <span>₹50,000 (Conservative)</span>
            <span>₹1,00,000 (Baseline)</span>
            <span>₹2,00,000 (Expansion)</span>
            <span>₹500,000 (Max Capacity)</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 10 — BUDGET ALLOCATION VISUAL (Capital Utilization Meter)         */}
        {/* ========================================================================= */}
        {result && (
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Capital Deployment Breakdown
                </span>
                <span className="text-[10px] text-slate-400">
                  (Total Budget: ₹{result.budget.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-400 font-bold">
                  ₹{result.budget_used.toLocaleString()} Deployed ({budgetUsedPct.toFixed(1)}%)
                </span>
                <span className="text-slate-400">
                  ₹{result.remaining_budget.toLocaleString()} Reserve ({(100 - budgetUsedPct).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 flex border border-slate-700/60">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${budgetUsedPct}%` }}
              />
              <div 
                className="h-full bg-slate-700/40 rounded-full transition-all duration-300"
                style={{ width: `${100 - budgetUsedPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Active Interventions ({result.customers_targeted} selected accounts)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-600"></span>
                <span>Unallocated Capital Buffer (guarantees zero budget overrun)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5, 6 & 9 — WHY PRIORITIZED, RISK != OPPORTUNITY & OFFER CHART    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Section 5: Why are these customers prioritized? (Visual Formula) */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Why are these customers prioritized?
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Knapsack 0/1 optimizer solves for maximum total saved value without exceeding budget. It evaluates the exact ROI equation for each account:
            </p>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 my-3 space-y-2 text-center">
              <div className="text-[11px] font-mono font-bold text-white bg-slate-900/90 py-1.5 px-2 rounded border border-slate-800">
                Expected Value = Uplift (τ) × CLV − Offer Cost
              </div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 bg-slate-900/90 py-1.5 px-2 rounded border border-slate-800">
                Portfolio ROI = Expected Value Saved ÷ Offer Cost
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Customers are ranked by value density (<span className="text-white font-semibold">marginal return per rupee</span>). 
              Lower-density accounts are pruned as budget fills.
            </p>
          </div>

          <div className="mt-3 p-2.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300">
            <strong>Optimizer Guarantee:</strong> Guarantees mathematically maximal value retention under the selected budget ceiling.
          </div>
        </div>

        {/* Section 6: High Risk != Automatically High Priority */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                High Risk ≠ Automatically High Priority
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Blindly contacting high-churn customers wastes capital if they are unpersuadable ("Lost Causes") or react negatively ("Sleeping Dogs").
            </p>

            {/* Dynamic Comparison from Current Optimizer State */}
            {realSelectedCustomer && (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
                    <span>SELECTED: {realSelectedCustomer.customer_id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20">Rank #{realSelectedCustomer.priority_rank}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Risk: <span className="font-semibold text-white">{(realSelectedCustomer.churn_probability * 100).toFixed(0)}%</span> · 
                    Uplift: <span className="font-semibold text-emerald-400">+{(realSelectedCustomer.uplift * 100).toFixed(2)}%</span> · 
                    ROI: <span className="font-semibold text-emerald-300">{realSelectedCustomer.roi.toFixed(2)}x</span>
                  </div>
                </div>

                {realUnselectedCustomer && (
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                      <span>NOT SELECTED: {realUnselectedCustomer.customer_id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800">Rank #{realUnselectedCustomer.priority_rank}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Risk: <span className="font-semibold text-slate-300">{(realUnselectedCustomer.churn_probability * 100).toFixed(0)}%</span> · 
                      Uplift: <span className="font-semibold text-slate-300">+{(realUnselectedCustomer.uplift * 100).toFixed(2)}%</span> · 
                      ROI: <span className="font-semibold text-slate-300">{realUnselectedCustomer.roi.toFixed(2)}x</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
            <strong>Key Differentiator:</strong> Interventions only target accounts where causal uplift generates positive net value.
          </div>
        </div>

        {/* Section 9: Offer Distribution Chart (Real Optimizer Output) */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recommended Offer Allocation
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                {result?.customers_targeted || 0} Targets
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Breakdown of offers assigned to selected customers under the ₹{budget.toLocaleString()} budget.
            </p>

            <div className="h-44">
              {offerDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={offerDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={110} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(val) => [`${val} customers`, 'Targeted']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {offerDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                  No active offers under current budget.
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 text-center">
            Offers dynamically rebalance as budget shifts between tiers.
          </div>
        </div>
      </div>

      {/* Diminishing Returns Chart with Live Operating Point */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Capital Efficiency Frontier (Knapsack Value Curve)
            </h3>
            <p className="text-[11px] text-slate-400">
              Green marker indicates your current operating budget allocation along the diminishing returns frontier
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Operating Position: ₹{budget.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scenarios} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="budget" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickFormatter={(b) => `₹${b / 1000}k`}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val, name) => [
                  `₹${Number(val).toLocaleString()}`, 
                  name === 'expected_value_saved' ? 'Value Protected' : name
                ]}
                labelFormatter={(b) => `Budget Cap: ₹${Number(b).toLocaleString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="expected_value_saved" 
                stroke="#3b82f6" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#3b82f6' }}
              />
              {result && (
                <ReferenceDot
                  x={result.budget}
                  y={result.expected_value_saved}
                  r={7}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 7 & 8 — UPGRADED PRIORITY TABLE & DECISION EXPLANATION            */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Prioritized Retention Allocation Plan
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Customers selected by the Knapsack algorithm are marked with <strong className="text-emerald-400">SELECTED</strong>. 
              Click any customer row to expand decision explanations.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 self-start md:self-auto text-xs">
            <span className="text-[11px] text-slate-400 mr-1">Show:</span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              All ({result?.selected_customers?.length || 0})
            </button>
            <button
              onClick={() => setStatusFilter('SELECTED')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                statusFilter === 'SELECTED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Selected ({result?.customers_targeted || 0})
            </button>
            <button
              onClick={() => setStatusFilter('NOT_SELECTED')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                statusFilter === 'NOT_SELECTED'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Not Selected ({(result?.selected_customers?.length || 0) - (result?.customers_targeted || 0)})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/95 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Decision</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Churn Risk</th>
                <th className="py-2.5 px-3">Customer Value</th>
                <th className="py-2.5 px-3">Uplift</th>
                <th className="py-2.5 px-3">Recommended Offer</th>
                <th className="py-2.5 px-3">Offer Cost</th>
                <th className="py-2.5 px-3 font-bold text-emerald-400">Value Saved</th>
                <th className="py-2.5 px-3 font-bold text-emerald-300">ROI</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredCustomers && filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => {
                  const isSelected = c.selection_status === 'SELECTED';
                  const isExpanded = expandedCustomerId === c.customer_id;
                  return (
                    <React.Fragment key={c.customer_id}>
                      <tr 
                        onClick={() => toggleExpand(c.customer_id)}
                        className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-950/10' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-400 font-bold">#{c.priority_rank}</td>
                        <td className="py-2.5 px-3 font-sans">
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" /> SELECTED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1 w-fit">
                              <XCircle className="h-3 w-3" /> NOT SELECTED
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-400 flex items-center gap-1">
                          <span>{c.customer_id}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-slate-500" />
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            c.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            c.risk_level === 'High' ? 'bg-orange-500/20 text-orange-400' :
                            c.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {c.risk_level} ({(c.churn_probability * 100).toFixed(0)}%)
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">
                          €{c.customer_value_eur.toFixed(0)} <span className="text-[10px] text-slate-400">(₹{(c.customer_value_eur * 90 / 1000).toFixed(0)}k)</span>
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 font-sans font-semibold">
                          +{(c.uplift * 100).toFixed(2)}%
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
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[10px] font-medium border border-slate-700 transition-all"
                          >
                            View 360
                          </button>
                        </td>
                      </tr>

                      {/* Section 8: Expandable Decision Explanation Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80 border-b border-slate-800">
                          <td colSpan={11} className="p-3.5 pl-10 font-sans">
                            <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5 text-blue-400" />
                                    Why was {c.customer_id} {isSelected ? 'selected' : 'not selected'}?
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                    isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    Rank #{c.priority_rank}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                                  {isSelected ? (
                                    <>
                                      Knapsack 0/1 selected this account because its value density (<strong className="text-emerald-400">{c.roi.toFixed(2)}x ROI</strong>) 
                                      and expected saved value (<strong className="text-emerald-400">₹{c.expected_value_saved_inr.toLocaleString()}</strong>) 
                                      fit within the current <span className="text-blue-400 font-semibold">₹{result.budget.toLocaleString()}</span> budget envelope. 
                                      Intervention via <span className="text-white font-semibold">{c.recommended_offer}</span> provides an estimated causal churn reduction of <span className="text-emerald-400 font-semibold">+{(c.uplift * 100).toFixed(2)}%</span>.
                                    </>
                                  ) : (
                                    <>
                                      This candidate has valid retention potential (ROI: {c.roi.toFixed(2)}x), but ranks at <strong className="text-slate-300">#{c.priority_rank}</strong> in overall value density. 
                                      Under the current <span className="text-blue-400 font-semibold">₹{result.budget.toLocaleString()}</span> budget, all available capital is already fully utilized by the top {result.customers_targeted} accounts. 
                                      Increasing the budget will activate this account for retention.
                                    </>
                                  )}
                                </p>
                              </div>

                              <button
                                onClick={() => onSelectCustomer(c.customer_id)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 self-start md:self-auto"
                              >
                                <span>Open Full Customer 360</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-sans">
                    {optimizing ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-blue-500 animate-ping"></span>
                        <span>Solving Knapsack 0/1 Dynamic Programming allocation...</span>
                      </div>
                    ) : (
                      'No customers match the current filter.'
                    )}
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
