import { useMediaQuery } from 'usehooks-ts';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Navigation, Header } from '../../components';
import {
  thunkGetProductsData,
  thunkGetVeAUXOStakingData,
  thunkGetXAUXOStakingData,
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../../store/products/thunks';
import { useAppDispatch } from '../../hooks';

export default function Layout({ children }) {
  const { library, account } = useWeb3React();

  const mq = useMediaQuery('(max-width: 1023px)');
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setOpen(!mq);
  }, [mq]);

  const updateOnBlock = useCallback(() => {
    dispatch(thunkGetProductsData());
    dispatch(thunkGetVeAUXOStakingData());
    dispatch(thunkGetXAUXOStakingData());
    if (account) {
      thunkGetUserProductsData({ account });
      thunkGetUserStakingData({ account });
    }
  }, [account, dispatch]);

  useEffect(() => {
    if (library) {
      library.getBlockNumber().then(() => {
        updateOnBlock();
      });
      //     library.on('block', updateOnBlock);
      return () => {
        library.removeListener('block', updateOnBlock);
      };
    }
  }, [library, updateOnBlock]);

  return (
    <>
      <div className="flex bg-background min-h-full">
        <Navigation open={open} setOpen={setOpen} />
        <div className="flex-1 flex flex-row w-full xl:container mx-auto ">
          <div className="flex flex-col flex-1">
            <Header title={children.props.title} />
            <main className="flex-1  px-7 w-full pb-10 min-h-full">
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
