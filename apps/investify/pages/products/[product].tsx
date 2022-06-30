import { useRouter } from 'next/router';

const ProductPage = () => {
  const router = useRouter();
  const { product } = router.query;

  return <p>Name: {product}</p>;
};

export default ProductPage;
