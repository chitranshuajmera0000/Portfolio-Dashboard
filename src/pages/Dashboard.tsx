import React, { useState, useEffect } from 'react';
import { PortfolioOverview } from '../components/PortfolioOverview';
import { HoldingsTable } from '../components/HoldingsTable';
import { AllocationChart } from '../components/AllocationChart';
import { PerformanceChart } from '../components/PerformanceChart';
import { TopPerformers } from '../components/TopPerformers';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function Dashboard() {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
  const { 
    portfolios, 
    summary, 
    holdings, 
    allocation, 
    performance, 
    loading, 
    error,
    refreshData,
    createSampleData 
  } = usePortfolioData(selectedPortfolioId);
  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolioId) {
      setSelectedPortfolioId(portfolios[0].id);
    }
  }, [portfolios, selectedPortfolioId]);

  const handleCreateSampleData = async () => {
    try {
      const response = await createSampleData();
      if (response.success) {
        setSelectedPortfolioId(response.portfolioId);
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to create sample data:', error);
    }
  };

  if (loading && portfolios.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading portfolio data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="ml-2 text-red-800 font-medium">Error loading data</span>
        </div>
        <p className="mt-2 text-red-700">{error}</p>
        <button
          onClick={refreshData}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Portfolio Analytics</h2>
          <p className="text-gray-600 mb-6">
            Get started by creating a portfolio or loading sample data to explore the dashboard features.
          </p>
          <button
            onClick={handleCreateSampleData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Sample Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">

      {/* Portfolio Selection */}
  <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPortfolioId}
              onChange={(e) => setSelectedPortfolioId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
            <button
              onClick={refreshData}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Loader overlay for dashboard content */}
      {loading && portfolios.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-700">Loading portfolio details...</span>
        </div>
      )}

      {/* Portfolio Overview Cards */}
      {summary && <PortfolioOverview summary={summary} />}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allocation && <AllocationChart allocation={allocation} />}
        {performance && <PerformanceChart performance={performance} />}
      </div>

      {/* Holdings Table and Top Performers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {holdings && <HoldingsTable holdings={holdings} />}
        </div>
        <div>
          {performance && <TopPerformers performance={performance} />}
        </div>
      </div>
    </div>
  );
}