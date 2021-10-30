// import HowWereBuildingGlenstack from "./how-we-re-building-glenstack/index.mdx";
import { FC } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { Fragment } from "react";
import { MagicLink } from "../../components/magicLink";
import { UsersIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/solid";

const bounties = [
  {
    title: "Startup Revenues 2017 needed urgently",
    author: "Stripe",
    description: "Sample description",
    offer: "negotiable",
    id: 0,
  },
  {
    title: "Startup Revenues 2018 needed urgently",
    author: "Stripe",
    description: "Sample description",
    offer: "negotiable",
    id: 1,
  },
  {
    title: "Open sourced Traffic at 16.0.1",
    author: "Glenstack",
    description: "Sample description",
    offer: "£100/mo",
    id: 2,
  },
  {
    title: "Jupiter hades cryptotron",
    author: "Google",
    description: "Sample description",
    offer: "£10k",
    id: 3,
  },
  {
    title: "Venusian delorad",
    author: "Cython OS",
    description: "Sample description",
    offer: "£1k",
    id: 4,
  },
  {
    title: "I am altering the dataset",
    author: "Darth Vader",
    description: "Sample description",
    offer: "£negotiable",
    id: 5,
  },
  {
    title: "Dance Deluge wanted",
    author: "The Academy",
    description: "Sample description",
    offer: "Open source",
    id: 6,
  },
  {
    title: "DOOM 2016 soundtrack",
    author: "Bethesda",
    description: "Sample description",
    offer: "10p",
    id: 7,
  },
  {
    title: "Tyranosarus Texts",
    author: "Walmart",
    description: "Sample description",
    offer: "£1k/mo",
    id: 8,
  },
  {
    title: "Velocitractor",
    author: "John Deere",
    description: "Sample description",
    offer: "£500/mo",
    id: 9,
  },
  {
    title: "Stegajorsus",
    author: "Paul McCartney",
    description: "Sample description",
    offer: "£5",
    id: 10,
  },
];

export const Bounties: FC = () => {
  return (
    <>
      <div className="min-h-full">
        <div className="bg-indigo-900 pb-32">
          <Header />
          <header className="max-w-7xl mx-auto flex py-10">
            <div className=" px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white">Data Bounties</h1>
              <h3 className="text-medium font-bold text-white">
                Create or respond to data bounties!
              </h3>
            </div>
            <MagicLink
              href="/create-listing"
              className="items-center hidden sm:inline-flex px-2 sm:px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 mr-8 ml-auto"
            >
              Create listing
            </MagicLink>
            <MagicLink
              href="/create-listing"
              className="inline-flex items-center block sm:hidden mt-5 mb-1 border border-transparent text-3xl font-medium rounded-3xl text-white bg-rose-600 hover:bg-rose-700 mr-8 ml-auto"
            >
              <PlusIcon className="h-10 w-10" aria-hidden="true" />
            </MagicLink>
          </header>
        </div>

        <main className="-mt-32">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow px-0 py-2">
              <ul role="list" className="divide-y divide-gray-200">
                {bounties.map((bounty) => (
                  <li key={bounty.id} className="hover:bg-gray-100 ">
                    <MagicLink href={`/view-listing/?id=${bounty.id}`}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="truncate">
                            <div className="flex text-sm">
                              <p className="font-medium text-indigo-600 truncate">
                                {bounty.title}
                              </p>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <UsersIcon
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <p>
                                  {bounty.author}, {bounty.offer}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                            <div className="flex overflow-hidden -space-x-1 hidden sm:block text-gray-500">
                              View
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <ChevronRightIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </MagicLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
        <Footer noCTA={true} />
      </div>
    </>
  );
};
