import React, { type ReactNode } from "react";

export const themeBaseDefault =
  "text-white rounded shadow-md border bg-linear-to-b";

const themePrimary = {
  default: `${themeBaseDefault} from-blue-600 to-blue-700 border-blue-500`,
  hover: "hover:from-blue-500 hover:to-blue-600 hover:border-blue-400",
};

const themeSecondary = {
  default: `${themeBaseDefault} from-gray-600 to-gray-700 border-gray-600`,
  hover: themePrimary.hover,
};

type ButtonProps = {
  href?: string;
  children?: ReactNode;
  className?: string;
  title?: string;
};

export const PrimaryButton = React.memo((props: ButtonProps) => {
  const { href = "#", children, className = "", title = "" } = props;

  return (
    <a
      href={href}
      target="_top"
      className={`${themePrimary.default} ${themePrimary.hover} ${className}`}
      title={title}
    >
      {children}
    </a>
  );
});

export const SecondaryButton = React.memo(
  (props: ButtonProps & { count?: number }) => {
    const { href, children, count = 0, className = "", title = "" } = props;
    return (
      <a
        href={href}
        target="_top"
        className={`flex items-center justify-center p-1 ${themeSecondary.default} ${themeSecondary.hover} ${className}`}
        title={title}
      >
        {children}

        {count > 0 && (
          <span className="ml-1 text-gray-400 text-xs">({count})</span>
        )}
      </a>
    );
  },
);
