import { useWeb3React } from '@web3-react/core';
import { useENSName } from '@shared/ui-library';
import { useAllUsersQuery } from '../../api/generated/graphql';

export default function UserCard() {
  const { account, library } = useWeb3React();
  const ensName = useENSName(library, account);
  const { data } = useAllUsersQuery();
  return <>{ensName ? <div>{ensName}</div> : <div>{account}</div>}</>;
}
