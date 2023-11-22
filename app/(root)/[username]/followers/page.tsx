"use client";
import UserList from "@/components/cards/UserList";
import Header from "@/components/shared/Header";
import {
  fetchAllUser,
  fetchUser,
  findUserAndList,
} from "@/lib/actions/user.actions";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const FollowersList = ({ params }: { params: { username: string } }) => {
  const [users, setUsers] = useState<any[]>([]);
  // const [userId, setUserId] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const [currUserId, setcurrUserId] = useState(null);
  const path = usePathname();
  if (!userId) return redirect("/sign-in");

  const fetchUserData = async () => {
    setLoading(true);

    try {
      const currUserInfo = await fetchUser(userId);

      setcurrUserId(currUserInfo._id);

      if (!currUserInfo?.onboarded) redirect("/onboarding");

      setFollowing(currUserInfo.following);
      console.log("i am here ");
      const userList = await findUserAndList(params.username, true, false); // Populate followers only
      console.log("checking :", userList);
      if (userList) {
        setUsers(userList);
      }
    } catch (error) {
      console.log("Error fetching users :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActualUser = async () => {};

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <Header showBackArrow label="Explore" isBorder />
      <ul>
        {users.map((user, index) => (
          <li key={user.id}>
            <UserList
              user={user}
              currList={following}
              currUserId={currUserId}
              path={path}
            />
          </li>
        ))}
      </ul>
      {/* <div ref={loader} style={{ height: "10px", background: "transparent" }}>
        {loading && <p>Loading...</p>}
      </div> */}
    </div>
  );
};

export default FollowersList;
