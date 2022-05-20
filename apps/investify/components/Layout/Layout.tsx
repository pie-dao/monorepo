import { useState } from 'react';
import { MenuAlt2Icon } from '@heroicons/react/solid';
import Navigation from '../Navigation/Navigation';

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="flex h-full bg-background">
        <Navigation open={open} setOpen={setOpen} />
        <div className="flex flex-col flex-1">
          <div className="flex-shrink-0 flex h-16">
            <button
              type="button"
              className="px-4 text-gray-500 focus:outline-none"
              onClick={() => setOpen(!open)}
            >
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main>{children}</main>
        </div>
      </div>

      <style jsx global>{`
        #__next {
          height: 100%;
        }
      `}</style>
    </>
  );
}
