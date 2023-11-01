import { useState, useContext, useEffect } from "react";
import { DATE, EXPENSE, INCOME, NET_DIFFERENCE } from "../../../../utils/Constant";
import Dropdown from "../../../custom/Dropdown/Dropdown";
import FileUploadButton from "../../../custom/Elements/buttons/FileUploadButton";
import PlainButton from "../../../custom/Elements/buttons/PlainButton";
import GidInput from "../../../custom/Elements/inputs/GidInput";
import BudgetForm from "./BudgetForm";
import { Divider } from "@mui/material";
import { apiAction } from "../../../../api/api";
import { employee, getBudgetListUrl, get_all_project } from "../../../../api/urls";
import { getWorkspaceInfo } from "../../../../config/cookiesInfo";
import { useNavigate } from "react-router-dom";
import * as Actions from '../../../../state/Actions';
import { amountFormatter, formatDate } from "../../../../utils/Utils";
import { routesName } from "../../../../config/routesName";

export default function Budget(props) {
    const { work_id } = getWorkspaceInfo();
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const [formVisibility, setFormVisibility] = useState(false)
    const [listOfEmployees, setEmployees] = useState([])
    const [listOfProjects, setProjects] = useState([])
    const [selectedEmployee, setEmployee] = useState(null)
    const [selectedProject, setProject] = useState(null)
    const [listOfBudgets, setListOfBudgets] = useState([])
    const [postBody, setPostBody] = useState({ workspace_id: work_id, employee_id: null, project_id: null })
    const [selectedBudget, selectBudget] = useState({})

    useEffect(() => {
        getProjectsResultsApi()
        getEmployeeResultsApi()
    }, [])

    useEffect(() => {
        getBudgetsList()
    }, [postBody])


    const getProjectsResultsApi = async () => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: get_all_project(work_id),
        })

        if (res && res.success) {
            var sorted = res.result.sort((a, b) => a.project_name.localeCompare(b.project_name, undefined, {}));
            setProjects([...sorted])
        }
    }
    const getBudgetsList = async () => {
        let response = await apiAction({
            method: 'post',
            navigate: navigate,
            dispatch: dispatch,
            url: getBudgetListUrl(),
            data: postBody
        }).then((response) => {
            setListOfBudgets(response.result)
        })
            .catch(error => {

            })
    }
    const getEmployeeResultsApi = async (projectId) => {
        let response = await apiAction({
            url: employee(work_id, projectId),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        }).then((response) => {
            var sorted = response.results.sort((a, b) => a.employee_name.localeCompare(b.employee_name, undefined, {}));
            setEmployees([...sorted])
        })
            .catch((error) => {
                console.log("CATCH BLOCK", error)
            })

    }
    const onEditBudgetClick = (item) => {
        selectBudget(item)
        setFormVisibility(true)
    }
    const onNewBudgetAdded = () => {
        getBudgetsList()
    }

    const onAnalysisClick = (item) => {
        navigate(routesName.analysis.path, { state: item })
        // alert("OK")
    }
    return (
        <div className="">
            <span className="mx-2 text-2xl">Budget</span>
            <div className="bg-white flex flex-col shadow mx-2 py-5 rounded-md">
                <div className="flex w-full flex-col md:flex-row px-5 ">
                    <div className='w-full flex flex-col md:flex-row space-y-2 md:space-x-3 md:space-y-0'>
                        <div className='md:w-60 max-w-sm w-lg'>
                            <Dropdown options={[{ project_name: "All Projects" }, ...listOfProjects]} optionLabel={'project_name'} value={selectedProject != null ? selectedProject : { name: 'All Project' }} setValue={(value) => {
                                setProject(value)
                                setPostBody({ ...postBody, project_id: value.project_id })
                                getEmployeeResultsApi(value.project_id)
                            }} />
                        </div>
                        <div className='md:w-60 max-w-sm w-lg'>
                            <Dropdown options={[{ employee_name: "All Employees" }, ...listOfEmployees]} optionLabel={'employee_name'} value={selectedEmployee != null ? selectedEmployee : { name: 'All Employees' }} setValue={(value) => {
                                setEmployee(value)
                                setPostBody({ ...postBody, employee_id: value.id })
                            }} />
                        </div>

                    </div>

                    <div className='flex justify-end max-w-sm w-full mt-2 md:mt-0'>
                        <button className='border border-[#dddddf] rounded-lg items-center flex px-3 py-2' onClick={() => {
                            selectBudget({})
                            setFormVisibility(true)
                        }}>
                            <i className="fa-solid fa-plus mr-2 text-[#75787b]" ></i>
                            <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Add New</p>
                        </button>
                    </div>
                </div>


                {formVisibility &&
                    <>
                        <Divider className="pt-5"></Divider>
                        <BudgetForm setData={selectBudget} data={selectedBudget} onFormClose={() => { setFormVisibility(!formVisibility) }} employeeList={listOfEmployees} projectList={listOfProjects} onNewBudgetAdded={onNewBudgetAdded}></BudgetForm>
                    </>
                }


            </div>
            <div className="flex mx-2 rounded mt-5">
                <table className=" bg-transparent border-collapse table-auto w-full rounded-lg">
                    <thead className='bg-gray-200 px-10 justify-center items-center'>
                        <tr className='justify-between h-10'>
                            {/* <th
                                key={"valid_from"}
                                className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                Sr/No
                            </th> */}
                            <th
                                key={"valid_from"}
                                className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold   font-quicksand font-bold`}>
                                Valid From
                            </th>
                            <th
                                key={"valid_upto"}
                                className={`text-sm  text-left text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                Valid Upto
                            </th>
                            <th
                                key={"employee"}
                                className={`text-sm  text-left text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                Employee
                            </th>
                            <th
                                key={"project"}
                                className={`text-sm  text-left text-blueGray-500 font-interVar font-bold font-quicksand font-bold`}>
                                Project
                            </th>
                            <th
                                key={"rate"}
                                className={`text-sm  text-left text-blueGray-500 font-interVar font-bold font-quicksand font-bold`}>
                                Rate/hr
                            </th>
                            <th
                                key={"rate"}
                                className={`text-sm  text-center text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                Capacity (hr)
                            </th>
                            <th
                                key={"analysis"}
                                className={`text-sm text-center  text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                Analysis
                            </th>
                            <th
                                key={"action"}
                                className={`text-sm text-center  text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200 table-fixed">
                        {listOfBudgets.map((item, index) => (
                            <tr key={index} className={`bg-white justify-between`} onClick={() => { }}>
                                <td className="p-4">
                                    <p className='text-md text-left font-quicksand'>
                                        {formatDate(item.valid_from, "DD/MM/YYYY")}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='flex text-left text-md font-quicksand'>
                                        {formatDate(item.valid_upto, "DD/MM/YYYY")}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='text-md text-left capitalize font-quicksand'>
                                        {item.employee_name}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='text-md text-left font-quicksand'>
                                        {item.project_name}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='text-md  text-left font-quicksand'>
                                        {amountFormatter(item.amount, item.currency.currency_code)}
                                    </p>
                                </td>
                                <td className="py-4">
                                    <p className='text-md  text-center font-quicksand'>
                                        {item.capacity}
                                    </p>
                                </td>
                                <td className="py-4 ">
                                    <div className="justify-center flex">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            height="1em"
                                            width="1em"
                                            className="cursor-pointer hover:fill-blue-500"
                                            onClick={() => onAnalysisClick(item)}
                                        >
                                            <path fill="none" d="M0 0h24v24H0z" />
                                            <path d="M5 3v16h16v2H3V3h2zm15.293 3.293l1.414 1.414L16 13.414l-3-2.999-4.293 4.292-1.414-1.414L13 7.586l3 2.999 4.293-4.292z" />
                                        </svg>
                                    </div>
                                </td>
                                <td className=" ">
                                    <div className="justify-center flex">
                                    <svg
                                        viewBox="0 0 1024 1024"
                                        fill="currentColor"
                                        height="1em"
                                        width="1em"
                                        className="cursor-pointer hover:fill-blue-500"
                                        onClick={() => { onEditBudgetClick(item) }}

                                    >
                                        <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
                                    </svg>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}