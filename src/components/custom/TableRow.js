import { twMerge } from "tailwind-merge"

export default function TableRow(props) {
    const { item, index, onItemClick, className } = props
    const tailwindMergedCSS = twMerge(`text-sm font-medium mx-1 font-quicksand pl-3`, className)
    return <>
        <td className="py-3">
            <p className={tailwindMergedCSS}>{item}
            </p>
        </td>
    </>
}