import { RefObject } from "react";
// import styles from "css/styles.json";
import tailwind from "tailwind-rn";

export const stylesFromClassName = (
  className: string = "",
  ref: RefObject<any>
): {} => {
  const classNames = className.split(" ");
  return tailwind(className);

  return {
    // backgroundColor: isBigScreen ? (isHover ? "pink" : "purple") : "blue",
    fontSize: 72,
  };
};
