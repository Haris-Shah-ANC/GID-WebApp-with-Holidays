import React from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

export default function Card({className='', children }) {
  const twCSS = twMerge("relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-lg", className)
  return (
    <div className={twCSS}>
      {children}
    </div>
  );
}

// Card.defaultProps = {};

// Card.propTypes = {
//   children: PropTypes.node,
// };
