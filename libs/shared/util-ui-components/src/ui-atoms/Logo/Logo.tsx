import React from 'react';
import PropTypes from 'prop-types';
import logoFile from './logo.png';
import './logo.css';

export interface LogoProps {
  size: 'small' | 'medium' | 'large' | 'extra-large';
}

const Logo = ({ size }: LogoProps) => {
  return (
    <div>
      <img className={size} src={logoFile.toString()} />
    </div>
  );
};

Logo.protoTypes = {
  size: PropTypes.string,
};

export default Logo;
