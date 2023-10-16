import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect } from 'react';
import { Layout } from '../components';
import { wrapper } from '../store';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { MERKLE_TREES_BY_USER_DISSOLUTION_URL } from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { MerkleTreesDissolution } from '../types/merkleTree';
import { thunkGetUserDissolution } from '../store/rewards/rewards.thunks';
import { useConnectWallet } from '@web3-onboard/react';
import { useTokenBalance, useUserStakedPRV } from '../hooks/useToken';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../store/products/thunks';
import { getUserDissolutionMerkeTree } from '../utils/getUserMerkleTree';
import TotalDissolution from '../components/TotalRewards/TotalDissolution';
import { useHasActiveClaimDissolution } from '../hooks/useRewards';

export default function Rewards({ title }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const { data: merkleTreesByUser } = useSWR<MerkleTreesDissolution>(
    MERKLE_TREES_BY_USER_DISSOLUTION_URL,
    fetcher,
  );

  useEffect(() => {
    if (merkleTreesByUser && account) {
      dispatch(
        thunkGetUserDissolution({
          account,
          rewards: getUserDissolutionMerkeTree(merkleTreesByUser, account),
        }),
      );
    }
  }, [account, dispatch, merkleTreesByUser]);

  useEffect(() => {
    if (account && wallet?.provider) {
      dispatch(
        thunkGetUserProductsData({ account, provider: wallet?.provider }),
      );
      dispatch(
        thunkGetUserStakingData({ account, provider: wallet?.provider }),
      );
    }
  }, [account, dispatch, wallet?.provider]);

  return (
    <div className="flex flex-col">
      <h2 className="flex sm:hidden text-2xl font-semibold text-primary w-auto drop-shadow-md ml-[10px]">
        {t(title)}
      </h2>
      <TotalDissolution />
    </div>
  );
}

Rewards.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Treasury Redemption',
    },
  };
});
