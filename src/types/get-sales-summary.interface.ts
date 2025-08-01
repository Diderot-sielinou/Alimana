export interface GetRevenueSummary {
  revenue_today: number;
  revenue_yesterday: number;
  percentage_change: number;
}

export interface GetSalesSummary {
  units_today: number;
  units_yesterday: number;
  percentage_change: number;
}

export interface GetProfitSummary {
  profit_today: number;
  profit_yesterday: number;
  percentage_change: number;
}

export interface GetSalesOverview {
  day: Date; // The day of the sale (time truncated to midnight)
  revenue: string; // Total revenue for that day (as string, will need parsing)
  profit: string; // Total profit for that day (as string, will need parsing)
}
