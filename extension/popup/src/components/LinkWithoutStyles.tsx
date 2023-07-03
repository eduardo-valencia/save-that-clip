import React from "react";
import { Link, LinkProps } from "react-router-dom";

export default function LinkWithoutStyles(props: Omit<LinkProps, "style">) {
  return <Link style={{ textDecoration: "none" }} {...props} />;
}
