import { ComponentProps, FC } from "react";
import createImage from "./landing/assets/create.png";
import collaborateImage from "./landing/assets/collaborate.png";
import exchangeImage from "./landing/assets/exchange.png";

export const CreateIllustration: FC<ComponentProps<"img">> = (props) => (
  <img {...props} src={createImage} alt="" />
);

export const CollaborateIllustration: FC<ComponentProps<"img">> = (props) => (
  <img {...props} src={collaborateImage} alt="" />
);

export const ExchangeIllustration: FC<ComponentProps<"img">> = (props) => (
  <img {...props} src={exchangeImage} alt="" />
);
