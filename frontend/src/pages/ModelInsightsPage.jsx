import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  BarChart2, 
  ShieldCheck, 
  GitBranch, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Info 
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
import { fetchChurnModel, fetchUpliftModel } from '../api';

export default function ModelInsightsPage() {
  const [churnModel, setChurnModel] = useState(null);
  const [upliftModel, setUpliftModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cRes, uRes] = await Promise.all([fetchChurnModel(), fetchUpliftModel()]);
        setChurnModel(cRes);
        setUpliftModel(uRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !churnModel || !upliftModel) {
    return (
      <div className="flex items-center justify-center h-full py-24 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Overview Banner */}
      <div className="glass-card rounded-xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            Empirical Model Performance & Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Auditable, uncompromised metrics evaluated on unseen stratified test sets and causal benchmark cohorts.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold">
          <ShieldCheck className="h-4 w-4" /> Zero Synthetic Metrics
        </div>
      </div>

      {/* SECTION 1: Baseline Churn Prediction Model */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <BarChart2 className="h-4 w-4 text-blue-400" />
          Part 1: Baseline Churn Prediction Model (XGBoost Classifier)
        </div>

        {/* 6 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ROC-AUC</span>
            <div className="text-xl font-black text-white font-mono mt-1">0.8534</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+0.078 vs Baseline</div>
          </div>
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PR-AUC</span>
            <div className="text-xl font-black text-white font-mono mt-1">0.1916</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">5.6x Random Rate</div>
          </div>
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precision</span>
            <div className="text-xl font-black text-white font-mono mt-1">36.67%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">3.4x vs LogReg</div>
          </div>
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recall</span>
            <div className="text-xl font-black text-white font-mono mt-1">13.41%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">False-Positive Safe</div>
          </div>
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">F1 Score</span>
            <div className="text-xl font-black text-white font-mono mt-1">0.1964</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Harmonic Balance</div>
          </div>
          <div className="glass-card rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
            <div className="text-xl font-black text-white font-mono mt-1">96.22%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">High Base Rate</div>
          </div>
        </div>

        {/* Model Comparison Table */}
        <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
            Stratified Test Set Evaluation (2,380 Customers)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Architecture</th>
                  <th className="py-2.5 px-4">ROC-AUC</th>
                  <th className="py-2.5 px-4">PR-AUC</th>
                  <th className="py-2.5 px-4">Precision</th>
                  <th className="py-2.5 px-4">Recall</th>
                  <th className="py-2.5 px-4">F1 Score</th>
                  <th className="py-2.5 px-4">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {churnModel.baseline_comparison.map((m, idx) => (
                  <tr key={idx} className={idx === 1 ? 'bg-blue-950/20 font-bold' : ''}>
                    <td className="py-2.5 px-4 font-sans text-white flex items-center gap-1.5">
                      {m.model}
                      {idx === 1 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-emerald-400">{(m.roc_auc).toFixed(4)}</td>
                    <td className="py-2.5 px-4 text-emerald-400">{(m.pr_auc).toFixed(4)}</td>
                    <td className="py-2.5 px-4 text-slate-300">{(m.precision * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-4 text-slate-300">{(m.recall * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-4 text-slate-300">{(m.f1).toFixed(4)}</td>
                    <td className="py-2.5 px-4 text-slate-300">{(m.accuracy * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 15 Feature Importances Chart */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Top 15 Most Influential Predictive Features (Churn Model)
            </h3>
            <span className="text-[10px] text-slate-400">Out of 336 Trained Features</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={churnModel.top_features}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis type="category" dataKey="feature" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val) => [`${(Number(val) * 100).toFixed(2)}%`, 'Relative Weight']}
                />
                <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 2: Uplift / Persuadability Model (T-Learner) */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <GitBranch className="h-4 w-4 text-emerald-400" />
          Part 2: Causal Uplift Architecture (Two-Model T-Learner)
        </div>

        {/* Cohort & Causal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Treatment Group (T=1)</span>
            <div className="text-lg font-bold text-white font-mono mt-1">9,010 Customers</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              303 Churned (3.3629% Rate)
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Control Group (T=0)</span>
            <div className="text-lg font-bold text-white font-mono mt-1">2,886 Customers</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              105 Churned (3.6383% Rate)
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qini Coefficient</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {upliftModel.ranking_metrics.qini_coefficient}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              Positive Incremental Area
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AUUC Score</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {upliftModel.ranking_metrics.auuc}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              Area Under Uplift Curve
            </div>
          </div>
        </div>

        {/* Uplift Validation Deciles Table */}
        <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
            <span>Uplift Decile Validation: Observed Churn Separation</span>
            <span className="text-[10px] text-slate-400 font-normal">Ranked by Model Uplift Score Descending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Uplift Decile</th>
                  <th className="py-2.5 px-4">Customer Volume</th>
                  <th className="py-2.5 px-4">Predicted Mean Uplift</th>
                  <th className="py-2.5 px-4">Control Churn Rate (T=0)</th>
                  <th className="py-2.5 px-4">Treatment Churn Rate (T=1)</th>
                  <th className="py-2.5 px-4">Observed Treatment Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {upliftModel.validation_deciles.map((d, idx) => (
                  <tr key={idx} className={idx === 0 ? 'bg-emerald-950/15 font-semibold' : ''}>
                    <td className="py-2.5 px-4 font-sans text-white">{d.decile}</td>
                    <td className="py-2.5 px-4 text-slate-300">{d.count}</td>
                    <td className={`py-2.5 px-4 font-bold ${d.mean_uplift >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {d.mean_uplift >= 0 ? `+${(d.mean_uplift * 100).toFixed(2)}%` : `${(d.mean_uplift * 100).toFixed(2)}%`}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">{(d.ctrl_rate * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-4 text-slate-300">{(d.treat_rate * 100).toFixed(2)}%</td>
                    <td className={`py-2.5 px-4 font-bold ${d.difference > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {d.difference > 0 ? `+${(d.difference * 100).toFixed(2)}%` : `${(d.difference * 100).toFixed(2)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
