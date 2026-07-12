import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Wrench, Wallet, BarChart3 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Truck },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Trips', path: '/trips', icon: Map, disabled: true },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, disabled: true },
    { name: 'Expenses', path: '/expenses', icon: Wallet, disabled: true },
    { name: 'Reports', path: '/reports', icon: BarChart3, disabled: true },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-850 flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-850">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-600/25">
            T
          </div>
          <span className="font-bold text-slate-100 text-lg tracking-tight">TransitOps</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-650 cursor-not-allowed text-sm group transition"
                title={`${item.name} module is locked`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
                <span className="ml-auto text-[9px] bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                  Locked
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition duration-150 ${
                isActive
                  ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:bg-slate-850/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-850 text-[10px] text-slate-500 text-center tracking-wide uppercase font-mono">
        Hackathon Build v1.0
      </div>
    </aside>
  );
};
export default Sidebar;
