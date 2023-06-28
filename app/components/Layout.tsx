import { Form, Link } from "@remix-run/react";
import { ReactNode, useEffect, useState } from "react";
import { GrGithub, GrLinkedin, GrTwitter, GrYoutube } from 'react-icons/gr'
import { HiMenuAlt4, HiOutlineSun, HiOutlineMoon, HiX } from 'react-icons/hi'
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
  let isDesktop = useMediaQuery('(min-width: 768px)')

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
        <div className="flex gap-4 justify-between w-full item-center dark:text-slate-100 pl-4 pr-5 items-center">
          <div>
            <Link prefetch="intent" to="/">
              <h1 className="text-2xl uppercase font-bold">F.Y.S Design</h1>
            </Link>
          </div>
          <div className='flex gap-2 md:gap-8'>
            {isDesktop ?
              <nav className="flex gap-4 items-center text-xl">
                <Link prefetch="intent" to="/blog">Blog</Link>
                <Link prefetch="intent" to="/projects">Projects</Link>
                <Link prefetch="intent" to="/contact">Contact</Link>
              </nav> :
              <button className="p-4">
                {isMenuOpen ?
                  <HiX onClick={() => setIsMenuOpen(false)} className='text-2xl' /> :
                  <HiMenuAlt4 onClick={() => setIsMenuOpen(true)} className='text-2xl' />
                }
              </button>
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
            <nav className="flex gap-4 my-2">
              <Link prefetch="intent" to="/blog" onClick={closeMenu}>Blog</Link>
              <Link prefetch="intent" to="/projects" onClick={closeMenu}>Projects</Link>
              <Link prefetch="intent" to="/contact" onClick={closeMenu}>Contact</Link>
            </nav>
          )
        }
      </header>
      {children}
      <footer className="bg-primary">
        <div className="flex flex-col gap-4 py-8 items-center text-center">
          <ul>
            <li><Link to="">Testimonials</Link></li>
            <li><Link to="">Services</Link></li>
            <li><Link to="">About</Link></li>
            <li><Link to="">Contact</Link></li>
            <li><Link to="">Portfolio</Link></li>
            <li><Link to="">Case Studies</Link></li>
          </ul>
          <div className="flex gap-2">
            {user && user.role === "ADMIN" && <Link className="hover:underline" to="admin">Admin</Link>}
          </div>
        </div>
      </footer>
    </div>
  );
};