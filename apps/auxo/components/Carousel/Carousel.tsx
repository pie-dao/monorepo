import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  FC,
  PropsWithChildren,
  useEffect,
  useState,
  Children,
  useCallback,
} from 'react';
import CarouselControls from './CarouselControls';
import Dots from './Dots';

type Props = PropsWithChildren & EmblaOptionsType;

const Carousel: FC<Props> = ({ children, ...options }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      delay: 2000,
      stopOnLastSnap: true,
    }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi, setScrollProgress]);

  useEffect(() => {
    function selectHandler() {
      const index = emblaApi?.selectedScrollSnap();
      setSelectedIndex(index || 0);
    }

    onScroll();
    emblaApi?.on('scroll', onScroll);
    emblaApi?.on('reInit', onScroll);

    emblaApi?.on('select', selectHandler);

    emblaApi?.on('pointerDown', () => {
      emblaApi?.plugins().autoplay.stop();
    });
    emblaApi?.on('pointerUp', () => {
      emblaApi?.plugins().autoplay.play();
    });

    // cleanup
    return () => {
      emblaApi?.off('select', selectHandler);
    };
  }, [emblaApi, onScroll]);

  const length = Children.count(children);
  const canScrollNext = !!emblaApi?.canScrollNext();
  const canScrollPrev = !!emblaApi?.canScrollPrev();
  return (
    <>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>
      <Dots itemsLength={length} selectedIndex={selectedIndex} />
      <CarouselControls
        canScrollPrev={canScrollPrev}
        onPrev={() => emblaApi?.scrollPrev()}
        position="left"
      />
      <CarouselControls
        canScrollNext={canScrollNext}
        onNext={() => emblaApi?.scrollNext()}
        position="right"
      />
      <div className="flex gap-x-2 items-center bottom-5 absolute w-full">
        <div className="relative w-full">
          <div className="absolute z-10 bg-sub-light h-0.5 rounded-md left-0 right-0 bottom-2 mx-auto pointer-events-none w-full max-w-[90%] overflow-hidden">
            <div
              className="bg-secondary absolute w-full top-0 bottom-0 -left-full"
              style={{ transform: `translateX(${scrollProgress}%)` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Carousel;
