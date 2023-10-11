import { twMerge } from "tailwind-merge"

export default function TableRow(props) {
    const { item, index, onItemClick, className } = props
    console.log("ITEM=========>", item)
    const tailwindMergedCSS = twMerge(`text-sm truncate mx-1 font-quicksand pl-3`, className)
    return <>

        <tr key={1} className={"bg-white"} >
            {Object.values(item).map((item) => (
                <td className="py-3">
                    <p className={tailwindMergedCSS}>{item}
                    </p>
                </td>
            ))}

        </tr>
    </>
}