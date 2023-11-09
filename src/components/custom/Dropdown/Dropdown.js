import React from "react";
import { twMerge } from "tailwind-merge";

const Dropdown = (props) => {
  const { disabled = false, placeholder = false, optionLabel, value, setValue, options = [], optionDescLabel, className, style = {} } = props;
  const dropDownStyle = twMerge(`${disabled ? 'bg-gray-100 ' : ''} truncate cursor-pointer w-full border-blueGray-300 text-blueGray-700 rounded px-3 pr-6 py-2 font-quicksand font-semibold text-sm`, className)
  const handleSelectChange = (event) => {
    const selectedValue = JSON.parse(event.target.value);
    if (selectedValue !== value) {
      setValue(selectedValue);
    }
  };


  return (
    <div className={"w-full"}>
      <select
        disabled={disabled}
        onChange={handleSelectChange}
        value={JSON.stringify(value)}
        className={dropDownStyle}
        style={style}
      >
        {options.map((item, index) => {
          return (
            <React.Fragment key={index} >
              {
                placeholder && index === 0 ?
                  <option value={JSON.stringify(item)} className="placeholder-blueGray-200 cursor-pointer font-quicksand font-medium mt-4">
                    {`${item[optionLabel]} ${optionDescLabel ? item[optionDescLabel] : ""}`}
                  </option>
                  :
                  <option value={JSON.stringify(item)} className="text-gray-600 cursor-pointer font-quicksand font-medium">
                    {`${item[optionLabel]} ${optionDescLabel ? item[optionDescLabel] : ''}`}
                  </option>
              }
            </React.Fragment>
          )
        }
        )}

      </select>
    </div>
  );
};


export default Dropdown;
