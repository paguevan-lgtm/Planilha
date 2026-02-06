
import React from 'react';
import { AppSettings } from '../types';
import { Settings as SettingsIcon, Save, RefreshCw, Type, DollarSign } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../constants';

interface Props {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsView: React.FC<Props> = ({ settings, onUpdate }) => {
  const updateField = (field: string, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  const updateLabel = (key: string, value: string) => {
    onUpdate({
      ...settings,
      labels: { ...settings.labels, [key]: value }
    });
  };

  const handleReset = () => {
    if (confirm("Deseja restaurar as configurações padrão?")) {
      onUpdate(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter flex items-center gap-3">
            <SettingsIcon className="text-blue-500" size={28} />
            Painel de Ajustes
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Personalize sua experiência de gestão</p>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-slate-700"
        >
          <RefreshCw size={14} /> Restaurar Padrões
        </button>
      </div>

      {/* Finance Section */}
      <section className="bg-slate-800 border border-slate-700 rounded-[32px] p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <DollarSign className="text-emerald-400" />
          <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">Valor da Operação</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Valor por Passageiro (Subida/Descida)</label>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-slate-400">R$</span>
              <input 
                type="number" 
                value={settings.passengerValue}
                onChange={e => updateField('passengerValue', Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 w-48 text-2xl font-black text-blue-400 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 text-slate-500 text-xs italic leading-relaxed">
            * Este valor é multiplicado automaticamente pela soma dos passageiros de "Subida" e "Descida" para gerar a receita base de cada dia.
          </div>
        </div>
      </section>

      {/* Labels Section */}
      <section className="bg-slate-800 border border-slate-700 rounded-[32px] p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <Type className="text-blue-400" />
          <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">Personalizar Nomes da Planilha</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(settings.labels).map(([key, value]) => (
            <div key={key}>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 opacity-60 italic">{key}</label>
              <input 
                type="text" 
                value={value}
                onChange={e => updateLabel(key, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-100 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end p-4">
        <div className="bg-blue-600/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
          <Save size={14} /> As alterações são salvas automaticamente
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
