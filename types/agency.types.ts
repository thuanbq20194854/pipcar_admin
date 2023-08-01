import { DateISO, ID } from './global.types';
export type TAgency = {
  _id: ID;
  phone: string;
  name: string;
  code: string;

  isTransportation?: boolean;
  isDriver?: boolean;
  status?: number;
  hasCar?: number;

  rank?: number;
  point?: number;

  address?: string;
  lat_address?: string;
  long_address?: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;

  createdAt: DateISO;
  updatedAt: DateISO;
};
