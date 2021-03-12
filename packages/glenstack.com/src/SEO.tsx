import { FC } from "react";
import { Helmet } from "react-helmet";

export const SEO: FC = () => {
  const url = "https://glenstack.com/";
  const name = "Glenstack";
  const headline = "Glenstack";
  const alternativeHeadline = "TODO";
  const title = "TODO";
  const description = "TODO";
  const keywords: string[] = [];

  // Greg, James, Ragnor
  const facebookAdmins = ["100005449818562", "100001367004327", "1429747215"];

  const jsonld = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "@id": "https://glenstack.com/#GlenstackWebsite",
    about: {
      "@type": "Organization",
      "@id": "https://glenstack.com/#GlenstackOrganization",
      name,
      sameAs: [],
      url: "https://glenstack.com/",
      // TODO
    },
    alternativeHeadline,
    author: {
      "@type": "Organization",
      "@id": "https://glenstack.com/#GlenstackOrganization",
    },
    copyrightHolder: {
      "@type": "Organization",
      "@id": "https://glenstack.com/#GlenstackOrganization",
    },
    copyrightYear: "2021",
    dateCreated: "2021-03-05",
    dateModified: (window as any).FAB_SETTINGS.BUILD_DATETIME,
    datePublished: "2021-03-05",
    headline,
    inLanguage: "en",
    isAccessibleForFree: "http://schema.org/True",
    isFamilyFriendly: "http://schema.org/True",
    keywords: keywords.join(","),
    mainEntity: {
      "@type": "Organization",
      "@id": "https://glenstack.com/#GlenstackOrganization",
    },
    thumbnailUrl: "TODO",
    description,
    name,
    potentialAction: {
      "@type": "Action",
      actionStatus: "http://schema.org/PotentialActionStatus",
      location: {
        "@type": "VirtualLocation",
        "@id": "https://glenstack.com/#GlenstackWebsite",
      },
    },
    url,
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(",")} />
      {/***
       * Open Graph
       */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content="TODO" />
      {/***
       * Facebook
       */}
      {facebookAdmins.map((admin) => (
        <meta property="fb:admins" key={admin} content={admin} />
      ))}
      <meta property="fb:pages" content="112319017143183" />
      {/***
       * Twitter
       */}
      <meta property="twitter:card" content="summary" />
      {/* @username */}
      <meta property="twitter:site" content="TODO" />
      {/* @username */}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:creator" content="TODO" />
      {/* Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported. Only the first frame of an animated GIF will be used. SVG is not supported.*/}
      <meta property="twitter:image" content="TODO" />
      {/* Maximum 420 characters */}
      <meta property="twitter:image:alt" content="TODO" />
      {/***
       * JSON-LD
       */}
      <script type="application/ld+json">{JSON.stringify(jsonld)}</script>;
    </Helmet>
  );
};
