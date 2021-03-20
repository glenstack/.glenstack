import * as React from "react";

function HeaderBackdrop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={2391}
      height={1129}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M918.863 764c91.327-43.576 154.907-84.651 172.137-122.5 86.65-190.356 395.23-273.57 692.81-353.819 268.1-72.3 527.28-142.193 607.19-285.866V0H0v589.475C45.08 608.987 94.982 634.549 153.416 667c136.098 75.581 460.338 89.704 695.219 97h70.228z"
        fill="#C76D60"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1128.3V906h568.173c-29.618 11.031-59.688 22.154-89.986 33.361l-.018.007C313.347 1000.34 141.813 1063.79 0 1128.3z"
        fill="#CB954E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 920.72V589.475C45.08 608.987 94.981 634.549 153.415 667c147.298 81.8 516.966 88.013 754.929 92.013l.054.001c6.816.114 13.524.227 20.116.34-100.998 49.066-238.317 101.362-385.071 155.84C363.144 925.899 165.609 927.09 0 920.72z"
        fill="#D38D83"
      />
    </svg>
  );
}

export default HeaderBackdrop;
