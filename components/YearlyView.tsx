
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AppData, MonthName, AppSettings } from '../types';
import { MONTHS } from '../constants';
import { calculateDailyStats, formatCurrency } from '../utils';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';

interface Props {
  data: AppData;
  settings: AppSettings;
}

const YearlyView: React.FC<Props> = ({ data, settings }) => {
  const annualSummary = useMemo(() => {
    return MONTHS.map(month => {
      const monthData = data[month];
      let totalRec = 0, totalExp = 0, totalLiq = 0, totalPass = 0;
      
      monthData.forEach(d => {
        const stats = calculateDailyStats(d, settings);
        totalRec += stats.receitaBruta;
        totalExp += stats.despesas;
        totalLiq += stats.lucroLiquido;
        totalPass += stats.passageiros;
      });

      return {
        month,
        Receita: totalRec,
        Despesa: totalExp,
        Lucro: totalLiq,
        Passageiros: totalPass
      };
    });
  }, [data, settings]);

  const yearTotals = useMemo(() => {
    return annualSummary.reduce((acc, curr) => ({
      rec: acc.rec + curr.Receita,
      exp: acc.exp + curr.Despesa,
      liq: acc.liq + curr.Lucro,
      pass: acc.pass + curr.Passageiros
    }), { rec: 0, exp: 0, liq: 0, pass: 0 });
  }, [annualSummary]);

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Lucro Total Anual" value={formatCurrency(yearTotals.liq)} icon={<Award className="text-amber-400" />} desc="2026 Acumuladoasdasd" />
        <SummaryCard label="Média Mensal" value={formatCurrency(yearTotals.liq / 12)} icon={<Target className="text-emerald-400" />} desc="Performance estimada" />
        <SummaryCard label="Fluxo Total Bruto" value={formatCurrency(yearTotals.rec)} icon={<TrendingUp className="text-blue-400" />} desc="Entradas processadas" />
      </div>

      <div className="bg-slate-800 border border-slate-700 p-8 rounded-[40px] shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <Calendar className="text-blue-400" size={24} />
          <h3 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic">Visão Geral 2026</h3>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={annualSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 9, fontWeight: 900}} axisLine={false} />
              <YAxis stroke="#64748b" tick={{fontSize: 9, fontWeight: 900}} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
              <Tooltip 
                cursor={{fill: '#334155', opacity: 0.2}}
                contentStyle={{backgroundColor: '#1e293b', borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}}
                formatter={(val: number) => formatCurrency(val)}
              />
              <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold'}} />
              <Bar dataKey="Receita" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Entradas" />
              <Bar dataKey="Lucro" fill="#10B981" radius={[6, 6, 0, 0]} name="Lucro Líquido" />
              <Bar dataKey="Despesa" fill="#EF4444" radius={[6, 6, 0, 0]} name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, desc }: { label: string, value: string, icon: React.ReactNode, desc: string }) => (
  <div className="bg-slate-800 border border-slate-700 p-6 rounded-[32px] relative overflow-hidden group shadow-lg">
    <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:scale-150 transition-transform duration-700">
      {React.cloneElement(icon as React.ReactElement, { size: 120 })}
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-900 rounded-xl shadow-inner">{icon}</div>
      <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="text-3xl font-black text-slate-100 tracking-tighter mb-1">{value}</div>
    <div className="text-[10px] text-slate-500 font-medium uppercase italic">{desc}</div>
  </div>
);

export default YearlyView;
