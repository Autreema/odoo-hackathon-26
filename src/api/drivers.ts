import client from './client';
import type { Driver } from '../types';

export const getDrivers = async (): Promise<Driver[]> => {
  const response = await client.get<Driver[]>('/drivers');
  return response.data;
};

export const getDriver = async (id: number): Promise<Driver> => {
  const response = await client.get<Driver>(`/drivers/${id}`);
  return response.data;
};

export const createDriver = async (data: Omit<Driver, 'id'>): Promise<Driver> => {
  const response = await client.post<Driver>('/drivers', data);
  return response.data;
};

export const updateDriver = async (
  id: number,
  data: Partial<Omit<Driver, 'id'>>
): Promise<Driver> => {
  const response = await client.patch<Driver>(`/drivers/${id}`, data);
  return response.data;
};

export const deleteDriver = async (id: number): Promise<Driver> => {
  const response = await client.delete<Driver>(`/drivers/${id}`);
  return response.data;
};
