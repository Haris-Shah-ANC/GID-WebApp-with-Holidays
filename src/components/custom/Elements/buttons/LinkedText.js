export const LinkedText = ({ title, onClick ,className=""}) => {
    return (
        <p className={`pr-4 text-blue-700 text-sm font-quicksand pt-1 cursor-pointer ${className}`} onClick={() => onClick(title)}>{title}</p>
    )
}