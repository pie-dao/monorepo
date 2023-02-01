import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import addTxNotifications from '../../utils/notifications';
import {
  ThunkGetVeDOUGHStakingData,
  ThunkMigrateVeDOUGH,
  ThunkPreviewMigration,
} from './migration.thunks';
import { SliceState, STEPS_LIST } from './migration.types';

const initialState: SliceState = {
  isMigrationDeployed: null,
  currentStep: STEPS_LIST.CHOOSE_MIGRATION_TYPE,
  previousStep: null,
  isSingleLock: false,
  destinationWallet: null,
  loadingPositions: false,
  loadingPreview: false,
  positions: [],
  estimatedOutput: null,
  boost: false,
  migrationType: null,
  DOUGHInput: '',
  tx: {
    hash: null,
    status: null,
  },
};

export const migrationSlice = createSlice({
  name: 'migration',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(ThunkGetVeDOUGHStakingData.pending, (state) => {
      state.loadingPositions = true;
    });

    builder.addCase(ThunkGetVeDOUGHStakingData.rejected, (state, action) => {
      console.error(action);
      state.loadingPositions = false;
    });

    builder.addCase(ThunkGetVeDOUGHStakingData.fulfilled, (state, action) => {
      migrationSlice.caseReducers.setVeAUXOStakingData(state, {
        ...action,
        payload: action.payload,
      });
      state.loadingPositions = false;
    });

    builder.addCase(ThunkPreviewMigration.pending, (state) => {
      state.loadingPreview = true;
    });

    builder.addCase(ThunkPreviewMigration.rejected, (state, action) => {
      console.error(action);
      state.loadingPreview = false;
    });

    builder.addCase(ThunkPreviewMigration.fulfilled, (state, action) => {
      state.loadingPreview = false;
      state.estimatedOutput = action.payload;
    });

    addTxNotifications(builder, ThunkMigrateVeDOUGH, 'aggregateVeDOUGH');
  },

  reducers: {
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
    setDestinationWallet: (state, action: PayloadAction<string>) => {
      state.destinationWallet = action.payload;
    },
    setVeAUXOStakingData: (
      state,
      action: PayloadAction<SliceState['positions']>,
    ) => {
      state.positions = action.payload;
    },
    setSingleLock: (state, action: PayloadAction<boolean>) => {
      state.isSingleLock = action.payload;
    },
    setTx: (state, action: PayloadAction<SliceState['tx']>) => {
      state.tx = action.payload;
    },
    setTxHash: (state, action: PayloadAction<string>) => {
      state.tx.hash = action.payload;
    },
    setTxState: (state, action: PayloadAction<SliceState['tx']['status']>) => {
      state.tx.status = action.payload;
    },
    setBoost: (state, action: PayloadAction<boolean>) => {
      state.boost = action.payload;
    },
    setMigrationType: (
      state,
      action: PayloadAction<SliceState['migrationType']>,
    ) => {
      state.migrationType = action.payload;
    },
    setConvertedDOUGHLabel: (state, action: PayloadAction<string>) => {
      state.DOUGHInput = action.payload;
    },
    setCleanupFlow: (state) => {
      state.currentStep = STEPS_LIST.CHOOSE_MIGRATION_TYPE;
      state.previousStep = null;
      state.isSingleLock = false;
      state.destinationWallet = null;
      state.loadingPositions = false;
      state.loadingPreview = false;
      state.positions = [];
      state.estimatedOutput = null;
      state.boost = false;
      state.migrationType = null;
      state.DOUGHInput = '';
      state.tx = {
        hash: null,
        status: null,
      };
    },
    setIsMigrationDeployed: (state, action: PayloadAction<boolean>) => {
      state.isMigrationDeployed = action.payload;
    },
  },
});

export const {
  setIsMigrationDeployed,
  setCurrentStep,
  setPreviousStep,
  setDestinationWallet,
  setSingleLock,
  setTx,
  setTxHash,
  setTxState,
  setBoost,
  setMigrationType,
  setConvertedDOUGHLabel,
  setCleanupFlow,
} = migrationSlice.actions;
export default migrationSlice.reducer;
