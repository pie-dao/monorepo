import Image from "next/image";

const SingleBox = ({ singleBox }) => {
  return (
    <div className="p-1 rounded-md bg-gradient-to-tr from-red-500 to-blue-500 mb-4 mt-36">
      <div className="w-full rounded-md bg-primary p-4 flex flex-col items-center justify-center text-center h-[550px]">
        <div className="-mt-32 w-[70%] lg:w-full">
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
        <p className="p-2">{singleBox.description}</p>
      </div>
    </div>
  );
};

export default SingleBox;
