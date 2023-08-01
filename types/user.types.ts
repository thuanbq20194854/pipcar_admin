import { DateISO, ID } from './global.types';
export type TUser = {
  _id: ID;
  phone: string;
  name: string;
  role: string;
  status: number;
  createdAt: DateISO;
  updatedAt: DateISO;
};
