import { useState } from "react"
import GidInput from "./Elements/inputs/GidInput"
import IconInput from "./Elements/inputs/IconInput"
import { formatDate } from "../../utils/Utils"

export default function EffortsComponent(props) {
    const { } = props
    const [sampleData, setSampleData] = useState([{ date: "12/12/2023", working_hr: "7", action: "edit" }])

    const onEditClick = (itemIndex) => {

    }
    const onAddItemLineClick = (index) => {
        sampleData.push({ date: "", working_hr: "", action: "" })
        setSampleData([...sampleData])
    }
    const onRowRemove = (itemIndex) => {
        sampleData.splice(itemIndex, 1)
        setSampleData([...sampleData])
    }
    return (
        <div className="relativeflex-auto ">
            <table className=" bg-transparent border-collapse table-auto  rounded-lg w-full">
                <thead className='bg-gray-200 justify-center items-center'>
                    <tr className='justify-center h-10'>
                        <th
                            key={"valid_from"}
                            className={`text-sm pl-2 text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                            Date
                        </th>
                        <th
                            key={"valid_upto"}
                            className={`text-sm  text-center text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                            {'Duration (Hr)'}
                        </th>
                        <th
                            key={"valid_upto"}
                            className={`text-sm pr-2 text-right text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                            Action
                        </th>

                    </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200 table-fixed">
                    {sampleData.map((item, index) => (
                        <tr key={index} className={`bg-white `} onClick={() => { }}>
                            <td className="">
                                {item.date != "" && item.working_hr != "" && item.action  ?
                                    <p className=' text-left text-md font-quicksand'>
                                        {item.date}
                                    </p>
                                    :
                                    <GidInput
                                        inputType={"date"}
                                        id={`date` + index}
                                        disable={false}
                                        placeholderMsg={"HH:MM"}
                                        className={"w-25 flex "}
                                        value={item.date != "" ? formatDate(item.date, "MM/DD/YYYY") : ""}
                                        onBlurEvent={() => { }}
                                        onTextChange={(e) => {
                                            console.log("SELECTED DATE", e.target.value)
                                            sampleData[index].date = e.target.value
                                            setSampleData([...sampleData])
                                        }}></GidInput>
                                }
                            </td>

                            <td className="py-4">
                                {item.working_hr != "" && item.date!="" && item.action ?
                                    <p className=' text-center text-md font-quicksand'>
                                        {item.working_hr}
                                    </p> :
                                    <div className=" justify-center items-center flex flex-row">
                                        <GidInput
                                            inputType={"number"}
                                            id='link_description'
                                            disable={false}
                                            placeholderMsg={"HH:MM"}
                                            className={"w-20 flex"}
                                            value={item.working_hr}
                                            onBlurEvent={(e) => { 
   
                                            }}
                                            onTextChange={(e) => {
                                                sampleData[index].working_hr = e.target.value
                                                setSampleData([...sampleData])
                                            }}></GidInput>
                                        <svg
                                            viewBox="0 0 1024 1024"
                                            fill="red"
                                            height="2em"
                                            width="1em"
                                            className="ml-4 cursor-pointer"
                                            onClick={() => onRowRemove(index)}
                                        >
                                            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                                        </svg>
                                    </div>
                                }
                            </td>
                            <td className="py-4 text-right justify-end flex ">
                                {item.action == "edit" ?
                                    <svg
                                        viewBox="0 0 1024 1024"
                                        fill="currentColor"
                                        height="1em"
                                        width="1em"
                                        className="mr-2"
                                        onClick={onEditClick}
                                    >
                                        <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
                                    </svg> :
                                    <span className="text-md font-quicksand cursor-pointer text-blue-700">Add</span>
                                }
                            </td>

                        </tr>
                    ))}

                </tbody>
            </table>
            <span className="text-sm text-blue-500 cursor-pointer" onClick={onAddItemLineClick}>Add</span>
        </div>
    )
}