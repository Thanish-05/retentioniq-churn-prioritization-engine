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
  ShieldCheck
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
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { kpis, charts, top_opportunities } = data;

  const storySteps = [
    { title: 'PREDICT', desc: 'Baseline Churn Risk (XGBoost 85.3% AUC)' },
    { title: 'EXPLAIN', desc: 'Feature Importances (Top PCA & Factors)' },
    { title: 'IDENTIFY', desc: 'Causal Persuadability (T-Learner Uplift)' },
    { title: 'CHOOSE', desc: 'Targeted Offer Matching (6 Retention Actions)' },
    { title: 'VALUE', desc: 'Customer Lifetime Value (€326–€2,093)' },
    { title: 'OPTIMIZE', desc: 'Knapsack Budget Allocation (0/1 DP)' },
    { title: 'EXECUTE', desc: 'Prioritized Retention Action Plan' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Product Story Journey Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Causal Retention Decision Engine Workflow
            </span>
          </div>
          <span className="text-[11px] text-slate-400">End-to-End Autonomous Optimization</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {storySteps.map((s, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 relative">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>0{idx + 1}</span>
                {idx < storySteps.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-slate-400 hidden lg:block" />
                )}
              </div>
              <div className="font-extrabold text-xs text-white tracking-tight">{s.title}</div>
              <div className="text-[10px] text-slate-400 line-clamp-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Customers */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Customer Base</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {kpis.total_customers.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400">
            <span>Orange Belgium benchmark dataset</span>
          </div>
        </div>

        {/* KPI 2: Elevated Risk Customers */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Elevated Churn Risk</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {kpis.elevated_risk_customers}
            </span>
            <span className="text-xs text-rose-400 font-semibold">
              ({kpis.critical_risk_customers} Critical, {kpis.high_risk_customers} High)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Valued at €{kpis.value_at_risk_eur.toLocaleString()} (₹{(kpis.value_at_risk_inr / 100000).toFixed(2)} Lakh) at risk
          </div>
        </div>

        {/* KPI 3: Budget & Deployment */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Default Retention Budget</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              ₹{kpis.default_budget.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              (₹{kpis.budget_used.toLocaleString()} deployed)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Reaches {kpis.customers_targeted} optimal customers (99.9% used)
          </div>
        </div>

        {/* KPI 4: Expected Value Saved & ROI */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 bg-gradient-to-br from-slate-900 to-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400">Expected Value Protected</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              ₹{kpis.expected_value_saved.toLocaleString()}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {kpis.roi}x ROI
            </span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-300/80">
            Net Value Gain: +₹{(kpis.expected_value_saved - kpis.budget_used).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Churn Risk Distribution */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Churn Risk Distribution
            </h2>
            <span className="text-[10px] text-slate-400">11,896 Customers</span>
          </div>
          <div className="h-52">
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
            <span className="text-[10px] text-blue-400">Causal T-Learner</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.persuadability_distribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
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
          <div className="h-52">
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

      {/* Charts Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 4: Offer Recommendations */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Actionable Offer Distribution
            </h2>
            <span className="text-[10px] text-emerald-400 font-semibold">668 Actionable Targets</span>
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
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between px-1">
            <span>Includes: Loyalty Reward, Priority Support, Small/Medium Discount, Trial</span>
            <span className="text-slate-400">11,228 No Action (Excluded)</span>
          </div>
        </div>

        {/* Chart 5: Budget vs Expected Value (Diminishing Marginal Returns) */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Capital Efficiency: Budget vs Value Saved
            </h2>
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
            Law of Diminishing Returns: Initial ₹25k yields 2.59x ROI; expands to 1.73x at ₹500k.
          </div>
        </div>
      </div>

      {/* Top Retention Opportunities Table */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              Highest-Value Retention Opportunities
            </h2>
            <p className="text-[11px] text-slate-400">
              Customers where targeted intervention delivers maximum net return
            </p>
          </div>
          <button
            onClick={onNavigateToOptimizer}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            Deploy In Optimizer <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Churn Risk</th>
                <th className="py-2.5 px-3">Estimated Uplift</th>
                <th className="py-2.5 px-3">Customer Value</th>
                <th className="py-2.5 px-3">Recommended Offer</th>
                <th className="py-2.5 px-3">Expected Value Saved</th>
                <th className="py-2.5 px-3">ROI</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {top_opportunities.map((c) => (
                <tr key={c.customer_id} className="hover:bg-slate-800/40 transition-colors">
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
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold font-sans">
                    +{ (c.uplift * 100).toFixed(2) }%
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">
                    €{c.customer_value_eur.toFixed(0)} <span className="text-[10px] text-slate-400">(₹{(c.customer_value_inr / 1000).toFixed(0)}k)</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px]">
                      {c.recommended_offer}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold font-sans">
                    ₹{c.expected_value_saved_inr.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-300 font-bold font-sans">
                    {c.roi.toFixed(2)}x
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    <button
                      onClick={() => onSelectCustomer(c.customer_id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-medium border border-slate-700 transition-all"
                    >
                      View 360
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
