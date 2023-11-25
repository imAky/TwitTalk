import { BsHeart, BsHeartFill } from "react-icons/bs";

const LikeButton = ({ likeStatus, handleLike, totalLikes }) => {
  return (
    <button onClick={handleLike}>
      <div className="flex items-center gap-4">
        {likeStatus ? (
          <BsHeartFill
            size={18}
            color="red"
            className=" hover:drop-shadow-2xl hover:font-bold transition-all "
          />
        ) : (
          <BsHeart
            size={18}
            className="hover:text-red-600 hover:drop-shadow-2xl hover:font-bold transition-all"
          />
        )}

        <span className="">{totalLikes}</span>
      </div>
    </button>
  );
};

export default LikeButton;
