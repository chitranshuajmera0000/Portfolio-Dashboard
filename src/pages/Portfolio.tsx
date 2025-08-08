import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { HoldingsTable } from '../components/HoldingsTable';
import { RefreshCw } from 'lucide-react';

export function Portfolio() {
  const { id } = useParams<{ id: string }>();
  const { holdings, loading, error } = usePortfolioData(id || '');
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (!loading && !error && Array.isArray(holdings) && holdings.length > 0) {
      setShowTable(false);
      const timer = setTimeout(() => setShowTable(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowTable(false);
    }
  }, [loading, error, holdings]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Portfolio Details: {id}
        </h1>
      </div>
      {loading && (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading holdings...</span>
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      {showTable && !loading && !error && Array.isArray(holdings) && holdings.length > 0 && (
        <HoldingsTable holdings={holdings} />
      )}
    </div>
  );
}