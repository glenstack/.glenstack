import { Organization, Person, WebPage, WebSite } from "schema-dts";
import { Helmet } from "react-helmet";
import { FC } from "react";
import { useLocation } from "react-router";

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

const authors = {
  "Greg Brimble": gregBrimble,
  "Ragnor Comerford": ragnorComerford,
  "James O'Donnell": jamesODonnell,
};

interface SEOProps {
  title?: string;
  description?: string;
  authorName?: keyof typeof authors;
  date?: string;
  year?: number;
  image?: string;
}

const glenstack: Organization = {
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

const webSite: WebSite = {
  "@id": "https://glenstack.com/#GlenstackWebSite",
  "@type": "WebSite",
  name: "glenstack.com",
  about: glenstack,
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

export const SEO: FC<SEOProps> = ({
  title,
  description,
  authorName,
  date,
  image,
}) => {
  const { pathname } = useLocation();
  const url = `https://glenstack.com${pathname}`;

  const author = authorName ? authors[authorName] : undefined;

  const schemaOrgObject: WebPage | WebSite = title
    ? {
        "@id": `https://glenstack.com/#${pathname}`,
        "@type": "WebPage",
        name: title,
        abstract: description,
        alternativeHeadline: description,
        author,
        copyrightYear: 2021,
        copyrightHolder: glenstack,
        creator: author,
        dateCreated: date,
        dateModified: date,
        datePublished: date,
        description,
        headline: title,
        isPartOf: webSite,
        url,
      }
    : webSite;

  return (
    <Helmet defaultTitle="Glenstack" titleTemplate="Glenstack | %s">
      {title && <title>{title}</title>}
      <meta
        name="description"
        content={description || "Create, exchange, and collaborate on data"}
      />
      <meta property="og:title" content={title || "Glenstack"} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://glenstack.com/tile.png" />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content={description || "Create, exchange, and collaborate on data"}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@glenstack" />
      <meta name="twitter:creator" content="@glenstack" />
      <meta
        name="twitter:description"
        content={description || "Create, exchange, and collaborate on data"}
      />
      <meta name="twitter:image" content="https://glenstack.com/tile.png" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          ...schemaOrgObject,
        })}
      </script>
    </Helmet>
  );
};
