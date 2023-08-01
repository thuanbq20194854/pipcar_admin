import { DateISO, ID } from './global.types';
export type TRegister = {
  _id: ID;
  phone: string;
  name: string;
  code: string;
  status?: number;

  isTransportation?: boolean;
  isDriver?: boolean;
  isAgency?: boolean;

  createdAt: DateISO;
  updatedAt: DateISO;
};
