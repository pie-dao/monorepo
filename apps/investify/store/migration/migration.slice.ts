import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceState, STEPS_LIST } from './migration.types';

const initialState: SliceState = {
  isFirstTimeMigration: true,
  currentStep: STEPS_LIST.CHOOSE_MIGRATION_TYPE_VE_AUXO,
  previousStep: null,
  migrateTo: null,
  destinationWallet: null,
};

export const migrationSlice = createSlice({
  name: 'migration',
  initialState,
  reducers: {
    setFirstTimeMigration: (state, action: PayloadAction<boolean>) => {
      state.isFirstTimeMigration = action.payload;
    },
    setCurrentStep: (
      state,
      action: PayloadAction<SliceState['currentStep']>,
    ) => {
      state.currentStep = action.payload;
    },
    setPreviousStep: (
      state,
      action: PayloadAction<SliceState['previousStep']>,
    ) => {
      state.previousStep = action.payload;
    },
    setMigrateTo: (state, action: PayloadAction<SliceState['migrateTo']>) => {
      state.migrateTo = action.payload;
    },
    setDestinationWallet: (state, action: PayloadAction<string>) => {
      state.destinationWallet = action.payload;
    },
  },
});

export const {
  setFirstTimeMigration,
  setCurrentStep,
  setPreviousStep,
  setDestinationWallet,
} = migrationSlice.actions;
export default migrationSlice.reducer;
