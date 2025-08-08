import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationChartProps {
  allocation: {
    sectorAllocation: Record<string, number>;
    assetAllocation: Record<string, number>;
    marketCapAllocation?: Record<string, number>;
    totalValue: number;
    holdingsCount: number;
  };
}

export function AllocationChart({ allocation }: AllocationChartProps) {
  const sectorData = Object.entries(allocation.sectorAllocation);
  const assetData = Object.entries(allocation.assetAllocation);
  const marketCapData = allocation.marketCapAllocation ? Object.entries(allocation.marketCapAllocation) : [];

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16'  // Lime
  ];

  const sectorChartData = {
    labels: sectorData.map(([sector]) => sector),
    datasets: [
      {
        data: sectorData.map(([, value]) => value),
        backgroundColor: colors.slice(0, sectorData.length),
        borderColor: colors.slice(0, sectorData.length),
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = ((value / allocation.totalValue) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Market Cap Chart Data
  const marketCapColors = ['#3B82F6', '#F59E0B', '#EF4444'];
  const marketCapChartData = {
    labels: marketCapData.map(([cap]) => cap),
    datasets: [
      {
        data: marketCapData.map(([, value]) => value),
        backgroundColor: marketCapColors.slice(0, marketCapData.length),
        borderColor: marketCapColors.slice(0, marketCapData.length),
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Asset Allocation</h3>
        <div className="text-sm text-gray-500">
          Total: {formatCurrency(allocation.totalValue)}
        </div>
      </div>

      <div className="space-y-6">
        {/* Sector Allocation */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">By Sector</h4>
          <div className="h-64">
            <Doughnut data={sectorChartData} options={chartOptions} />
          </div>
        </div>

        {/* Market Cap Distribution */}
        {marketCapData.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">By Market Cap</h4>
            <div className="h-64">
              <Doughnut data={marketCapChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Allocation Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Holdings:</span>
              <span className="ml-2 text-gray-900">{allocation.holdingsCount}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Sectors:</span>
              <span className="ml-2 text-gray-900">{sectorData.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}