import React from "react";

const Dropdown = (props) => {
  const {disabled=false, placeholder = false, optionLabel, value, setValue, options = [] } = props;

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
        className={`${disabled ? 'bg-gray-100 ' : ''} truncate cursor-pointer w-full border-blueGray-300 text-blueGray-700 rounded px-3 pr-6 py-2 font-quicksand font-semibold text-sm`}
      > 
        {options.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {
                placeholder && index === 0 ?
                  <option value={JSON.stringify(item)} className="placeholder-blueGray-200 cursor-pointer font-quicksand font-medium ">
                    {item[optionLabel]}
                  </option>
                  :
                  <option value={JSON.stringify(item)} className="text-gray-600 cursor-pointer font-quicksand font-medium ">
                    {item[optionLabel]}
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
