/// <reference types="react" />
declare const _default: {
    title: string;
    component: {
        ({ size }: import("./Logo").ButtonProps): JSX.Element;
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
export declare const Default: (args: any) => JSX.Element;
export declare const Small: (args: any) => JSX.Element;
export declare const Medium: (args: any) => JSX.Element;
export declare const Large: (args: any) => JSX.Element;
export declare const ExtraLarge: (args: any) => JSX.Element;
