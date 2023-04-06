import Carousel from '../Carousel/Carousel';
import { FC } from 'react';

type Props = {
  children: React.ReactNode;
};

const TokenCarousel: FC<Props> = ({ children }: Props) => {
  return (
    <div className="lg:w-full mx-auto my-2 relative">
      <Carousel loop={false}>{children}</Carousel>
    </div>
  );
};

export default TokenCarousel;
