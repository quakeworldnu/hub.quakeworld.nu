import React from "react";

export const TextBlur = React.memo((props) =>
  TextAnimation({ name: "blur", ...props })
);

export const TextPulse = React.memo((props) =>
  TextAnimation({ name: "pulse", ...props })
);

export const TextAnimation = (props) => {
  const { key, value, name } = props;

  return (
    <span className={`animation-${name}`} key={`${key}-${value}`}>
      {value}
    </span>
  );
};
