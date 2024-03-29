import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import addTxNotifications from '../../utils/notifications';
import { BigNumberReference } from '../products/products.types';
import {
  thunkClaimDissolution,
  thunkClaimRewards,
  thunkCompoundRewards,
  thunkGetUserDissolution,
  thunkGetUserRewards,
  thunkStopCompoundRewards,
} from './rewards.thunks';
import { SliceState, Steps, TokenName, TxState } from './rewards.types';

export const initialState: SliceState = {
  data: {
    rewardPositions: {
      ARV: [],
      PRV: [],
    },
    metadata: {
      ARV: {
        total: {
          value: '0',
          label: 0,
        },
        isCompound: false,
      },
      PRV: {
        total: {
          value: '0',
          label: 0,
        },
        isCompound: false,
      },
      total: {
        value: '0',
        label: 0,
      },
      allTimeTotal: {
        value: '0',
        label: 0,
      },
    },
  },
  claimFlow: {
    step: null,
    phase: 0,
    open: false,
    tx: {
      hash: null,
      status: null,
    },
    token: {
      name: null,
      singleClaim: false,
    },
    claim: null,
    showCompleteModal: false,
    totalClaiming: null,
  },
  dissolution: [],
  loading: false,
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,

  extraReducers: (builder) => {
    builder.addCase(thunkGetUserRewards.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserRewards.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetUserRewards.fulfilled, (state, action) => {
      rewardsSlice.caseReducers.setRewardsState(state, {
        ...action,
        payload: action.payload,
      });
      state.loading = false;
    });
    builder.addCase(thunkGetUserDissolution.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserDissolution.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetUserDissolution.fulfilled, (state, action) => {
      rewardsSlice.caseReducers.setDissolutionState(state, {
        ...action,
        payload: action.payload,
      });
      state.loading = false;
    });

    addTxNotifications(builder, thunkClaimRewards, 'claimRewards');
    addTxNotifications(builder, thunkCompoundRewards, 'compoundRewards');
    addTxNotifications(
      builder,
      thunkStopCompoundRewards,
      'stopCompoundRewards',
    );
    addTxNotifications(builder, thunkClaimDissolution, 'claimDissolution');
  },

  reducers: {
    setRewardsState: (state, action: PayloadAction<SliceState['data']>) => {
      state.data = action.payload;
    },
    setClaimStep: (state, action: PayloadAction<Steps>) => {
      state.claimFlow.step = action.payload;
    },
    setClaimFlowPhase: (state, action: PayloadAction<number>) => {
      state.claimFlow.phase = action.payload;
    },
    setClaimFlowOpen: (state, action: PayloadAction<boolean>) => {
      state.claimFlow.open = action.payload;
    },
    setClaimToken: (state, action: PayloadAction<TokenName>) => {
      state.claimFlow.token.name = action.payload;
    },
    setIsSingleClaim: (state, action: PayloadAction<boolean>) => {
      state.claimFlow.token.singleClaim = action.payload;
    },
    setTx: (state, action: PayloadAction<SliceState['claimFlow']['tx']>) => {
      state.claimFlow.tx = action.payload;
    },
    setTxHash: (state, action: PayloadAction<string>) => {
      state.claimFlow.tx.hash = action.payload;
    },
    setTxState: (state, action: PayloadAction<TxState>) => {
      state.claimFlow.tx.status = action.payload;
    },
    setClaim: (
      state,
      action: PayloadAction<SliceState['claimFlow']['claim']>,
    ) => {
      state.claimFlow.claim = action.payload;
    },
    setShowCompleteModal: (state, action: PayloadAction<boolean>) => {
      state.claimFlow.showCompleteModal = action.payload;
    },
    setTotalClaiming: (state, action: PayloadAction<BigNumberReference>) => {
      state.claimFlow.totalClaiming = action.payload;
    },
    setDissolutionState: (
      state,
      action: PayloadAction<SliceState['dissolution']>,
    ) => {
      state.dissolution = action.payload;
    },
  },
});

export const {
  setRewardsState,
  setClaimStep,
  setClaimFlowOpen,
  setClaimToken,
  setIsSingleClaim,
  setClaimFlowPhase,
  setTx,
  setTxHash,
  setTxState,
  setClaim,
  setShowCompleteModal,
  setTotalClaiming,
} = rewardsSlice.actions;

export default rewardsSlice.reducer;
