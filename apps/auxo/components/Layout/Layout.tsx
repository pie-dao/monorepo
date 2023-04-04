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
import classNames from '../../utils/classnames';

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
        <div
          className={classNames(
            'flex-1 flex flex-row w-full min-[1920px]:container min-[1920px]:mx-auto transition-all duration-300 ease-in-out',
            open ? 'sm:ml-44' : 'sm:ml-16',
          )}
        >
          <div className="flex flex-col flex-1">
            <Header title={children.props.title} icon={children.props.icon} />
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
