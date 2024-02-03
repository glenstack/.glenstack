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

export const ContactListing: FC = () => {
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  return (
    <>
      <div className="min-h-full">
        <div className="bg-indigo-900 pb-32">
          <Header />
          <header className="max-w-7xl mx-auto flex py-10">
            <div className=" px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white">
                Contact {bounties[id].author} about {bounties[id].title}
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
              <form className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="about"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Your message
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                            defaultValue={""}
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Explain how you can help, structure of your dataset
                            etc.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Your Contact Information
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        This will be passed on to the bounty issuer
                      </p>
                    </div>
                    <div className="space-y-6 sm:space-y-5">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          First name
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            autoComplete="given-name"
                            className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Last name
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            autoComplete="family-name"
                            className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Email address
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer noCTA={true} />
    </>
  );
};
