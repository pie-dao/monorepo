import Image from "next/image";

const TwitterCard = ({ twitterPost }) => {
  return (
    <div className="flex flex-col text-left mx-auto rounded-lg bg-white shadow p-5 text-gray-800  w-full h-[372px] md:h-[340px]">
      <div className="w-full flex mb-4">
        <div className="overflow-hidden rounded-full w-10 h-10">
          <Image
            src={twitterPost.author.profile_image_url}
            alt={twitterPost.author.name}
            width={48}
            height={48}
          />
        </div>
        <div className="flex-grow pl-3">
          <h6 className="font-bold text-md">{twitterPost.author.name}</h6>
          <p className="text-xs text-gray-600">
            @{twitterPost.author.username}
          </p>
        </div>
        <div className="w-12 text-right">
          <i className="mdi mdi-twitter text-blue-400 text-3xl"></i>
        </div>
      </div>
      <div className="w-full mb-4 flex-1">
        <p className="text-sm">{twitterPost.text}</p>
      </div>
      <div className="w-full mt-auto">
        <p className="text-xs text-gray-500 text-left">
          {new Date(twitterPost.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TwitterCard;
