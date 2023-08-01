import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICar } from 'src/types/car.types';

interface TState {
  carList: ICar[];
}

const initialState: TState = {
  carList: [],
};

const createAgencySlice = createSlice({
  name: 'createAgency',
  initialState,
  reducers: {
    addCar(state, action: PayloadAction<ICar>) {
      state.carList.push(action.payload);
    },
  },
});

export const { addCar } = createAgencySlice.actions;

export default createAgencySlice.reducer;
