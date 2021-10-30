import { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ScrollToTop } from "./components/scrollToTop";
import { Login } from "./pages/authentication/login";
import { WaitList } from "./pages/authentication/waitlist";
import { Bounties } from "./pages/bounties";
import { CreateListing } from "./pages/bounties/createListing";
import { ViewListing } from "./pages/bounties/viewListing";
import { ContactListing } from "./pages/bounties/contactListing";
import { Homepage } from "./pages/landing";
import { Terms } from "./pages/landing/terms";
import { Privacy } from "./pages/landing/privacy";
import { About } from "./pages/landing/about";
import { MethodNotAllowed } from "./pages/landing/methodNotAllowed";
import { InternalError } from "./pages/landing/internalError";
import { NotFound } from "./pages/landing/notFound";
import { Blog } from "./pages/blog";
import { Contact } from "./pages/landing/contact";

export const App: FC = () => {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/waitlist" exact>
            <WaitList />
          </Route>
          <Route path="/bounties" exact>
            <Bounties />
          </Route>
          <Route path="/create-listing" exact>
            <CreateListing />
          </Route>
          <Route path="/view-listing" exact>
            {
              //should be /id or something/
            }
            <ViewListing />
          </Route>
          <Route path="/contact-listing" exact>
            <ContactListing />
          </Route>
          <Route path="/terms" exact>
            <Terms />
          </Route>
          <Route path="/privacy" exact>
            <Privacy />
          </Route>
          <Route path="/about" exact>
            <About />
          </Route>
          <Route path="/contact" exact>
            <Contact />
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
    </>
  );
};
