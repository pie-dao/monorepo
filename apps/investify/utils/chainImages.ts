export default function chainImages(chainId: number) {
  switch (chainId) {
    case 1:
      return '/chains/ethereum.svg';
    case 137:
      return '/chains/ethereum.svg';
    case 250:
      return '/chains/ethereum.svg';
    default:
      return '/chains/ethereum.png';
  }
}
