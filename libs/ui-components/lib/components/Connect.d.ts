import React, { MutableRefObject, Ref } from "react";
import { Props } from "../types/types";
import { PropsForFeatures } from "../utils/render";
interface ConnectRenderPropArg {
    open: boolean;
    connected: boolean;
    connecting: boolean;
    waiting: boolean;
}
declare type ConnectPropsWeControl = "id" | "role" | "aria-modal" | "aria-describedby" | "aria-labelledby" | "onClick";
declare let ConnectRenderFeatures: number;
interface OverlayRenderPropArg {
    open: boolean;
}
declare type OverlayPropsWeControl = "id" | "aria-hidden" | "onClick";
interface TitleRenderPropArg {
    open: boolean;
}
declare type TitlePropsWeControl = "id";
interface MetamaskButtonRenderPropArg {
    connected: boolean;
}
declare type MetamaskButtonPropsWeControl = "id" | "type" | "aria-expanded" | "onKeyDown" | "onClick";
interface WalletConnectButtonRenderPropArg {
    connected: boolean;
}
declare type WalletConnectButtonPropsWeControl = "id" | "type" | "aria-expanded" | "onKeyDown" | "onClick";
interface DisconnectButtonRenderPropArg {
    connected: boolean;
}
declare type DisconnectButtonPropsWeControl = "id" | "type" | "aria-expanded" | "onKeyDown" | "onClick";
export declare let Connect: (<TTag extends React.ElementType<any> = "div">(props: Props<TTag, ConnectRenderPropArg, ConnectPropsWeControl> & (({
    static?: undefined;
} & {
    unmount?: boolean | undefined;
}) | ({
    unmount?: undefined;
} & {
    static?: boolean | undefined;
})) & {
    open?: boolean | undefined;
    onClose(value: boolean): void;
    initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
    __demoMode?: boolean | undefined;
}, ref: Ref<HTMLDivElement>) => JSX.Element) & {
    displayName: string;
} & {
    Overlay: (<TTag_1 extends React.ElementType<any> = "div">(props: Props<TTag_1, OverlayRenderPropArg, OverlayPropsWeControl>, ref: Ref<HTMLDivElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Title: (<TTag_2 extends React.ElementType<any> = "h2">(props: Props<TTag_2, TitleRenderPropArg, "id">, ref: Ref<HTMLHeadingElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Description: (<TTag_3 extends React.ElementType<any> = "p">(props: Props<TTag_3, {}, "id">, ref: React.Ref<HTMLParagraphElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    MetamaskButton: (<TTag_4 extends React.ElementType<any> = "button">(props: Props<TTag_4, MetamaskButtonRenderPropArg, MetamaskButtonPropsWeControl>, ref: Ref<HTMLButtonElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    WalletConnectButton: (<TTag_5 extends React.ElementType<any> = "button">(props: Props<TTag_5, WalletConnectButtonRenderPropArg, WalletConnectButtonPropsWeControl>, ref: Ref<HTMLButtonElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    DisconnectButton: (<TTag_6 extends React.ElementType<any> = "button">(props: Props<TTag_6, DisconnectButtonRenderPropArg, DisconnectButtonPropsWeControl>, ref: Ref<HTMLButtonElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
};
export {};
