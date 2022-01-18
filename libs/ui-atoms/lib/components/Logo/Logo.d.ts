import PropTypes from "prop-types";
import "./logo.css";
export interface ButtonProps {
    size: "small" | "medium" | "large";
}
declare const Logo: {
    ({ size }: ButtonProps): JSX.Element;
    protoTypes: {
        size: PropTypes.Requireable<string>;
    };
};
export declare const LogoIcon: ({ size }: {
    size: string | 'xl' | 'lg' | 'sm';
}) => JSX.Element;
export default Logo;
