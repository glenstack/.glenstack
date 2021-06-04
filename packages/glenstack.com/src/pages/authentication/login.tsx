import { FC } from "react";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";
import { Logo } from "../../components/logo";
import { MagicLink } from "../../components/magicLink";
import { useQueryParams } from "../../components/useQueryParams";
import { XCircleIcon, InboxInIcon } from "@heroicons/react/solid";
import { Footer } from "../../components/landing/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export const Login: FC = () => {
  const queryParams = useQueryParams();
  const errors = JSON.parse(queryParams.get("errors") || "[]");

  return (
    <>
      <SEO title="Sign In or Register" description="Welcome to Glenstack" />
      <Header />
      <div className="bg-indigo-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="text-white mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300 max-w-sm mx-auto">
            By providing your email address, you agree to the Glenstack's{" "}
            <MagicLink href="/terms" className="underline">
              Terms of Service
            </MagicLink>{" "}
            and{" "}
            <MagicLink href="/privacy" className="underline">
              Privacy Policy
            </MagicLink>
            .
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {queryParams.has("success") ? (
              <div>
                <div className="rounded-md bg-blue-700 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InboxInIcon
                        className="h-5 w-5 text-blue-50"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-50">
                        Authorization required
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 prose">
                  <p>A login link has been sent to your email address.</p>
                </div>
              </div>
            ) : (
              <>
                <form
                  className="space-y-6"
                  action="https://auth.glenstack.com/login"
                  method="POST"
                >
                  {queryParams.has("errors") && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircleIcon
                            className="h-5 w-5 text-red-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            There were {errors.length} errors with your
                            submission
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <ul className="list-disc pl-5 space-y-1">
                              {errors.map((error: string) => (
                                <li key={error}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      Sign In or Register
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div>
                      <MagicLink
                        href="https://auth.glenstack.com/login/google"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">
                          Sign in or register with Google
                        </span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <FontAwesomeIcon icon={faGoogle} />
                        </svg>
                      </MagicLink>
                    </div>

                    <div>
                      <MagicLink
                        href="https://auth.glenstack.com/login/twitter"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">
                          Sign in or register with Twitter
                        </span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <FontAwesomeIcon icon={faTwitter} />
                        </svg>
                      </MagicLink>
                    </div>

                    <div>
                      <MagicLink
                        href="https://auth.glenstack.com/login/github"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">
                          Sign in or register with GitHub
                        </span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <FontAwesomeIcon icon={faGithub} />
                        </svg>
                      </MagicLink>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer noCTA={true} />
    </>
  );
};
