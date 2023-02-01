import classNames from '../../utils/classnames';

export type Props = {
  content: string | React.ReactNode;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
};
const Banner: React.FC<Props> = ({ icon, content, bgColor, textColor }) => {
  return (
    <div
      className={classNames(
        bgColor ?? 'bg-white',
        'rounded-lg items-center py-1 justify-center',
      )}
    >
      <div className="flex w-full items-center gap-x-3 mx-auto px-2">
        {icon ? <div className="flex-shrink-0">{icon}</div> : null}
        <div>
          <p
            className={classNames(
              `text-sm  font-medium`,
              textColor ?? 'text-primary',
            )}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
