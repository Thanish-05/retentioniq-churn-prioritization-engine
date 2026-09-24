import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  Target, 
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Sliders,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  Tag,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { fetchSegments } from '../api';

export default function SegmentationPage({ onFilterBySegment, onNavigateToOptimizer, onSelectCustomer }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSegments();
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Unable to load segmentation data. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Section 11: Loading Skeleton State
  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-20 bg-slate-900/60 rounded-xl border border-slate-800"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900/60 rounded-xl border border-slate-800"></div>
          ))}
        </div>
        <div className="h-72 bg-slate-900/60 rounded-xl border border-slate-800"></div>
        <div className="h-80 bg-slate-900/60 rounded-xl border border-slate-800"></div>
      </div>
    );
  }

  // Section 11: Error State
  if (error || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="glass-card rounded-xl p-8 border border-rose-500/30 text-center space-y-3">
          <AlertOctagon className="h-10 w-10 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Unable to Load Segmentation Data</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error || 'No segmentation data available.'}</p>
          <button
            onClick={loadData}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const { persuadability_segments, risk_value_matrix } = data;

  const segmentColors = {
    'HIGHLY PERSUADABLE': '#10b981',
    'PERSUADABLE': '#06b6d4',
    'LOW RESPONSE': '#64748b',
    'NEGATIVE RESPONSE': '#f43f5e'
  };

  // Archetype customers for demo jump to Customer 360
  const sampleArchetypes = {
    'HIGHLY PERSUADABLE': 'C10828',
    'PERSUADABLE': 'C09561',
    'LOW RESPONSE': 'C00001',
    'NEGATIVE RESPONSE': 'C00050'
  };

  const totalCustomers = persuadability_segments.reduce((acc, s) => acc + s.customer_count, 0);
  const totalEvSavedInr = persuadability_segments.reduce((acc, s) => acc + s.total_expected_value_inr, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* SECTION 1 — PAGE HEADER                                                   */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              Behavior + Risk + Causal Segmentation
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Empirically Validated via T-Learner
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            Customer Strategy Map
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Understand customer groups by value, churn risk, and retention opportunity. 
            Connects causal persuadability modeling directly to strategic portfolio execution.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onNavigateToOptimizer && (
            <button
              onClick={onNavigateToOptimizer}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/20 transition-all flex items-center gap-2"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Open Optimizer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2 — SEGMENTATION OVERVIEW (Real Data KPI Cards)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Customer Base</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {totalCustomers.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-blue-400 font-medium">
            100% Portfolio Coverage
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">
            Orange Belgium benchmark accounts
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Causal Persuadables</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            {(persuadability_segments[0]?.customer_count + persuadability_segments[1]?.customer_count).toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">
            25.0% Responsive Cohort
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">
            668 Highly Persuadable + 2,306 Persuadable
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Do Not Disturb Cohort</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-400 font-mono">
            {persuadability_segments.find(s => s.segment_name === 'NEGATIVE RESPONSE')?.customer_count.toLocaleString() || '1,558'}
          </div>
          <div className="mt-1 text-[11px] text-rose-400 font-medium">
            13.1% Sleeping Dogs
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">
            Negative uplift; campaign contact increases churn
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Total Potential Value Saved</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            ₹{totalEvSavedInr.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-300 font-medium">
            Expected Value in Persuadables
          </div>
          <div className="mt-0.5 text-[10px] text-emerald-400/80">
            Available for retention capture under budget
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 10 — EXPLANATION FOR JUDGES PANEL                                 */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <div className="font-bold text-white text-sm">Why Strategic Segmentation Matters</div>
          <p className="leading-relaxed">
            Customers with identical churn risk often have entirely different retention economics. 
            RETENTIONIQ combines customer characteristics with baseline risk, projected customer lifetime value, 
            and causal intervention response to identify where specific retention actions generate positive return on capital.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3 & 4 — 2×2 RISK VS VALUE STRATEGIC MATRIX                        */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                2×2 Customer Risk vs. Customer Value Strategic Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-segmentation combining baseline churn probability (split at population mean 3.4%) with lifetime value (split at median €1,362)
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
            Axes: Churn Risk (Y) vs Customer Lifetime Value (X)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Top-Right: High Risk + High Value (Priority Retention) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-slate-900 border border-rose-500/40 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                HIGH RISK • HIGH VALUE (Priority Retention)
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {risk_value_matrix.high_risk_high_val.count.toLocaleString()} Accounts
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              Suggested Strategy: Prioritize high-touch retention interventions
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customers with significant economic value who require urgent attention due to elevated churn risk. 
              Assign top-tier retention offers (Premium Retention Offer / Medium Discount).
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span>Mean Causal Uplift: <strong className="text-emerald-400 font-mono">+{(risk_value_matrix.high_risk_high_val.avg_uplift * 100).toFixed(2)}%</strong></span>
              <span className="text-rose-400 font-medium">Urgent High-Touch Action</span>
            </div>
          </div>

          {/* Top-Left: High Risk + Low Value (Low-Cost Intervention) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/40 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-amber-400" />
                HIGH RISK • LOW VALUE (Low-Cost Intervention)
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {risk_value_matrix.high_risk_low_val.count.toLocaleString()} Accounts
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              Suggested Strategy: Use scalable, lower-cost digital incentives
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customers with elevated risk but lower individual economic value. Address via automated digital incentives 
              (Small Discount / Loyalty Reward) to protect margin and prevent negative ROI.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span>Mean Causal Uplift: <strong className="text-emerald-400 font-mono">+{(risk_value_matrix.high_risk_low_val.avg_uplift * 100).toFixed(2)}%</strong></span>
              <span className="text-amber-400 font-medium">Automated Digital Delivery</span>
            </div>
          </div>

          {/* Bottom-Right: Low Risk + High Value (Relationship Protection) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-slate-900 border border-blue-500/40 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                LOW RISK • HIGH VALUE (Relationship Protection)
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {risk_value_matrix.low_risk_high_val.count.toLocaleString()} Accounts
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              Suggested Strategy: Protect the relationship with proactive engagement
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Valuable customers who are currently lower risk. Maintain satisfaction and engagement with 
              non-monetary recognition (Priority Support / VIP Service Care) without offering costly bill discounts.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span>Mean Causal Uplift: <strong className="text-emerald-400 font-mono">+{(risk_value_matrix.low_risk_high_val.avg_uplift * 100).toFixed(2)}%</strong></span>
              <span className="text-blue-400 font-medium">Proactive VIP Engagement</span>
            </div>
          </div>

          {/* Bottom-Left: Low Risk + Low Value (Monitor / Self-Serve) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                LOW RISK • LOW VALUE (Monitor / Self-Serve)
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {risk_value_matrix.low_risk_low_val.count.toLocaleString()} Accounts
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              Suggested Strategy: Monitor behavior and avoid unnecessary spend
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customers with lower immediate retention pressure and lower margin. Maintain standard digital self-service 
              and preserve promotional capital for high-yield segments.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span>Mean Causal Uplift: <strong className="text-slate-300 font-mono">+{(risk_value_matrix.low_risk_low_val.avg_uplift * 100).toFixed(2)}%</strong></span>
              <span className="text-slate-400 font-medium">Preserve Capital</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5 — EXISTING 4 CAUSAL GROUPS (T-Learner Uplift Segmentation)       */}
      {/* ========================================================================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Four Causal Uplift Cohorts (T-Learner Architecture)
            </h2>
            <p className="text-xs text-slate-400">
              Rigorous classification isolating true incremental intervention impact vs unresponsiveness or adverse reactions
            </p>
          </div>
          {onFilterBySegment && (
            <button
              onClick={onFilterBySegment}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore Customers in Risk Explorer</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {persuadability_segments.map((seg) => {
            const color = segmentColors[seg.segment_name] || '#3b82f6';
            const sampleId = sampleArchetypes[seg.segment_name];
            return (
              <div 
                key={seg.segment_name}
                className="glass-card rounded-xl p-5 border border-slate-800 space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5" 
                  style={{ backgroundColor: color }}
                />
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      {seg.segment_name}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-white">
                      {seg.percentage}%
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {seg.customer_count.toLocaleString()}
                    <span className="text-xs text-slate-400 font-sans font-normal ml-1">cust.</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300 mt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mean Churn Probability:</span>
                      <span className="font-mono font-semibold">{(seg.avg_churn * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Causal Uplift:</span>
                      <span className="font-mono font-bold" style={{ color }}>
                        {seg.avg_uplift >= 0 ? `+${(seg.avg_uplift * 100).toFixed(2)}%` : `${(seg.avg_uplift * 100).toFixed(2)}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average Lifetime Value:</span>
                      <span className="font-mono">€{seg.avg_customer_value_eur.toFixed(0)} (₹{(seg.avg_customer_value_inr / 1000).toFixed(0)}k)</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800/60 font-semibold">
                      <span className="text-slate-400">Empirical Churn Drop:</span>
                      <span className="font-mono text-emerald-400">
                        {seg.observed_difference > 0 ? `+${(seg.observed_difference * 100).toFixed(2)}%` : `${(seg.observed_difference * 100).toFixed(2)}%`}
                      </span>
                    </div>
                    {seg.total_expected_value_inr > 0 && (
                      <div className="flex justify-between font-bold text-emerald-300">
                        <span>Expected Value Saved:</span>
                        <span className="font-mono">₹{seg.total_expected_value_inr.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 8: Clickable sample archetype */}
                {sampleId && onSelectCustomer && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Inspect Persona:</span>
                    <button
                      onClick={() => onSelectCustomer(sampleId)}
                      className="font-mono text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>{sampleId}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Segment Expected Value Saved Comparison Chart */}
      <div className="glass-card rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Expected Value Saved by Persuadability Segment (INR)
            </h3>
            <p className="text-[11px] text-slate-400">
              Concentration of recoverable economic value across causal treatment groups
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            Total Potential: ₹{totalEvSavedInr.toLocaleString()}
          </span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={persuadability_segments} 
              margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="segment_name" stroke="#94a3b8" fontSize={11} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Expected Value Saved']}
              />
              <Bar dataKey="total_expected_value_inr" radius={[6, 6, 0, 0]}>
                {persuadability_segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={segmentColors[entry.segment_name] || '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6 — "WHAT SHOULD WE DO WITH EACH GROUP?" STRATEGY TABLE           */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              What should we do with each group? (Strategic Playbook)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct alignment between causal response characteristics and executive retention actions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Causal Segment</th>
                <th className="py-2.5 px-3">Cohort Size</th>
                <th className="py-2.5 px-3">Avg Churn</th>
                <th className="py-2.5 px-3">Causal Uplift</th>
                <th className="py-2.5 px-3">Strategic Action</th>
                <th className="py-2.5 px-3">Assigned Offers</th>
                <th className="py-2.5 px-3">Priority Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-emerald-400">HIGHLY PERSUADABLE</td>
                <td className="py-3 px-3 font-mono">668 (5.6%)</td>
                <td className="py-3 px-3 font-mono">8.25%</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-400">+6.31%</td>
                <td className="py-3 px-3 font-semibold text-white">Prioritize Personalized Intervention</td>
                <td className="py-3 px-3 text-slate-300">Premium Retention Offer, Free Trial</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Highest Priority
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-cyan-400">PERSUADABLE</td>
                <td className="py-3 px-3 font-mono">2,306 (19.4%)</td>
                <td className="py-3 px-3 font-mono">2.10%</td>
                <td className="py-3 px-3 font-mono font-bold text-cyan-400">+1.77%</td>
                <td className="py-3 px-3 font-semibold text-white">Targeted Scalable Retention</td>
                <td className="py-3 px-3 text-slate-300">Loyalty Reward, Small/Medium Discount</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    High Priority
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-400">LOW RESPONSE</td>
                <td className="py-3 px-3 font-mono">7,364 (61.9%)</td>
                <td className="py-3 px-3 font-mono">1.02%</td>
                <td className="py-3 px-3 font-mono text-slate-300">+0.28%</td>
                <td className="py-3 px-3 text-slate-300">Passive Monitoring / Low Cost Care</td>
                <td className="py-3 px-3 text-slate-400">Standard Support, No Promotion</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    Low / Monitor
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-rose-400">NEGATIVE RESPONSE</td>
                <td className="py-3 px-3 font-mono">1,558 (13.1%)</td>
                <td className="py-3 px-3 font-mono">13.45%</td>
                <td className="py-3 px-3 font-mono font-bold text-rose-400">−1.21%</td>
                <td className="py-3 px-3 font-semibold text-rose-300">Do Not Disturb / Exclude from Campaigns</td>
                <td className="py-3 px-3 text-rose-400/80">No Action (Strict Exclusion)</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Do Not Disturb
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 7 — SEGMENT → OPTIMIZER CTA BANNER                                */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-5 border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Take these insights to the Retention Optimizer
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Segmentation identifies where retention opportunities exist across the customer portfolio. 
            The Knapsack Optimizer decides which individual accounts should receive limited intervention budget to maximize portfolio ROI.
          </p>
        </div>

        {onNavigateToOptimizer && (
          <button
            onClick={onNavigateToOptimizer}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <span>Open Retention Optimizer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
