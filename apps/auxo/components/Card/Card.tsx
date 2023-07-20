import React from 'react';
import classNames from '../../utils/classnames';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames(
      'shadow-lg flex flex-col @[620px]/main:flex-row @[1224px]/grid:flex-row overflow-hidden rounded-lg',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames('flex flex-col space-y-4 p-2', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={classNames('text-lg text-primary font-semibold', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={classNames('text-sm', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={classNames('p-2 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames('flex items-center p-2 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

const CardInfoList = React.forwardRef<
  HTMLDivElement,
  { className?: string; infos: { title: string; value: JSX.Element }[] }
>(({ className, infos, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames(
      'p-2 grid grid-cols-1 @lg:grid-cols-[minmax(100px,_150px)_minmax(100px,_150px)_minmax(100px,_1fr)] gap-x-5 text-sm justify-center flex-1',
      className,
    )}
    {...props}
  >
    {infos.map(({ title, value }, index) => (
      <dl key={index} className="font-medium flex gap-1 justify-between">
        <dt>{title}</dt>
        <dd className="font-medium text-right">{value}</dd>
      </dl>
    ))}
  </div>
));
CardInfoList.displayName = 'CardInfoList';

const CardDebug = React.forwardRef<
  HTMLDivElement,
  { className?: string; infos: { title: string; value: JSX.Element }[] }
>(({ className, infos, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames(
      'flex flex-col p-2 gap-y-2 text-sm justify-center flex-1',
    )}
    {...props}
  >
    {infos.map(({ title, value }, index) => (
      <dl
        key={index}
        className="font-medium flex flex-col gap-1 justify-between"
      >
        <dt>{title}</dt>
        <dd className="font-medium">{value}</dd>
      </dl>
    ))}
  </div>
));
CardDebug.displayName = 'CardDebug';

export default CardInfoList;

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardInfoList,
  CardDebug,
};
