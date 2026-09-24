import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceDot 
} from 'recharts';
import { optimizeBudget, fetchBudgetScenarios } from '../api';

export default function OptimizerPage({ onSelectCustomer }) {
  const [budget, setBudget] = useState(100000);
  const [result, setResult] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [optimizing, setOptimizing] = useState(false);
  const debounceRef = useRef(null);

  // Load scenarios for the diminishing returns curve
  useEffect(() => {
    async function loadScenarios() {
      try {
        const scens = await fetchBudgetScenarios();
        setScenarios(scens);
      } catch (err) {
        console.error(err);
      }
    }
    loadScenarios();
  }, []);

  // Run optimization whenever budget changes
  const runOptimization = async (targetBudget) => {
    setOptimizing(true);
    try {
      const res = await optimizeBudget(targetBudget);
      setResult(res);
    } catch (err) {
      console.error(err);
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

  const presetBudgets = [25000, 50000, 100000, 200000, 500000];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header with Algorithm Details */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              HERO CAPABILITY
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3" /> Exact 0/1 Knapsack Dynamic Programming
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            Capital Allocation & ROI Optimizer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamically solves optimal customer-offer pairs to maximize net protected value under your exact budget cap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBudget(100000)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            Reset to Default (₹1 Lakh)
          </button>
        </div>
      </div>

      {/* Interactive Budget Control Console */}
      <div className="glass-card rounded-xl p-6 border border-blue-500/30 shadow-xl bg-slate-900/90 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Set Retention Budget (INR)
            </label>
            <div className="text-3xl font-black text-white font-mono flex items-center gap-2">
              <span className="text-blue-500">₹</span>
              <span>{budget.toLocaleString()}</span>
              {optimizing && (
                <span className="text-xs font-sans text-blue-400 font-normal animate-pulse flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                  Optimizing...
                </span>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Presets:</span>
            {presetBudgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  budget === b
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                ₹{b >= 100000 ? `${b / 100000} Lakh` : `${b / 1000}k`}
              </button>
            ))}
          </div>
        </div>

        {/* Smooth Budget Range Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>₹10,000 (Min)</span>
            <span>₹1,00,000 (Baseline)</span>
            <span>₹2,50,000</span>
            <span>₹5,00,000 (Max Capacity)</span>
          </div>
        </div>
      </div>

      {/* Real-Time KPIs Grid */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* KPI 1 */}
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Budget</span>
            <div className="text-lg font-bold text-white font-mono mt-1">₹{result.budget.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Input Constraint</div>
          </div>

          {/* KPI 2 */}
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget Used</span>
            <div className="text-lg font-bold text-blue-400 font-mono mt-1">₹{result.budget_used.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              {((result.budget_used / result.budget) * 100).toFixed(1)}% utilized
            </div>
          </div>

          {/* KPI 3 */}
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remaining Budget</span>
            <div className="text-lg font-bold text-slate-300 font-mono mt-1">₹{result.remaining_budget.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Unallocated Slack</div>
          </div>

          {/* KPI 4 */}
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customers Targeted</span>
            <div className="text-lg font-bold text-white font-mono mt-1">{result.customers_targeted}</div>
            <div className="text-[10px] text-blue-400 font-semibold mt-0.5">Optimal Interventions</div>
          </div>

          {/* KPI 5 */}
          <div className="glass-card rounded-xl p-3.5 border border-emerald-500/20 bg-emerald-950/10">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Expected Value Saved</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">₹{result.expected_value_saved.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-300/80 mt-0.5">
              Net: +₹{(result.expected_value_saved - result.budget_used).toLocaleString()}
            </div>
          </div>

          {/* KPI 6 */}
          <div className="glass-card rounded-xl p-3.5 border border-emerald-500/20 bg-emerald-950/10">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Portfolio ROI</span>
            <div className="text-lg font-bold text-white font-mono mt-1">{result.roi}x</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              ₹{result.roi} per ₹1.00 spent
            </div>
          </div>
        </div>
      )}

      {/* Diminishing Returns Chart with Live Operating Point */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Budget Curve & Marginal Efficiency (Knapsack Optimization)
            </h3>
            <p className="text-[11px] text-slate-400">
              Green marker indicates your current operating budget allocation
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Current Position: ₹{budget.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="h-56">
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
                  r={6}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommended Retention Plan Table */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Recommended Retention Plan (Top 100 Ranked Candidates)
            </h3>
            <p className="text-[11px] text-slate-400">
              Customers selected by the Knapsack algorithm are marked with <strong className="text-emerald-400">SELECTED</strong>
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Total Available Active Candidates: <span className="font-bold text-white font-mono">668</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Churn Risk</th>
                <th className="py-2.5 px-3">Uplift</th>
                <th className="py-2.5 px-3">Customer Value</th>
                <th className="py-2.5 px-3">Recommended Offer</th>
                <th className="py-2.5 px-3">Offer Cost</th>
                <th className="py-2.5 px-3">Expected Value Saved</th>
                <th className="py-2.5 px-3">ROI</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {result && result.selected_customers ? (
                result.selected_customers.map((c) => {
                  const isSelected = c.selection_status === 'SELECTED';
                  return (
                    <tr 
                      key={c.customer_id}
                      onClick={() => onSelectCustomer(c.customer_id)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-950/10' : 'opacity-70'
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
                      <td className="py-2.5 px-3 font-bold text-blue-400">{c.customer_id}</td>
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
                      <td className="py-2.5 px-3 text-emerald-400 font-sans font-semibold">
                        +{(c.uplift * 100).toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">
                        €{c.customer_value_eur.toFixed(0)}
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
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[10px] font-medium border border-slate-700 transition-all"
                        >
                          View 360
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-sans">
                    Running optimization engine...
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
