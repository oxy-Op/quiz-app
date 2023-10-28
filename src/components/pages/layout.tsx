import { Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "../mode-toggle";
import { User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { profile } from "@/lib/profile";
import { useModal } from "../hooks/modal-store";

const Layout = () => {
  const { onOpen } = useModal();
  const user = profile();

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
        <div className="flex items-center justify-center space-x-3 bg-inherit me-3">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <User2 className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="me-3">
              <DropdownMenuLabel>
                {user.name}#{user.id}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onOpen("editProfile")}>
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpen("settings")}>
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
