import { twMerge } from "tailwind-merge"

export default function TableHeader(props) {
    const { title, className } = props
    const tailwindMergedCSS = twMerge(`text-sm text-blueGray-500 font-interVar font-bold w-full font-quicksand`, className)
    return <th
        key={title}
        className={tailwindMergedCSS}>
        {title}
    </th>
}