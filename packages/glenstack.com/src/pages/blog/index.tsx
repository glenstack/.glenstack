// import HowWereBuildingGlenstack from "./how-we-re-building-glenstack/index.mdx";
import { FC } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

export const Blog: FC = () => {
  const match = useRouteMatch();

  return (
    <div className="prose xl:prose-xl">
      <Switch>
        <Route path={`${match.path}/how-we-re-building-glenstack`}>
          {/* <HowWereBuildingGlenstack /> */}
        </Route>
        <Route path="/" exact>
          BLOG
        </Route>
      </Switch>
    </div>
  );
};
