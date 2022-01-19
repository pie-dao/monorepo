import React from "react";
import PropTypes from "prop-types";
// @ts-ignore
import logoFile from "./logo-piedao.svg";
import "./logo.css";

export interface LogoProps {
  size: "small" | "medium" | "large" | "extra-large";
}

const Logo = ({ size }: LogoProps) => {
  return (
    <div>
      <img className={size} src={logoFile} />
    </div>
  );
};

Logo.protoTypes = {
  size: PropTypes.string,
};

export default Logo;
