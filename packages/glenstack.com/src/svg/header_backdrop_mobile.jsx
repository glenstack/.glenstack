import * as React from "react";

function HeaderBackdropMobile(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={1213}
      height={715}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1213 0H0v655.175c112.712 35.99 221.394 59.826 324 59.826 167.626 0 518.731-52.002 889-140.55V0z"
        fill="#C76D60"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M481.554 705.491l2.546-.257c-124.286-13.952-236.041-36.225-302.684-73.235C110.619 592.683 52.346 563.478 0 542.895v112.279C112.712 691.164 221.394 715 324 715c41.906 0 95.28-3.25 157.554-9.509z"
        fill="#D38D83"
      />
    </svg>
  );
}

export default HeaderBackdropMobile;
