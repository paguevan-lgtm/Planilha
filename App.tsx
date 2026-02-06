
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Table as TableIcon, 
  Calendar, 
  Download, 
  Upload, 
  RefreshCw, 
  Truck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Settings as SettingsIcon
} from 'lucide-react';
import { AppData, MonthName, ViewType, AppSettings, DayData } from './types';
import { MONTHS, EMPTY_DAY_DATA, DEFAULT_SETTINGS } from './constants';
import { formatCurrency, formatNumber, calculateDailyStats } from './utils';
import DashboardView from './components/DashboardView';
import TableView from './components/TableView';
import YearlyView from './components/YearlyView';
import SettingsView from './components/SettingsView';

const DATA_STORAGE_KEY = 'lotacao_pro_2026_data_v1';
const SETTINGS_STORAGE_KEY = 'lotacao_pro_2026_settings_v1';

const generateInitialData = (): AppData => {
  const data: Partial<AppData> = {};
  MONTHS.forEach(m => {
    data[m] = Array.from({ length: 31 }, (_, i) => ({ ...EMPTY_DAY_DATA, dia: i + 1 }));
  });
  return data as AppData;
};

export default function App() {
  const [data, setData] = useState<AppData>(generateInitialData());
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [currentMonth, setCurrentMonth] = useState<MonthName>('Janeiro');
  const [view, setView] = useState<ViewType>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence logic - Crucial para APK
  useEffect(() => {
    const savedData = localStorage.getItem(DATA_STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    
    if (savedData) {
      try { setData(JSON.parse(savedData)); } catch (e) { console.error(e); }
    }
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [data, settings, isLoaded]);

  const handleUpdateDay = (month: MonthName, dayIndex: number, field: string, value: any) => {
    const newData = { ...data };
    const day = { ...newData[month][dayIndex] };
    (day as any)[field] = value;

    // "Carimba" o valor do passageiro atual se o dia ainda não tiver um valor fixado
    // Isso garante que se o usuário mudar o valor nos ajustes amanhã, este dia (viagem antiga)
    // manterá o valor que estava em vigor no momento do preenchimento.
    if (!day.rate || day.rate === 0) {
      day.rate = settings.passengerValue;
    }

    newData[month][dayIndex] = day;
    setData(newData);
  };

  const handleReset = () => {
    if (confirm("Deseja apagar todos os dados permanentemente? Isso não pode ser desfeito.")) {
      setData(generateInitialData());
      localStorage.removeItem(DATA_STORAGE_KEY);
    }
  };

  const exportData = () => {
    const payload = { data, settings };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lotacao_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.data) setData(json.data);
        if (json.settings) setSettings(json.settings);
        alert("Dados restaurados com sucesso!");
      } catch (err) {
        alert("Erro ao importar backup. Verifique o arquivo.");
      }
    };
    reader.readAsText(file);
  };

  const monthlyStats = useMemo(() => {
    const currentData = data[currentMonth];
    let totalReceita = 0;
    let totalDespesa = 0;
    let totalLiquido = 0;
    let totalPassageiros = 0;

    currentData.forEach(day => {
      const stats = calculateDailyStats(day, settings);
      totalReceita += stats.receitaBruta;
      totalDespesa += stats.despesas;
      totalLiquido += stats.lucroLiquido;
      totalPassageiros += stats.passageiros;
    });

    return { totalReceita, totalDespesa, totalLiquido, totalPassageiros };
  }, [data, currentMonth, settings]);

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0 safe-top">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Truck className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-none italic uppercase tracking-tighter">
                Lotação Pro
              </h1>
              <span className="hidden sm:inline text-[9px] text-slate-500 font-black tracking-widest uppercase">Gestão Operacional</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-slate-950/50 rounded-2xl p-1 border border-slate-700/50">
            <NavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={16}/>} label="Painel" />
            <NavBtn active={view === 'tabela'} onClick={() => setView('tabela')} icon={<TableIcon size={16}/>} label="Lançar" />
            <NavBtn active={view === 'anual'} onClick={() => setView('anual')} icon={<Calendar size={16}/>} label="Anual" />
            <NavBtn active={view === 'config'} onClick={() => setView('config')} icon={<SettingsIcon size={16}/>} label="Ajustes" />
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={exportData} title="Backup" className="p-2 text-slate-400 hover:text-blue-400 transition-all active:scale-90">
              <Download size={20} />
            </button>
            <label className="p-2 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer active:scale-90">
              <Upload size={20} />
              <input type="file" className="hidden" accept=".json" onChange={importData} />
            </label>
            <button onClick={handleReset} className="hidden sm:block p-2 text-slate-400 hover:text-red-400 transition-all">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Selector de Mês Compacto */}
      {view !== 'anual' && view !== 'config' && (
        <div className="bg-slate-900/50 border-b border-slate-800/50 sticky top-16 z-40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {MONTHS.map(m => (
                <button
                  key={m}
                  onClick={() => setCurrentMonth(m)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap uppercase tracking-widest transition-all border ${
                    currentMonth === m
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* KPI Grid */}
        {view !== 'anual' && view !== 'config' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <StatCard label="Líquido" value={formatCurrency(monthlyStats.totalLiquido)} icon={<DollarSign size={18} className="text-emerald-400" />} color="text-emerald-400" />
            <StatCard label="Entradas" value={formatCurrency(monthlyStats.totalReceita)} icon={<TrendingUp size={18} className="text-blue-400" />} color="text-blue-400" />
            <StatCard label="Saídas" value={formatCurrency(monthlyStats.totalDespesa)} icon={<TrendingDown size={18} className="text-red-400" />} color="text-red-400" />
            <StatCard label="Passageiros" value={formatNumber(monthlyStats.totalPassageiros)} icon={<Users size={18} className="text-amber-400" />} color="text-amber-400" />
          </div>
        )}

        <div className="min-h-[400px]">
          {view === 'dashboard' && <DashboardView data={data[currentMonth]} monthName={currentMonth} settings={settings} />}
          {view === 'tabela' && <TableView data={data[currentMonth]} monthName={currentMonth} onUpdate={handleUpdateDay} settings={settings} />}
          {view === 'anual' && <YearlyView data={data} settings={settings} />}
          {view === 'config' && <SettingsView settings={settings} onUpdate={setSettings} />}
        </div>
      </main>

      {/* Navegação Mobile Inferior - Estilo Aplicativo Nativo */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/50 px-8 py-4 flex justify-between items-center z-[100] safe-bottom shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.8)]">
        <MobileNavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={22}/>} label="Início" />
        <MobileNavBtn active={view === 'tabela'} onClick={() => setView('tabela')} icon={<TableIcon size={22}/>} label="Lançar" />
        <MobileNavBtn active={view === 'anual'} onClick={() => setView('anual')} icon={<Calendar size={22}/>} label="Anual" />
        <MobileNavBtn active={view === 'config'} onClick={() => setView('config')} icon={<SettingsIcon size={22}/>} label="Ajustes" />
      </nav>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
          : 'text-slate-500 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function MobileNavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
        active ? 'text-blue-400 scale-110' : 'text-slate-600'
      }`}
    >
      {active && <span className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full animate-ping" />}
      <div className={`p-1.5 rounded-2xl transition-all ${active ? 'bg-blue-400/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-[24px] shadow-lg shadow-black/10">
      <div className="flex justify-between items-start mb-2 opacity-60">
        <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div className={`text-sm md:text-xl font-black ${color} truncate tracking-tighter`}>
        {value}
      </div>
    </div>
  );
}
