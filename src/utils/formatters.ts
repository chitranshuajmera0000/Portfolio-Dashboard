export function formatCurrency(value: number, options?: {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
}): string {
  const {
    currency = 'INR',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    locale = 'en-IN'
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
}

export function formatPercentage(value: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSign?: boolean;
}): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSign = false
  } = options || {};

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value / 100);

  if (showSign && value > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

export function formatNumber(value: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options || {};

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
}

export function formatDate(date: string | Date, options?: {
  style?: 'short' | 'medium' | 'long';
}): string {
  const { style = 'medium' } = options || {};
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formatOptions: Record<'short' | 'medium' | 'long', Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  };

  return new Intl.DateTimeFormat('en-IN', formatOptions[style]).format(dateObj);
}