

export class NotImplementedError extends Error {};
export class InsufficientBalanceError extends Error {};
export class NotYetReadyToWithdrawError extends Error {};
export class ProviderNotActivatedError extends Error {};
export class MissingDecimalsError extends Error {};
export class TXRejectedError extends Error {};

// function getErrorMessage(error: Error) {
//   if (error instanceof NoEthereumProviderError) {
//     return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
//   } else if (error instanceof UnsupportedChainIdError) {
//     return "You're connected to an unsupported network."
//   } else if (
//     error instanceof UserRejectedRequestErrorInjected ||
//     error instanceof UserRejectedRequestErrorWalletConnect
//     // error instanceof UserRejectedRequestErrorFrame
//   ) {
//     return 'Please authorize this website to access your Ethereum account.'
//   } else {
//     console.error(error)
//     return 'An unknown error occurred. Check the console for more details.'
//   }
// }
