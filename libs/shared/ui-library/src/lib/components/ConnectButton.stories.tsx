import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { ConnectButton } from './ConnectButton';

export default {
  title: 'Components/ConnectButton',
  component: ConnectButton,
} as Meta;

// Reuse that template for creating different stories
export const Basic = (args: any) => <ConnectButton {...args} />;
Basic.args = {};
