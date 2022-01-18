/// <reference types="react" />
import PropTypes from "prop-types";
import "./logo.css";
export interface LogoProps {
    size: "small" | "medium" | "large" | "extra-large";
}
declare const Logo: {
    ({ size }: LogoProps): JSX.Element;
    protoTypes: {
        size: PropTypes.Requireable<string>;
    };
};
export default Logo;
