import React, { Ref } from "react";
import { Props, NetworkDetail } from "../types/types";
import { PropsForFeatures } from "../utils/render";
interface NetworkSwitcherRenderPropArg {
    open: boolean;
    disabled: boolean;
}
interface ButtonRenderPropArg {
    open: boolean;
    disabled: boolean;
}
declare type ButtonPropsWeControl = "id" | "type" | "aria-haspopup" | "aria-controls" | "aria-expanded" | "aria-labelledby" | "disabled" | "onKeyDown" | "onClick";
interface LabelRenderPropArg {
    open: boolean;
    disabled: boolean;
}
declare type LabelPropsWeControl = "id" | "ref" | "onClick" | "onChange";
interface OptionsRenderPropArg {
    open: boolean;
}
declare type OptionsPropsWeControl = "aria-activedescendant" | "aria-labelledby" | "id" | "onKeyDown" | "role" | "tabIndex";
declare let OptionsRenderFeatures: number;
interface OptionRenderPropArg {
    active: boolean;
    selected: boolean;
    disabled: boolean;
}
declare type NetworkSwitcherOptionPropsWeControl = "id" | "role" | "tabIndex" | "aria-disabled" | "aria-selected" | "onPointerLeave" | "onMouseLeave" | "onPointerMove" | "onMouseMove" | "onFocus" | "onChange";
export declare let NetworkSwitcher: (<TTag extends React.ElementType<any> = React.ExoticComponent<{
    children?: React.ReactNode;
}>>(props: Props<TTag, NetworkSwitcherRenderPropArg, "value" | "disabled" | "name" | "onChange"> & {
    value: NetworkDetail | null | undefined;
    onChange(value: NetworkDetail): void;
    disabled?: boolean | undefined;
    name?: string | undefined;
}, ref: React.Ref<TTag>) => JSX.Element) & {
    displayName: string;
} & {
    Button: (<TTag_1 extends React.ElementType<any> = "button">(props: Props<TTag_1, ButtonRenderPropArg, ButtonPropsWeControl>, ref: Ref<HTMLButtonElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Label: (<TTag_2 extends React.ElementType<any> = "label">(props: Props<TTag_2, LabelRenderPropArg, LabelPropsWeControl>, ref: Ref<HTMLElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Options: (<TTag_3 extends React.ElementType<any> = "ul">(props: Props<TTag_3, OptionsRenderPropArg, OptionsPropsWeControl> & (({
        static?: undefined;
    } & {
        unmount?: boolean | undefined;
    }) | ({
        unmount?: undefined;
    } & {
        static?: boolean | undefined;
    })), ref: Ref<HTMLElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Option: (<TTag_4 extends React.ElementType<any> = "li">(props: Props<TTag_4, OptionRenderPropArg, "value" | NetworkSwitcherOptionPropsWeControl> & {
        disabled?: boolean | undefined;
        value: NetworkDetail;
    }, ref: Ref<HTMLElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
};
export {};
