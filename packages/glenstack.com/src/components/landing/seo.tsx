import { Organization, Person, WebSite } from "schema-dts";
import { Helmet } from "react-helmet";
import { FC } from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

const gregBrimble: Person = {
  "@type": "Person",
  "@id": "https://glenstack.com/#GregBrimble",
  name: "Greg Brimble",
  sameAs: [
    "https://gregbrimble.com/",
    "https://www.wikidata.org/wiki/Q52444075",
    "https://twitter.com/gregbrimble",
    "https://uk.linkedin.com/in/gregbrimble",
    "https://github.com/GregBrimble",
    "https://instagram.com/gregbrimble",
    "https://facebook.com/gregbrimble",
    "https://medium.com/@gregbrimble",
  ],
  url: "https://gregbrimble.com/",
};

const ragnorComerford: Person = {
  "@type": "Person",
  "@id": "https://glenstack.com/#RagnorComerford",
  name: "Ragnor Comerford",
  sameAs: ["https://ragnor.co/"],
  url: "https://ragnor.co/",
};

const jamesODonnell: Person = {
  "@type": "Person",
  "@id": "https://glenstack.com/#JamesODonnell",
  name: "James O'Donnell",
  sameAs: ["https://www.james-odonnell.com/"],
  url: "https://www.james-odonnell.com/",
};

const glenstackOrganization: Organization = {
  "@type": "Organization",
  "@id": "https://glenstack.com/#GlenstackOrganization",
  name: "Glenstack",
  description: "Create, exchange, and collaborate on data",
  email: "hello@glenstack.com",
  founder: [gregBrimble, ragnorComerford, jamesODonnell],
  image: "https://glenstack.com/logo512.png",
  logo: "https://glenstack.com/logo512.png",
  // makesOffer: {
  //   "@type": "Offer",
  //   "@id": "https://glenstack.com/#DatabaseHosting",
  // },
  sameAs: [
    "https://www.wikidata.org/wiki/Q94578094",
    "https://twitter.com/glenstackcom",
    "https://github.com/glenstack",
    "https://dev.to/glenstack",
    "https://www.instagram.com/glenstack/",
    "https://www.facebook.com/glenstackcom/",
    "https://www.linkedin.com/company/glenstack/",
  ],
  slogan: "Create, exchange, and collaborate on data",
  url: "https://glenstack.com/",
};

const glenstackWebSite: WebSite = {
  "@id": "https://glenstack.com/#GlenstackWebSite",
  "@type": "WebSite",
  name: "glenstack.com",
  about: glenstackOrganization,
  alternativeHeadline: "Create, exchange, and collaborate on data",
  copyrightYear: 2021,
  dateCreated: "2021-05-19",
  dateModified: "2021-05-19",
  datePublished: "2021-05-19",
  headline: "Glenstack",
  inLanguage: "en",
  isAccessibleForFree: "https://schema.org/True",
  isFamilyFriendly: "https://schema.org/True",
  keywords: "",
  description: "Create, exchange, and collaborate on data",
  url: "https://glenstack.com/",
};

export const SEO: FC<SEOProps> = ({ title, description }) => {
  return (
    <Helmet defaultTitle="Glenstack" titleTemplate="Glenstack | %s">
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          ...glenstackWebSite,
        })}
      </script>
    </Helmet>
  );
};
