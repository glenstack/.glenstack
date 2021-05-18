import { FC, Fragment } from "react";
import { Logo } from "../logo";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { MagicLink } from "../magicLink";

const links = [
  { name: "About", href: "/about" },
  { name: "Sign In", href: "/login" },
];

export const Header: FC = ({ children }) => {
  return (
    <div>
      <div className="relative overflow-hidden">
        <div className={`bg-indigo-900 ${children ? "h-screen" : "pb-6"}`}>
          <Popover as="header" className="relative">
            {({ open }) => (
              <>
                <div className="pt-6">
                  <nav
                    className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
                    aria-label="Glenstack"
                  >
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-between w-full md:w-auto">
                        <MagicLink
                          href="/"
                          className="flex text-white items-center"
                        >
                          <span className="sr-only">Glenstack</span>
                          <Logo className="h-8 w-auto sm:h-10 text-white" />
                          <p className="ml-4 text-lg font-semibold">
                            Glenstack
                          </p>
                        </MagicLink>
                        <div className="-mr-2 flex items-center md:hidden">
                          <Popover.Button className="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-6">
                      <div className="hidden space-x-8 md:flex md:ml-10">
                        {links.map((link) => (
                          <MagicLink
                            key={link.name}
                            href={link.href}
                            className="text-base text-white hover:text-gray-300"
                          >
                            {link.name}
                          </MagicLink>
                        ))}
                      </div>
                      <MagicLink
                        href="/waitlist"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                      >
                        Join Waitlist
                      </MagicLink>
                    </div>
                  </nav>
                </div>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-100 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    static
                    className="absolute top-0 inset-x-0 p-2 transition transform origin-top md:hidden"
                  >
                    <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="px-5 pt-4 flex items-center justify-between">
                        <div>
                          <MagicLink href="/">
                            <span className="sr-only">Glenstack</span>
                            <Logo className="h-8 w-auto text-indigo-900" />
                          </MagicLink>
                        </div>
                        <div className="-mr-2">
                          <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                            <span className="sr-only">Close menu</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                      <div className="pt-5 pb-6">
                        <div className="px-2 space-y-1">
                          {links.map((link) => (
                            <MagicLink
                              key={link.name}
                              href={link.href}
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                            >
                              {link.name}
                            </MagicLink>
                          ))}
                        </div>
                        <div className="mt-6 px-5">
                          <MagicLink
                            href="/waitlist"
                            className="block text-center w-full py-3 px-4 rounded-md shadow bg-gray-600 text-white font-medium hover:bg-gray-700"
                          >
                            Join Waitlist
                          </MagicLink>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          {children}
        </div>
      </div>
    </div>
  );
};
