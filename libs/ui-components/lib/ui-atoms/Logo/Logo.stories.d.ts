import { Story } from "@storybook/react";
import { LogoProps } from "./Logo";
declare const _default: {
    title: string;
    component: {
        ({ size }: LogoProps): JSX.Element;
        protoTypes: {
            size: import("prop-types").Requireable<string>;
        };
    };
    argTypes: {
        size: {
            control: string;
        };
    };
};
export default _default;
export declare const Default: Story<LogoProps>;
export declare const Small: Story<LogoProps>;
export declare const Medium: Story<LogoProps>;
export declare const Large: Story<LogoProps>;
export declare const ExtraLarge: Story<LogoProps>;
