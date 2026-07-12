import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VehicleStatus } from '../../types';
import type { Vehicle } from '../../types';
import { createVehicle, updateVehicle } from '../../api/vehicles';

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  vehicle?: Vehicle | null;
}

interface FormInputs {
  reg_number: string;
  name: string;
  type: string;
  max_load_kg: number;
  odometer: number;
  acquisition_cost: number;
  status: VehicleStatus;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  vehicle,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      reset({
        reg_number: vehicle.reg_number,
        name: vehicle.name,
        type: vehicle.type,
        max_load_kg: vehicle.max_load_kg,
        odometer: vehicle.odometer,
        acquisition_cost: vehicle.acquisition_cost,
        status: vehicle.status,
      });
    } else {
      reset({
        reg_number: '',
        name: '',
        type: '',
        max_load_kg: 0,
        odometer: 0,
        acquisition_cost: 0,
        status: VehicleStatus.AVAILABLE,
      });
    }
    setErrorMsg(null);
  }, [vehicle, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (vehicle) {
        await updateVehicle(vehicle.id, data);
      } else {
        await createVehicle(data);
      }
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.detail || 'An error occurred while saving the vehicle.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden transform transition-all duration-200 scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-100">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 mb-4 text-sm bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Registration Plate
              </label>
              <input
                type="text"
                placeholder="e.g. TX-101"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('reg_number', { required: 'Registration plate is required' })}
              />
              {errors.reg_number && (
                <p className="text-xs text-red-500 mt-1">{errors.reg_number.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Vehicle Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ford Transit"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Vehicle Type
              </label>
              <input
                type="text"
                placeholder="e.g. Van, Semi-Truck"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('type', { required: 'Type is required' })}
              />
              {errors.type && (
                <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Max Capacity (kg)
              </label>
              <input
                type="number"
                step="any"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('max_load_kg', {
                  required: 'Capacity is required',
                  min: { value: 0, message: 'Capacity must be >= 0' },
                })}
              />
              {errors.max_load_kg && (
                <p className="text-xs text-red-500 mt-1">{errors.max_load_kg.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Odometer (km)
              </label>
              <input
                type="number"
                step="any"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('odometer', {
                  required: 'Odometer reading is required',
                  min: { value: 0, message: 'Odometer must be >= 0' },
                })}
              />
              {errors.odometer && (
                <p className="text-xs text-red-500 mt-1">{errors.odometer.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Acquisition Cost ($)
              </label>
              <input
                type="number"
                step="any"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('acquisition_cost', {
                  required: 'Cost is required',
                  min: { value: 0, message: 'Cost must be >= 0' },
                })}
              />
              {errors.acquisition_cost && (
                <p className="text-xs text-red-500 mt-1">{errors.acquisition_cost.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Vehicle Status
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
              {...register('status', { required: 'Status is required' })}
            >
              <option value={VehicleStatus.AVAILABLE}>Available</option>
              <option value={VehicleStatus.ON_TRIP}>On Trip</option>
              <option value={VehicleStatus.IN_SHOP}>In Shop</option>
              <option value={VehicleStatus.RETIRED}>Retired</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-lg text-sm shadow-md shadow-brand-600/10 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
