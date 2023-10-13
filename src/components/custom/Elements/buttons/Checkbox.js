import React from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

export default function Checkbox(props) {
  const {label, checkBoxStyle, labelStyle, ...rest} = props
  const checkBoxCSS = twMerge('form-checkbox appearance-none ml-1 w-4 h-4 ease-linear transition-all duration-150 border border-blueGray-300 rounded focus:border-blueGray-300', checkBoxStyle)
  const labelCSS = twMerge('ml-2 text-sm font-semibold text-blueGray-500', labelStyle)

  return (
    <>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          {...rest}
          className={checkBoxCSS}
        />
        {label ? (
          <span className={labelCSS}>
            {label}
          </span>
        ) : null}
      </label>
    </>
  );
}

Checkbox.defaultProps = {};
// you can also pass additional props
// such as defaultValue, value, onChange, onClick etc.
Checkbox.propTypes = {
  label: PropTypes.string,
};
