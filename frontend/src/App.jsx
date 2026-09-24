import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CustomerRiskPage from './pages/CustomerRiskPage';
import Customer360Page from './pages/Customer360Page';
import SegmentationPage from './pages/SegmentationPage';
import OptimizerPage from './pages/OptimizerPage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import { fetchDashboard } from './api';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState('C10828');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to RETENTIONIQ Backend. Please ensure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    setActivePage('customer360');
  };

  const handleNavigateToOptimizer = () => {
    setActivePage('optimizer');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080c14] text-slate-100 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        selectedCustomerId={selectedCustomerId}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          activePage={activePage} 
          onSelectCustomer={handleSelectCustomer}
          onRefresh={loadInitialData}
        />

        <main className="flex-1 overflow-y-auto bg-[#080c14]">
          {error && (
            <div className="m-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={loadInitialData}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold"
              >
                Retry Connection
              </button>
            </div>
          )}

          {activePage === 'dashboard' && (
            <DashboardPage 
              data={dashboardData} 
              onSelectCustomer={handleSelectCustomer}
              onNavigateToOptimizer={handleNavigateToOptimizer}
            />
          )}

          {activePage === 'risk' && (
            <CustomerRiskPage 
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activePage === 'customer360' && (
            <Customer360Page 
              customerId={selectedCustomerId}
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activePage === 'segmentation' && (
            <SegmentationPage 
              onFilterBySegment={() => setActivePage('risk')}
            />
          )}

          {activePage === 'optimizer' && (
            <OptimizerPage 
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activePage === 'insights' && (
            <ModelInsightsPage />
          )}
        </main>
      </div>
    </div>
  );
}
