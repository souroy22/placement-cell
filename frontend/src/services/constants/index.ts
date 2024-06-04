export const pages = [
  {
    name: "Login",
    url: "/signin",
    private: false,
  },
  {
    name: "Signup",
    url: "/signup",
    private: false,
  },
  {
    name: "Students",
    url: "/students",
    private: true,
  },
  {
    name: "Interviews",
    url: "/interviews",
    private: true,
  },
];

export const settings = [
  { name: "Profile", url: "/profile" },
  { name: "Logout", url: null },
];
