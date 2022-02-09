import Image from "next/image";
import styles from "../styles/SingleBox.module.scss";

const SingleBox = ({ singleBox }) => {
  return (
    <div
      className={`rounded-md bg-primary px-4 py-6 flex flex-col items-center justify-center text-center h-[550px] md:mb-28 md:h-auto border-4 border-transparent ${styles.gradient}`}
    >
      <div className="-mt-32 w-[70%] md:w-[180px]">
        <Image
          src={singleBox.icon}
          alt={`${singleBox.title} icon`}
          width={300}
          height={300}
        />
      </div>
      <p className="text-3xl text-highlight mb-2 uppercase">
        {singleBox.title}
      </p>
      <p className="p-2 flex-1">{singleBox.description}</p>
    </div>
  );
};

export default SingleBox;
