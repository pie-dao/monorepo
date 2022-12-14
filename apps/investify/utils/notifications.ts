import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import {
  successNotificationUpdate,
  errorNotificationUpdate,
} from '../components/Notifications/Notifications';
import { SliceState } from '../store/products/products.types';

const addTxNotifications = (
  builder: ActionReducerMapBuilder<SliceState>,
  // We could narrow the typedefs from any, but this adds substantial boilerplate
  // for a very simple set of functions that don't rely heavily on type inference
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thunk: AsyncThunk<unknown, unknown, any>,
  notificationReason: string,
) => {
  builder.addCase(thunk.fulfilled, () => {
    successNotificationUpdate(notificationReason);
  });

  builder.addCase(thunk.rejected, (_state, { error }) => {
    // This is a good entry point for Sentry checks
    if (error instanceof Error) {
      errorNotificationUpdate(notificationReason, error.message);
      console.error(error.message);
    }
  });
};

export default addTxNotifications;
