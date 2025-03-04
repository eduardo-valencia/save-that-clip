import React from "react";
import { Link, LinkProps } from "react-router-dom";

export default function LinkWithoutStyles({ style, ...other }: LinkProps) {
  return <Link style={{ textDecoration: "none", ...style }} {...other} />;
}
