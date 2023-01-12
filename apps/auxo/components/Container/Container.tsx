import React from 'react';
import classNames from '../../utils/classnames';

export type ContainerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
};

const styles = {
  xs: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-2',
  sm: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-4xl lg:px-12',
  md: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-5xl lg:px-8',
  lg: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-7xl lg:px-8',
  xl: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-screen-2xl lg:px-8',
};

const Container: React.FC<ContainerProps> = ({
  size = 'sm',
  className,
  children,
  ...props
}) => {
  return (
    <div className={classNames(styles[size], className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
