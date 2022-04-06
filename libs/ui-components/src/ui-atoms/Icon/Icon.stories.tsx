import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Icon from "./Icon";
import { icons } from "../../shared/icons";

export default {
  title: "Ui Atoms/Icon",
  component: Icon,
} as Meta;

export const Basic = (args: any) => <Icon {...args} />;
Basic.args = { icon: "close" };

export const Labels = () => (
  <>
    There are {Object.keys(icons).length} icons
    <ul>
      {Object.keys(icons).map((key) => (
        <li key={key}>
          <Icon icon={key as keyof typeof icons} aria-hidden />
          <div>{key}</div>
        </li>
      ))}
    </ul>
  </>
);

export const NoLabels = () => (
  <ul>
    {Object.keys(icons).map((key) => (
      <li key={key}>
        <Icon icon={key as keyof typeof icons} aria-label={key} />
      </li>
    ))}
  </ul>
);
