import { FC } from "react";
import { MagicLink } from "../magicLink";

export const FooterCTA: FC = () => {
  return (
    <div className="bg-indigo-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          <span>Launching Summer, 2021.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <MagicLink
              href="/waitlist"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-white bg-pink-600 hover:bg-pink-700"
            >
              Join Waitlist
            </MagicLink>
          </div>
        </div>
      </div>
    </div>
  );
};
