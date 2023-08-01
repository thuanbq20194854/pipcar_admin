import { DateISO, ID } from './global.types';

export type TCar = {
  _id: ID;
  agency_id: ID;

  plates: string;
  type: string;
  name: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;

  createdAt: DateISO;
  updatedAt: DateISO;
};

export interface ICar {
  id: string;
  name: string;
  plates: string;
  type: string;
  lat?: string;
  long?: string;
}
