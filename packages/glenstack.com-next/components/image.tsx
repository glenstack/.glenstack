import NextImage, { ImageLoader, ImageProps } from "next/image";
import { FC } from "react";

const normalizeSrc = (src: string) => (src[0] === "/" ? src.slice(1) : src);

const cloudflareLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`];
  if (quality) params.push(`quality=${quality}`);
  const paramsString = params.join(`,`);
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};

export const Image: FC<ImageProps> = (props) => (
  <NextImage loader={cloudflareLoader} {...props} />
);
