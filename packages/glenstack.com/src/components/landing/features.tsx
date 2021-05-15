import {
  ChipIcon,
  CloudIcon,
  // CubeTransparentIcon,
  // CubeIcon,
  // DatabaseIcon,
  DesktopComputerIcon,
  // DocumentDuplicateIcon,
  // DocumentSearchIcon,
  // DocumentTextIcon,
  // FingerPrintIcon,
  GlobeAltIcon,
  // GlobeIcon,
  HeartIcon,
  // HomeIcon,
  // KeyIcon,
  // LockClosedIcon,
  // SearchCircleIcon,
  // SearchIcon,
  // ServerIcon,
  // ShieldCheckIcon,
  // SparklesIcon,
  // StatusOnlineIcon,
  // SupportIcon,
  // TableIcon,
  // TemplateIcon,
  // TerminalIcon,
  // TrendingUpIcon,
  // UploadIcon,
  // UserGroupIcon,
  UsersIcon,
  // ViewGridAddIcon,
  ShareIcon,
  // PencilAltIcon,
  SaveAsIcon,
} from "@heroicons/react/outline";
import { FC } from "react";

// const cool = [
//   ChipIcon,
//   CloudIcon,
//   CubeTransparentIcon,
//   CubeIcon,
//   DatabaseIcon,
//   DesktopComputerIcon,
//   DocumentDuplicateIcon,
//   DocumentSearchIcon,
//   DocumentTextIcon,
//   FingerPrintIcon,
//   GlobeAltIcon,
//   GlobeIcon,
//   HeartIcon,
//   HomeIcon,
//   KeyIcon,
//   LockClosedIcon,
//   SearchCircleIcon,
//   SearchIcon,
//   ServerIcon,
//   ShieldCheckIcon,
//   SparklesIcon,
//   StatusOnlineIcon,
//   SupportIcon,
//   TableIcon,
//   TemplateIcon,
//   TerminalIcon,
//   TrendingUpIcon,
//   UploadIcon,
//   UserGroupIcon,
//   UsersIcon,
//   ViewGridAddIcon,
// ];

const features = [
  {
    name: "Auto-Generated GraphQL APIs",
    description:
      "Instantly turn your data into a full database with GraphQL API and documentation.",
    icon: ChipIcon,
  },
  {
    name: "Live Collaborative Editing",
    description:
      "Collaborate live with your team or crowdsource your data from external ",
    icon: UsersIcon,
  },
  {
    name: "Version Control",
    description:
      "Git-like atomic versioning allows changes to be tracked and reverted.",
    icon: ShareIcon,
  },
  {
    name: "No-code Spreadsheet View",
    description: "Easily edit your data without code.",
    icon: DesktopComputerIcon,
  },
  {
    name: "External Collaborators",
    description:
      "Crowdsource your data and approve data submissions from external contributors.",
    icon: CloudIcon,
  },
  {
    name: "Secure Backups & 1-click Exports",
    description:
      "Get absolute safety and zero lock-in with secure backups and 1-click exports.",
    icon: SaveAsIcon,
  },
  {
    name: "Global low-latency",
    description:
      "Access your data with low latency from anywhere in the world with consistent and globally replicated data.",
    icon: GlobeAltIcon,
  },
  {
    name: "Incredibly scalable",
    description:
      "Your database scales automatically without having to worry about data sharding, clustering, replication, upgrades.",
    icon: HeartIcon,
  },
];

export const Features: FC = () => {
  return (
    <div className="bg-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          A Complete Data Hub
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-indigo-200">
          Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et
          magna sit morbi lobortis. Blandit aliquam sit nisl euismod mattis in.
        </p>
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
