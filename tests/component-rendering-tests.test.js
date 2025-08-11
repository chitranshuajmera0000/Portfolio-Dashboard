```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { act } from 'react-dom/test-utils';


jest.mock('../hooks/usePortfolioData', () => ({
  usePortfolioData: jest.fn(),
}));

describe('Dashboard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state when portfolios are empty and loading is true', async () => {
    usePortfolioData.mockReturnValue({
      portfolios: [],
      loading: true,
      error: null,
      summary: null,
      holdings: null,
      allocation: null,
      performance: null,
      refreshData: jest.fn(),
      createSampleData: jest.fn(),
    });
    render(<Dashboard />);
    expect(screen.getByText('Loading portfolio data...')).toBeInTheDocument();
  });

  test('renders error state when error is present', () => {
    const mockError = 'Failed to fetch data';
    usePortfolioData.mockReturnValue({
      portfolios: [],
      loading: false,
      error: mockError,
      summary: null,
      holdings: null,
      allocation: null,
      performance: null,
      refreshData: jest.fn(),
      createSampleData: jest.fn(),
    });
    render(<Dashboard />);
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  test('renders empty state when portfolios are empty and not loading', () => {
    usePortfolioData.mockReturnValue({
      portfolios: [],
      loading: false,
      error: null,
      summary: null,
      holdings: null,
      allocation: null,
      performance: null,
      refreshData: jest.fn(),
      createSampleData: jest.fn(),
    });
    render(<Dashboard />);
    expect(screen.getByText('Welcome to Portfolio Analytics')).toBeInTheDocument();
    expect(screen.getByText('Create Sample Portfolio')).toBeInTheDocument();
  });

  test('renders dashboard components when data is available', async () => {
    const mockData = {
      portfolios: [{ id: '1', name: 'Portfolio 1' }],
      loading: false,
      error: null,
      summary: { totalValue: 1000 },
      holdings: [{ symbol: 'AAPL', quantity: 10 }],
      allocation: { stocks: 50 },
      performance: { totalReturn: 10 },
      refreshData: jest.fn(),
      createSampleData: jest.fn(),
    };
    usePortfolioData.mockReturnValue(mockData);
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByText('Portfolio Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Portfolio 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();

  });

  test('calls createSampleData and refreshData on button click', async () => {
    const mockCreateSampleData = jest.fn(() => Promise.resolve({ success: true, portfolioId: '1' }));
    const mockRefreshData = jest.fn();
    usePortfolioData.mockReturnValue({
      portfolios: [],
      loading: false,
      error: null,
      summary: null,
      holdings: null,
      allocation: null,
      performance: null,
      refreshData: mockRefreshData,
      createSampleData: mockCreateSampleData,
    });
    render(<Dashboard />);
    const button = screen.getByText('Create Sample Portfolio');
    await act(async () => {
        button.click();
    });
    await waitFor(() => expect(mockCreateSampleData).toHaveBeenCalled());
    await waitFor(() => expect(mockRefreshData).toHaveBeenCalled());

  });
});
```
