import { FC, Fragment } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const navigation = [{ name: "About", href: "/about" }];

export const Header: FC = () => {
  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="bg-indigo-900 h-screen">
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
                        <Link to="/" className="flex text-white items-center">
                          <span className="sr-only">Glenstack</span>
                          <Logo className="h-8 w-auto sm:h-10 text-white" />
                          <p className="ml-4 text-lg font-medium">Glenstack</p>
                        </Link>
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
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="text-base text-white hover:text-gray-300"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                      <Link
                        to="/contact"
                        className="text-base text-white hover:text-gray-300"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/waitlist"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                      >
                        Join Waitlist
                      </Link>
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
                          <Link to="/">
                            <span className="sr-only">Glenstack</span>
                            <Logo className="h-8 w-auto text-indigo-900" />
                          </Link>
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
                          {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                        <div className="mt-6 px-5">
                          <Link
                            to="/contact"
                            className="block text-center w-full py-3 px-4 rounded-md shadow bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                          >
                            Contact Us
                          </Link>
                        </div>
                        <div className="mt-6 px-5">
                          <p className="text-center text-base font-medium text-gray-500">
                            Existing customer?{" "}
                            <Link
                              to="/login"
                              className="text-gray-900 hover:underline"
                            >
                              Login
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <div className="h-full flex justify-center items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="text-center">
                {/* <h1 className="text-5xl tracing-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                Glenstack
              </h1> */}
                <h1 className="mt-4 text-3xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-5xl lg:mt-6 xl:text-5xl">
                  <span className="block">
                    Create, exchange and collaborate on
                  </span>
                  <span className="block text-yellow-500">data</span>
                </h1>

                <div className="mt-10 sm:mt-20">
                  <form action="#" className="sm:max-w-xl sm:mx-auto">
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="block py-3 px-7 rounded-full shadow bg-rose-600 text-white font-medium hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 focus:ring-offset-gray-900"
                      >
                        Join Waitlist
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
