import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, PieChart, BarChart3, Target } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface PortfolioOverviewProps {
  summary: {
    totalMarketValue: number;
    totalGainLoss: number;
    totalGainLossPerc: number;
    totalCostBasis: number;
    holdingsCount: number;
    avgGainLossPerc: number;
  };
}

export function PortfolioOverview({ summary }: PortfolioOverviewProps) {
  const cards = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(summary.totalMarketValue),
      icon: IndianRupee,
      color: 'blue',
      trend: null
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(summary.totalGainLoss),
      icon: summary.totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      color: summary.totalGainLoss >= 0 ? 'green' : 'red',
      trend: formatPercentage(summary.totalGainLossPerc)
    },
    {
      title: 'Cost Basis',
      value: formatCurrency(summary.totalCostBasis),
      icon: Target,
      color: 'gray',
      trend: null
    },
    {
      title: 'Holdings Count',
      value: summary.holdingsCount.toString(),
      icon: BarChart3,
      color: 'purple',
      trend: formatPercentage(summary.avgGainLossPerc, { showSign: true })
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      gray: 'bg-gray-50 text-gray-600 border-gray-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </p>
                {card.trend && (
                  <p className={`text-sm font-medium ${
                    card.trend.startsWith('-') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {card.trend}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg border ${getColorClasses(card.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}