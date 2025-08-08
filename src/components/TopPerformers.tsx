import React from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface TopPerformersProps {
  performance: {
    topGainers: Array<{
      symbol: string;
      name: string;
      gainLossPerc: number;
      gainLoss: number;
      marketValue: number;
    }>;
    topLosers: Array<{
      symbol: string;
      name: string;
      gainLossPerc: number;
      gainLoss: number;
      marketValue: number;
    }>;
  };
}

export function TopPerformers({ performance }: TopPerformersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
      
      <div className="space-y-6">
        {/* Top Gainers */}
        <div>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Top Gainers</h4>
          </div>
          
          {performance.topGainers.length > 0 ? (
            <div className="space-y-3">
              {performance.topGainers.slice(0, 3).map((holding, index) => (
                <div key={holding.symbol} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">{holding.symbol}</span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-32">
                      {holding.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      {formatPercentage(Number(holding.gainLossPerc), { showSign: true })}
                    </div>
                    <div className="text-sm text-green-600">
                      {formatCurrency(Number(holding.gainLoss))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Award className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No positive performers</p>
            </div>
          )}
        </div>

        {/* Top Losers */}
        <div>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h4 className="font-medium text-gray-900">Top Losers</h4>
          </div>
          
          {performance.topLosers.length > 0 ? (
            <div className="space-y-3">
              {performance.topLosers.slice(0, 3).map((holding, index) => (
                <div key={holding.symbol} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">{holding.symbol}</span>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-32">
                      {holding.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">
                      {formatPercentage(Number(holding.gainLossPerc), { showSign: true })}
                    </div>
                    <div className="text-sm text-red-600">
                      {formatCurrency(Number(holding.gainLoss))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <TrendingDown className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No negative performers</p>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Performance Overview</div>
            <div className="text-lg font-semibold text-gray-900">
              {performance.topGainers.length} Gainers | {performance.topLosers.length} Losers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}