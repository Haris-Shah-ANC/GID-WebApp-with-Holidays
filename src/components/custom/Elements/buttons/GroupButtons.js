export default function GroupButtons(props) {
    const { onClick, title1, title2,chartType } = props
    return (
        <div class="inline-flex rounded-md shadow-sm mr-8 h-10">
            <button type="button" onClick={() => {
                onClick(title1)
            }} className={`py-0 px-4 inline-flex  focus:outline-none outline-none justify-center items-center gap-2 -ml-px first:rounded-l-md first:ml-0 last:rounded-r-md border font-medium align-middle transition-all text-sm ${chartType == title1 ? "bg-[#024a73] text-white hover:bg-[#031e4a]" : "text-gray-700 bg-[#cee3f0] hover:bg-[#b8cef2]"} `}>
                {title1}
            </button>

            <button type="button" onClick={() => {
                onClick(title2)
            }} className={`py-0 px-4 inline-flex  focus:outline-none outline-none justify-center items-center gap-2 -ml-px first:rounded-l-md first:ml-0 last:rounded-r-md border font-medium align-middle transition-all text-sm ${chartType == title2 ? "bg-[#024a73] text-white hover:bg-[#031e4a]" : "text-gray-700 bg-[#cee3f0] hover:bg-[#b8cef2]"}`}>
                {title2}
            </button>
        </div>
    )
}