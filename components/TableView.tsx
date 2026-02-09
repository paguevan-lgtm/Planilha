import React, { useState } from 'react';
import { DayData, MonthName, AppSettings } from '../types';
import { calculateDailyStats, formatCurrency } from '../utils';
import { Save, MessageSquare, ChevronRight } from 'lucide-react';

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
                <th className="px-3 py-5 text-center bg-blue-900/10 border-b border-slate-700">{settings.labels.subida}</th>
                <th className="px-3 py-5 text-center bg-blue-900/10 border-b border-slate-700">{settings.labels.descida}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pedagio1}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pedagio2}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.gasolina}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.prancheta}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.lanche}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pagPassageiro}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.pagVagas}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.transbordo}</th>
                <th className="px-3 py-5 text-center bg-red-900/10 border-b border-slate-700">{settings.labels.adicional}</th>
                <th className="px-3 py-5 text-center border-b border-slate-700">Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.map((day, idx) => {
                const stats = calculateDailyStats(day, settings);
                const isActive = stats.receitaBruta > 0 || stats.despesas > 0;
                return (
                  <tr key={idx} className={`hover:bg-slate-700/30 transition-colors ${isActive ? 'bg-slate-800/40' : 'bg-transparent opacity-60'}`}>
                    <td className="px-3 py-4 text-center font-black text-slate-500 sticky left-0 z-10 bg-slate-800 border-r border-slate-700/50">{day.dia}</td>
                    <td className="px-2 py-2">
                      <input 
                        type="number" 
                        value={day.subida || ''} 
                        onChange={e => onUpdate(monthName, idx, 'subida', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-blue-400 focus:border-blue-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number" 
                        value={day.descida || ''} 
                        onChange={e => onUpdate(monthName, idx, 'descida', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-blue-400 focus:border-blue-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number" 
                        value={day.pedagio1 || ''} 
                        onChange={e => onUpdate(monthName, idx, 'pedagio1', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number" 
                        value={day.pedagio2 || ''} 
                        onChange={e => onUpdate(monthName, idx, 'pedagio2', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number" 
                        value={day.gasolina || ''} 
                        onChange={e => onUpdate(monthName, idx, 'gasolina', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number" 
                        value={day.prancheta || ''} 
                        onChange={e => onUpdate(monthName, idx, 'prancheta', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number" 
                        value={day.lanche || ''} 
                        onChange={e => onUpdate(monthName, idx, 'lanche', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={day.pagPassageiro || ''}
                        onChange={e => onUpdate(monthName, idx, 'pagPassageiro', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={day.pagVagas || ''}
                        onChange={e => onUpdate(monthName, idx, 'pagVagas', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={day.transbordo || ''}
                        onChange={e => onUpdate(monthName, idx, 'transbordo', Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-red-400 focus:border-red-500 outline-none transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="relative group">
                        <input 
                          type="number" 
                          value={day.adicional || ''} 
                          onChange={e => onUpdate(monthName, idx, 'adicional', Number(e.target.value))}
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-center font-bold text-amber-400 focus:border-amber-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => handleComment(idx, day.adicionalComment || "")}
                          className={`absolute -right-1 -top-1 p-1 rounded-full ${day.adicionalComment ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-500 opacity-0 group-hover:opacity-100'} transition-all`}
                        >
                          <MessageSquare size={8} />
                        </button>
                      </div>
                    </td>
                    <td className={`px-3 py-4 text-center font-black tracking-tighter ${stats.lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(stats.lucroLiquido)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW: CARDS --- */}
      <div className="md:hidden space-y-3">
        {data.map((day, idx) => {
          const stats = calculateDailyStats(day, settings);
          const isExpanded = editingIdx === idx;
          const isActive = stats.receitaBruta > 0 || stats.despesas > 0;

          return (
            <div 
              key={idx} 
              className={`bg-slate-800 border rounded-2xl transition-all duration-300 ${
                isActive ? 'border-slate-700' : 'border-slate-800 opacity-50'
              } ${isExpanded ? 'ring-2 ring-blue-500 shadow-2xl' : ''}`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setEditingIdx(isExpanded ? null : idx)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-700">
                    {day.dia}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo Diário</div>
                    <div className={`text-lg font-black tracking-tighter ${stats.lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(stats.lucroLiquido)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {day.adicionalComment && <MessageSquare size={14} className="text-amber-500" />}
                  <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-90 bg-blue-600/20 text-blue-400' : 'text-slate-600'}`}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-700/50 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <MobileInput label={settings.labels.subida} value={day.subida} onChange={v => onUpdate(monthName, idx, 'subida', v)} color="text-blue-400" />
                    <MobileInput label={settings.labels.descida} value={day.descida} onChange={v => onUpdate(monthName, idx, 'descida', v)} color="text-blue-400" />
                    <MobileInput label={settings.labels.pedagio1} value={day.pedagio1} onChange={v => onUpdate(monthName, idx, 'pedagio1', v)} color="text-red-400" />
                    <MobileInput label={settings.labels.pedagio2} value={day.pedagio2} onChange={v => onUpdate(monthName, idx, 'pedagio2', v)} color="text-red-400" />
                    <MobileInput label={settings.labels.gasolina} value={day.gasolina} onChange={v => onUpdate(monthName, idx, 'gasolina', v)} color="text-red-400" />
                    <MobileInput label={settings.labels.prancheta} value={day.prancheta} onChange={v => onUpdate(monthName, idx, 'prancheta', v)} color="text-red-400" />
                    <MobileInput label={settings.labels.lanche} value={day.lanche} onChange={v => onUpdate(monthName, idx, 'lanche', v)} color="text-red-400" />
                    <MobileInput label={settings.labels.pagPassageiro} value={day.pagPassageiro} onChange={v => onUpdate(monthName, idx, 'pagPassageiro', v)} color="text-red-400" />
                    <MobileInput label={settings.labels.pagVagas} value={day.pagVagas} onChange={v => onUpdate(monthName, idx, 'pagVagas', v)} color="text-red-400" />
                    <MobileInput label={settings.labels.transbordo} value={day.transbordo} onChange={v => onUpdate(monthName, idx, 'transbordo', v)} color="text-red-400" />
                    <div className="col-span-2">
                      <MobileInput label={settings.labels.adicional} value={day.adicional} onChange={v => onUpdate(monthName, idx, 'adicional', v)} color="text-amber-400" hasComment onCommentClick={() => handleComment(idx, day.adicionalComment || "")} commentActive={!!day.adicionalComment} />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-slate-950/50 rounded-xl border border-slate-700/50 flex justify-between items-center">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ganhos: {stats.passageiros} pass.</div>
                    <div className="text-xs font-black text-slate-300">Taxa: {formatCurrency(stats.appliedRate)}</div>
                  </div>
                  
                  <button 
                    onClick={() => setEditingIdx(null)}
                    className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-600/20"
                  >
                    Confirmar Lançamento
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MobileInput = ({ label, value, onChange, color, hasComment, onCommentClick, commentActive }: { 
  label: string, 
  value: number, 
  onChange: (v: number) => void, 
  color: string,
  hasComment?: boolean,
  onCommentClick?: () => void,
  commentActive?: boolean
}) => (
  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-700/50 relative">
    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</label>
    <div className="flex items-center gap-1">
      <input 
        type="number" 
        value={value || ''} 
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full bg-transparent outline-none font-black text-sm ${color}`}
      />
      {hasComment && (
        <button 
          onClick={onCommentClick}
          className={`p-1.5 rounded-lg transition-all ${commentActive ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-500'}`}
        >
          <MessageSquare size={12} />
        </button>
      )}
    </div>
  </div>
);

export default TableView;
