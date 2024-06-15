import { IoMdDownload } from "react-icons/io";

export const pages = [
  {
    name: "Login",
    url: "/signin",
    privateURL: false,
  },
  {
    name: "Signup",
    url: "/signup",
    privateURL: false,
  },
  {
    name: "Download Result",
    url: null,
    privateURL: true,
    Icon: IoMdDownload,
  },
  {
    name: "Students",
    url: "/students",
    privateURL: true,
  },
  {
    name: "Batches",
    url: "/batches",
    privateURL: true,
  },
  {
    name: "Interviews",
    url: "/interviews",
    privateURL: true,
  },
];

export const settings = [
  { name: "Profile", url: "/profile" },
  { name: "Logout", url: null },
];

export const statusOptions: { name: string; value: string }[] = [
  { name: "Not Placed", value: "not_placed" },
  { name: "Placed", value: "placed" },
];
