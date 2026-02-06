
export interface DayData {
  dia: number;
  subida: number;
  descida: number;
  pedagio1: number;
  pedagio2: number;
  gasolina: number;
  prancheta: number;
  pagPassageiro: number;
  lanche: number;
  pagVagas: number;
  transbordo: number;
  adicional: number;
  adicionalComment?: string;
  rate?: number; // Valor do passageiro fixado no momento do lançamento
}

export type MonthName = 
  | 'Janeiro' | 'Fevereiro' | 'Março' | 'Abril' 
  | 'Maio' | 'Junho' | 'Julho' | 'Agosto' 
  | 'Setembro' | 'Outubro' | 'Novembro' | 'Dezembro';

export type AppData = Record<MonthName, DayData[]>;

export interface AppSettings {
  passengerValue: number;
  labels: Record<string, string>;
}

export interface CalculatedStats {
  receitaBruta: number;
  despesas: number;
  lucroLiquido: number;
  passageiros: number;
  appliedRate: number;
}

export type ViewType = 'dashboard' | 'tabela' | 'anual' | 'config';
