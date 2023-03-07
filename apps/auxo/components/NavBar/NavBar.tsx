import { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Popover } from '@headlessui/react';
import Image from 'next/image';
import classNames from '../../utils/classnames';
import AUXOLogotype from '../../public/images/AUXOLogotype.svg';
import Link from 'next/link';
import { TemplateIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';

const sections = [
  { id: 'auxodao', title: 'AuxoDAO' },
  { id: 'lend', title: 'Lend' },
  { id: 'support', title: 'Support' },
];

function MenuIcon({ open, ...props }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d={open ? 'M17 7 7 17M7 7l10 10' : 'm15 16-3 3-3-3M15 8l-3-3-3 3'}
      />
    </svg>
  );
}

export function NavBar() {
  const { t } = useTranslation();
  const navBarRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [activeIndex, setActiveIndex] = useState(null);
  const mobileActiveIndex = activeIndex === null ? 0 : activeIndex;

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

  return (
    <div ref={navBarRef} className="sticky top-0 z-50">
      <Popover className="sm:hidden">
        {({ open }) => (
          <>
            <div
              className={classNames(
                'relative flex items-center py-3 px-4',
                !open &&
                  'bg-white/95 shadow-sm [@supports(backdrop-filter:blur(0))]:bg-white/80 [@supports(backdrop-filter:blur(0))]:backdrop-blur',
              )}
            >
              {!open && (
                <>
                  <span className="ml-4 text-base font-medium text-primary">
                    {sections[mobileActiveIndex].title}
                  </span>
                </>
              )}
              <Popover.Button
                className={classNames(
                  '-mr-1 ml-auto flex h-8 w-8 items-center justify-center',
                  open && 'relative z-10',
                )}
                aria-label="Toggle navigation menu"
              >
                {!open && <span className="absolute inset-0" />}
                <MenuIcon open={open} className="h-6 w-6 stroke-slate-700" />
              </Popover.Button>
            </div>
            <Popover.Panel className="absolute inset-x-0 top-0 bg-white/95 py-3.5 shadow-sm [@supports(backdrop-filter:blur(0))]:bg-white/80 [@supports(backdrop-filter:blur(0))]:backdrop-blur">
              {sections.map((section, sectionIndex) => (
                <Popover.Button
                  as={'a'}
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center py-1.5 px-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-blue-600"
                  >
                    {(sectionIndex + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="ml-4 text-base font-medium text-slate-900">
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
          <Image src={AUXOLogotype} alt="AUXO" />
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
            <Link passHref href="/ARV">
              <button className="w-fit px-4 py-0.5 text-base text-white bg-secondary rounded-2xl ring-inset ring-1 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary flex gap-x-2 items-center">
                <TemplateIcon className="fill-current w-4 h-4" />
                {t('launchApp')}
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
