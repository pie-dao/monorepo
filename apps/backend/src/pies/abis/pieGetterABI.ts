import { ContractInterface } from '@ethersproject/contracts';

export const pieGetterABI: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_globalRegistry',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_experiPieRegistry',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_smartPoolsRegistry',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_lendingRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'experiPieRegistry',
    outputs: [
      {
        internalType: 'contract IPieRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pie',
        type: 'address',
      },
    ],
    name: 'getAssetsAndAmounts',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pie',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'getAssetsAndAmountsForAmount',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'globalRegistry',
    outputs: [
      {
        internalType: 'contract IPieRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lendingRegistry',
    outputs: [
      {
        internalType: 'contract ILendingRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'smartPoolsRegistry',
    outputs: [
      {
        internalType: 'contract IPieRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
