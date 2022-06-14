import useMediaQuery from '../../hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import { Navigation, Sidebar, Header } from '../../components';

export default function Layout({ children }) {
  const mq = useMediaQuery('(max-width: 1023px)');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(!mq);
  }, [mq]);

  return (
    <>
      <div className="flex h-screen bg-background overflow-y-hidden">
        <Navigation open={open} setOpen={setOpen} />
        <div className="flex-1 flex flex-row">
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            <Header
              open={open}
              setOpen={setOpen}
              title={children.props.title}
            />
            <main className="flex-1 max-h-full px-7">{children}</main>
          </div>
          <Sidebar />
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
