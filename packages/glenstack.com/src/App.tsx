import { ReactComponent as ChevronRight } from "heroicons/solid/chevron-right.svg";
import { useState } from "react";
//import { SEO } from "./SEO";
import Astroghost1 from "./svg/astroghost_1";
import Astroghost2 from "./svg/astroghost_2";
import HeaderBackdrop from "./svg/header_backdrop";
import HeaderBackdropMobile from "./svg/header_backdrop_mobile";
import SpaceBackdrop from "./svg/space_backdrop";
import MarketPlaceIcon from "./svg/marketplace_icon";
import DatastoresIcon from "./svg/datastores_icon";
import Logo from "./svg/logo";

type Data = {
  loading: boolean;
  error?: string;
  result?: {
    currentPlace: number;
    referralLink: string;
    referralBumpSize: number;
  };
};

const Result = ({ result }: { result: NonNullable<Data["result"]> }) => (
  // TODO: Update current window URL & social share buttons
  <>
    You are <span>#{result.currentPlace}</span> in the line. Share this link{" "}
    <a href={result.referralLink}>({result.referralLink})</a> to jump{" "}
    <span>{result.referralBumpSize}</span> places and get early access!
  </>
);

export const App = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [emailAddress2, setEmailAddress2] = useState("");
  const [{ loading, error, result }, setData] = useState<Data>({
    loading: false,
  });

  const registerEmail = (emailAddress: string) => {
    if (loading || result) return;

    setData({ loading: true });

    (async () => {
      try {
        const response = await fetch("/api/registerEmail", {
          method: "POST",
          body: JSON.stringify({
            emailAddress,
            referralURL: window.location.href,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          setData({ loading: false, result: await response.json() });
        } else {
          // TODO: Throw descriptive error
          throw Error();
        }
      } catch (error) {
        // TODO: Log error

        setData({
          loading: false,
          error: "An unknown error occurred. Please try again.",
        });
      }
    })();
  };

  return (
    <div className="bg-white">
    <div className="container relative overflow-hidden max-w-full">
      <div className="flex">
        <SpaceBackdrop className="flex-none transform -scale-x-1 -scale-y-1"/>
        <div className="transform translate-x-full">
          <SpaceBackdrop className="flex-none fixed transform -translate-x-1 -scale-y-1 hidden xl:block"/>
        </div>
      </div>
      <div className="flex">
        <SpaceBackdrop className="transform flex-none -scale-x-1 sm:h-352 md:h-316 lg:h-200 xl:h-156" />
        <div className="transform translate-x-full">
          <SpaceBackdrop className="flex-none fixed transform -translate-x-1 hidden xl:block"/>
        </div>
      </div> 
      {/* TODO - no overhang here      */}
      {/* <div className="absolute -bottom-8 hidden sm:grid">
        <DatastoresIcon className="-mt-120 justify-self-center lg:justify-self-left"/>
      </div>           */}
      <div className="absolute top-0 left-0">
        <div className="container absolute">
          <HeaderBackdrop viewBox="0 0 4782 2258" className="hidden md:block"></HeaderBackdrop>
          <HeaderBackdropMobile viewBox="0 0 1213 715" className="md:hidden transform -translate-y-64"></HeaderBackdropMobile>
        </div>
        <div className="container relative">
          <div className="flex ml-4 mt-4">
            <Logo className="flex-none" viewBox="0 0 200 200"/>
            <p className="font-sans font-bold flex-none -ml-6 text-white text-5xl">Glenstack</p>
          </div>
          <p className="font-sans font-bold text-left ml-4 -mt-2 text-white text-4xl sm:text-5xl ml-0 md:text-left md:ml-8">Store, sell and share data</p>
          <p className="font-sans font-bold text-left ml-4 mt-0 text-white text-xl sm:text-2xl mt-4 ml-0 md:text-left md:ml-8">Access rich data, or monetise your own<br/>View and edit collaboratively.</p>
          <p className="font-sans font-bold text-white text-lg mt-6 mr-4 text-right md:text-left md:ml-24 md:mt-8 md:mr-0">Coming soon</p>
        </div>
      </div>
      <div className="animate-fadein container absolute top-32">
        <p className="text-white mt-96 font-sans font-bold text-3xl flex justify-left text-center md:absolute md:mt-80 md:mr-4 lg:mr-0 lg:mt-48 lg:relative ml-0 sm:ml-16 md:text-right md:right-0 lg:text-left lg:ml-152">Sign up now and:<br/>• Gain early access<br/>• Get increased payouts  for access to all<br/>your monetised bases - permanently.</p>
        <div className="container relative">
          <div className="top-40 py-3 m-4 text-center bg-white rounded md:mt-128 md:ml-64 lg:ml-156 lg:mt-8 md:mr-4 xl:top-8 xl:rounded-r-none xl:absolute xl:ml-152 xl:px-48 xl:mt-0">someone@example.com</div>
          <div className="text-white ml-16 mr-16 text-center rounded font-bold top-40 py-3 px-6 bg-yellow-400 ml-0 md:ml-96 md:mt-8 md:mr-32 lg:ml-176 lg:mt-8 lg:mr-20 xl:mr-0 xl:mt-0 xl:left-0 xl:top-8 xl:rounded-l-none xl:ml-280 xl:absolute xl:ml-280">Sign me up!</div>
        </div>
        <div className="container relative left-0 mt-36 lg:mt-56 xl:mt-128">
          <div className="m-4">
            <p className="font-sans font-bold text-white text-5xl text-center ml-0 lg:text-left lg:ml-16">
              A data ecosystem built for scaling
            </p>
          </div>
          <div className="m-4">
            <p className="font-sans text-white text-2xl text-center ml-0 lg:text-left lg:ml-16">
              Glenstack Bases provide a new way to store and access your<br/>
              data: build an entire application, or just keep a list of<br/>
              your favorite books. We grow with you.
            </p>
          </div>          
        </div>
        <div className="lg:flex">
          <div className="hidden sm:grid">
            <MarketPlaceIcon className="transform scale-25 sm:scale-67 mt-16 justify-self-center lg:justify-self-left"/>
          </div>
          <div className="container relative right-0 mt-16">
            <div className="m-4">
              <p className="font-sans font-bold text-white text-5xl mr-0 text-center lg:text-right xl:-mr-16">
                Collaborate, fork, merge, embed, PR, API
              </p>
            </div>
            <div className="m-4">
              <p className="font-sans text-white text-2xl mr-0 text-center lg:text-right xl:-mr-16">
                Glenstack Bases are part of an ecosystem that enables you to use data in completely new ways.<br/>
                We can't wait to see what you build with it.<br/>
                We recognize that a growing number of people have valuable data that they want to sell.<br/>
                We want to give you an effective place to do that. Simply upload your data, create a listing, and set your price.<br/>
                Buyers get immediate access.
              </p>
            </div>          
          </div>
        </div>  
        <div className="container relative left-0 mt-36">
          <div className="m-4">
            <p className="font-sans font-bold text-white text-5xl text-center ml-0 lg:text-left lg:ml-16">
              A high-quality data marketplace for<br/>
              buyers and sellers alike
            </p>
          </div>
          <div className="m-4">
            <p className="font-sans text-white text-2xl text-center ml-0 lg:text-left lg:ml-16">
              Curate datasets and sell them on our marketplace.<br/>
              Or, subscribe to premium Bases for high-quality and up-to-date information.<br/>
              We recognize that a growing number of people have valuable data that they want to sell.<br/>
              We want to give you an effective place to do that! Simply upload your data, create a listing, and set your price.<br/>
              Buyers get immediate access and can combine it with their own data to really take advantage of all that you can offer.
            </p>
          </div>          
        </div>      
      </div>
      <div className="absolute top-32 left-0 mt-96 ml-24 invisible lg:visible lg:animate-slideinleft">
        <Astroghost1/>
      </div>        
      <div className="absolute top-0 right-0 invisible transform scale-50 mt-56 md:mt-32 sm:visible md:scale-50 lg:mt-8 lg:scale-100 lg:animate-slideinright">
        <Astroghost2/>
      </div>
      <div className="relative hidden sm:grid">
        <DatastoresIcon className="-mt-120 justify-self-center lg:justify-self-left"/>
      </div>  
    </div>
      
    </div>
  );
};
