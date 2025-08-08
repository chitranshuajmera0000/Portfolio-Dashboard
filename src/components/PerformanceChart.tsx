import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatCurrency, formatPercentage } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PerformanceChartProps {
  performance: {
    totalGainLoss: number;
    totalGainLossPerc: number;
    totalMarketValue: number;
    totalCostBasis: number;
    topGainers: any[];
    topLosers: any[];
    timeframe: string;
  };
}

export function PerformanceChart({ performance }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState('1M');

  // Generate sample performance data for visualization
  const generatePerformanceData = () => {
    const days = timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
    const data = [];
    const labels = [];
    
    let baseValue = performance.totalCostBasis;
    const dailyVolatility = 0.02; // 2% daily volatility
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Simulate price movement
      const randomChange = (Math.random() - 0.5) * 2 * dailyVolatility;
      baseValue *= (1 + randomChange);
      data.push(baseValue);
    }
    
    // Ensure the last value matches current market value
    data[data.length - 1] = performance.totalMarketValue;
    
    return { labels, data };
  };

  const { labels, data } = generatePerformanceData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data,
        borderColor: performance.totalGainLoss >= 0 ? '#10B981' : '#EF4444',
        backgroundColor: performance.totalGainLoss >= 0 ? '#10B98120' : '#EF444420',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Portfolio Value: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  const timeframes = [
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeframe === tf.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Performance Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Gain/Loss</div>
            <div className={`text-xl font-bold ${
              performance.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(performance.totalGainLoss)}
            </div>
            <div className={`text-sm ${
              performance.totalGainLossPerc >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(performance.totalGainLossPerc, { showSign: true })}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Current Value</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(performance.totalMarketValue)}
            </div>
            <div className="text-sm text-gray-600">
              Cost: {formatCurrency(performance.totalCostBasis)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}