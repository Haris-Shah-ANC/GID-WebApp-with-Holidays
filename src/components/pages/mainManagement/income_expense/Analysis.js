import React, { useEffect, useState, useContext } from 'react'
import { DATE, EXPENSE, INCOME, NET_DIFFERENCE } from '../../../../utils/Constant';
import { amountFormatter, formatDate, getIconStyle, getLabelColor, getTimePeriods } from '../../../../utils/Utils';
import { svgIcons } from '../../../../utils/Constant';
import { employee, getIncomeExpenseDataWithComparison, get_all_project } from '../../../../api/urls';
import ColumnAndLineChart from './ColumnAndLineChart';
import FileUploadButton from '../../../custom/Elements/buttons/FileUploadButton';
import { apiAction } from '../../../../api/api';
import PieChartGraph from './PieChart';
import { json, useLocation, useNavigate } from 'react-router-dom';
import * as Actions from '../../../../state/Actions';
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo';
import Dropdown from '../../../custom/Dropdown/Dropdown';

const timePeriodsList = getTimePeriods()
export default function Analysis() {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const state = Actions.getState(useContext)
    const { work_id } = getWorkspaceInfo();
    const [selectedProject, setProject] = useState(null)
    const [selectedTime, setTimePeriod] = useState(timePeriodsList[0])
    const [selectedEmployee, selectEmployee] = useState(null)
    const [employees, setEmployeeList] = useState([])
    const [projects, setProjectList] = useState([])
    const [incomeExpenseData, setIncomeExpenseData] = useState(null)
    const [fileUploaded, setFileUploadStatus] = useState(null)

    useEffect(() => {
        getProjects()
        getEmployees()
    }, [])

    useEffect(() => {
        fetchIncomeAndExpense()

    }, [selectedProject, selectedTime, selectedEmployee])

    const getPostBody = () => {
        return {
            workspace_id: work_id,
            from_date: selectedTime.dates.from,
            to_date: selectedTime.dates.to,
            previous_from_date: selectedTime.dates.previousFromDate,
            previous_to_date: selectedTime.dates.previousToDate,
            project_id: selectedProject ? selectedProject.project_id : null,
            employee_id: selectedEmployee ? selectedEmployee.id : null
        }
    }
    const getEmployees = async () => {
        let response = await apiAction({
            url: employee(work_id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        })
        if (response) {

            setEmployeeList([{ employee_name: "All Employee" }, ...response.results])
        }
    }

    const fetchIncomeAndExpense = async () => {
        let response = await apiAction({ url: getIncomeExpenseDataWithComparison(), method: 'post', data: getPostBody() }, onError)
        if (response) {
            if (response.success) {
                setIncomeExpenseData(response.result)
            }
        }
        function onError(err) {
            console.log("UPLOAD ERROR", err)
        }
    }


    const getProjects = async () => {
        let response = await apiAction({
            method: 'get',
            // navigate: navigate,
            dispatch: dispatch,
            url: get_all_project(work_id),
        })
        if (response.success) {
            setProjectList([{ project_name: "All Project" }, ...response.result])
        }
    }

    const onSuccessFileUpload = (fileData) => {
        fetchIncomeAndExpense()
        console.log(fileData)
        setFileUploadStatus(fileData.file)
    }


    return (
        <div className='flex flex-col mb-16'>
            <div className="bg-white flex flex-col md:flex-row shadow mx-2 my-2 py-5 px-5 rounded-md  ">
                <div className='w-full flex flex-col md:flex-row space-y-2 md:space-x-3 md:space-y-0'>
                    <div className='md:w-60 max-w-sm w-full'>
                        <Dropdown options={projects} optionLabel={'project_name'} value={selectedProject ? selectedProject : { name: 'All Project' }} setValue={(value) => {
                            setProject(value)
                        }} />
                    </div>
                    <div className='md:w-60 max-w-sm w-full'>
                        <Dropdown options={employees} optionLabel={'employee_name'} value={selectedEmployee ? selectedEmployee : { name: 'All Employees' }} setValue={(value) => {
                            console.log("ON SELECT", value)
                            selectEmployee(value)
                        }} />
                    </div>

                </div>

                <div className='fex max-w-sm w-full mt-2 md:mt-0'>
                    <FileUploadButton onSuccessFileUpload={onSuccessFileUpload}></FileUploadButton>
                </div>
            </div>

            <div className='px-5 pt-4 grid sm:grid-cols-1 xs:grid-cols-1 bg-[#fafafa] gap-4 mt-2 shadow rounded-md mx-2'>
                <div className='md:w-60 max-w-sm w-full flex pb-0'>
                    <Dropdown options={timePeriodsList} optionDescLabel={"period"} placeholder={true} optionLabel={'title'} value={selectedTime ? selectedTime : { title: 'All Project' }} setValue={(value) => {
                        setTimePeriod(value)
                    }} />
                </div>

                <div className='flex w-full pb-2'>
                    <div className='flex flex-col w-full p-5 m-2 bg-white shadow rounded-md items-center'>
                        <p className={`text-sm  text-center text-blueGray-500 font-interVar font-bold `}>{INCOME}</p>
                        <p className='flex text-2xl text-center items-center'>{incomeExpenseData ? amountFormatter(incomeExpenseData.income_amount,"INR") : "-"}
                            {svgIcons(`w-4 h-3 ml-2 ${getIconStyle(incomeExpenseData, "difference_in_percent_for_income")}`, "arrow")}
                            <span className={`text-sm ${getLabelColor(incomeExpenseData, "difference_in_percent_for_income")}`} >{`${incomeExpenseData ? amountFormatter(incomeExpenseData.difference_in_percent_for_income,"INR") : ""}%`}</span>
                        </p>
                    </div>

                    <div className='flex flex-col w-full p-5 m-2 bg-white shadow rounded-md items-center'>
                        <p className={`text-sm  text-center text-blueGray-500 font-interVar font-bold `}>{EXPENSE}</p>
                        <p className='flex text-2xl text-center items-center'>{incomeExpenseData ? amountFormatter(incomeExpenseData.expense_amount,"INR") : "-"}
                            {svgIcons(`w-4 h-3 ml-2 ${getIconStyle(incomeExpenseData, "difference_in_percent_for_expense")}`, "arrow")}
                            <span className={`text-sm ${getLabelColor(incomeExpenseData, "difference_in_percent_for_expense")}`} >{`${incomeExpenseData ? amountFormatter(incomeExpenseData.difference_in_percent_for_expense,"INR") : ""}%`}</span>
                        </p>
                    </div>

                    <div className='flex flex-col w-full p-5 m-2 bg-white shadow rounded-md items-center'>
                        <p className={`text-sm text-center text-blueGray-500 font-interVar font-bold `}>{NET_DIFFERENCE}</p>
                        <p className='flex text-2xl text-center items-center'>{incomeExpenseData ? amountFormatter(incomeExpenseData.net_difference,"INR") : "-"}
                            {svgIcons(`w-4 h-3 ml-2  ${getIconStyle(incomeExpenseData, "difference_in_net_difference")}`, "arrow")}
                            <span className={`text-sm ${getLabelColor(incomeExpenseData, "difference_in_net_difference")}`} >{`${incomeExpenseData ? amountFormatter(incomeExpenseData.difference_in_net_difference,"INR") : ""}%`}</span>
                        </p>
                    </div>
                </div>

            </div>

            <div className='px-2 py-2 grid sm:grid-cols-1 xs:grid-cols-1 bg-[#fafafa] gap-4 mt-2 overflow-hidden'>
                <ColumnAndLineChart project={selectedProject} employee={selectedEmployee} onFileUpload={fileUploaded} />

                <PieChartGraph project={selectedProject} employee={selectedEmployee} onFileUpload={fileUploaded} />
            </div>
        </div>
    )
}
