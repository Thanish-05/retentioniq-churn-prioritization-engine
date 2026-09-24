import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  Target, 
  AlertOctagon,
  Sparkles,
  ArrowRight
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

export default function SegmentationPage({ onFilterBySegment }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSegments();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full py-24 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Intro Header */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-400" />
            Causal Persuadability & Uplift Segments
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Segmenting by estimated treatment effect rather than simple risk avoids wasting budget on non-responders.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="h-4 w-4" />
          Empirically Validated via T-Learner
        </div>
      </div>

      {/* 4 Persuadability Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {persuadability_segments.map((seg) => {
          const color = segmentColors[seg.segment_name] || '#3b82f6';
          return (
            <div 
              key={seg.segment_name}
              className="glass-card rounded-xl p-5 border border-slate-800 space-y-3 relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: color }}
              />
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {seg.segment_name}
                </span>
                <span className="text-xs font-mono font-extrabold text-white">
                  {seg.percentage}%
                </span>
              </div>

              <div className="text-2xl font-black text-white font-mono">
                {seg.customer_count.toLocaleString()}
                <span className="text-xs text-slate-400 font-sans font-normal ml-1">cust.</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mean Churn Probability:</span>
                  <span className="font-mono font-semibold">{(seg.avg_churn * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Uplift:</span>
                  <span className="font-mono font-bold" style={{ color }}>
                    {seg.avg_uplift >= 0 ? `+${(seg.avg_uplift * 100).toFixed(2)}%` : `${(seg.avg_uplift * 100).toFixed(2)}%`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Customer Value:</span>
                  <span className="font-mono">€{seg.avg_customer_value_eur.toFixed(0)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800/60 font-semibold">
                  <span className="text-slate-400">Observed Churn Delta:</span>
                  <span className="font-mono text-emerald-400">
                    {seg.observed_difference > 0 ? `+${(seg.observed_difference * 100).toFixed(2)}%` : `${(seg.observed_difference * 100).toFixed(2)}%`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Segment Comparison Chart */}
      <div className="glass-card rounded-xl p-5 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
          Expected Value Saved by Persuadability Segment (INR)
        </h3>
        <div className="h-64">
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

      {/* 2x2 Risk vs Value Strategic Matrix */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-400" />
            2×2 Customer Risk vs. Customer Value Strategic Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Cross-segmentation combining baseline churn probability with projected customer lifetime value
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Top-Right: High Risk + High Value */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-slate-900 border border-rose-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                HIGH RISK • HIGH VALUE (Top Priority)
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300">
                {risk_value_matrix.high_risk_high_val.count.toLocaleString()} Customers
              </span>
            </div>
            <div className="text-sm font-semibold text-white">
              Action: {risk_value_matrix.high_risk_high_val.action}
            </div>
            <p className="text-xs text-slate-400">
              Mean Uplift: <strong className="text-emerald-400 font-mono">+{(risk_value_matrix.high_risk_high_val.avg_uplift * 100).toFixed(2)}%</strong>. High urgency customers warranting premium intervention budgets.
            </p>
          </div>

          {/* Top-Left: High Risk + Low Value */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                HIGH RISK • LOW VALUE (Cost-Controlled)
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300">
                {risk_value_matrix.high_risk_low_val.count.toLocaleString()} Customers
              </span>
            </div>
            <div className="text-sm font-semibold text-white">
              Action: {risk_value_matrix.high_risk_low_val.action}
            </div>
            <p className="text-xs text-slate-400">
              Mean Uplift: <strong className="text-emerald-400 font-mono">+{(risk_value_matrix.high_risk_low_val.avg_uplift * 100).toFixed(2)}%</strong>. Address via automated digital discounts to protect profit margin.
            </p>
          </div>

          {/* Bottom-Right: Low Risk + High Value */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-slate-900 border border-blue-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                LOW RISK • HIGH VALUE (Loyalty Nurturing)
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300">
                {risk_value_matrix.low_risk_high_val.count.toLocaleString()} Customers
              </span>
            </div>
            <div className="text-sm font-semibold text-white">
              Action: {risk_value_matrix.low_risk_high_val.action}
            </div>
            <p className="text-xs text-slate-400">
              Low churn risk today; provide priority service and loyalty rewards to maintain satisfaction without costly discounts.
            </p>
          </div>

          {/* Bottom-Left: Low Risk + Low Value */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                LOW RISK • LOW VALUE (Self-Serve)
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300">
                {risk_value_matrix.low_risk_low_val.count.toLocaleString()} Customers
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-300">
              Action: {risk_value_matrix.low_risk_low_val.action}
            </div>
            <p className="text-xs text-slate-400">
              Standard automated service tier. No costly proactive retention spend required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
