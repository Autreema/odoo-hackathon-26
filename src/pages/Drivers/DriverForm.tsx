import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DriverStatus } from '../../types';
import type { Driver } from '../../types';
import { createDriver, updateDriver } from '../../api/drivers';

interface DriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  driver?: Driver | null;
}

interface FormInputs {
  name: string;
  license_number: string;
  license_category: string;
  license_expiry_date: string;
  contact_number: string;
  safety_score: number;
  status: string;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  driver,
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
    if (driver) {
      reset({
        name: driver.name,
        license_number: driver.license_number,
        license_category: driver.license_category,
        license_expiry_date: driver.license_expiry_date,
        contact_number: driver.contact_number,
        safety_score: driver.safety_score,
        status: driver.status,
      });
    } else {
      reset({
        name: '',
        license_number: '',
        license_category: '',
        license_expiry_date: '',
        contact_number: '',
        safety_score: 100,
        status: DriverStatus.AVAILABLE,
      });
    }
    setErrorMsg(null);
  }, [driver, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const payload = {
        ...data,
        safety_score: Number(data.safety_score),
        status: data.status as import('../../types').DriverStatus,
      };
      if (driver) {
        await updateDriver(driver.id, payload);
      } else {
        await createDriver(payload as Omit<Driver, 'id'>);
      }
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.detail || 'An error occurred while saving the driver.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 transform transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-100">
            {driver ? 'Edit Driver' : 'Add New Driver'}
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

        {/* Error */}
        {errorMsg && (
          <div className="p-3 mb-4 text-sm bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmed Khan"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                License Number
              </label>
              <input
                type="text"
                placeholder="e.g. DL-PKR-9901"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('license_number', { required: 'License number is required' })}
              />
              {errors.license_number && (
                <p className="text-xs text-red-500 mt-1">{errors.license_number.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                License Category
              </label>
              <input
                type="text"
                placeholder="e.g. B, C, D, E"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('license_category', { required: 'Category is required' })}
              />
              {errors.license_category && (
                <p className="text-xs text-red-500 mt-1">{errors.license_category.message}</p>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                License Expiry Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('license_expiry_date', { required: 'Expiry date is required' })}
              />
              {errors.license_expiry_date && (
                <p className="text-xs text-red-500 mt-1">{errors.license_expiry_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="+92-300-1234567"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('contact_number', { required: 'Contact number is required' })}
              />
              {errors.contact_number && (
                <p className="text-xs text-red-500 mt-1">{errors.contact_number.message}</p>
              )}
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Safety Score (0–100)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('safety_score', {
                  required: 'Safety score is required',
                  min: { value: 0, message: 'Min score is 0' },
                  max: { value: 100, message: 'Max score is 100' },
                })}
              />
              {errors.safety_score && (
                <p className="text-xs text-red-500 mt-1">{errors.safety_score.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Status
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition"
                {...register('status', { required: 'Status is required' })}
              >
                <option value={DriverStatus.AVAILABLE}>Available</option>
                <option value={DriverStatus.ON_TRIP}>On Trip</option>
                <option value={DriverStatus.OFF_DUTY}>Off Duty</option>
                <option value={DriverStatus.SUSPENDED}>Suspended</option>
              </select>
              {errors.status && (
                <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>
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
              {loading ? 'Saving...' : 'Save Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
