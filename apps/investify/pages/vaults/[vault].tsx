import { useRouter } from 'next/router';

const VaultPage = () => {
  const router = useRouter();
  const { vault } = router.query;

  return <p>Name: {vault}</p>;
};

export default VaultPage;
