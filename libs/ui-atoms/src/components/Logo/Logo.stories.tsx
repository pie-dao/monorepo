import React from 'react';
import { Story } from "@storybook/react";
import Logo, { LogoProps } from './Logo';

export default {
  title: 'Application/Component Library/Logo',
  component: Logo,
  argTypes: {
      size: {control: 'text'}
  }
}

const Template: Story<LogoProps> = (args) => <Logo {...args} />;

export const Default = Template.bind({})
Default.args = {
    size: 'medium'
}

export const Small = Template.bind({})
Small.args = {
    size: 'small'    
}

export const Medium = Template.bind({})
Medium.args = {
    size: 'medium'    
}

export const Large = Template.bind({})
Large.args = {
    size: 'large'    
}

export const ExtraLarge = Template.bind({})
ExtraLarge.args = {
    size: 'extra-large'    
}