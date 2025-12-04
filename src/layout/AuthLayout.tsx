import { ModeToggle } from "@/components/theme/mode-toggle";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <header className="flex justify-end items-center px-10 py-5">
        <ModeToggle />
      </header>
      <section className="py-5">
        <img
          src="./logo.webp"
          alt="logo de ice mankora"
          className="mx-auto max-w-[100px]"
        />
      </section>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
