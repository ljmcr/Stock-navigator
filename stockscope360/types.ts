export interface UserInfo {
  UserId: number;
  CurrencyName: string;
  FirstName: string;
  LastName: string;
  DisplayName: string;
  Email: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface StockTableInfo {
  IsFavorite: boolean;
  StockId: number;
  StockName: string;
  StockCompany: string;
  AvgPrice: number;
}

export interface IndustryInfo {
  Industry: string;
}

export interface NewUserArgs {
  name: string;
  email: string;
  currency?: string;
}

export interface EditFavoritesArgs {
  email: string;
  stockId: number;
  isFavorite: boolean;
}

export interface StockMetaInfo {
  Name: string;
  Company: string;
  Industry: string;
}

export interface StockDisplayInfo {
  StockId: number;
  StockName: string;
  IntervalStart: Date;
  AvgClosingPrice: number;
  AvgOpeningPrice: number;
  High: number;
  Low: number;
  TotalVolume: number;
}

export interface ChartDataPoint {
  x: string;
  y: string;
  avgOpeningPrice: string;
  High: string;
  Low: string;
  totalVolume: number;
}

export interface ChartDataSet {
  label: string;
  data: ChartDataPoint[];
  borderColor: string;
  backgroundColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}