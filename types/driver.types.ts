import { TCar } from './car.types';
import { DateISO, ID } from './global.types';

export type TCarPopulate = Pick<TCar, '_id' | 'name' | 'plates'>;

export type TDriver = {
  _id: ID;
  agency_id: ID;
  car_id: TCarPopulate | ID;

  phone: string;
  license_id: string;
  name: string;

  status?: number;
  rank?: number;

  address?: string;
  lat_address?: string;
  long_address?: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;

  createdAt: DateISO;
  updatedAt: DateISO;
};

export interface IDriver {
  id: string;
  name: string;
  phone: string;
  license_id: string;
  address?: string;
  lat?: string;
  long?: string;
}
