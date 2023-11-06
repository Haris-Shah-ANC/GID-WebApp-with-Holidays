
const ToggleSlider = (props) => {
    const { isChecked, handleChange }=props

    const handleToggle = () => {
        handleChange(!isChecked);
    };

    return (
        <div class=" items-center justify-center">
            <label for="toggleB" class="flex items-center cursor-pointer">
                <div class="mr-3 text-sm text-gray-700 font-medium">
                    Edit
                </div>
                <div class="relative">
                    <input type="checkbox" id="toggleB" class="sr-only" onChange={handleToggle}></input>
                    <div class={`${isChecked ? 'bg-blue-500' : 'bg-gray-500'} block   w-9 h-5 rounded-full`}></div>
                    <div class={`${isChecked ? 'translate-x-full ' :''}  absolute left-[3px] top-[2.5px] bg-white w-3.5 h-3.5 rounded-full transition`}></div>
                </div>
              
            </label>

        </div>
    );
};

export default ToggleSlider;