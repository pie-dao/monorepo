import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Id = string | number;
type SliceState = {
  id: Id;
};

const initialState: SliceState = {
  id: '',
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setCurrentNotification: (state, action: PayloadAction<Id>) => {
      state.id = action.payload;
    },
    cleanupNotification: (state) => {
      state.id = '';
    },
  },
});

export const { setCurrentNotification, cleanupNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
