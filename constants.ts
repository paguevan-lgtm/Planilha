
import { MonthName, DayData, AppSettings } from './types';

export const MONTHS: MonthName[] = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const EMPTY_DAY_DATA: Omit<DayData, 'dia'> = {
  subida: 0,
  descida: 0,
  pedagio1: 0,
  pedagio2: 0,
  gasolina: 0,
  prancheta: 0,
  pagPassageiro: 0,
  lanche: 0,
  pagVagas: 0,
  transbordo: 0,
  adicional: 0,
  adicionalComment: ''
};

export const DEFAULT_SETTINGS: AppSettings = {
  passengerValue: 50,
  labels: {
    subida: 'Subida',
    descida: 'Descida',
    pedagio1: 'Ped. 1',
    pedagio2: 'Ped. 2',
    gasolina: 'Gaso.',
    prancheta: 'Pran.',
    pagPassageiro: 'Pg. Pass.',
    lanche: 'Lanche',
    pagVagas: 'Pg. Vagas',
    transbordo: 'Transb.',
    adicional: 'Adic.',
    total: 'Total'
  }
};

export const COLORS = {
  success: '#10B981',
  danger: '#EF4444',
  primary: '#3B82F6',
  warning: '#F59E0B',
  info: '#06B6D4'
};
