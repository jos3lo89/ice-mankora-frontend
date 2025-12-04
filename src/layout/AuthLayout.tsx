import { ModeToggle } from "@/components/theme/mode-toggle";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <header className="flex justify-between items-center px-10">
        <img
          src="./logo.webp"
          alt="logo de ice mankora"
          className="max-w-[100px]"
        />

        <ModeToggle />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default AuthLayout;
