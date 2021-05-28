import { FC } from "react";
import { gql } from "graphql-let/macro";
import { MagicLink } from "../magicLink";

interface LegalType {
  name: string;
  href: string;
}

export const legalTypes: Record<string, LegalType> = {
  privacy: {
    name: "Privacy Policy",
    href: `https://www.iubenda.com/privacy-policy/${process.env.REACT_APP_IUBENDA_ID}`,
  },
  terms: {
    name: "Terms of Service",
    href: `https://www.iubenda.com/terms-and-conditions/${process.env.REACT_APP_IUBENDA_ID}`,
  },
};

export const Fallback: FC<LegalType> = ({ name, href }) => (
  <MagicLink href={href} rel="noreferrer" target="_blank">
    {name}
  </MagicLink>
);

export const Content: FC<{ html: string }> = ({ html }) => (
  <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
);

const { useGetLegalQuery } = gql(`
  query GetLegal {
    legal {
      termsOfService
      privacyPolicy
    }
  }
`);

export const LegalContent: FC<{ type: "privacy" | "terms" }> = ({ type }) => {
  const { data } = useGetLegalQuery();

  if (data)
    return (
      <Content
        html={
          type === "privacy"
            ? data.legal.privacyPolicy
            : data.legal.termsOfService
        }
      />
    );

  return <Fallback {...legalTypes[type]} />;
};
