import React from 'react';
import classNames from '../../utils/classnames';

export type ContainerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'wide';
  className?: string;
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
};

const styles = {
  xs: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-2',
  sm: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-5xl lg:px-12',
  md: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-5xl lg:px-8',
  lg: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-7xl lg:px-8',
  xl: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-screen-2xl',
  wide: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-[calc(1536px-2rem)]',
};

const Container: React.FC<ContainerProps> = ({
  size = 'sm',
  className,
  children,
  ref,
  ...props
}) => {
  return (
    <div className={classNames(styles[size], className)} ref={ref} {...props}>
      {children}
    </div>
  );
};

export default Container;
