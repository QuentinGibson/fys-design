import { Link } from "@remix-run/react";
import { ReactNode, useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { Theme, useTheme } from "~/utils/theme-provider";
import { useMediaQuery } from "usehooks-ts";
import { useOptionalUser } from "~/utils";
import FlashMessage from "../routes/FlashMessage";

interface LayoutProps {
  message: flashMessage;
  children: ReactNode;
}

export default function Layout({ children, message }: LayoutProps) {
  const [theme, setTheme] = useTheme();
  const isDark = theme === Theme.DARK;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let isDesktop = useMediaQuery("(min-width: 1050px)");

  const user = useOptionalUser();
  const changeTheme = () => {
    setTheme(isDark ? Theme.LIGHT : Theme.DARK);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] text-white">
      <header className=" dark:bg-slate-800 dark:border-slate-300 flex flex-col items-center justify-between border-b border-white/10 bg-primary px-4 py-5">
        <div className="item-center dark:text-slate-100 flex w-full items-center justify-start md:gap-8 pl-4 pr-5">
          <div className="">
            <Link prefetch="intent" to="/">
              <h1 className="font-sauce text-3xl font-semibold uppercase">
                <img src={"/static/FYS-logo.svg"} alt="" />
              </h1>
            </Link>
          </div>
          <div className="flex w-full gap-2 md:gap-8">
            {isDesktop ? (
              <nav className="box-border flex w-full items-center justify-between font-display tracking-[1.8px] text-base">
                <div className="flex gap-8 font-bold uppercase">
                  <Link prefetch="intent" to="/">
                    Home
                  </Link>
                  <Link prefetch="intent" to="/services">
                    Services
                  </Link>
                  <Link prefetch="intent" to="/about">
                    About
                  </Link>
                  <Link prefetch="intent" to="/portfolio">
                    Portfolio
                  </Link>
                  <Link prefetch="intent" to="/case-studies">
                    Case Studies
                  </Link>
                  <Link prefetch="intent" to="/testimonials">
                    Testimonials
                  </Link>
                </div>
                <div>
                  <Link
                    className="border-2 px-8 py-3 font-display text-sm font-semibold hover:bg-white  hover:text-primary"
                    prefetch="intent"
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                </div>
              </nav>
            ) : (
              <div className="flex w-full items-center justify-end">
                {!isDesktop && (
                  <button className="p-4">
                    {isMenuOpen ? (
                      <HiX
                        onClick={() => setIsMenuOpen(false)}
                        className="text-3xl"
                      />
                    ) : (
                      <HiMenuAlt4
                        onClick={() => setIsMenuOpen(true)}
                        className="text-3xl"
                      />
                    )}
                  </button>
                )}
              </div>
            )}
            {/* <button>
              {isDark ?
                <HiOutlineSun onClick={changeTheme} className='text-2xl' /> :
                <HiOutlineMoon onClick={changeTheme} className='text-2xl' />
              }
            </button> */}
          </div>
        </div>
        {isDesktop
          ? null
          : isMenuOpen && (
            <nav className="my-2 flex flex-col justify-center gap-4">
              <Link
                className="hover:font-bold"
                prefetch="intent"
                to="/services"
                onClick={closeMenu}
              >
                Services
              </Link>
              <Link
                className="hover:font-bold"
                prefetch="intent"
                to="/about"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                className="hover:font-bold"
                prefetch="intent"
                to="/portfolio"
                onClick={closeMenu}
              >
                Portfolio
              </Link>
              <Link
                className="hover:font-bold"
                prefetch="intent"
                to="/case-studies"
                onClick={closeMenu}
              >
                Case Studies
              </Link>
              <Link
                className="hover:font-bold"
                prefetch="intent"
                to="/testimonials"
                onClick={closeMenu}
              >
                Testimonials
              </Link>
              <Link
                className="hover:font-bold"
                prefetch="intent"
                to="/contact"
                onClick={closeMenu}
              >
                Contact Us
              </Link>
            </nav>
          )}
      </header>
      <FlashMessage message={message} />
      {children}
      <footer className="bg-primary px-12 py-8 font-sauce font-semibold">
        <div className="flex flex-col items-center justify-center gap-10 py-12 text-center text-base lg:flex-row">
          <div className="flex w-full justify-center md:justify-start">
            <ul className="grid gap-4 md:grid-cols-3 md:flex-row">
              <li className="text-start">
                <Link to="">Testimonials</Link>
              </li>
              <li className="text-start">
                <Link to="">Services</Link>
              </li>
              <li className="text-start">
                <Link to="">About</Link>
              </li>
              <li className="text-start">
                <Link to="">Contact</Link>
              </li>
              <li className="text-start">
                <Link to="">Portfolio</Link>
              </li>
              <li className="text-start">
                <Link to="">Case Studies</Link>
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            {user && user.role === "ADMIN" && (
              <Link className="hover:underline" to="superadmin">
                Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <span className="text-sm">© F.Y.S Design</span>
        </div>
      </footer>
    </div>
  );
}
