import { DeletePostById } from "@/lib/actions/twit.actions";
import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import AnimateSVG from "./AnimatesSVG";
import { usePathname } from "next/navigation";

const DeleteButton = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await DeletePostById(id, pathname);
    } catch (err) {
      console.log(`Error on deleting Post ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={() => handleDelete(id)}
      className="font-extrabold text-gray-500 tracking-widest rounded-full hover:bg-gray-700 p-1"
    >
      {loading ? (
        <AnimateSVG width={20} height={20} swidth={12} />
      ) : (
        <MdDeleteForever size={16} />
      )}
    </button>
  );
};

export default DeleteButton;

{
  /*  */
}
