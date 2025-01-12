import React from "react";
import { ToggleContext } from "./Toggle";

const ToggleOn = ({ children, className, ...rest }) => {
  const { on } = React.useContext(ToggleContext);
  return on ? <div className={className}>{children}</div> : null;
};

export default ToggleOn;
