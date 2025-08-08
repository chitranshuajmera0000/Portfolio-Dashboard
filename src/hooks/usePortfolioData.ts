
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

interface Portfolio {
  id: string;
  name: string;
  description?: string;
  totalValue: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPerc: number;
  sector: string;
  assetType: string;
}

interface Summary {
  totalMarketValue: number;
  totalGainLoss: number;
  totalGainLossPerc: number;
  totalCostBasis: number;
  holdingsCount: number;
  avgGainLossPerc: number;
}

interface Allocation {
  sectorAllocation: Record<string, number>;
  assetAllocation: Record<string, number>;
  totalValue: number;
  holdingsCount: number;
}

interface Performance {
  totalGainLoss: number;
  totalGainLossPerc: number;
  totalMarketValue: number;
  totalCostBasis: number;
  topGainers: Holding[];
  topLosers: Holding[];
  timeframe: string;
}

export function usePortfolioData(portfolioId: string) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (endpoint: string) => {
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`);
      const data = response.data;
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      return data.data;
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  }, []);

  const fetchPortfolios = useCallback(async () => {
    try {
      const data = await fetchData('/portfolios');
      setPortfolios(data);
    } catch (err) {
      setError('Failed to fetch portfolios');
      setLoading(false);
    }
  }, [fetchData]);

  const fetchPortfolioData = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [summaryData, holdingsData, allocationData, performanceData] = await Promise.all([
        fetchData(`/portfolios/${id}/summary`),
        fetchData(`/portfolios/${id}/holdings`),
        fetchData(`/portfolios/${id}/allocation`),
        fetchData(`/portfolios/${id}/performance`)
      ]);
      
      setSummary(summaryData.summary);
      setHoldings(holdingsData);
      setAllocation(allocationData);
      setPerformance(performanceData);
    } catch (err) {
      setError('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchPortfolios();
    if (portfolioId) {
      await fetchPortfolioData(portfolioId);
    }
  }, [fetchPortfolios, fetchPortfolioData, portfolioId]);

  const createSampleData = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE}/seed-data`);
      const data = response.data;
      if (!data.success) {
        throw new Error(data.error || 'Failed to create sample data');
      }
      return data;
    } catch (err) {
      console.error('Error creating sample data:', err);
      throw err;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Fetch portfolio-specific data when portfolioId changes
  useEffect(() => {
    if (portfolioId) {
      fetchPortfolioData(portfolioId);
    }
  }, [portfolioId, fetchPortfolioData]);

  return {
    portfolios,
    summary,
    holdings,
    allocation,
    performance,
    loading,
    error,
    refreshData,
    createSampleData
  };
}