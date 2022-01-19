import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import Button, { ButtonProps } from "./Button";

export default {
<<<<<<< HEAD:libs/ui-components/src/ui-atoms/Button/Button.stories.tsx
  title: "Ui Atoms/Button",
=======
  title: "ui-atoms/Button",
>>>>>>> db04f5a655b220245dd6cea91e6fe5e3ff48dd53:libs/ui-atoms/src/components/Button/Button.stories.tsx
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<ButtonProps> = (args) => <Button {...args} />;

// Reuse that template for creating different stories
export const Primary = Template.bind({});
Primary.args = { label: "Primary 😃", size: "large" };

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, primary: false, label: "Secondary 😇" };
