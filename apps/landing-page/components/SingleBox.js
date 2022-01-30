import Image from "next/image";

const SingleBox = ({ singleBox }) => {
  return (
    <div className="p-1 rounded-md bg-gradient-to-tr from-red-500 to-blue-500 mb-4 mt-20">
      <div className="w-full rounded-md bg-primary p-4 flex flex-col items-center justify-center text-center">
        <Image
          src={singleBox.icon}
          alt={`${singleBox.title} icon`}
          className="lg:-mt-20"
          width={300}
          height={300}
        />
        <p className="text-4xl text-highlight p-4">{singleBox.title}</p>
        <p className="p-2">{singleBox.description}</p>
      </div>
    </div>
  );
};

export default SingleBox;
