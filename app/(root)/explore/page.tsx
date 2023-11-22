"use client";
import UserList from "@/components/cards/UserList";
import Header from "@/components/shared/Header";
import { fetchAllUser, fetchUser } from "@/lib/actions/user.actions";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const Explore = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMoreUser, setMoreUser] = useState(true);
  const loader = useRef(null);
  const { userId } = useAuth();
  const [currUserId, setcurrUserId] = useState(null);
  const path = usePathname();
  if (!userId) return redirect("/sign-in");
  const currentUserFetch = async () => {
    const currUserInfo = await fetchUser(userId);
    setcurrUserId(currUserInfo._id);
    if (!currUserInfo?.onboarded) redirect("/onboarding");
    setFollowing(currUserInfo.following);
  };

  const fetchUserData = async () => {
    if (hasMoreUser === false || loading === true) return;
    setLoading(true);

    try {
      const PAGE_SIZE = 3;

      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchAllUser(nextPage, PAGE_SIZE)
          .then(({ userData, totalCount }) => {
            if (userData.length === 0) {
              setMoreUser(false);
            }
            const filteredUsers = userData.filter((user) => user.id !== userId);
            setUsers((prevUsers) => {
              // Extract existing user IDs
              const existingUserIds = prevUsers.map((user) => user.id);

              // Filter out duplicates from the fetched data based on user IDs
              const uniqueNewUsers = filteredUsers.filter(
                (newUser) => !existingUserIds.includes(newUser.id)
              );

              // Combine unique new users with the existing state
              return [...prevUsers, ...uniqueNewUsers];
            });
          })
          .catch((error) => {
            console.log("Error fetching users:", error);
          });

        return nextPage;
      });
    } catch (error) {
      console.log("Error fetching users :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    currentUserFetch();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchUserData();
      }
    }, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader]);

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
      <div ref={loader} style={{ height: "10px", background: "transparent" }}>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Explore;
