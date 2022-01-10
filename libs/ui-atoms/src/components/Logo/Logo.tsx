import React from 'react'
import PropTypes from "prop-types";
import "./logo.css"
import { ReactComponent as LogoSvg } from './logo.svg'

const logoClasses = size => {
    switch (size) {
        case 'xl':
            return 'w-96 h-96';
            break;
        case 'lg':
            return 'w-48 h-48';
            break;
        case 'sm':
            return 'w-12 h-12';
            break;
        default:
            return 'w-96 h-96';
    }
}

const Logo = ({ size }) => {
  return (      
    <div className="text-blue-300">
        <img className={[logoClasses(size)]} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNKBCUqHqXhzWXIp0jkhMKP3w4mUz2CgbkRw&usqp=CAU"/>
    </div>
  )
}

Logo.protoTypes = {
  size: PropTypes.string,
}

export default Logo;