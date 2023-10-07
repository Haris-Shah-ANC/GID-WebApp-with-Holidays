export default function TaskStatusLabel(props) {
    const { status } = props

    const formatStatusText = (text) => {
        if (String(text).includes("-")) {
            return String(text).replace("-", " ")
        } else {
            return text
        }
    }

    const getStatusColor = (txt) => {
       let colorDict={"In Progress":'text-green-600 bg-green-50',"On Hold":'text-orange-600 bg-orange-50',"Completed":'text-indigo-600 bg-indigo-50',"Pending":'text-yellow-600 bg-yellow-50'}
       return colorDict[txt]
    }
    return (
        <p className={`text-center text-sm font-normal w-24 truncate mx-1 font-quicksand py-[2px] rounded-lg px-[0px] ${getStatusColor(formatStatusText(status))} `}>{formatStatusText(status)} </p>
    )
}