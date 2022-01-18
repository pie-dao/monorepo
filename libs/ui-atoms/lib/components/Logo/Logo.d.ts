import PropTypes from "prop-types";
import "./logo.css";
declare const Logo: {
    ({ size }: {
        size: string | 'xl' | 'lg' | 'sm';
    }): JSX.Element;
    protoTypes: {
        size: PropTypes.Requireable<string>;
    };
};
export declare const LogoIcon: ({ size }: {
    size: string | 'xl' | 'lg' | 'sm';
}) => JSX.Element;
export default Logo;
