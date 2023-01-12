import Image from 'next/image';
import Link from 'next/link';
import classNames from '../../utils/classnames';
import Container from '../Container/Container';
import { ImageProps } from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/outline';

export type LeftRightContainerProps = {
  features: {
    title: string | JSX.Element;
    description: string | JSX.Element;
    image: {
      src: string;
      alt: string;
    };
    button: {
      text: string;
      link: string;
      image: ImageProps['src'];
    };
  }[];
  textPosition?: 'left' | 'right';
};

const LeftRightContainer: React.FC<LeftRightContainerProps> = ({
  features,
  textPosition,
}) => {
  return (
    <Container size="xl" className="mt-16 space-y-16">
      {features.map((feature, featureIdx) => (
        <div
          key={featureIdx}
          className="flex flex-col-reverse lg:grid lg:grid-cols-12 items-center lg:gap-x-8"
        >
          <div
            className={classNames(
              textPosition === 'left'
                ? 'lg:col-start-1'
                : textPosition === 'right'
                ? 'lg:col-start-5 xl:col-start-6'
                : featureIdx % 2 === 0
                ? 'lg:col-start-5 xl:col-start-6'
                : 'lg:col-start-1',
              'mt-6 lg:mt-0 lg:row-start-1 lg:col-span-7 xl:col-span-8 flex items-start gap-x-10',
            )}
          >
            {(featureIdx % 2 !== 0 || textPosition === 'left') && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 32 4"
                className="w-8 h-1 fill-current mt-4 absolute -left-4 sm:-left-3 xl:block xl:[position:initial]"
              >
                <rect width="32" height="4" fill="#0B78DD" rx="2" />
              </svg>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 4"
              className="w-8 h-1 fill-current mt-4 absolute -left-4 sm:-left-3 xl:[position:initial] lg:hidden"
            >
              <rect width="32" height="4" fill="#0B78DD" rx="2" />
            </svg>
            <div className="flex flex-col xl:ml-4">
              <h3 className="text-4xl font-bold text-primary">
                {feature.title}
              </h3>
              <p className="mt-2 text-base text-primary">
                {feature.description}
              </p>
              <Link passHref href={feature?.button?.link}>
                <div className="flex items-center mt-8">
                  <div className="flex items-center rounded-l-[50px] rounded-r-[20px] bg-gradient-primary w-fit">
                    <div className="rounded-full bg-background flex p-4 shadow-sm">
                      <Image
                        src={feature?.button?.image}
                        alt={feature?.button?.text}
                      />
                    </div>
                    <div>
                      <p className="text-primary font-bold text-lg px-2 min-w-[14rem]">
                        {feature?.button?.text}
                      </p>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div
            className={classNames(
              textPosition === 'left'
                ? 'lg:col-start-8 xl:col-start-9'
                : textPosition === 'right'
                ? 'lg:col-start-1'
                : featureIdx % 2 === 0
                ? 'lg:col-start-1'
                : 'lg:col-start-8 xl:col-start-9',
              'flex-auto lg:row-start-1 lg:col-span-4 xl:col-span-5',
            )}
          >
            <div className="overflow-hidden rounded-lg">
              <Image
                src={feature.image.src}
                alt={feature.image.alt}
                width={444}
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default LeftRightContainer;
