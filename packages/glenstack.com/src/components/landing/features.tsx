import {
  HeartIcon,
  LightningBoltIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import {
  CloudIcon,
  CloudDownloadIcon,
  CollectionIcon,
  GlobeIcon,
  ViewGridAddIcon,
} from "@heroicons/react/outline";
import { FC } from "react";
import { Constellation } from "./constellation";

const features = [
  {
    name: "No-Code Editor",
    description: "Upload and edit your data as easily as a spreadsheet.",
    icon: ViewGridAddIcon,
  },
  {
    name: "Bring Your Team",
    description: "Seamlessly collaborate across your organization.",
    icon: UserGroupIcon,
  },
  {
    name: "External Collaborators",
    description:
      "Crowdsource your data and approve submissions from external contributors.",
    icon: HeartIcon,
  },
  {
    name: "Incredibly Scalable",
    description:
      "You don’t have to worry about sharding, clustering, or redundancy.",
    icon: CloudIcon,
  },
  {
    name: "Global Low Latency",
    description:
      "Access your data with low latency from anywhere in the world with consistent and replicated data.",
    icon: GlobeIcon,
  },
  {
    name: "Zero Lock-In",
    description:
      "Get started with Glenstack immediately without fear of vendor lock-in—we offer 1-click exports for your data.",
    icon: CloudDownloadIcon,
  },
  {
    name: "Version Control",
    description:
      "Snapshot backups and atomic versioning allows changes to be tracked and reverted.",
    icon: CollectionIcon,
  },
  {
    name: "Instant GraphQL APIs",
    description:
      "Immediately serve your data with secure and production-ready GraphQL.",
    icon: LightningBoltIcon,
  },
];

export const Features: FC = () => {
  return (
    <div className="bg-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          The Platform for Data.
        </h2>
        <div className="flex">
          <div className="flex-initial">
            <p className="mt-4 max-w-3xl text-lg text-indigo-200">
              Glenstack is a production-ready, modern data platform. And as
              such, we are embracing the latest and greatest technologies as we
              deliver our application quickly, securely, and with the features
              our customers demand.
            </p>
          </div>
          <div className="flex-initial hidden lg:block ml-16 -mt-16">
            <Constellation />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name}>
              <div>
                <span className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-10">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-indigo-200">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
