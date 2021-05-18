import { ChevronDoubleDownIcon } from "@heroicons/react/outline";
import { FC } from "react";
import { MagicLink } from "../magicLink";
import { LeftGhost, RightGhost } from "./ghosts";

export const Hero: FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mx-auto flex-1 flex justify-center items-center">
        <div className="hidden lg:block mr-16">
          <LeftGhost />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-5xl tracing-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              Glenstack
            </h1>
            <h1 className="mt-4 text-3xl tracking-tight font-semibold text-white sm:mt-5 lg:mt-6 md:text-4xl">
              Create, exchange, and collaborate on{" "}
              <span className="text-yellow-500">data</span>
            </h1>

            <div className="mt-10 sm:mt-20">
              <form action="#" className="sm:max-w-xl sm:mx-auto">
                <div className="flex justify-center">
                  <MagicLink
                    href="/waitlist"
                    className="block py-3 px-7 rounded-full shadow bg-rose-600 text-white font-medium hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 focus:ring-offset-gray-900"
                  >
                    Join Waitlist
                  </MagicLink>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:block ml-16">
          <RightGhost />
        </div>
      </div>
      <MagicLink
        href="#explainer"
        className="mx-auto transform -translate-y-28 text-white"
      >
        <ChevronDoubleDownIcon className="text-white w-8" />
      </MagicLink>
    </div>
  );
};
