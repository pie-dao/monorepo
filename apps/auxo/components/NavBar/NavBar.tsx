import { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Popover } from '@headlessui/react';
import Image from 'next/image';
import classNames from '../../utils/classnames';
import AUXOLogotype from '../../public/images/AUXOLogotype.svg';
import Link from 'next/link';
import { TemplateIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import MenuIcon from '../Header/MenuIcon';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';

const sections = [
  { id: 'auxodao', title: 'AuxoDAO' },
  { id: 'lend', title: 'Lend' },
];

export function NavBar() {
  const { t } = useTranslation();
  const navBarRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [activeIndex, setActiveIndex] = useState(null);
  const mobileActiveIndex = activeIndex === null ? 0 : activeIndex;
  const handOffCompleted = useServerHandoffComplete();

  useEffect(() => {
    function updateActiveIndex() {
      let newActiveIndex = null;
      const elements = sections.map(({ id }) => document.getElementById(id));
      const bodyRect = document.body.getBoundingClientRect();
      const offset = bodyRect.top + navBarRef?.current?.offsetHeight + 1;

      for (let index = 0; index < elements.length; index++) {
        if (
          window.scrollY >=
          elements[index]?.getBoundingClientRect()?.top - offset - 100
        ) {
          newActiveIndex = index;
        } else {
          break;
        }
      }

      setActiveIndex(newActiveIndex);
    }

    updateActiveIndex();

    const opts: AddEventListenerOptions & EventListenerOptions = {
      passive: true,
    };

    window.addEventListener('resize', updateActiveIndex);
    window.addEventListener('scroll', updateActiveIndex, opts);

    return () => {
      window.removeEventListener('resize', updateActiveIndex);
      window.removeEventListener('scroll', updateActiveIndex, opts);
    };
  }, [activeIndex]);

  const handleScrollToTop = () => {
    if (handOffCompleted) {
      window?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div ref={navBarRef} className="sticky top-0 z-50">
      <Popover className="sm:hidden">
        {({ open }) => (
          <>
            <div
              className={classNames(
                'relative flex items-center py-3 px-4 gap-x-4',

                'bg-white/95 shadow-sm [@supports(backdrop-filter:blur(0))]:bg-white/80 [@supports(backdrop-filter:blur(0))]:backdrop-blur',
              )}
            >
              {
                <div className="flex gap-x-2 items-center justify-between flex-shrink-0 flex-1">
                  <Image
                    src={AUXOLogotype}
                    alt="AUXO"
                    priority
                    onClick={handleScrollToTop}
                    className="cursor-pointer"
                  />
                  <GoToApp />
                </div>
              }
              <Popover.Button
                className={classNames(
                  '-mr-1 flex h-8 w-8 items-center justify-center focus:outline-none',
                  open && 'relative z-10 ml-auto',
                )}
                aria-label="Toggle navigation menu"
              >
                <MenuIcon open={open} />
              </Popover.Button>
            </div>
            <Popover.Panel className="absolute inset-x-0 bg-gradient-primary m-3.5 shadow-md divide-y rounded-md">
              {sections.map((section, sectionIndex) => (
                <Popover.Button
                  as={'a'}
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center py-1.5 mx-3"
                >
                  <span className="text-base font-medium text-primary">
                    {section.title}
                  </span>
                </Popover.Button>
              ))}
            </Popover.Panel>
          </>
        )}
      </Popover>

      <div className="hidden sm:h-20 sm:flex sm:items-center sm:justify-between sm:[@supports(backdrop-filter:blur(0))]:bg-white/80 sm:[@supports(backdrop-filter:blur(0))]:backdrop-blur">
        <div className="flex gap-x-2 items-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 32 4"
            className="w-8 h-1 fill-current relative -left-3"
          >
            <rect width="32" height="4" fill="#0B78DD" rx="2" />
          </svg>
          <Image src={AUXOLogotype} alt="AUXO" priority />
        </div>
        <ul
          role="list"
          className="flex w-fit text-base font-medium text-primary items-center gap-x-10 sm:px-6 lg:px-8"
        >
          {sections.map((section, sectionIndex) => (
            <li key={section.id} className="flex justify-center">
              <a
                href={`#${section.id}`}
                className={classNames(
                  'flex flex-col items-center justify-center',
                  sectionIndex === activeIndex
                    ? 'border-secondary text-secondary'
                    : 'border-transparent',
                )}
              >
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <GoToApp />
          </li>
        </ul>
      </div>
    </div>
  );
}

export const GoToApp = () => {
  const { t } = useTranslation();
  return (
    <Link passHref href="/ARV">
      <button className="w-fit px-4 py-2 text-base text-white bg-secondary rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:cursor-not-allowed disabled:opacity-70 flex gap-x-2 items-center font-medium">
        <TemplateIcon className="fill-current w-4 h-4" />
        {t('launchApp')}
      </button>
    </Link>
  );
};
