
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { DayData, MonthName, AppSettings } from '../types';
import { calculateDailyStats, formatCurrency } from '../utils';
import { COLORS } from '../constants';
import { AlertCircle, TrendingUp, Wallet, PieChart as PieIcon } from 'lucide-react';

interface Props {
  data: DayData[];
  monthName: MonthName;
  settings: AppSettings;
}

const DashboardView: React.FC<Props> = ({ data, monthName, settings }) => {
  const chartData = useMemo(() => {
    return data.map(d => {
      const stats = calculateDailyStats(d, settings);
      return {
        name: d.dia,
        Receita: stats.receitaBruta,
        Despesa: stats.despesas,
        Lucro: stats.lucroLiquido,
        Passageiros: stats.passageiros
      };
    }).filter(d => d.Receita > 0 || d.Despesa > 0);
  }, [data, settings]);

  const expenseBreakdown = useMemo(() => {
    let comb = 0, ped = 0, staff = 0, others = 0;
    data.forEach(d => {
      comb += Number(d.gasolina) || 0;
      ped += (Number(d.pedagio1) || 0) + (Number(d.pedagio2) || 0);
      staff += (Number(d.lanche) || 0) + (Number(d.prancheta) || 0);
      others += (Number(d.transbordo) || 0) + (Number(d.adicional) < 0 ? Math.abs(Number(d.adicional)) : 0);
    });
    return [
      { name: settings.labels.gasolina || 'Combustível', value: comb, color: COLORS.danger },
      { name: 'Pedágios', value: ped, color: COLORS.warning },
      { name: 'Pessoal', value: staff, color: COLORS.primary },
      { name: 'Extras', value: others, color: COLORS.info },
    ].filter(v => v.value > 0);
  }, [data, settings]);

  const totalExpense = expenseBreakdown.reduce((acc, curr) => acc + curr.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-slate-800/50 border border-dashed border-slate-700 rounded-3xl text-slate-500">
        <AlertCircle size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Nenhum dado lançado em {monthName}</p>
        <p className="text-sm">Vá para a aba "Lançamentos" para inserir dados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Financial Evolution Area Chart */}
      <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h3 className="text-lg font-black text-slate-100 uppercase tracking-tighter flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" />
            Performance Financeira - {monthName}
          </h3>
          <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Receita</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Lucro</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Despesa</div>
          </div>
        </div>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLuc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
              <YAxis stroke="#64748b" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} tickFormatter={(val) => `R$${val}`} />
              <Tooltip 
                contentStyle={{backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'}}
                itemStyle={{fontSize: '11px', fontWeight: 'bold'}}
                labelStyle={{color: '#94a3b8', marginBottom: '6px', fontWeight: 'black', textTransform: 'uppercase'}}
                formatter={(val: number) => formatCurrency(val)}
              />
              <Area type="monotone" dataKey="Receita" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorRec)" />
              <Area type="monotone" dataKey="Lucro" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorLuc)" />
              <Area type="monotone" dataKey="Despesa" stroke="#EF4444" strokeWidth={2} fill="none" strokeDasharray="6 6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Distribution Pie Chart */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl flex flex-col shadow-lg">
        <h3 className="text-lg font-black text-slate-100 uppercase tracking-tighter flex items-center gap-2 mb-8">
          <PieIcon size={20} className="text-amber-400" />
          Distribuição de Custos
        </h3>
        
        <div className="flex-1 min-h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: number) => formatCurrency(val)}
                contentStyle={{backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155'}}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Gasto</span>
            <span className="text-2xl font-black text-slate-100 tracking-tighter">{formatCurrency(totalExpense)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {expenseBreakdown.map((item) => (
            <div key={item.name} className="flex flex-col p-2 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{item.name}</span>
              </div>
              <div className="text-xs font-black text-slate-200">{formatCurrency(item.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Volume Summary - Bar Chart */}
      <div className="lg:col-span-3 bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-lg">
        <h3 className="text-lg font-black text-slate-100 uppercase tracking-tighter flex items-center gap-2 mb-8">
          <Wallet size={20} className="text-cyan-400" />
          Métrica de Volume (Passageiros {settings.labels.subida}/{settings.labels.descida})
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
              <YAxis stroke="#64748b" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155'}}
                cursor={{fill: '#334155', opacity: 0.4}}
              />
              <Bar dataKey="Passageiros" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
