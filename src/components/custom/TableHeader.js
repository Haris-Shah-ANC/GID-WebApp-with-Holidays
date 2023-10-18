import { twMerge } from "tailwind-merge"
import { formatText } from "../../utils/Utils"

export default function TableHeader(props) {
    const { className, headerList = [], labelKey } = props
    const tailwindMergedCSS = twMerge(`text-sm text-blueGray-500 font-interVar font-bold font-quicksand capitalize`, className)
    return <tr className='h-10 flex-auto'>
        {headerList.map((item, index) => {
            return (
                <th
                    key={index}
                    className={tailwindMergedCSS}>
                    {labelKey ? formatText(item[labelKey]) : formatText(item)}
                </th>
            )
        }
        )
        }
    </tr>
}