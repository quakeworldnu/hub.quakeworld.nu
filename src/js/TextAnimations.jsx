import React from "react";

export const TextBlur = React.memo((props) =>
  TextAnimation({ name: "blur", ...props })
);

export const TextAnimation = (props) => {
  const { value, name } = props;

  return (
    <span className={`animation-${name}`} key={value}>
      {value}
    </span>
  );
};
