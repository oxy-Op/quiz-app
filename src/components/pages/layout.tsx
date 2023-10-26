import { Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "../mode-toggle";

const Layout = () => {
  return (
    <>
      <div className="flex items-center justify-center h-[48px] z-50 top-0 sticky bg-slate-200 dark:bg-[#333336]">
        <div className="ms-6">
          <a href="/">
            <Avatar className="cursor-pointer">
              <AvatarImage src="/logo.svg" alt="logo" />
              <AvatarFallback>Logo</AvatarFallback>
            </Avatar>
          </a>
        </div>
        <div className="mx-auto">
          <a href="/">
            <h1 className="text-2xl font-bold">Anime Quiz</h1>
          </a>
        </div>
        <div className="bg-inherit me-3">
          <ModeToggle />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
