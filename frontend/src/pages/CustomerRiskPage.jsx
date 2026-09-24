import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { fetchCustomers } from '../api';

export default function CustomerRiskPage({ onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [persuadabilityFilter, setPersuadabilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('churn');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchCustomers({
        search,
        risk: riskFilter,
        persuadability: persuadabilityFilter,
        sortBy,
        order: sortOrder,
        page,
        pageSize
      });
      setCustomers(res.customers);
      setTotalCount(res.total_count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, riskFilter, persuadabilityFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleSortChange = (newSort) => {
    if (sortBy === newSort) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSort);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Filters & Control Toolbar */}
      <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Customer ID (e.g. C10828, C09561)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-20 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all"
            >
              Filter
            </button>
          </form>

          {/* Quick Filter Counts */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Matching records:</span>
            <span className="font-bold text-white font-mono">{totalCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Risk Level
            </label>
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
              className="w-full py-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk (0.80–1.00)</option>
              <option value="High">High Risk (0.60–0.80)</option>
              <option value="Medium">Medium Risk (0.30–0.60)</option>
              <option value="Low">Low Risk (0.00–0.30)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Persuadability Segment
            </label>
            <select
              value={persuadabilityFilter}
              onChange={(e) => { setPersuadabilityFilter(e.target.value); setPage(1); }}
              className="w-full py-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Segments</option>
              <option value="HIGHLY PERSUADABLE">Highly Persuadable (Strong Response)</option>
              <option value="PERSUADABLE">Persuadable (Positive Response)</option>
              <option value="LOW RESPONSE">Low Response (Negligible Uplift)</option>
              <option value="NEGATIVE RESPONSE">Negative Response (Avoid Outreach)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Primary Sort Metric
            </label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full py-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="churn">Highest Churn Risk</option>
              <option value="uplift">Highest Estimated Uplift</option>
              <option value="value">Highest Customer Value</option>
              <option value="ev">Highest Expected Value Saved</option>
              <option value="roi">Highest Return on Investment (ROI)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Page Size
            </label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="w-full py-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value={25}>25 customers per page</option>
              <option value={50}>50 customers per page</option>
              <option value={100}>100 customers per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Customer ID</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSortChange('churn')}
                >
                  <div className="flex items-center gap-1">
                    <span>Churn Probability</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Risk Level</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSortChange('uplift')}
                >
                  <div className="flex items-center gap-1">
                    <span>Uplift</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Persuadability Segment</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSortChange('value')}
                >
                  <div className="flex items-center gap-1">
                    <span>Customer Value</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Recommended Offer</th>
                <th className="py-3 px-3">Offer Cost</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSortChange('ev')}
                >
                  <div className="flex items-center gap-1">
                    <span>Expected Value</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSortChange('roi')}
                >
                  <div className="flex items-center gap-1">
                    <span>ROI</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
                    <div className="text-xs font-sans">Querying customer intelligence base...</div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-sans">
                    No customers match the active filters.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr 
                    key={c.customer_id} 
                    onClick={() => onSelectCustomer(c.customer_id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 font-bold text-blue-400 flex items-center gap-1.5">
                      <span>{c.customer_id}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </td>
                    <td className="py-3 px-3 text-white font-sans font-semibold">
                      {(c.churn_probability * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        c.risk_level === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        c.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {c.risk_level}
                      </span>
                    </td>
                    <td className={`py-3 px-3 font-sans font-semibold ${
                      c.uplift > 0.005 ? 'text-emerald-400 font-bold' :
                      c.uplift > 0 ? 'text-cyan-400' :
                      c.uplift === 0 ? 'text-slate-400' : 'text-rose-400'
                    }`}>
                      {c.uplift >= 0 ? `+${(c.uplift * 100).toFixed(2)}%` : `${(c.uplift * 100).toFixed(2)}%`}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        c.persuadability_segment === 'HIGHLY PERSUADABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        c.persuadability_segment === 'PERSUADABLE' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        c.persuadability_segment === 'LOW RESPONSE' ? 'bg-slate-700/40 text-slate-300' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {c.persuadability_segment}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      €{c.customer_value_eur.toFixed(0)} <span className="text-[10px] text-slate-400">(₹{(c.customer_value_inr / 1000).toFixed(0)}k)</span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        c.recommended_offer === 'No Action'
                          ? 'text-slate-400'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/25'
                      }`}>
                        {c.recommended_offer}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-sans">
                      {c.recommended_offer === 'No Action' ? '—' : `₹${c.offer_cost_inr.toFixed(0)}`}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-sans">
                      {c.expected_value_saved_inr > 0 ? `₹${c.expected_value_saved_inr.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3 font-sans font-bold text-slate-300">
                      {c.roi > 0 ? `${c.roi.toFixed(2)}x` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCustomer(c.customer_id);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-[11px] font-medium border border-slate-700 transition-all"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-white">{customers.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-semibold text-white">{Math.min(page * pageSize, totalCount)}</span> of{' '}
            <span className="font-semibold text-white">{totalCount.toLocaleString()}</span> customers
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-white">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
