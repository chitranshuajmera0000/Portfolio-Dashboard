import React, { useState } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

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

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<keyof Holding>('marketValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const handleSort = (field: keyof Holding) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredHoldings = holdings.filter(h =>
    h.symbol.toLowerCase().includes(search.toLowerCase()) ||
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    const aValue = Number(a[sortField]);
    const bValue = Number(b[sortField]);
    if (sortDirection === 'asc') {
      return aValue - bValue;
    }
    return bValue - aValue;
  });

  const getSectorColor = (sector: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Financial Services': 'bg-yellow-100 text-yellow-800',
      'Consumer Discretionary': 'bg-purple-100 text-purple-800',
      'Communication Services': 'bg-indigo-100 text-indigo-800',
      'Industrial': 'bg-gray-100 text-gray-800',
      'Energy': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[sector as keyof typeof colors] || colors['Other'];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Holdings</h3>
          <p className="text-sm text-gray-600 mt-1">{filteredHoldings.length} positions</p>
        </div>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by symbol or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol/Name
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end">
                  Shares
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('avgCost')}
              >
                <div className="flex items-center justify-end">
                  Avg Cost
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center justify-end">
                  Current Price
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('marketValue')}
              >
                <div className="flex items-center justify-end">
                  Market Value
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('gainLossPerc')}
              >
                <div className="flex items-center justify-end">
                  Gain/Loss
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sector
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedHoldings.map((holding) => (
              <tr key={holding.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                    <div className="text-sm text-gray-500 truncate max-w-48">{holding.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">
                  {Number(holding.quantity).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">
                  {formatCurrency(Number(holding.avgCost))}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">
                  {formatCurrency(Number(holding.currentPrice))}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(Number(holding.marketValue))}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center text-sm font-medium ${
                      Number(holding.gainLoss) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Number(holding.gainLoss) >= 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4" />
                      )}
                      {formatCurrency(Number(holding.gainLoss))}
                    </div>
                    <div className={`text-sm ${
                      Number(holding.gainLossPerc) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(Number(holding.gainLossPerc), { showSign: true })}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getSectorColor(holding.sector || 'Other')
                  }`}>
                    {holding.sector || 'Other'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}