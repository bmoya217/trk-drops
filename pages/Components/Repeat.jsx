import React from "react";

const Repeat = ({ children, n }) => {
  return (
    <div>
      {new Array(n).fill(null).map((_, i) => (
        <React.Fragment key={i}>
          {children}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Repeat;
