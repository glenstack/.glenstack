// eslint-disable-next-line import/no-webpack-loader-syntax
import HowWereBuildingGlenstack from "!xdm/webpack.cjs!./how-were-building-glenstack/index.mdx";
import { FC } from "react";
import { Route, Switch, useRouteMatch } from "react-router";

export const Blog: FC = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/how-were-building-glenstack`}>
        <HowWereBuildingGlenstack />
      </Route>
    </Switch>
  );
};
