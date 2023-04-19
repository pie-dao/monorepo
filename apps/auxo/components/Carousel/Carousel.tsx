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
import { useToggle } from 'usehooks-ts';
import { PauseIcon, PlayIcon } from '@heroicons/react/outline';

type Props = PropsWithChildren & EmblaOptionsType;

const Carousel: FC<Props> = ({ children, ...options }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      delay: 2000,
    }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [scrollProgress, setScrollProgress] = useState(0);

  const [toggle, setToggle] = useToggle(true);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
    toggle
      ? emblaApi?.plugins().autoplay.play()
      : emblaApi?.plugins().autoplay.stop();
  }, [emblaApi, toggle]);

  useEffect(() => {
    function selectHandler() {
      const index = emblaApi?.selectedScrollSnap();
      setSelectedIndex(index || 0);
    }

    onScroll();
    emblaApi?.on('scroll', onScroll);
    emblaApi?.on('reInit', onScroll);

    emblaApi?.on('select', selectHandler);
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
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>
      <Dots
        itemsLength={length}
        selectedIndex={selectedIndex}
        goTo={emblaApi?.scrollTo}
      />
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
      <div className="flex gap-x-2 bottom-0 absolute w-full max-w-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center">
        <button
          className="group group-hover:shadow-lg bg-secondary rounded-full"
          onClick={() => {
            setToggle();
            toggle
              ? emblaApi?.plugins().autoplay.play()
              : emblaApi?.plugins().autoplay.stop();
          }}
        >
          {toggle ? (
            <PauseIcon className="w-8 h-8 text-white" />
          ) : (
            <PlayIcon className="w-8 h-8 text-white" />
          )}
        </button>
        <div className="relative w-full">
          <div className="absolute z-10 bg-sub-light h-0.5 rounded-md left-0 right-0 pointer-events-none w-full  overflow-hidden">
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
