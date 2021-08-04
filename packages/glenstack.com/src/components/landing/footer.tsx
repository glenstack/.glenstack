import { FC, SVGProps } from "react";
import { MagicLink } from "../magicLink";
import { Logo } from "../logo";
import {
  faDev,
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FooterCTA } from "./footerCTA";
import { useState } from "react";
import { useEffect } from "react";

const navigation = {
  support: [
    { name: "Get In Touch", href: "/contact" },
    { name: "Discord", href: "https://discord.gg/F2hV6AXy44" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/glenstackcom/",
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <FontAwesomeIcon icon={faFacebook} />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/glenstack/",
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <FontAwesomeIcon icon={faInstagram} />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/glenstack_com",
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <FontAwesomeIcon icon={faTwitter} />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/glenstack/",
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <FontAwesomeIcon icon={faGithub} />
        </svg>
      ),
    },
    {
      name: "Discord",
      href: "https://discord.gg/F2hV6AXy44",
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <FontAwesomeIcon icon={faDiscord} />
        </svg>
      ),
    },
    {
      name: "DEV",
      href: "https://dev.to/glenstack",
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <FontAwesomeIcon icon={faDev} />
        </svg>
      ),
    },
  ],
};

export const Footer: FC<{ noCTA?: boolean }> = ({ noCTA = false }) => {
  const [status, setStatus] = useState<{ text: string; color: string }>({
    text: "Loading...",
    color: "bg-grey-500",
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://status.glenstack.com/api/v1/status-page/info"
      );
      const {
        config: { all_monitors_operational, not_all_monitors_operational },
        monitors,
      } = await response.json();
      let text = all_monitors_operational;
      let color = "bg-green-500";

      for (const {
        last_check: { operational },
      } of monitors) {
        if (!operational) {
          text = not_all_monitors_operational;
          color = "bg-yellow-500";
          break;
        }
      }
      setStatus({ text, color });
    })();
  }, []);

  return (
    <footer className="bg-white" aria-labelledby="footerHeading">
      {!noCTA && <FooterCTA />}
      <h2 id="footerHeading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-12 xl:col-span-1">
            <MagicLink
              to="/"
              className="flex items-center text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Glenstack</span>
              <Logo className="h-8 w-auto sm:h-10" />
              <p className="ml-4 text-lg font-semibold">Glenstack</p>
            </MagicLink>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <MagicLink
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </MagicLink>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Social
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.social.map((item) => (
                    <li key={item.name}>
                      <MagicLink
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </MagicLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <MagicLink
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </MagicLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <MagicLink
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </MagicLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <MagicLink
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </MagicLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="w-full text-sm font-light text-gray-400 lg:flex lg:justify-between lg:items-center">
            <span className="block mb-2 lg:w-1/3 lg:my-0">
              ©2021 Glenstack Ltd.
            </span>
            <div className="mt-6 lg:my-0 lg:w-1/3 lg:text-right">
              <MagicLink
                href="https://status.glenstack.com"
                className="inline-block lg:ml-auto"
              >
                <span
                  className={`inline-block w-2 h-2 mr-2 rounded-full ${status.color}`}
                ></span>
                <span>{status.text}</span>
              </MagicLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
