import { useUser } from "@clerk/nextjs";
import Image from "next/image";
const UserCard = () => {
  const { user } = useUser();
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const userImage = user?.imageUrl;
  const userName = user?.username;

  return (
    <div className="flex flex-row bg-dark-2">
      <div>
        {userImage && (
          <Image
            src={userImage}
            alt="userImage"
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
      </div>
      <div className="flex flex-col">
        <div>{fullName}</div>
        <div>{`@${userName}`}</div>
      </div>
    </div>
  );
};

export default UserCard;
