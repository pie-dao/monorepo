import { useMediaQuery } from 'usehooks-ts';
import { useCallback, useEffect, useState } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
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
import { ethereumProvider } from '../MultichainProvider/MultichainProvider';

export default function Layout({ children }) {
  const mq = useMediaQuery('(max-width: 1023px)');
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setOpen(!mq);
  }, [mq]);

  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;

  const updateOnBlock = useCallback(async () => {
    dispatch(thunkGetProductsData());
    dispatch(thunkGetVeAUXOStakingData());
    dispatch(thunkGetXAUXOStakingData());
    if (!account || !wallet?.provider) return;
    dispatch(thunkGetUserProductsData({ account, provider: wallet?.provider }));
    dispatch(thunkGetUserStakingData({ account, provider: wallet?.provider }));
  }, [account, wallet?.provider, dispatch]);

  useEffect(() => {
    if (ethereumProvider) {
      ethereumProvider.on('block', async () => {
        await updateOnBlock();
      });
    }
    return () => {
      if (ethereumProvider) {
        ethereumProvider.removeAllListeners('block');
      }
    };
  }, [updateOnBlock]);

  return (
    <>
      <div className="flex bg-background min-h-full">
        <Navigation open={open} setOpen={setOpen} />
        <div
          className={classNames(
            'flex-1 flex flex-row w-full min-[1920px]:container min-[1920px]:mx-auto transition-all duration-300 ease-in-out',
            open
              ? 'lg:ml-48 min-[1920px]:ml-auto'
              : 'lg:ml-[6.75rem] min-[1920px]:ml-auto',
          )}
        >
          <div className="flex flex-col flex-1">
            <main className="flex-1 px-2 w-full pb-10 min-h-full">
              <Header title={children.props.title} icon={children.props.icon} />
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
