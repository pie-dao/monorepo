/// <reference types="react" />
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
export default Logo;
