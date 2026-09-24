import React, { useState, useEffect } from 'react';
import { 
  User, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  AlertTriangle,
  Search,
  Sparkles,
  DollarSign,
  TrendingUp,
  Percent,
  Tag,
  ShieldCheck,
  Layers,
  Zap,
  RotateCcw,
  Info,
  Activity,
  FileText,
  Sliders
} from 'lucide-react';
import { fetchCustomerDetails } from '../api';

export default function Customer360Page({ customerId, onSelectCustomer }) {
  const [activeId, setActiveId] = useState(customerId || 'C10828');
  const [searchInput, setSearchInput] = useState('');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customerId) {
      setActiveId(customerId);
    }
  }, [customerId]);

  const loadCustomer = async (idToLoad) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomerDetails(idToLoad);
      setCustomer(data);
    } catch (err) {
      setError(err.message || `Customer ${idToLoad} not found.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer(activeId);
  }, [activeId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveId(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  // Diverse preset profiles representing key decision archetypes:
  // C10828: High Uplift (+9.75%), High Value (€1,832) -> Premium Offer (2.55x ROI)
  // C09561: Max Uplift (+11.77%) -> Free Premium Trial (4.47x ROI)
  // C10604: Critical Churn (97.2%), High Uplift (+10.7%) -> Free Premium Trial (2.87x ROI)
  // C00050: Critical Churn (92.8%), Negative Uplift (-4.16%) -> No Action (Sleeping Dog)
  // C09383: Medium Value, Solid Response -> Medium Discount
  const demoPresets = [
    { id: 'C10828', label: 'C10828 (High CLV + Uplift)' },
    { id: 'C09561', label: 'C09561 (Top Uplift +11.8%)' },
    { id: 'C10604', label: 'C10604 (97% Churn + Persuadable)' },
    { id: 'C00050', label: 'C00050 (High Risk + Negative Uplift)' },
    { id: 'C09383', label: 'C09383 (Mid Tier Discount)' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* SEARCH & PERSONA QUICK-SELECT TOOLBAR                                     */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Lookup Customer ID (e.g. C10828)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-sm"
          >
            Lookup
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Persona Presets:</span>
          {demoPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => setActiveId(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                activeId === preset.id 
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 border border-blue-400'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {preset.id}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 11 — LOADING, ERROR & EMPTY STATES                                */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          {/* Skeleton Header */}
          <div className="h-32 bg-slate-900/60 rounded-xl border border-slate-800 p-6 space-y-3">
            <div className="h-5 w-48 bg-slate-800 rounded"></div>
            <div className="h-3 w-64 bg-slate-800 rounded"></div>
          </div>
          {/* Skeleton KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-2">
                <div className="h-3 w-20 bg-slate-800 rounded"></div>
                <div className="h-6 w-24 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
          {/* Skeleton Counterfactual */}
          <div className="h-48 bg-slate-900/60 rounded-xl border border-slate-800"></div>
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-8 border border-rose-500/30 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Customer Profile Unavailable</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => loadCustomer(activeId)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry Lookup</span>
          </button>
        </div>
      ) : customer ? (
        <div className="space-y-6">
          {/* ========================================================================= */}
          {/* SECTION 1 — CUSTOMER DECISION PROFILE HEADER                              */}
          {/* ========================================================================= */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-extrabold text-2xl font-mono shadow-inner">
                {customer.customer_id.substring(0, 3)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-white font-mono tracking-tight">
                    {customer.customer_id}
                  </h1>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Decision Profile
                  </span>

                  {/* Risk Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    customer.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    customer.risk_level === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    customer.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {customer.risk_level} Risk Category
                  </span>

                  {/* Persuadability Segment Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    customer.persuadability_segment === 'HIGHLY PERSUADABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    customer.persuadability_segment === 'PERSUADABLE' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                    customer.persuadability_segment === 'LOW RESPONSE' ? 'bg-slate-700/50 text-slate-300 border border-slate-600/50' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {customer.persuadability_segment}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>Baseline Churn Risk: <strong className="text-white font-mono">{(customer.churn_probability * 100).toFixed(1)}%</strong></span>
                  <span>•</span>
                  <span>Customer Lifetime Value: <strong className="text-white">€{customer.customer_value_eur.toFixed(0)} (₹{customer.customer_value_inr.toLocaleString()})</strong></span>
                  <span>•</span>
                  <span>Value Tier: <strong className="text-white">{customer.customer_value_segment}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Verdict Pill */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center gap-4 text-right self-start md:self-auto shadow-sm">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Recommended Offer</div>
                <div className="text-sm font-bold text-blue-400 font-sans">{customer.recommended_offer}</div>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Expected Protected EV</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">
                  {customer.expected_value_saved_inr > 0 ? `₹${customer.expected_value_saved_inr.toLocaleString()}` : '₹0.00'}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2 — RETENTION DECISION SUMMARY (Key Executive Metrics)            */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Churn Probability */}
            <div className="glass-card rounded-xl p-4 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Churn Probability
              </span>
              <div className="mt-1 text-2xl font-black text-white font-mono">
                {(customer.churn_probability * 100).toFixed(1)}%
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Category: <span className="font-semibold text-white">{customer.risk_level} Risk</span>
              </div>
            </div>

            {/* Causal Uplift */}
            <div className="glass-card rounded-xl p-4 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Causal Uplift (τ)
              </span>
              <div className={`mt-1 text-2xl font-black font-mono ${
                customer.uplift > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {customer.uplift >= 0 ? `+${(customer.uplift * 100).toFixed(2)}%` : `${(customer.uplift * 100).toFixed(2)}%`}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Segment: <span className="font-semibold text-white">{customer.persuadability_segment}</span>
              </div>
            </div>

            {/* Expected Value Protected (High Visual Hierarchy) */}
            <div className="glass-card rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/20 shadow-md">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block flex items-center justify-between">
                <span>Value Protected</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </span>
              <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">
                {customer.expected_value_saved_inr > 0 ? `₹${customer.expected_value_saved_inr.toLocaleString()}` : '₹0.00'}
              </div>
              <div className="mt-1 text-[11px] text-emerald-300 font-medium">
                {customer.expected_value_saved_inr > customer.offer_cost_inr 
                  ? `Net Gain: +₹${(customer.expected_value_saved_inr - customer.offer_cost_inr).toLocaleString()}` 
                  : 'Zero Net Benefit'}
              </div>
            </div>

            {/* Expected ROI (High Visual Hierarchy) */}
            <div className="glass-card rounded-xl p-4 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Intervention ROI</span>
                <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
              </span>
              <div className="mt-1 text-2xl font-black text-white font-mono flex items-baseline gap-1.5">
                <span>{customer.roi.toFixed(2)}x</span>
                {customer.roi >= 1.0 && (
                  <span className="text-xs text-emerald-400 font-bold font-sans">
                    +{((customer.roi - 1) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {customer.roi >= 1.0 ? 'Positive ROI Threshold' : 'Sub-Economic Hurdle'}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 7 — COUNTERFACTUAL / INTERVENTION VIEW                             */}
          {/* ========================================================================= */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  Causal Counterfactual Analysis: Control vs Treatment
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct evaluation of customer outcomes under alternative business actions using the Two-Model T-Learner
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Causal Treatment Effect (Uplift)</span>
                <span className={`text-xl font-extrabold font-mono ${
                  customer.uplift > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {customer.uplift >= 0 ? `+${(customer.uplift * 100).toFixed(2)}%` : `${(customer.uplift * 100).toFixed(2)}%`}
                </span>
              </div>
            </div>

            {/* Comparative Visual Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Without Intervention (Control) */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">WITHOUT INTERVENTION (Control)</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    {(customer.control_churn_probability * 100).toFixed(2)}% Churn
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, customer.control_churn_probability * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Natural trajectory if no offer sent</span>
                  <span className="font-mono text-rose-300">
                    Expected Loss: ₹{(customer.control_churn_probability * customer.customer_value_inr).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* With Intervention (Treatment) */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">WITH INTERVENTION (Treated)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {(customer.treatment_churn_probability * 100).toFixed(2)}% Churn
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, customer.treatment_churn_probability * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Residual churn risk after offer delivery</span>
                  <span className="font-mono text-emerald-300">
                    Net Churn Reduction: {customer.uplift >= 0 ? `+${(customer.uplift * 100).toFixed(2)}%` : `${(customer.uplift * 100).toFixed(2)}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4 — RISK ≠ RETENTION OPPORTUNITY (Educational Section)             */}
          {/* ========================================================================= */}
          <div className="glass-card rounded-xl p-5 border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Decision Principle
              </span>
              <h2 className="text-sm font-bold text-white">
                Risk ≠ Retention Opportunity for {customer.customer_id}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">1. Churn Risk</span>
                <span className="font-bold text-white text-sm">{(customer.churn_probability * 100).toFixed(1)}%</span>
                <p className="text-[10px] text-slate-400 mt-1">"How likely are they to leave without action?"</p>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">2. Causal Uplift (τ)</span>
                <span className={`font-bold text-sm ${customer.uplift > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {customer.uplift >= 0 ? `+${(customer.uplift * 100).toFixed(2)}%` : `${(customer.uplift * 100).toFixed(2)}%`}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">"How much can an offer change their decision?"</p>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">3. Customer Value (CLV)</span>
                <span className="font-bold text-white text-sm">€{customer.customer_value_eur.toFixed(0)}</span>
                <p className="text-[10px] text-slate-400 mt-1">"How much commercial value is at stake?"</p>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 font-semibold block">4. Final Decision</span>
                <span className="font-bold text-emerald-300 text-sm">
                  {customer.recommended_offer !== 'No Action' ? 'Prioritize Action' : 'Preserve Budget'}
                </span>
                <p className="text-[10px] text-emerald-300/80 mt-1">
                  {customer.recommended_offer !== 'No Action' ? `${customer.roi.toFixed(2)}x Expected ROI` : 'Non-positive return'}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 5 & 6 — RECOMMENDED ACTION & WHY THIS OFFER?                      */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section 5: Recommended Action Card */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-blue-400" />
                  Recommended Action
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  customer.recommended_offer !== 'No Action' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {customer.recommended_offer !== 'No Action' ? 'Incentive Assigned' : 'No Action Assigned'}
                </span>
              </div>

              <div className="text-xl font-black text-white tracking-tight">
                {customer.recommended_offer}
              </div>

              <div className="pt-2 text-xs space-y-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Offer Direct Cost:</span>
                  <span className="font-mono font-bold text-white">
                    {customer.recommended_offer === 'No Action' ? '₹0.00' : `₹${customer.offer_cost_inr.toLocaleString()} (€${customer.offer_cost_eur.toFixed(0)})`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Expected Value Saved:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{customer.expected_value_saved_inr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Net Value Margin:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    {customer.expected_value_saved_inr > customer.offer_cost_inr
                      ? `+₹${(customer.expected_value_saved_inr - customer.offer_cost_inr).toLocaleString()}`
                      : '₹0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Return on Investment:</span>
                  <span className="font-mono font-bold text-white">
                    {customer.roi.toFixed(2)}x ROI
                  </span>
                </div>
              </div>
            </div>

            {/* Section 6: Why This Offer? Card */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-emerald-400" />
                  Why This Offer?
                </h2>
                <span className="text-[10px] text-slate-400 font-mono">
                  Rule-Guided Causal Allocation
                </span>
              </div>

              <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg text-xs text-blue-200">
                <strong>Recommendation Logic:</strong> "{customer.recommendation_reason}"
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                {customer.recommended_offer !== 'No Action' ? (
                  <>
                    <p>
                      • Customer's causal uplift (<strong className="text-emerald-400">+{(customer.uplift * 100).toFixed(2)}%</strong>) and simulated lifetime value (<strong className="text-white">€{customer.customer_value_eur.toFixed(0)}</strong>) generate an expected gross return of <strong className="text-emerald-400">₹{customer.expected_value_saved_inr.toLocaleString()}</strong>.
                    </p>
                    <p>
                      • This exceeds the direct offer cost of <strong className="text-white">₹{customer.offer_cost_inr.toLocaleString()}</strong> by a factor of <strong className="text-emerald-300">{customer.roi.toFixed(2)}x</strong>, justifying the intervention under financial hurdle rates.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      • Estimated intervention uplift is non-positive or insufficient to cover minimum campaign costs.
                    </p>
                    <p>
                      • Withholding an offer preserves marketing budget with zero penalty to net customer value.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3 — "WHY THIS CUSTOMER?" MODEL EXPLAINABILITY                     */}
          {/* ========================================================================= */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Why is this customer at risk? (Model Reasoning & Drivers)
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded">
                XGBoost + Two-Model T-Learner
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {customer.explanations && customer.explanations.map((exp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="h-2 w-2 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed">{exp}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                Model-level churn drivers: Top predictive factors identified by baseline XGBoost (Usage volume, billing stability, call traffic patterns, contract maturity).
              </span>
              <span className="text-slate-500 shrink-0">
                100% ground-truth pipeline data
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 8 & 9 — CUSTOMER VALUE & COMPREHENSIVE PROFILE CARDS              */}
          {/* ========================================================================= */}
          <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Structured Customer Profile & Commercial Attributes
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                ID: {customer.customer_id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Group 1: Profile Identity */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Identity & Segment
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account ID:</span>
                    <span className="font-mono text-white font-bold">{customer.customer_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Value Segment:</span>
                    <span className="text-white font-semibold">{customer.customer_value_segment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Persuadability:</span>
                    <span className="text-cyan-400 font-semibold">{customer.persuadability_segment}</span>
                  </div>
                </div>
              </div>

              {/* Group 2: Behavioral Risk */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Behavioral Risk
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Category:</span>
                    <span className="text-white font-semibold">{customer.risk_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Baseline Churn:</span>
                    <span className="font-mono text-white font-semibold">{(customer.churn_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Control Churn:</span>
                    <span className="font-mono text-rose-400">{(customer.control_churn_probability * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Group 3: Commercial Value */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Commercial Lifetime Value
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Value (EUR):</span>
                    <span className="font-mono text-white font-bold">€{customer.customer_value_eur.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Value (INR):</span>
                    <span className="font-mono text-white font-bold">₹{customer.customer_value_inr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Value Tier:</span>
                    <span className="text-emerald-400 font-semibold">{customer.customer_value_segment}</span>
                  </div>
                </div>
              </div>

              {/* Group 4: Retention Economics */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Retention Economics
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Action:</span>
                    <span className="text-blue-300 font-semibold">{customer.recommended_offer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cost:</span>
                    <span className="font-mono text-white">₹{customer.offer_cost_inr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Expected ROI:</span>
                    <span className="font-mono text-emerald-400 font-bold">{customer.roi.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
