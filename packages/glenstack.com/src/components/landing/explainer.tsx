import { FC } from "react";
import createImage from "./assets/create.png";
import collaborateImage from "./assets/collaborate.png";
import exchangeImage from "./assets/exchange.png";

/* This example requires Tailwind CSS v2.0+ */
// import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, MailIcon, ScaleIcon } from '@heroicons/react/outline'
export const Explainer: FC = () => {
  return (
    <div className="py-16 overflow-hidden lg:py-24">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your database in one click
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            magnam voluptatum cupiditate veritatis in, accusamus quisquam.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <span className="mb-10 rounded-xl bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 tracking-wide uppercase">
              create
            </span>
            <h3 className="mt-3 text-2xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Seamlessly create and <br></br>access your data{" "}
              <span className="text-rose-600">without code</span>.
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Seamlessly create data with our no-code spreadsheet UI or drag and
              drop your existing csv and json files to automatically generate a
              database. Instantly access your data with our auto-generated
              GraphQL API.
            </p>
          </div>

          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <img
              className="relative mx-auto"
              width={490}
              src={createImage}
              alt=""
            />
          </div>
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mt-24">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2">
              <span className="mb-10 rounded-xl bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-500 tracking-wide uppercase">
                collaborate
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Easily collaborate on data<br></br> with your team,<br></br>or
                the <span className="text-yellow-500">entire world</span>.
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Glenstack makes it easy to collaborate live on data with your
                team. You can also crowdsource your data and allow external
                collaborators to submit data to be approved by your team.
              </p>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
              <img
                className="relative mx-auto"
                width={490}
                src={collaborateImage}
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <span className="mb-10 rounded-xl bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 tracking-wide uppercase">
              exchange
            </span>
            <h3 className="mt-3 text-2xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Share or access live, ready-to-query<br></br>data from our{" "}
              <span className="text-rose-600">marketplace</span>.
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Share or sell your data on our data marketplace and build a
              business on top of your data. Access third-party data to power
              your app or provide deeper insights to your organization.
            </p>
          </div>

          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <img
              className="relative mx-auto"
              width={490}
              src={exchangeImage}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
