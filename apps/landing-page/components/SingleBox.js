import Image from 'next/image';
import styles from '../styles/SingleBox.module.scss';

const SingleBox = ({ singleBox }) => {
  return (
    <div
      className={`rounded-md bg-primary px-4 py-6 flex flex-col items-center justify-center text-center md:mb-36 md:h-auto border-2 border-transparent ${styles.gradient}`}
    >
      <div className="-mt-32 md:mb-4 w-[70%] md:w-[180px]">
        <Image
          lazyBoundary="325px"
          src={singleBox.icon}
          alt={`${singleBox.title} icon`}
          width={300}
          height={300}
          placeholder="blur"
          blurDataURL={`/metaverse_${singleBox.id}.svg`}
        />
      </div>
      <p className="text-highlight uppercase text-2xl md:text-3xl mb-4">
        {singleBox.title}
      </p>
      <p className="p-2 flex-1 text-sm md:text-xl">{singleBox.description}</p>
    </div>
  );
};

export default SingleBox;
