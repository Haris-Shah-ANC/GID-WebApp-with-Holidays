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
import CheckRatePopup from './CheckRatePopup';
import CustomDatePicker from '../../../custom/Elements/CustomDatePicker';

const timePeriodsList = getTimePeriods()
export default function Analysis(props) {
    const navigate = useNavigate();
    const location = useLocation()
    const paramsData = location.state
    const dispatch = Actions.getDispatch(React.useContext);
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const state = Actions.getState(useContext)
    const { work_id } = getWorkspaceInfo();
    const [selectedProject, setProject] = useState(null)
    const [selectedTime, setTimePeriod] = useState(timePeriodsList[0])
    const [selectedEmployee, selectEmployee] = useState(null)
    const [employees, setEmployeeList] = useState([{ employee_name: "All Employee" }])
    const [projects, setProjectList] = useState([])
    const [incomeExpenseData, setIncomeExpenseData] = useState(null)
    const [fileUploaded, setFileUploadStatus] = useState(null)
    const [rateModalVisibility, setRateModalVisibility] = useState(false)
    const [tempBudgetList, setTempBudgetList] = useState(null)

    useEffect(() => {
        getProjects()
        getEmployees()
        timePeriodsList.splice(4, 1) //REMOVED THE CUSTOM OPTION FROM ANALYSIS.BCOZ CHART REQUIRED THE OPTIONS LIKE daily,weekly,monthly and yearly.
    }, [])

    useEffect(() => {
        fetchIncomeAndExpense(selectedProject, selectedEmployee)
    }, [selectedTime])

    const getPostBody = () => {
        let pBody = {
            workspace_id: work_id,
            from_date: selectedTime.dates.from,
            to_date: selectedTime.dates.to,
            previous_from_date: selectedTime.dates.previousFromDate,
            previous_to_date: selectedTime.dates.previousToDate,
        }

        return pBody
    }
    const getEmployees = async (project) => {
        let res = await apiAction({
            url: employee(work_id, project && project.project_id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        }).then((response) => {
            if (response) {
                var sorted = response.results.sort((a, b) => a.employee_name.localeCompare(b.employee_name, undefined, {}));
                setEmployeeList([{ employee_name: "All Employee", }, ...sorted])

                let found = sorted.find(function (element) {
                    if (selectedEmployee != null) {
                        return element.id == selectedEmployee.id;
                    }

                });
                if (!found) {
                    selectEmployee(null)
                    fetchIncomeAndExpense(project, undefined)
                } else {
                    fetchIncomeAndExpense(project, found)
                }
                if (paramsData && paramsData.employee_id) {
                    selectEmployee(response.results.find((item) => item.id == paramsData.employee_id))
                }
            }
        }
        )
            .catch((error) => {
                console.log("ERROR", error)
            })

    }

    const fetchIncomeAndExpense = async (project, employee) => {
        console.log("EMPLOYEE", employee)
        let response = await apiAction({ url: getIncomeExpenseDataWithComparison(), method: 'post', data: { employee_id: employee ? employee.id : null, project_id: project ? project.project_id : null, ...getPostBody() } }, onError)
        if (response) {
            if (response.success) {
                setIncomeExpenseData(response.result)
                let totalIncome = 0
                response.result.budget_data.map(item => {
                    totalIncome += (Number(item.amount) * Number(item.exchange_rate) * item.hour)
                })
                setTempBudgetList(null)
            }
        }
        function onError(err) {
            // console.log("UPLOAD ERROR", err)
        }
    }


    const getProjects = async () => {
        let response = await apiAction({
            method: 'get',
            // navigate: navigate,
            dispatch: dispatch,
            url: get_all_project(work_id),
        }).then((res) => {
            if (res.success) {
                var sorted = res.result.sort((a, b) => a.project_name.localeCompare(b.project_name, undefined, {}));
                setProjectList([{ project_name: "All Project" }, ...sorted])
                if (paramsData && paramsData.employee_id) {
                    let selectedProject = res.result.find((item) => item.project_id == paramsData.project_id)
                    setProject(selectedProject)
                }
            }
        }
        )
            .catch((e) => {
                console.log(e)
            })
    }

    const onSuccessFileUpload = (fileData) => {
        fetchIncomeAndExpense()
        console.log(fileData)
        setFileUploadStatus(fileData)
    }

    const onRateChanged = (budgetList) => {
        changeRateTemporary(budgetList)
    }
    function search(budgetId, budgetList) {
        for (let i = 0; i < budgetList.length; i++) {
            if (budgetList[i].id === budgetId) {
                return budgetList[i];
            }
        }
    }
    const getDifferencePercentage = (current, previous) => {
        if (current == 0 && previous == 0) {
            return 0
        } else if (previous == 0) {
            return 0
        } else {
            return ((current - previous) / previous) * 100
        }
    }

    const changeRateTemporary = (budgetList = []) => {
        setTempBudgetList(budgetList)
        const allBudgets = budgetList
        let originalIncomeExpenseData = incomeExpenseData

        let incomeAmount = 0
        let expenseAmount = Number(originalIncomeExpenseData.expense_amount)
        for (const obj of originalIncomeExpenseData.budget_data) {
            let searchedItem = search(obj.budget_id, allBudgets)
            if (searchedItem) {
                incomeAmount += (Number(searchedItem.new_rate) * Number(searchedItem.exchange_rate)) * Number(obj.hour)
            }
        }
        const netDifference = incomeAmount - Number(originalIncomeExpenseData.expense_amount)
        const differenceInPercentageOfIncome = getDifferencePercentage(incomeAmount, Number(originalIncomeExpenseData.previous_income_amount))
        const differenceInPercentageOfExpense = getDifferencePercentage(expenseAmount, Number(originalIncomeExpenseData.previous_expense_amount))
        const differenceInNetDifferencePercentage = getDifferencePercentage(netDifference, Number(originalIncomeExpenseData.previous_net_difference))
        setIncomeExpenseData({
            ...incomeExpenseData, income_amount: incomeAmount,
            net_difference: netDifference,
            difference_in_net_difference: parseFloat(differenceInNetDifferencePercentage).toFixed(2),
            difference_in_percent_for_expense: parseFloat(differenceInPercentageOfExpense).toFixed(2),
            difference_in_percent_for_income: parseFloat(differenceInPercentageOfIncome).toFixed(2)
        })


    }
    const onChange = (event) => {
        console.log("ON PERIOD CHANGE", event)

    }
    return (
        <div className='flex flex-col mb-16'>
            <div className="bg-white flex flex-col md:flex-row shadow mx-2 my-2 py-5 px-5 rounded-md  ">
                <div className='w-full flex flex-col md:flex-row space-y-2 md:space-x-3 md:space-y-0'>
                    <div className='md:w-60 max-w-sm w-full'>
                        <Dropdown options={projects} optionLabel={'project_name'} value={selectedProject ? selectedProject : { name: 'All Project' }} setValue={(value) => {
                            setProject(value)
                            getEmployees(value)
                        }} />
                    </div>
                    <div className='md:w-60 max-w-sm w-full'>
                        <Dropdown options={employees} optionLabel={'employee_name'} value={selectedEmployee ? selectedEmployee : { name: 'All Employees' }} setValue={(value) => {
                            selectEmployee(value)
                            fetchIncomeAndExpense(selectedProject, value)
                        }} />
                    </div>


                </div>

                <div className='fex max-w-sm w-full mt-2 md:mt-0'>
                    <FileUploadButton onSuccessFileUpload={onSuccessFileUpload}></FileUploadButton>
                </div>
            </div>

            <div className='px-5 pt-4 grid sm:grid-cols-1 xs:grid-cols-1 bg-[#fafafa] gap-4 mt-2 shadow rounded-md mx-2'>
                <div className='flex flex-row justify-between'>
                    <div className='md:w-60 max-w-sm flex  pb-0'>
                        <Dropdown options={timePeriodsList} optionDescLabel={"period"} placeholder={true} optionLabel={'title'} value={selectedTime ? selectedTime : { title: 'All Project' }} setValue={(value) => {
                            setTimePeriod(value)
                        }} />
                    </div>
                    <div className=''>
                        <span className='text-[#120fbf] cursor-pointer hover:underline' onClick={() => setRateModalVisibility(!rateModalVisibility)}>Check Rate</span>

                        {rateModalVisibility && <CheckRatePopup tempBudgetList={tempBudgetList} onRateChanged={onRateChanged} project={selectedProject} employee={selectedEmployee} setState={setRateModalVisibility} data={{}} onSuccessCreate={() => ""} />}
                    </div>

                </div>


                <div className='flex w-full pb-2'>
                    <div className='flex flex-col w-full p-5 m-2 bg-white shadow rounded-md items-center'>
                        <p className={`text-sm  text-center text-blueGray-500 font-interVar font-bold `}>{INCOME}</p>
                        <p className='flex text-2xl text-center items-center'>{incomeExpenseData ? amountFormatter(incomeExpenseData.income_amount, "INR") : "-"}
                            {svgIcons(`w-4 h-3 ml-2 ${getIconStyle(incomeExpenseData, "difference_in_percent_for_income")}`, "arrow")}
                            <span className={`text-sm ${getLabelColor(incomeExpenseData, "difference_in_percent_for_income")}`} >{`${incomeExpenseData ? incomeExpenseData.difference_in_percent_for_income : ""}%`}</span>
                        </p>
                    </div>

                    <div className='flex flex-col w-full p-5 m-2 bg-white shadow rounded-md items-center'>
                        <p className={`text-sm  text-center text-blueGray-500 font-interVar font-bold `}>{EXPENSE}</p>
                        <p className='flex text-2xl text-center items-center'>{incomeExpenseData ? amountFormatter(incomeExpenseData.expense_amount, "INR") : "-"}
                            {svgIcons(`w-4 h-3 ml-2 ${getIconStyle(incomeExpenseData, "difference_in_percent_for_expense")}`, "arrow")}
                            <span className={`text-sm ${getLabelColor(incomeExpenseData, "difference_in_percent_for_expense")}`} >{`${incomeExpenseData ? incomeExpenseData.difference_in_percent_for_expense : ""}%`}</span>
                        </p>
                    </div>

                    <div className='flex flex-col w-full p-5 m-2 bg-white shadow rounded-md items-center'>
                        <p className={`text-sm text-center text-blueGray-500 font-interVar font-bold `}>{NET_DIFFERENCE}</p>
                        <p className='flex text-2xl text-center items-center'>{incomeExpenseData ? amountFormatter(incomeExpenseData.net_difference, "INR") : "-"}
                            {svgIcons(`w-4 h-3 ml-2  ${getIconStyle(incomeExpenseData, "difference_in_net_difference")}`, "arrow")}
                            <span className={`text-sm ${getLabelColor(incomeExpenseData, "difference_in_net_difference")}`} >{`${incomeExpenseData ? incomeExpenseData.difference_in_net_difference : ""}%`}</span>
                        </p>
                    </div>
                </div>

            </div>

            <div className='px-2 py-2 grid sm:grid-cols-1 xs:grid-cols-1 bg-[#fafafa] gap-4 mt-2 overflow-hidden'>
                <ColumnAndLineChart project={selectedProject} employee={selectedEmployee} onFileUpload={fileUploaded} period={selectedTime} />

                <PieChartGraph project={selectedProject} employee={selectedEmployee} onFileUpload={fileUploaded} />
            </div>
        </div>
    )
}
