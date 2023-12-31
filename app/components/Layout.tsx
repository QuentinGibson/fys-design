import { Link } from "@remix-run/react";
import { ReactNode, useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { Theme, useTheme } from "~/utils/theme-provider";
import { useMediaQuery } from "usehooks-ts";
import { useOptionalUser } from "~/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useTheme();
  const isDark = theme === Theme.DARK;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let isDesktop = useMediaQuery("(min-width: 1050px)");
  let isPhone = useMediaQuery("(max-width: 410px");

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
        <div className="item-center dark:text-slate-100 flex w-full items-center justify-start gap-4 pl-4 pr-5">
          <div className="min-w-[240px]">
            <Link prefetch="intent" to="/">
              <h1 className="font-sauce text-3xl font-semibold uppercase">
                F.Y.S Design
              </h1>
            </Link>
          </div>
          <div className="flex w-full gap-2 md:gap-8">
            {isDesktop ? (
              <nav className="box-border flex w-full items-center justify-between font-display text-base">
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
                  <Link prefetch="intent" to="/case">
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
                {!isPhone && (
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
              <nav className="my-2 flex justify-center gap-4">
                <Link
                  className="hover:font-bold"
                  prefetch="intent"
                  to="/blog"
                  onClick={closeMenu}
                >
                  Blog
                </Link>
                <Link
                  className="hover:font-bold"
                  prefetch="intent"
                  to="/projects"
                  onClick={closeMenu}
                >
                  Projects
                </Link>
                <Link
                  className="hover:font-bold"
                  prefetch="intent"
                  to="/contact"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </nav>
            )}
      </header>
      {children}
      <footer className="bg-primary px-12 py-12 font-sauce font-semibold">
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
              <Link className="hover:underline" to="admin">
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
