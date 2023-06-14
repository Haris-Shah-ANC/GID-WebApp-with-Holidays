import React from "react";
import PropTypes from "prop-types";

export default function Card({className='', children }) {
  return (
    <div className={`relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-lg ${className}`}>
      {children}
    </div>
  );
}

Card.defaultProps = {};

Card.propTypes = {
  children: PropTypes.node,
};
