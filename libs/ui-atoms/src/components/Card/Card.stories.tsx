import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import Card from "./Card";

export default {
  title: "Components/Card",
  component: Card,
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story = (args) => <Card {...args} />;

// Reuse that template for creating different stories
export const Primary = Template.bind({});