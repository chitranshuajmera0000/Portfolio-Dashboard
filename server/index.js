import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());



// Create new portfolio endpoint
app.post('/api/portfolios', async (req, res) => {
  try {
    const { name, description, currency, totalValue } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, error: 'Portfolio name is required.' });
    }
    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        description: description || '',
        currency: currency || 'INR',
        totalValue: typeof totalValue === 'number' && !isNaN(totalValue) ? totalValue : 0,
      }
    });
    res.status(201).json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ success: false, error: 'Failed to create portfolio' });
  }
});



// Portfolio Holdings Endpoint
app.get('/api/portfolios/:id/holdings', async (req, res) => {
  try {
    const { id } = req.params;
    const holdings = await prisma.holding.findMany({
      where: { portfolioId: id },
      orderBy: { marketValue: 'desc' }
    });
    
    res.json({
      success: true,
      data: holdings
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio holdings'
    });
  }
});

// Portfolio Allocation Endpoint
app.get('/api/portfolios/:id/allocation', async (req, res) => {
  try {
    const { id } = req.params;
    const holdings = await prisma.holding.findMany({
      where: { portfolioId: id }
    });

    // Calculate allocation by sector
    const sectorAllocation = holdings.reduce((acc, holding) => {
      const sector = holding.sector || 'Other';
      acc[sector] = (acc[sector] || 0) + Number(holding.marketValue);
      return acc;
    }, {});

    // Calculate allocation by asset type
    const assetAllocation = holdings.reduce((acc, holding) => {
      acc[holding.assetType] = (acc[holding.assetType] || 0) + Number(holding.marketValue);
      return acc;
    }, {});

    // Calculate allocation by market cap
    // For demo: classify by marketValue (Large >= 1L, Mid >= 10K, else Small)
    const marketCapAllocation = holdings.reduce((acc, holding) => {
      let cap = 'Small';
      if (holding.marketValue >= 1000000) cap = 'Large';
      else if (holding.marketValue >= 100000) cap = 'Mid';
      acc[cap] = (acc[cap] || 0) + Number(holding.marketValue);
      return acc;
    }, {});

    const totalValue = holdings.reduce((sum, holding) => sum + Number(holding.marketValue), 0);

    res.json({
      success: true,
      data: {
        sectorAllocation,
        assetAllocation,
        marketCapAllocation,
        totalValue,
        holdingsCount: holdings.length
      }
    });
  } catch (error) {
    console.error('Error fetching allocation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio allocation'
    });
  }
});

// Performance Comparison Endpoint
app.get('/api/portfolios/:id/performance', async (req, res) => {
  try {
    const { id } = req.params;
    const { timeframe = '1M' } = req.query;
    
    const holdings = await prisma.holding.findMany({
      where: { portfolioId: id },
      include: {
        priceHistory: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 data points
        }
      }
    });
    
    // Calculate portfolio performance
    const totalGainLoss = holdings.reduce((sum, holding) => sum + Number(holding.gainLoss), 0);
    const totalMarketValue = holdings.reduce((sum, holding) => sum + Number(holding.marketValue), 0);
    const totalCostBasis = totalMarketValue - totalGainLoss;
    const totalGainLossPerc = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
    
    // Top performers
    const topGainers = holdings
      .filter(h => Number(h.gainLossPerc) > 0)
      .sort((a, b) => Number(b.gainLossPerc) - Number(a.gainLossPerc))
      .slice(0, 5);
    
    const topLosers = holdings
      .filter(h => Number(h.gainLossPerc) < 0)
      .sort((a, b) => Number(a.gainLossPerc) - Number(b.gainLossPerc))
      .slice(0, 5);
    
    res.json({
      success: true,
      data: {
        totalGainLoss,
        totalGainLossPerc,
        totalMarketValue,
        totalCostBasis,
        topGainers,
        topLosers,
        timeframe
      }
    });
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio performance'
    });
  }
});

// Portfolio Summary Endpoint
app.get('/api/portfolios/:id/summary', async (req, res) => {
  try {
    const { id } = req.params;
    
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        holdings: true
      }
    });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    const totalMarketValue = portfolio.holdings.reduce((sum, holding) => sum + Number(holding.marketValue), 0);
    const totalGainLoss = portfolio.holdings.reduce((sum, holding) => sum + Number(holding.gainLoss), 0);
    const totalCostBasis = totalMarketValue - totalGainLoss;
    const totalGainLossPerc = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
    
    // Update portfolio total value
    await prisma.portfolio.update({
      where: { id },
      data: { totalValue: totalMarketValue }
    });
    
    res.json({
      success: true,
      data: {
        ...portfolio,
        summary: {
          totalMarketValue,
          totalGainLoss,
          totalGainLossPerc,
          totalCostBasis,
          holdingsCount: portfolio.holdings.length,
          avgGainLossPerc: portfolio.holdings.length > 0 ? 
            portfolio.holdings.reduce((sum, h) => sum + Number(h.gainLossPerc), 0) / portfolio.holdings.length : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio summary'
    });
  }
});

// Get all portfolios
app.get('/api/portfolios', async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: {
        holdings: {
          take: 5,
          orderBy: { marketValue: 'desc' }
        }
      }
    });
    
    res.json({
      success: true,
      data: portfolios
    });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolios'
    });
  }
});

// Create sample data endpoint
app.post('/api/seed-data', async (req, res) => {
  try {
    // Create sample portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        name: 'My Investment Portfolio',
        description: 'Diversified investment portfolio with growth focus',
        currency: 'USD'
      }
    });
    
    // Sample holdings data
    const sampleHoldings = [
      { symbol: 'AAPL', name: 'Apple Inc.', quantity: 100, avgCost: 150.00, currentPrice: 175.50, sector: 'Technology', assetType: 'stock' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', quantity: 75, avgCost: 280.00, currentPrice: 310.25, sector: 'Technology', assetType: 'stock' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 50, avgCost: 2200.00, currentPrice: 2350.75, sector: 'Technology', assetType: 'stock' },
      { symbol: 'TSLA', name: 'Tesla Inc.', quantity: 25, avgCost: 850.00, currentPrice: 725.50, sector: 'Consumer Discretionary', assetType: 'stock' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', quantity: 40, avgCost: 420.00, currentPrice: 485.30, sector: 'Technology', assetType: 'stock' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', quantity: 80, avgCost: 140.00, currentPrice: 155.75, sector: 'Financial Services', assetType: 'stock' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', quantity: 60, avgCost: 165.00, currentPrice: 172.20, sector: 'Healthcare', assetType: 'stock' },
      { symbol: 'V', name: 'Visa Inc.', quantity: 45, avgCost: 220.00, currentPrice: 245.80, sector: 'Financial Services', assetType: 'stock' }
    ];
    
    const holdingsData = sampleHoldings.map(holding => {
      const marketValue = Number(holding.quantity) * Number(holding.currentPrice);
      const costBasis = Number(holding.quantity) * Number(holding.avgCost);
      const gainLoss = marketValue - costBasis;
      const gainLossPerc = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
      
      return {
        portfolioId: portfolio.id,
        symbol: holding.symbol,
        name: holding.name,
        quantity: holding.quantity,
        avgCost: holding.avgCost,
        currentPrice: holding.currentPrice,
        marketValue,
        gainLoss,
        gainLossPerc,
        sector: holding.sector,
        assetType: holding.assetType
      };
    });
    
    await prisma.holding.createMany({
      data: holdingsData
    });
    
    res.json({
      success: true,
      message: 'Sample data created successfully',
      portfolioId: portfolio.id
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sample data'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio Analytics API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio Analytics API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});