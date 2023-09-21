import { DATE, EXPENSE, INCOME, NET_DIFFERENCE } from "../../../../utils/Constant";
import Dropdown from "../../../custom/Dropdown/Dropdown";
import FileUploadButton from "../../../custom/Elements/buttons/FileUploadButton";

export default function Budget(props) {

    let sampleData = [
        {
            valid_from: "12/10/2023",
            valid_upto: "12/11/2023",
            rate: 700,
            employee: "kunal kadlag",
            project: "Get It Done",
        },
        {
            valid_from: "12/10/2023",
            valid_upto: "12/11/2023",
            rate: 800,
            employee: "kunal kadlag",
            project: "Get It Done",
        },
        {
            valid_from: "12/10/2023",
            valid_upto: "12/11/2023",
            rate: 700,
            employee: "kunal kadlag",
            project: "Get It Done",
        },
        {
            valid_from: "12/10/2023",
            valid_upto: "12/11/2023",
            rate: 500,
            employee: "kunal kadlag",
            project: "Get It Done",
        },
        {
            valid_from: "12/10/2023",
            valid_upto: "12/11/2023",
            rate: 700,
            employee: "Rahul Thakur",
            project: "Get It Done",
        },
        {
            valid_from: "12/10/2023",
            valid_upto: "12/11/2023",
            rate: 400,
            employee: "Utkarsh Sankpal",
            project: "Number",
        }
    ]
    return (
        <div className="">
            <span className="mx-2 text-2xl">Budget</span>
            <div className="bg-white flex flex-col md:flex-row shadow mx-2 my-2 py-5 px-5 rounded-md  ">
                <div className='w-full flex flex-col md:flex-row space-y-2 md:space-x-3 md:space-y-0'>
                    <div className='md:w-60 max-w-sm w-lg'>
                        <Dropdown options={[]} optionLabel={'project_name'} value={{ name: 'All Project' }} setValue={(value) => {
                           
                        }} />
                    </div>
                    <div className='md:w-60 max-w-sm w-lg'>
                        <Dropdown options={[]} optionLabel={'employee_name'} value={{ name: 'All Employees' }} setValue={(value) => {
                            console.log("ON SELECT", value)
                        }} />
                    </div>

                </div>

                <div className='flex justify-end max-w-sm w-full mt-2 md:mt-0'>
                    <button className='border border-[#dddddf] rounded-lg items-center flex px-3 py-2' onClick={() => {}}>
                        <i className="fa-solid fa-plus mr-2 text-[#75787b]" ></i>
                        <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Add New</p>
                    </button>
                </div>
            </div>
            <div className="flex mx-2 rounded mt-5">
                <table className=" bg-transparent border-collapse table-auto w-full rounded-lg">
                    <thead className='bg-gray-200 px-10 justify-center items-center'>
                        <tr className='justify-between h-10'>
                            <th
                                key={"valid_from"}
                                className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                Valid From
                            </th>
                            <th
                                key={"valid_upto"}
                                className={`text-sm  text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                Valid Upto
                            </th>
                            <th
                                key={"employee"}
                                className={`text-sm  text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                Employee
                            </th>
                            <th
                                key={"project"}
                                className={`text-sm  text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                Project
                            </th>
                            <th
                                key={"rate"}
                                className={`text-sm pr-3 text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                Rate/hr
                            </th>
                        </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200 table-fixed">
                        {sampleData.map((item, index) => (
                            <tr key={index} className={`bg-white `} onClick={() => { }}>
                                <td className="p-4">
                                    <p className='text-md text-left font-quicksand'>
                                        {item.valid_from}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='flex text-left text-md font-quicksand'>
                                        {item.valid_upto}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='text-md text-left capitalize font-quicksand '>
                                        {item.employee}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='text-md text-left font-quicksand'>
                                        {item.project}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='text-md text-left font-quicksand'>
                                        {item.rate}
                                    </p>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}