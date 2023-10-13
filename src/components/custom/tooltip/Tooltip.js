
export default function Tooltip(props) {
    const { text } = props
    return (
        <span class="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100 absolute -top-7 left-0 w-max bg-gray-300 px-2 rounded py-1 text-sm">
            {text}
            <div class="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"></div>
        </span>
    )
}