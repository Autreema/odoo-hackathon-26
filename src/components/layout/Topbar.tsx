import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

export const Topbar: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-850 bg-slate-900/20 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          API Online
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button 
          type="button" 
          className="p-1.5 text-slate-400 hover:text-slate-200 transition"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-850">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-200">Reema (Demo)</span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3 h-3 text-brand-400" />
              Fleet Manager
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-semibold text-xs">
            RM
          </div>
        </div>
      </div>
    </header>
  );
};
export default Topbar;
