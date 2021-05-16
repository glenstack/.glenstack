import { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./pages/authentication/login";
import { Homepage } from "./pages/landing";
import { Terms } from "./pages/landing/terms";
import { About } from "./pages/landing/about";
import { MethodNotAllowed } from "./pages/landing/methodNotAllowed";
import { InternalError } from "./pages/landing/internalError";
import { NotFound } from "./pages/landing/notFound";
import { Blog } from "./pages/blog";

export const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/terms" exact>
          <Terms />
        </Route>
        <Route path="/about" exact>
          <About />
        </Route>
        <Route path="/blog">
          <Blog />
        </Route>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/405" exact>
          <MethodNotAllowed />
        </Route>
        <Route path="/500" exact>
          <InternalError />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
