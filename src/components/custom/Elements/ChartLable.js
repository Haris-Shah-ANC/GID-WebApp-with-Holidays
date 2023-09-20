export const ChartTitle = (props) => {
    const { title } = props
    return (
        <p className=' text-lg font-medium'>{title}</p>
    )
}

export const ChartLable = (props) => {
    const { label, amount, style, labelStyle } = props

    return (
        <div className={`flex-row` + style}>
            <p className={`text-lg ${labelStyle} `}>{label}</p>
            <p className=' text-lg font-medium'>{amount}</p>
        </div>
    )
}
