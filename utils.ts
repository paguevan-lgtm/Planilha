
import { DayData, CalculatedStats, AppSettings } from './types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const calculateDailyStats = (day: DayData, settings: AppSettings): CalculatedStats => {
  // Prioriza o valor salvo no dia. Se não houver (ex: legado), usa o valor atual dos ajustes.
  const appliedRate = (day.rate && day.rate > 0) ? day.rate : settings.passengerValue;
  
  // Receita Base: Cada passageiro (subida ou descida) vale o valor aplicado
  const passageirosTotal = (Number(day.subida) || 0) + (Number(day.descida) || 0);
  const receitaBase = passageirosTotal * appliedRate;

  // Deduções (Todos estes diminuem o total)
  const custosFixos = 
    (Number(day.pedagio1) || 0) + 
    (Number(day.pedagio2) || 0) + 
    (Number(day.gasolina) || 0) + 
    (Number(day.prancheta) || 0) + 
    (Number(day.pagPassageiro) || 0) +
    (Number(day.lanche) || 0) + 
    (Number(day.pagVagas) || 0) +
    (Number(day.transbordo) || 0);
  
  const adicional = Number(day.adicional) || 0;
  
  // Total = Receita Base - Deduções + Adicional
  const lucroLiquido = receitaBase - custosFixos + adicional;

  // Para fins de exibição em gráficos
  const receitaBrutaGrafico = receitaBase + (adicional > 0 ? adicional : 0);
  const despesasTotaisGrafico = custosFixos + (adicional < 0 ? Math.abs(adicional) : 0);

  return {
    receitaBruta: receitaBrutaGrafico,
    despesas: despesasTotaisGrafico,
    lucroLiquido,
    passageiros: passageirosTotal,
    appliedRate
  };
};
