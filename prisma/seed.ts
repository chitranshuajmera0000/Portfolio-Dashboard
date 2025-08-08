import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create two portfolios
  const [portfolio, portfolio2] = await Promise.all([
    prisma.portfolio.create({
      data: {
        name: 'Default Portfolio',
        description: 'Seeded portfolio',
        currency: 'INR',
      },
    }),
    prisma.portfolio.create({
      data: {
        name: 'Growth Portfolio',
        description: 'Aggressive growth stocks',
        currency: 'INR',
      },
    })
  ]);

  // Seed holdings for both portfolios
  await prisma.holding.createMany({
    data: [
      {
        portfolioId: portfolio.id,
        symbol: 'RELIANCE',
        name: 'Reliance Industries Limited',
        quantity: 50,
        avgCost: 2450,
        currentPrice: 2680.5,
        marketValue: 134025,
        gainLoss: 11525,
        gainLossPerc: 9.39,
        sector: 'Energy',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'INFY',
        name: 'Infosys Limited',
        quantity: 100,
        avgCost: 1800,
        currentPrice: 2010.75,
        marketValue: 201075,
        gainLoss: 21075,
        gainLossPerc: 11.71,
        sector: 'Technology',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        quantity: 75,
        avgCost: 3200,
        currentPrice: 3450.25,
        marketValue: 258768.8,
        gainLoss: 18768.75,
        gainLossPerc: 7.82,
        sector: 'Technology',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Limited',
        quantity: 80,
        avgCost: 1650,
        currentPrice: 1580.3,
        marketValue: 126424,
        gainLoss: -5576,
        gainLossPerc: -4.22,
        sector: 'Banking',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Limited',
        quantity: 60,
        avgCost: 1100,
        currentPrice: 1235.8,
        marketValue: 74148,
        gainLoss: 8148,
        gainLossPerc: 12.34,
        sector: 'Banking',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'BHARTIARTL',
        name: 'Bharti Airtel Limited',
        quantity: 120,
        avgCost: 850,
        currentPrice: 920.45,
        marketValue: 110454,
        gainLoss: 8454,
        gainLossPerc: 8.28,
        sector: 'Telecommunications',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'ITC',
        name: 'ITC Limited',
        quantity: 200,
        avgCost: 420,
        currentPrice: 465.2,
        marketValue: 93040,
        gainLoss: 9040,
        gainLossPerc: 10.76,
        sector: 'Consumer Goods',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'BAJFINANCE',
        name: 'Bajaj Finance Limited',
        quantity: 25,
        avgCost: 6800,
        currentPrice: 7150.6,
        marketValue: 178765,
        gainLoss: 8765,
        gainLossPerc: 5.15,
        sector: 'Financial Services',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'ASIANPAINT',
        name: 'Asian Paints Limited',
        quantity: 40,
        avgCost: 3100,
        currentPrice: 2890.75,
        marketValue: 115630,
        gainLoss: -8370,
        gainLossPerc: -6.75,
        sector: 'Consumer Discretionary',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'MARUTI',
        name: 'Maruti Suzuki India Limited',
        quantity: 30,
        avgCost: 9500,
        currentPrice: 10250.3,
        marketValue: 307509,
        gainLoss: 22509,
        gainLossPerc: 7.9,
        sector: 'Automotive',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'WIPRO',
        name: 'Wipro Limited',
        quantity: 150,
        avgCost: 450,
        currentPrice: 485.6,
        marketValue: 72840,
        gainLoss: 5340,
        gainLossPerc: 7.91,
        sector: 'Technology',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Limited',
        quantity: 100,
        avgCost: 650,
        currentPrice: 720.85,
        marketValue: 72085,
        gainLoss: 7085,
        gainLossPerc: 10.9,
        sector: 'Automotive',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'TECHM',
        name: 'Tech Mahindra Limited',
        quantity: 80,
        avgCost: 1200,
        currentPrice: 1145.25,
        marketValue: 91620,
        gainLoss: -4380,
        gainLossPerc: -4.56,
        sector: 'Technology',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'AXISBANK',
        name: 'Axis Bank Limited',
        quantity: 90,
        avgCost: 980,
        currentPrice: 1055.4,
        marketValue: 94986,
        gainLoss: 6786,
        gainLossPerc: 7.69,
        sector: 'Banking',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'SUNPHARMA',
        name: 'Sun Pharmaceutical Industries',
        quantity: 60,
        avgCost: 1150,
        currentPrice: 1245.3,
        marketValue: 74718,
        gainLoss: 5718,
        gainLossPerc: 8.29,
        sector: 'Healthcare',
      },
      // Add a few holdings for the second portfolio
      {
        portfolioId: portfolio2.id,
        symbol: 'DMART',
        name: 'Avenue Supermarts',
        quantity: 20,
        avgCost: 3500,
        currentPrice: 4100,
        marketValue: 82000,
        gainLoss: 12000,
        gainLossPerc: 17.14,
        sector: 'Consumer Goods',
      },
      {
        portfolioId: portfolio2.id,
        symbol: 'HCLTECH',
        name: 'HCL Technologies',
        quantity: 40,
        avgCost: 1100,
        currentPrice: 1380,
        marketValue: 55200,
        gainLoss: 11200,
        gainLossPerc: 25.45,
        sector: 'Technology',
      },
      {
        portfolioId: portfolio2.id,
        symbol: 'LT',
        name: 'Larsen & Toubro',
        quantity: 15,
        avgCost: 2500,
        currentPrice: 3200,
        marketValue: 48000,
        gainLoss: 10500,
        gainLossPerc: 28.0,
        sector: 'Engineering',
      },
    ],
    skipDuplicates: true,
  });

  // Seed MarketData
  await prisma.marketData.createMany({
    data: [
      { symbol: 'RELIANCE', name: 'Reliance Industries Limited', price: 2680.5, change: 30.5, changePerc: 1.15, volume: 1200000, marketCap: 1800000000000, sector: 'Energy' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 2010.75, change: 15.75, changePerc: 0.79, volume: 900000, marketCap: 850000000000, sector: 'Technology' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3450.25, change: 25.25, changePerc: 0.74, volume: 800000, marketCap: 1200000000000, sector: 'Technology' },
      { symbol: 'DMART', name: 'Avenue Supermarts', price: 4100, change: 50, changePerc: 1.23, volume: 300000, marketCap: 320000000000, sector: 'Consumer Goods' },
      { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1380, change: 20, changePerc: 1.47, volume: 400000, marketCap: 350000000000, sector: 'Technology' },
      { symbol: 'LT', name: 'Larsen & Toubro', price: 3200, change: 40, changePerc: 1.27, volume: 250000, marketCap: 450000000000, sector: 'Engineering' },
    ],
    skipDuplicates: true,
  });

  // Seed PriceHistory for a few holdings
  const holding = await prisma.holding.findFirst({ where: { symbol: 'RELIANCE', portfolioId: portfolio.id } });
  if (holding) {
    await prisma.priceHistory.createMany({
      data: [
        { holdingId: holding.id, price: 2500, date: new Date('2025-07-01') },
        { holdingId: holding.id, price: 2600, date: new Date('2025-07-15') },
        { holdingId: holding.id, price: 2680.5, date: new Date('2025-08-01') },
      ]
    });
  }
  const holding2 = await prisma.holding.findFirst({ where: { symbol: 'INFY', portfolioId: portfolio.id } });
  if (holding2) {
    await prisma.priceHistory.createMany({
      data: [
        { holdingId: holding2.id, price: 1800, date: new Date('2025-07-01') },
        { holdingId: holding2.id, price: 1950, date: new Date('2025-07-15') },
        { holdingId: holding2.id, price: 2010.75, date: new Date('2025-08-01') },
      ]
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
