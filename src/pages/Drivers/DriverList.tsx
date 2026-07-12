import React, { useEffect, useState } from 'react';
import { getDrivers, deleteDriver } from '../../api/drivers';
import { DriverStatus } from '../../types';
import type { Driver } from '../../types';
import { DriverForm } from './DriverForm';
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, RefreshCw, AlertTriangle } from 'lucide-react';
import { differenceInDays, parseISO, isValid } from 'date-fns';

// --- Helpers ----------------------------------------------------------------

function getLicenseExpiryInfo(dateStr: string): {
  label: string;
  className: string;
  icon?: boolean;
} {
  if (!dateStr) return { label: '—', className: 'text-slate-400' };
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return { label: dateStr, className: 'text-slate-400' };

  const daysLeft = differenceInDays(parsed, new Date());

  if (daysLeft < 0) {
    return {
      label: `${dateStr} (Expired)`,
      className: 'text-red-400 font-semibold',
      icon: true,
    };
  }
  if (daysLeft <= 30) {
    return {
      label: `${dateStr} (${daysLeft}d left)`,
      className: 'text-amber-400 font-semibold',
      icon: true,
    };
  }
  return { label: dateStr, className: 'text-slate-300' };
}

function getStatusStyle(status: string) {
  switch (status) {
    case DriverStatus.AVAILABLE:
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case DriverStatus.ON_TRIP:
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case DriverStatus.OFF_DUTY:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    case DriverStatus.SUSPENDED:
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}

function getSafetyScoreStyle(score: number) {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-rose-400';
}

// --- Component --------------------------------------------------------------

export const DriverList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

  const fetchDriversList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch drivers list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriversList();
  }, []);

  const handleEditClick = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setCurrentDriver(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(id);
        fetchDriversList();
      } catch (err: any) {
        alert(err.response?.data?.detail || 'Failed to delete driver.');
      }
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.license_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.license_category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Drivers</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your driver roster, track license expiry, and monitor safety scores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDriversList}
            className="p-2 border border-slate-800 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-lg text-sm shadow-lg shadow-brand-600/15 transition"
          >
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, license number or category..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </span>
          <select
            className="bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value={DriverStatus.AVAILABLE}>Available</option>
            <option value={DriverStatus.ON_TRIP}>On Trip</option>
            <option value={DriverStatus.OFF_DUTY}>Off Duty</option>
            <option value={DriverStatus.SUSPENDED}>Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading drivers database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-2 font-medium">{error}</p>
            <button
              onClick={fetchDriversList}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-lg text-sm transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="font-medium text-base mb-1">No drivers found</p>
            <p className="text-sm text-slate-500">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your filters or search queries.'
                : 'Get started by adding your first driver.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">License No.</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Safety Score</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDrivers.map((driver) => {
                  const expiryInfo = getLicenseExpiryInfo(driver.license_expiry_date);
                  return (
                    <tr
                      key={driver.id}
                      className="hover:bg-slate-800/25 text-slate-300 text-sm transition"
                    >
                      <td className="px-6 py-4 font-medium text-slate-100">{driver.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-200">{driver.license_number}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 text-xs font-mono font-semibold">
                          {driver.license_category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${expiryInfo.className}`}>
                        <span className="flex items-center gap-1.5">
                          {expiryInfo.icon && (
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          )}
                          {expiryInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{driver.contact_number}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-mono font-bold text-base ${getSafetyScoreStyle(
                            driver.safety_score
                          )}`}
                        >
                          {driver.safety_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(
                            driver.status
                          )}`}
                        >
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(driver)}
                            className="p-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition"
                            title="Edit driver"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(driver.id)}
                            className="p-1.5 border border-slate-800 hover:border-red-900/50 bg-slate-950 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-md transition"
                            title="Delete driver"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <DriverForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={fetchDriversList}
        driver={currentDriver}
      />
    </div>
  );
};
export default DriverList;
