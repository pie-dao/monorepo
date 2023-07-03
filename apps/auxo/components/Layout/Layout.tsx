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
  thunkGetUserPrvWithdrawal,
} from '../../store/products/thunks';
import { useAppDispatch } from '../../hooks';
import classNames from '../../utils/classnames';
import { ethereumProvider } from '../MultichainProvider/MultichainProvider';
import PrvWithdrawalTree from '../../config/PrvWithdrawalTree.json';
import { usePRVMerkleVerifier } from '../../hooks/useContracts';
import { PrvWithdrawalMerkleTree } from '../../types/merkleTree';
import { getPRVWithdrawalMerkleTree } from '../../utils/getUserMerkleTree';

const prvTree = PrvWithdrawalTree as PrvWithdrawalMerkleTree;
import {
  thunkGetLendingData,
  thunkGetUserLendingData,
} from '../../store/lending/lending.thunks';

export default function Layout({ children }) {
  const mq = useMediaQuery('(max-width: 1023px)');
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setOpen(!mq);
  }, [mq]);

  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const prvMerkleVerifier = usePRVMerkleVerifier();

  const updateOnBlock = useCallback(async () => {
    dispatch(thunkGetProductsData());
    dispatch(thunkGetVeAUXOStakingData());
    dispatch(thunkGetXAUXOStakingData());
    dispatch(thunkGetLendingData());
    if (!account || !wallet?.provider) return;
    dispatch(thunkGetUserProductsData({ account, provider: wallet?.provider }));
    dispatch(thunkGetUserStakingData({ account, provider: wallet?.provider }));
    dispatch(thunkGetUserLendingData({ account, provider: wallet?.provider }));
    if (prvTree && prvTree?.recipients && account && prvMerkleVerifier) {
      dispatch(
        thunkGetUserPrvWithdrawal({
          account,
          claim: {
            ...getPRVWithdrawalMerkleTree(prvTree, account),
            account,
          },
          prvMerkleVerifier,
        }),
      );
    }
  }, [dispatch, account, wallet?.provider, prvMerkleVerifier]);

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

  useEffect(() => {
    if (account && wallet?.provider) {
      dispatch(
        thunkGetUserProductsData({ account, provider: wallet?.provider }),
      );
      dispatch(
        thunkGetUserStakingData({ account, provider: wallet?.provider }),
      );
      dispatch(
        thunkGetUserLendingData({ account, provider: wallet?.provider }),
      );
    }
  }, [account, dispatch, wallet?.provider]);

  return (
    <>
      <div className="flex bg-background min-h-full">
        <Navigation open={open} setOpen={setOpen} />
        <div
          className={classNames(
            'flex-1 flex flex-row w-full min-[1920px]:container min-[1920px]:mx-auto transition-all duration-300 ease-in-out sm:ml-8',
            open
              ? 'lg:ml-48 min-[1920px]:ml-auto'
              : 'lg:ml-24 min-[1920px]:ml-auto',
          )}
        >
          <div className="flex flex-col flex-1">
            <main className="flex-1  px-7 w-full pb-10 min-h-full">
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
