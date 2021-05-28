// import HowWereBuildingGlenstack from "./how-we-re-building-glenstack/index.mdx";
import { FC } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";
import { HowWereBuildingGlenstack } from "./building-tmp";

export const Blog: FC = () => {
  const match = useRouteMatch();

  return (
    <>
      <Header />
      <Switch>
        <Route path={`${match.path}/how-we-re-building-glenstack`}>
          <HowWereBuildingGlenstack />
        </Route>
        <Route path={match.path} exact>
          <SEO
            title="Blog"
            description="A collection of articles by the Glenstack team."
          />
          <Redirect to="/blog/how-we-re-building-glenstack" />
        </Route>
      </Switch>
      <Footer />
    </>
  );
};
