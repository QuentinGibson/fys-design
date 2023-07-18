import { Link } from "@remix-run/react";
import { ReactNode, useState } from "react";
import { HiMenuAlt4, HiX } from 'react-icons/hi'
import { Theme, useTheme } from "~/utils/theme-provider";
import { useMediaQuery } from "usehooks-ts";
import { useOptionalUser } from "~/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useTheme();
  const isDark = theme === Theme.DARK;
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  let isDesktop = useMediaQuery('(min-width: 1050px)')
  let isPhone = useMediaQuery('(max-width: 410px')

  const user = useOptionalUser()
  const changeTheme = () => {
    setTheme(isDark ? Theme.LIGHT : Theme.DARK);
  }
  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full text-white">
      <header className=" flex flex-col justify-between items-center py-5 bg-primary dark:bg-slate-800 border-white/10 dark:border-slate-300 px-4 border-b">
        <div className="flex gap-4 justify-start w-full item-center dark:text-slate-100 pl-4 pr-5 items-center">
          <div className="min-w-[180px]">
            <Link prefetch="intent" to="/">
              <h1 className="text-xl uppercase font-semibold font-sauce">F.Y.S Design</h1>
            </Link>
          </div>
          <div className='flex gap-2 md:gap-8 w-full'>
            {isDesktop ?
              <nav className="flex justify-between w-full items-center text-base box-border font-display">
                <div className="flex gap-4 font-bold uppercase">
                  <Link prefetch="intent" to="/blog">Home</Link>
                  <Link prefetch="intent" to="/blog">Services</Link>
                  <Link prefetch="intent" to="/blog">About</Link>
                  <Link prefetch="intent" to="/blog">Portfolio</Link>
                  <Link prefetch="intent" to="/blog">Case Studies</Link>
                  <Link prefetch="intent" to="/projects">Testimonials</Link>
                </div>
                <div>
                  <Link className="hover:bg-white hover:text-primary px-8 py-3 font-display font-semibold border-2  text-sm" prefetch="intent" to="/contact">Contact Us</Link>
                </div>
              </nav> :
              <div className="flex justify-end w-full items-center">
                {!isPhone && 
                  <Link className="hover:bg-white hover:text-primary px-8 py-3 font-display font-semibold border-2 text-sm tracking-widest" prefetch="intent" to="/contact">Contact Us</Link>}
                <button className="p-4">
                  {isMenuOpen ?
                    <HiX onClick={() => setIsMenuOpen(false)} className='text-3xl' /> :
                    <HiMenuAlt4 onClick={() => setIsMenuOpen(true)} className='text-3xl' />
                  }
                </button>
              </div>

            }
            {/* <button>
              {isDark ?
                <HiOutlineSun onClick={changeTheme} className='text-2xl' /> :
                <HiOutlineMoon onClick={changeTheme} className='text-2xl' />
              }
            </button> */}
          </div>
        </div>
        {isDesktop ?
          null :
          isMenuOpen && (
            <nav className="flex justify-center gap-4 my-2">
              <Link className="hover:font-bold" prefetch="intent" to="/blog" onClick={closeMenu}>Blog</Link>
              <Link  className="hover:font-bold" prefetch="intent" to="/projects" onClick={closeMenu}>Projects</Link>
              <Link className="hover:font-bold" prefetch="intent" to="/contact" onClick={closeMenu}>Contact</Link>
            </nav>
          )
        }
      </header>
      {children}
      <footer className="bg-primary font-semibold font-sauce px-12 py-12">
        <div className="flex flex-col gap-10 py-12 text-base items-center text-center lg:flex-row justify-center">
          <div className="w-full flex justify-center md:justify-start">
            <ul className="grid md:grid-cols-3 md:flex-row gap-4">
              <li className="text-start"><Link to="">Testimonials</Link></li>
              <li className="text-start"><Link to="">Services</Link></li>
              <li className="text-start"><Link to="">About</Link></li>
              <li className="text-start"><Link to="">Contact</Link></li>
              <li className="text-start"><Link to="">Portfolio</Link></li>
              <li className="text-start"><Link to="">Case Studies</Link></li>
            </ul>
          </div>

          <div className="flex gap-2">
            {user && user.role === "ADMIN" && <Link className="hover:underline" to="admin">Admin</Link>}
          </div>
        </div>
        <div className="flex justify-end">
          <span className="text-sm">© F.Y.S Design</span>
        </div>
      </footer>
    </div>
  );
};
