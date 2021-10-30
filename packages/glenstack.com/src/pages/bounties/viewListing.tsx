// import HowWereBuildingGlenstack from "./how-we-re-building-glenstack/index.mdx";
import { FC } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { Fragment } from "react";
import { MagicLink } from "../../components/magicLink";
import { useLocation } from "react-router-dom";

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

export const ViewListing: FC = () => {
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  return (
    <>
      <div className="min-h-full">
        <div className="bg-indigo-900 pb-32">
          <Header />
          <header className=" max-w-7xl mx-auto flex py-10">
            <div className=" px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white">Data Bounties</h1>
            </div>
            <div className="ml-auto mr-8">
              <MagicLink
                href={`/create-listing/?id=${id}&edit=true`}
                className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-transparent text-base font-medium rounded-md text-white hover:bg-gray-700"
              >
                Edit
              </MagicLink>
              <MagicLink
                href={`/contact-listing/?id=${id}`}
                className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-gray-700"
              >
                Contact
              </MagicLink>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            {bounties[id] ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-700">
                    {bounties[id].title}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Author
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bounties[id].author}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bounties[id].description}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Offer
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bounties[id].offer}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div>
                No bounty found with that id{" "}
                {
                  //^TODO
                }
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer noCTA={true} />
    </>
  );
};
