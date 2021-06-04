import { FC } from "react";
import {
  CreateIllustration,
  CollaborateIllustration,
  ExchangeIllustration,
} from "./illustrations";

export const Explainer: FC = () => {
  return (
    <div id="explainer" className="py-16 overflow-hidden lg:py-24">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Build Data First.
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Glenstack empowers you with all the tools you need to develop your
            application with data.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <span className="mb-10 rounded-xl bg-rose-600 px-2.5 py-1 text-xs font-semibold text-rose-50 tracking-wide uppercase">
              Create
            </span>
            <h3 className="mt-3 text-2xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Power your application with an instant{" "}
              <span className="text-rose-600">GraphQL</span> data API.
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Seamlessly create data with our no-code editor or drag-and-drop
              your existing CSV and JSON files. Instantly access your data with
              our auto-generated GraphQL API.
            </p>
          </div>

          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <CreateIllustration className="relative mx-auto w-128 px-6 lg:px-0" />
          </div>
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mt-24">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2">
              <span className="mb-10 rounded-xl bg-yellow-400 px-2.5 py-1 text-xs font-semibold text-yellow-900 tracking-wide uppercase">
                Collaborate
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Easily collaborate on data
                <br /> with your team, or the <br />
                <span className="text-yellow-500">open-source community</span>.
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Glenstack makes it easy to collaborate on data with your team.
                Or, crowdsource your data with easy merge requests and
                collaborative workflows.
              </p>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
              <CollaborateIllustration className="relative mx-auto w-128 px-6 lg:px-0" />
            </div>
          </div>
        </div>

        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <span className="mb-10 rounded-xl bg-rose-600 px-2.5 py-1 text-xs font-semibold text-rose-50 tracking-wide uppercase">
              exchange
            </span>
            <h3 className="mt-3 text-2xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Buy and sell live data access
              <br /> from our <span className="text-rose-600">marketplace</span>
              .
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Build a business on top of your data by sharing or selling access
              on the Glenstack Marketplace. Or, get unified access to rich,
              high-quality data to power your app and provide deeper insights to
              your organization.
            </p>
            {/* <p>Rich, high-quality, ready-to-query, curated and up-to-date</p> */}
          </div>

          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <ExchangeIllustration className="relative mx-auto w-128 px-6 lg:px-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
