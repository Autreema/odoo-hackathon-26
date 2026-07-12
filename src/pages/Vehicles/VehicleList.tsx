import React, { useEffect, useState } from 'react';
import { getVehicles, deleteVehicle } from '../../api/vehicles';
import { VehicleStatus } from '../../types';
import type { Vehicle } from '../../types';
import { VehicleForm } from './VehicleForm';
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  const fetchVehiclesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch vehicles list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesList();
  }, []);

  const handleEditClick = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setCurrentVehicle(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        fetchVehiclesList();
      } catch (err: any) {
        alert(err.response?.data?.detail || 'Failed to delete vehicle.');
      }
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.reg_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case VehicleStatus.ON_TRIP:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case VehicleStatus.IN_SHOP:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case VehicleStatus.RETIRED:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Vehicles</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your fleet units, check statuses, and register new vehicles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVehiclesList}
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
            Add Vehicle
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
            placeholder="Search by name, reg number or type..."
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
            <option value={VehicleStatus.AVAILABLE}>Available</option>
            <option value={VehicleStatus.ON_TRIP}>On Trip</option>
            <option value={VehicleStatus.IN_SHOP}>In Shop</option>
            <option value={VehicleStatus.RETIRED}>Retired</option>
          </select>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading vehicles database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-2 font-medium">{error}</p>
            <button
              onClick={fetchVehiclesList}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-lg text-sm transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="font-medium text-base mb-1">No vehicles found</p>
            <p className="text-sm text-slate-500">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your filters or search queries.'
                : 'Get started by creating your first fleet unit.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Reg Number</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Max Load</th>
                  <th className="px-6 py-4 text-right">Odometer</th>
                  <th className="px-6 py-4 text-right">Cost</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-800/25 text-slate-300 text-sm transition">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-100">
                      {vehicle.reg_number}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{vehicle.name}</td>
                    <td className="px-6 py-4 text-slate-400">{vehicle.type}</td>
                    <td className="px-6 py-4 text-right">
                      {vehicle.max_load_kg.toLocaleString()} kg
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {vehicle.odometer.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-450 font-semibold">
                      ${vehicle.acquisition_cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="p-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition"
                          title="Edit vehicle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicle.id)}
                          className="p-1.5 border border-slate-800 hover:border-red-900/50 bg-slate-950 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-md transition"
                          title="Delete vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal Component */}
      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={fetchVehiclesList}
        vehicle={currentVehicle}
      />
    </div>
  );
};
export default VehicleList;
