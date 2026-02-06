
import React, { useState } from 'react';
import { DayData, MonthName, AppSettings } from '../types';
import { calculateDailyStats, formatCurrency } from '../utils';
import { Save, MessageSquare, Info, Edit3, X, ChevronRight } from 'lucide-react';

interface Props {
  data: DayData[];
  monthName: MonthName;
  onUpdate: (month: MonthName, dayIndex: number, field: string, value: any) => void;
  settings: AppSettings;
}

const TableView: React.FC<Props> = ({ data, monthName, onUpdate, settings }) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleComment = (idx: number, currentText: string) => {
    const comment = prompt("Insira o comentário para este adicional:", currentText || "");
    if (comment !== null) {
      onUpdate(monthName, idx, 'adicionalComment', comment);
    }
  };

  const editingDay = editingIdx !== null ? data[editingIdx] : null;
  const editingStats = editingDay ? calculateDailyStats(editingDay, settings) : null;

  return (
    <div className="space-y-4">
      {/* --- DESKTOP VIEW: TABELA --- */}
      <div className="hidden md:block bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-300">
        <div className="p-5 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-slate-100 uppercase tracking-tighter">Planilha de Lançamentos</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">{monthName} 2026</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter shadow-inner">
            <Save size={12} className="text-blue-500" /> Auto-Save Ativo
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-20 bg-slate-900 text-slate-400 font-black uppercase tracking-[0.1em] text-[10px]">
              <tr>
                <th className="px-3 py-5 text-center sticky left-0 z-30 bg-slate-900 border-b border-slate-700">Dia</th>
                <th className="px-3 py-5 text-center bg-blue-900/10 border-b border-slate-700">
                  {settings.labels.subida} <span className="block text-[8px] text-blue-400">(R${settings.passengerValue})</span>
                </th>
                <th className="px-3 py-5 text-center bg-blue-900/10 border-b border-slate-700">
                  {settings.labels.descida} <span className="block text-[8px] text-blue-400">(R${settings.passengerValue})</span>
                </th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pedagio1}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pedagio2}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.gasolina}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.prancheta}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pagPassageiro}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.lanche}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pagVagas}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.transbordo}</th>
                <th className="px-3 py-5 text-center bg-amber-900/10 border-b border-slate-700">{settings.labels.adicional}</th>
                <th className="px-3 py-5 text-center bg-slate-900 border-b border-slate-700">{settings.labels.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.map((day, idx) => {
                const stats = calculateDailyStats(day, settings);
                const hasData = stats.receitaBruta !== 0 || stats.despesas !== 0 || (Number(day.adicional) || 0) !== 0;
                
                return (
                  <tr key={idx} className={`group hover:bg-slate-700/30 transition-colors ${hasData ? 'bg-slate-800/40' : ''}`}>
                    <td className="px-3 py-2 text-center font-black text-slate-500 bg-slate-900/20 group-hover:text-blue-400 transition-colors sticky left-0 z-10 backdrop-blur-sm">
                      {day.dia}
                    </td>
                    <InputCell value={day.subida} onChange={v => onUpdate(monthName, idx, 'subida', v)} />
                    <InputCell value={day.descida} onChange={v => onUpdate(monthName, idx, 'descida', v)} />
                    <InputCell value={day.pedagio1} onChange={v => onUpdate(monthName, idx, 'pedagio1', v)} color="text-red-400" />
                    <InputCell value={day.pedagio2} onChange={v => onUpdate(monthName, idx, 'pedagio2', v)} color="text-red-400" />
                    <InputCell value={day.gasolina} onChange={v => onUpdate(monthName, idx, 'gasolina', v)} color="text-red-400" />
                    <InputCell value={day.prancheta} onChange={v => onUpdate(monthName, idx, 'prancheta', v)} color="text-red-400" />
                    <InputCell value={day.pagPassageiro} onChange={v => onUpdate(monthName, idx, 'pagPassageiro', v)} color="text-red-400" />
                    <InputCell value={day.lanche} onChange={v => onUpdate(monthName, idx, 'lanche', v)} color="text-red-400" />
                    <InputCell value={day.pagVagas} onChange={v => onUpdate(monthName, idx, 'pagVagas', v)} color="text-red-400" />
                    <InputCell value={day.transbordo} onChange={v => onUpdate(monthName, idx, 'transbordo', v)} color="text-red-400" />
                    
                    <td className="p-0 border-r border-slate-700/20 relative group/adic">
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={day.adicional || ''}
                          placeholder="0"
                          onChange={e => onUpdate(monthName, idx, 'adicional', Number(e.target.value))}
                          className="w-full h-full bg-transparent px-2 py-3 text-center outline-none focus:bg-slate-700/50 transition-all text-amber-400 font-bold"
                        />
                        <button 
                          onClick={() => handleComment(idx, day.adicionalComment || "")}
                          className={`absolute right-1 p-1 rounded-md transition-all ${day.adicionalComment ? 'text-amber-500 bg-amber-500/10' : 'text-slate-600 opacity-0 group-hover/adic:opacity-100 hover:text-amber-400'}`}
                        >
                          <MessageSquare size={12} />
                          {day.adicionalComment && (
                             <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 text-slate-100 text-[10px] p-2 rounded-lg border border-slate-700 shadow-2xl invisible group-hover/adic:visible z-50 pointer-events-none normal-case font-medium">
                                <Info size={10} className="inline mr-1 text-amber-500" />
                                {day.adicionalComment}
                             </div>
                          )}
                        </button>
                      </div>
                    </td>

                    <td className={`px-4 py-2 text-right font-black border-l border-slate-700/50 ${stats.lucroLiquido >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {hasData ? formatCurrency(stats.lucroLiquido) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW: CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {data.map((day, idx) => {
          const stats = calculateDailyStats(day, settings);
          const hasData = stats.receitaBruta !== 0 || stats.despesas !== 0 || (Number(day.adicional) || 0) !== 0;

          return (
            <button
              key={idx}
              onClick={() => setEditingIdx(idx)}
              className={`flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-2xl active:scale-[0.98] transition-all text-left ${hasData ? 'border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-blue-400">
                  {day.dia}
                </div>
                <div>
                  <h4 className="text-slate-100 text-sm font-bold uppercase tracking-tighter">Dia {day.dia}</h4>
                  <p className={`text-[10px] font-black uppercase ${stats.lucroLiquido >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {hasData ? formatCurrency(stats.lucroLiquido) : 'Sem Lançamento'}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          );
        })}
      </div>

      {/* --- MOBILE MODAL: FORMULÁRIO --- */}
      {editingIdx !== null && editingDay && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingIdx(null)} />
          
          <div className="relative w-full max-w-lg bg-slate-900 sm:rounded-[32px] rounded-t-[32px] shadow-2xl overflow-hidden border-t border-slate-700 sm:border flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic">Lançamento Dia {editingDay.dia}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{monthName} 2026</p>
              </div>
              <button 
                onClick={() => setEditingIdx(null)}
                className="p-2 bg-slate-800 text-slate-400 rounded-full hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Form */}
            <div className="p-6 overflow-y-auto space-y-8 no-scrollbar pb-12">
              
              {/* Resumo Instantâneo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                   <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Resultado Atual</p>
                   <p className={`text-xl font-black ${editingStats!.lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                     {formatCurrency(editingStats!.lucroLiquido)}
                   </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                   <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Passageiros</p>
                   <p className="text-xl font-black text-blue-400">
                     {editingStats!.passageiros}
                   </p>
                </div>
              </div>

              {/* Seção: Passageiros */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1 h-4 bg-blue-500 rounded-full" />
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Movimentação</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MobileInput label={settings.labels.subida} value={editingDay.subida} onChange={v => onUpdate(monthName, editingIdx, 'subida', v)} icon="↑" />
                  <MobileInput label={settings.labels.descida} value={editingDay.descida} onChange={v => onUpdate(monthName, editingIdx, 'descida', v)} icon="↓" />
                </div>
              </div>

              {/* Seção: Custos Variáveis */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1 h-4 bg-red-500 rounded-full" />
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Custos de Viagem</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MobileInput label={settings.labels.pedagio1} value={editingDay.pedagio1} onChange={v => onUpdate(monthName, editingIdx, 'pedagio1', v)} color="border-red-500/30" />
                  <MobileInput label={settings.labels.pedagio2} value={editingDay.pedagio2} onChange={v => onUpdate(monthName, editingIdx, 'pedagio2', v)} color="border-red-500/30" />
                  <MobileInput label={settings.labels.gasolina} value={editingDay.gasolina} onChange={v => onUpdate(monthName, editingIdx, 'gasolina', v)} color="border-red-500/30" />
                  <MobileInput label={settings.labels.transbordo} value={editingDay.transbordo} onChange={v => onUpdate(monthName, editingIdx, 'transbordo', v)} color="border-red-500/30" />
                </div>
              </div>

              {/* Seção: Administrativo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1 h-4 bg-amber-500 rounded-full" />
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrativo</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MobileInput label={settings.labels.prancheta} value={editingDay.prancheta} onChange={v => onUpdate(monthName, editingIdx, 'prancheta', v)} />
                  <MobileInput label={settings.labels.lanche} value={editingDay.lanche} onChange={v => onUpdate(monthName, editingIdx, 'lanche', v)} />
                  <MobileInput label={settings.labels.pagPassageiro} value={editingDay.pagPassageiro} onChange={v => onUpdate(monthName, editingIdx, 'pagPassageiro', v)} />
                  <MobileInput label={settings.labels.pagVagas} value={editingDay.pagVagas} onChange={v => onUpdate(monthName, editingIdx, 'pagVagas', v)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{settings.labels.adicional}</label>
                   <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={editingDay.adicional || ''} 
                        onChange={e => onUpdate(monthName, editingIdx, 'adicional', Number(e.target.value))}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-4 text-amber-400 font-bold outline-none focus:ring-2 focus:ring-amber-500/50" 
                      />
                      <button 
                        onClick={() => handleComment(editingIdx, editingDay.adicionalComment || "")}
                        className={`p-4 rounded-2xl border transition-all ${editingDay.adicionalComment ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                      >
                        <MessageSquare size={20} />
                      </button>
                   </div>
                   {editingDay.adicionalComment && (
                     <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200 italic">
                        "{editingDay.adicionalComment}"
                     </div>
                   )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-end">
               <button 
                 onClick={() => setEditingIdx(null)}
                 className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
               >
                 Confirmar e Salvar
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileInput = ({ label, value, onChange, icon, color = "border-slate-700" }: { label: string, value: number, onChange: (v: number) => void, icon?: string, color?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate block">{label}</label>
    <div className={`relative flex items-center bg-slate-800 border ${color} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all`}>
      {icon && <span className="pl-4 text-blue-400 font-bold">{icon}</span>}
      <input 
        type="number" 
        value={value || ''}
        placeholder="0"
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-transparent px-4 py-4 text-slate-100 font-bold outline-none text-center"
      />
    </div>
  </div>
);

const InputCell = ({ value, onChange, color = "text-slate-300" }: { value: number, onChange: (v: number) => void, color?: string }) => (
  <td className="p-0 border-r border-slate-700/20">
    <input
      type="number"
      value={value || ''}
      placeholder="0"
      onChange={e => onChange(Number(e.target.value))}
      className={`w-full h-full bg-transparent px-2 py-3 text-center outline-none focus:bg-slate-700/50 transition-all ${color}`}
    />
  </td>
);

export default TableView;
