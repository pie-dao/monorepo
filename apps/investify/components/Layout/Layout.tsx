import { useMediaQuery } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { Navigation, Header } from '../../components';
import {
  thunkGetProductsData,
  thunkGetVaultsData,
} from '../../store/products/thunks';
import { useAppDispatch } from '../../hooks';

export default function Layout({ children }) {
  const mq = useMediaQuery('(max-width: 1023px)');
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setOpen(!mq);
  }, [mq]);

  useEffect(() => {
    dispatch(thunkGetProductsData());
    dispatch(thunkGetVaultsData());
  }, [dispatch]);

  return (
    <>
      <div className="flex h-screen bg-background overflow-y-hidden">
        <Navigation open={open} setOpen={setOpen} />
        <div className="flex-1 flex flex-row w-full">
          <div className="flex flex-col flex-1 h-full">
            <Header
              open={open}
              setOpen={setOpen}
              title={children.props.title}
            />
            <main className="flex-1 max-h-full px-7 overflow-y-auto w-full pb-10">
              {children}
            </main>
          </div>
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
