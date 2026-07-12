import client from './client';
import type { Vehicle } from '../types';

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await client.get<Vehicle[]>('/vehicles');
  return response.data;
};

export const getVehicle = async (id: number): Promise<Vehicle> => {
  const response = await client.get<Vehicle>(`/vehicles/${id}`);
  return response.data;
};

export const createVehicle = async (data: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  const response = await client.post<Vehicle>('/vehicles', data);
  return response.data;
};

export const updateVehicle = async (
  id: number,
  data: Partial<Omit<Vehicle, 'id'>>
): Promise<Vehicle> => {
  const response = await client.patch<Vehicle>(`/vehicles/${id}`, data);
  return response.data;
};

export const deleteVehicle = async (id: number): Promise<Vehicle> => {
  const response = await client.delete<Vehicle>(`/vehicles/${id}`);
  return response.data;
};
