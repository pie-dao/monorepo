import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { ChainSwitcher } from './ChainSwitcher';

export default {
  title: 'Components/ChainSwitcher',
  component: ChainSwitcher,
} as Meta;

// Reuse that template for creating different stories
export const Basic = (args: any) => <ChainSwitcher {...args} />;
Basic.args = { allowedChains: ['MAINNET', 'POLYGON', 'FANTOM'] };

export const withoutNetworkName = (args: any) => <ChainSwitcher {...args} />;
withoutNetworkName.args = {
  allowedChains: ['MAINNET', 'POLYGON', 'FANTOM'],
  showNetworkName: false,
};
