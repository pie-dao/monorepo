import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from '@web3-react/injected-connector';

export class NotImplementedError extends Error {}
export class InsufficientBalanceError extends Error {}
export class NotYetReadyToWithdrawError extends Error {}
export class ProviderNotActivatedError extends Error {}
export class MissingDecimalsError extends Error {}
export class TXRejectedError extends Error {}

export function getErrorMessage(error: any): string {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestError ||
    error instanceof UserRejectedRequestError
    // error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.';
  } else if (error.code && error.code === 'CALL_EXCEPTION') {
    console.error(error);
    return 'There was a problem fetching data for one of the vaults, check the console for details';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}
