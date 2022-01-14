import React from 'react'
import PropTypes from "prop-types"
import "./logo.css"
import logoFile from "./logo.png"

export interface LogoProps  {
  size: "small" | "medium" | "large" | "extra-large";
};

const Logo = ({ size }: LogoProps) => {
  return (      
    <div className="text-blue-300">
        <img className={size} src={logoFile} />
    </div>
  )
}

Logo.protoTypes = {
  size: PropTypes.string,
}

export default Logo;