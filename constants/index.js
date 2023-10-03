import { RiHome7Fill } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { RiNotification4Line } from "react-icons/ri";
import { GoMail } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi";
import { CiUser } from "react-icons/ci";

export const sidebarLinks = [
  {
    icon: <RiHome7Fill size={24} color="white" />,
    route: "/",
    label: "Home",
  },
  {
    icon: <BiSearch size={24} color="white" />,
    route: "/explore",
    label: "Explore",
  },
  {
    icon: <RiNotification4Line size={24} color="white" />,
    route: "/notifications",
    label: "Notifications",
  },
  {
    icon: <GoMail size={24} color="white" />,
    route: "/messages",
    label: "Messages",
  },
  {
    icon: <HiOutlineUsers size={24} color="white" />,
    route: "/communities",
    label: "Communities",
  },
  {
    icon: <CiUser size={24} color="white" />,
    route: "/profile",
    label: "Profile",
  },
];

export const bottombarLinks = [
  {
    icon: <RiHome7Fill size={24} color="white" />,
    route: "/",
    label: "Home",
  },
  {
    icon: <BiSearch size={24} color="white" />,
    route: "/explore",
    label: "Explore",
  },
  {
    icon: <HiOutlineUsers size={24} color="white" />,
    route: "/communities",
    label: "Communities",
  },
  {
    icon: <RiNotification4Line size={24} color="white" />,
    route: "/notifications",
    label: "Notifications",
  },
  {
    icon: <GoMail size={24} color="white" />,
    route: "/messages",
    label: "Messages",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const sidebarIcons = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/notificationsv1.svg",
    route: "/notifications",
    label: "Notifications",
  },
  {
    imgURL: "/assets/messagev1.svg",
    route: "/messages",
    label: "Messages",
  },
  {
    imgURL: "/assets/community.svg",
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];
