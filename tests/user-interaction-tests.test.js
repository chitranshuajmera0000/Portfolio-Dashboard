```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Portfolio } from './pages/Portfolio';
import { AllocationChart } from './components/AllocationChart';
import { HoldingsTable } from './components/HoldingsTable';
import { PerformanceChart } from './components/PerformanceChart';


const server = setupServer(
  rest.get('/api/portfolios/1/allocation', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          sectorAllocation: { Technology: 1000, Healthcare: 500, Financials: 250 },
          assetAllocation: { Stocks: 1200, Bonds: 500 },
          marketCapAllocation: { Large: 800, Mid: 700, Small: 0 },
          totalValue: 1750,
          holdingsCount: 10
        }
      })
    );
  }),
  rest.get('/api/portfolios/1/holdings', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          { id: '1', symbol: 'AAPL', name: 'Apple', quantity: 10, avgCost: 150, currentPrice: 170, marketValue: 1700, gainLoss: 200, gainLossPerc: 10, sector: 'Technology', assetType: 'stock' }
        ]
      })
    );
  }),
  rest.get('/api/portfolios/1/performance', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: {
        totalGainLoss: 100,
        totalGainLossPerc: 5,
        totalMarketValue: 2000,
        totalCostBasis: 1900,
        topGainers: [],
        topLosers: [],
        timeframe: '1M'
      }
    }))
  }),
  rest.get('/api/portfolios/1/summary', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: {
        id: '1',
        name: 'Test Portfolio',
        holdings: []
      }
    }))
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


test('renders App component', () => {
  render(<Router><App /></Router>);
  const element = screen.getByText(/Portfolio Analytics/i);
  expect(element).toBeInTheDocument();
});

test('navigates to /portfolio/:id', async () => {
  render(<Router><App /></Router>);
  const linkElement = screen.getByRole('link', { name: /portfolio/i });
  fireEvent.click(linkElement);
  await waitFor(() => expect(screen.getByText(/portfolio/i)).toBeInTheDocument())

});

test('renders AllocationChart component', async () => {
  render(<Router><Portfolio portfolioId={'1'} /></Router>);
  await waitFor(() => expect(screen.getByRole('heading', { name: /asset allocation/i })).toBeInTheDocument());
});

test('renders HoldingsTable component', async () => {
  render(<Router><Portfolio portfolioId={'1'} /></Router>);
  await waitFor(() => expect(screen.getByRole('heading', { name: /portfolio holdings/i })).toBeInTheDocument());
});

test('renders PerformanceChart component', async () => {
  render(<Router><Portfolio portfolioId={'1'} /></Router>);
  await waitFor(() => expect(screen.getByRole('heading', { name: /performance/i })).toBeInTheDocument());
});


test('AllocationChart displays correct data', async () => {
  render(<Router><AllocationChart allocation={{ sectorAllocation: { Technology: 1000, Healthcare: 500 }, assetAllocation: { Stocks: 1200, Bonds: 500 }, totalValue: 1750, holdingsCount: 10 }} /></Router>);
    await waitFor(() => expect(screen.getByText(/Total: \$1,750.00/i)).toBeInTheDocument());
});

test('HoldingsTable sorts correctly', async () => {
  render(<Router><HoldingsTable holdings={[{ id: '1', symbol: 'AAPL', name: 'Apple', quantity: 10, avgCost: 150, currentPrice: 170, marketValue: 1700, gainLoss: 200, gainLossPerc: 10, sector: 'Technology', assetType: 'stock' }, { id: '2', symbol: 'MSFT', name: 'Microsoft', quantity: 20, avgCost: 250, currentPrice: 280, marketValue: 5600, gainLoss: 600, gainLossPerc: 20, sector: 'Technology', assetType: 'stock' }]} /></Router>);
  const marketValueHeader = screen.getByText(/market value/i);
  fireEvent.click(marketValueHeader);
  await waitFor(() => expect(screen.getByText(/MSFT/i)).toBeInTheDocument());
});

test('PerformanceChart shows correct total gain/loss', async () => {
  render(<Router><PerformanceChart performance={{ totalGainLoss: 100, totalGainLossPerc: 5, totalMarketValue: 2000, totalCostBasis: 1900, topGainers: [], topLosers: [], timeframe: '1M' }} /></Router>);
  await waitFor(() => expect(screen.getByText(/\$100.00/i)).toBeInTheDocument());
});


test('HoldingsTable search functionality', async () => {
  render(<Router><HoldingsTable holdings={[{ id: '1', symbol: 'AAPL', name: 'Apple', quantity: 10, avgCost: 150, currentPrice: 170, marketValue: 1700, gainLoss: 200, gainLossPerc: 10, sector: 'Technology', assetType: 'stock' }, { id: '2', symbol: 'MSFT', name: 'Microsoft', quantity: 20, avgCost: 250, currentPrice: 280, marketValue: 5600, gainLoss: 600, gainLossPerc: 20, sector: 'Technology', assetType: 'stock' }]} /></Router>);
  const searchInput = screen.getByPlaceholderText('Search by symbol or name...');
  fireEvent.change(searchInput, { target: { value: 'AAPL' } });
  await waitFor(() => expect(screen.getByText(/AAPL/i)).toBeInTheDocument());
  expect(screen.queryByText(/MSFT/i)).not.toBeInTheDocument();
});

```