import { useState } from 'react';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="flex h-screen bg-background overflow-y-hidden">
        <Navigation open={open} setOpen={setOpen} />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <Header open={open} setOpen={setOpen} />
          <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
            {children}
          </main>
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
