import {
  AnchorHTMLAttributes,
  ComponentProps,
  DetailedHTMLProps,
  FC,
} from "react";
import { Link } from "react-router-dom";

type AnchorLinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const MagicLink: FC<AnchorLinkProps | ComponentProps<Link>> = (
  props
) => {
  if ("to" in props) {
    return <Link {...props} />;
  }

  if (props?.href?.startsWith("/")) {
    return (
      <Link to={props.href} {...(props as Omit<ComponentProps<Link>, "to">)} />
    );
  }

  let additionalProps: AnchorLinkProps = {};

  const href = props.href || "";
  if (href.startsWith("http")) {
    const url = new URL(href);
    if (
      !["glenstack.com", "auth.glenstack.com", "upload.glenstack.com"].includes(
        url.host
      )
    )
      additionalProps = { rel: "noopener", target: "_blank" };
  }

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...additionalProps} {...props} />;
};
