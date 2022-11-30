import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThunkGetVeDOUGHStakingData } from './migration.thunks';
import { SliceState, STEPS_LIST } from './migration.types';

const initialState: SliceState = {
  isFirstTimeMigration: true,
  currentStep: STEPS_LIST.CHOOSE_MIGRATION_TYPE_VE_AUXO,
  previousStep: null,
  migrateTo: null,
  destinationWallet: null,
  loadingPositions: false,
  positions: [],
};

export const migrationSlice = createSlice({
  name: 'migration',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(ThunkGetVeDOUGHStakingData.pending, (state) => {
      state.loadingPositions = true;
    });

    builder.addCase(ThunkGetVeDOUGHStakingData.rejected, (state, action) => {
      console.error(action.error);
      state.loadingPositions = false;
    });

    builder.addCase(ThunkGetVeDOUGHStakingData.fulfilled, (state, action) => {
      migrationSlice.caseReducers.setVeAUXOStakingData(state, {
        ...action,
        payload: action.payload,
      });
      state.loadingPositions = false;
    });
  },

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
    setVeAUXOStakingData: (
      state,
      action: PayloadAction<SliceState['positions']>,
    ) => {
      state.positions = action.payload;
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
