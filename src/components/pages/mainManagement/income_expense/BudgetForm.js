import React, { useContext, useEffect, useState } from 'react'
import Dropdown from '../../../custom/Dropdown/Dropdown'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import { svgIcons } from '../../../../utils/Constant'
import IconInput from '../../../custom/Elements/inputs/IconInput'
import CustomLabel from '../../../custom/Elements/CustomLabel'
import { getWorkspaceInfo } from '../../../../config/cookiesInfo'
import { useNavigate } from 'react-router-dom'
import * as Actions from '../../../../state/Actions';
import { apiAction } from '../../../../api/api'
import { employee, getAddNewBudgetUrl, getCurrencyUrl, getUpdateBudgetUrl, get_all_project } from '../../../../api/urls'
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../../utils/Utils'

export default function BudgetForm(props) {
    const { onFormClose, employeeList, projectList, data = {}, setData, onNewBudgetAdded } = props
    const { work_id } = getWorkspaceInfo();
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const [listOfCurrency, setCurrencyData] = useState([])
    const [selectedCurrency, selectCurrency] = useState(data.currency ? data.currency : null)
    const [selectedProject, selectProject] = useState(data.project_id ? projectList.find((item) => item.project_id == data.project_id) : null)
    const [selectedEmployee, selectEmployee] = useState(data.employee_id ? employeeList.find((item) => item.id == data.employee_id) : null)

    const [budgetData, setBudgetData] = useState({
        workspace_id: work_id,
        employee_id: null,
        project_id: null,
        valid_from: null,
        valid_upto: null,
        amount: null,
        currency_id: null,
        exchange_rate: 1
    })

    useEffect(() => {
        getListOfCurrencies()
    }, [])
    useEffect(() => {
        if (data.id) {
            selectCurrency(data.currency)
            selectEmployee(employeeList.find((item) => item.id == data.employee_id))
            selectProject(projectList.find((item) => item.project_id == data.project_id))
            setBudgetData({
                workspace_id: work_id,
                employee_id: data.employee_id ? data.employee_id : null,
                project_id: data.project_id ? data.project_id : null,
                valid_from: data.valid_from ? data.valid_from : null,
                valid_upto: data.valid_upto ? data.valid_upto : null,
                amount: data.amount ? data.amount : null,
                currency_id: data.currency ? data.currency.id : null,
                exchange_rate: data.exchange_rate ? data.exchange_rate : 1
            })
        }
    }, [data])

    const getListOfCurrencies = async () => {
        let res = await apiAction({
            url: getCurrencyUrl(work_id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        })
        if (res) {
            if (res.success) {
                setCurrencyData(res.result)
            } else {
                notifyErrorMessage(res.status)
            }
        }
    }
    const addNewBudget = async () => {
        let res = await apiAction({
            url: getAddNewBudgetUrl(),
            method: 'post',
            navigate: navigate,
            dispatch: dispatch,
            data: budgetData
        })
        if (res) {
            if (res.success) {
                notifySuccessMessage(res.status)
                onNewBudgetAdded()
                onFormClose()

            } else {
                notifyErrorMessage(res.status)
            }
        }
    }
    const updateBudget = async (postData) => {
        let res = await apiAction({
            url: getUpdateBudgetUrl(),
            method: 'post',
            navigate: navigate,
            dispatch: dispatch,
            data: postData
        })
        if (res) {
            if (res.success) {
                notifySuccessMessage(res.status)
                onNewBudgetAdded()
                onFormClose()
            } else {
                notifyErrorMessage(res.status)
            }
        }
    }
    const OnAddNewBudget = () => {
        let validation_data = [
            { key: "project_id", message: 'Please select the project!' },
            { key: "employee_id", message: `Please select the employee!` },
            { key: "currency_id", message: 'Currency field left empty!' },
            { key: "amount", message: 'Rate field left empty!' },
            { key: "exchange_rate", message: 'Exchange rate field left empty!' },
            { key: "valid_from", message: 'Budget start date field left empty!' },
            { key: "valid_upto", message: 'Budget end date field left empty!' },
        ]

        const { isValid, message } = isFormValid(budgetData, validation_data);
        if (isValid) {
            if (data.id) {
                let pBody = budgetData
                budgetData["budget_id"] = data.id
                updateBudget(pBody)
            } else {
                addNewBudget()
            }

        } else {
            notifyErrorMessage(message)
        }

    }

    return (
        <div className='transition-all duration-1000 ease-in delay-1000'>
            <form className="flex flex-row ">
                {/* <p className='text-center text-xl'>Budget Details</p>  */}
                <div className=' pt-5 md:w-full '>
                    <div className='md:flex md:flex-row md:w-full sm:flex-col space-x-12 mx-5'>
                        <div className='sm:flex md:flex  md:flex-col'>
                            <div className='flex-col '>
                                <div className="my-0 flex flex-col">
                                    <CustomLabel label={`Project`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                    <Dropdown disabled={false} placeholder={true} options={[{ project_name: "Select Project", project_id: null }, ...projectList]} optionLabel={'project_name'} value={selectedProject != null ? selectedProject : ""} setValue={(value) => {
                                        selectProject(value)
                                        setBudgetData({ ...budgetData, project_id: value.project_id })
                                    }} />
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col">
                                <CustomLabel label={`Currency`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                <Dropdown disabled={false} placeholder={true} options={[{ currency_name: "Select Currency", id: null }, ...listOfCurrency]} optionLabel={'currency_name'} value={selectedCurrency != null ? selectedCurrency : ""} setValue={(value) => {
                                    setBudgetData({ ...budgetData, currency_id: value.id })
                                    selectCurrency(value)
                                }
                                } />
                            </div>
                           
                        </div>
                        <div className='flex flex-col'>
                            <div className='w-full max-w-sm w-lg'>
                                <div className="my-0 flex flex-col">
                                    <CustomLabel label={`Employee`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                    <Dropdown disabled={false} placeholder={true} options={[{ employee_name: "Select Employee", id: null }, ...employeeList]} optionLabel={'employee_name'} value={selectedEmployee != null ? selectedEmployee : ""} setValue={(value) => {
                                        selectEmployee(value)
                                        setBudgetData({ ...budgetData, employee_id: value.id })
                                    }} />
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col">
                                <CustomLabel label={`Exchange Rate`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                <GidInput
                                    inputType={"number"}
                                    id='link_description'
                                    disable={false}
                                    placeholderMsg={"Enter exchange rate"}
                                    className={""}
                                    value={budgetData.exchange_rate}
                                    onBlurEvent={() => { }}
                                    onTextChange={(e) => {
                                        setBudgetData({ ...budgetData, exchange_rate: e.target.value })
                                    }}></GidInput>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='w-full max-w-sm w-lg'>
                                <div className="my-0 flex flex-col">
                                    <CustomLabel label={`Valid From`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                    <GidInput
                                        inputType={"date"}
                                        id='to_date'
                                        disable={false}
                                        placeholderMsg={"Enter link"}
                                        className={""}
                                        value={budgetData.valid_from}
                                        onBlurEvent={() => { }}
                                        onTextChange={(e) => {
                                            setBudgetData({ ...budgetData, valid_from: e.target.value })
                                        }}></GidInput>
                                   
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col">
                                <CustomLabel label={`Rate/Hr`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                <GidInput
                                    inputType={"number"}
                                    id='link_description'
                                    disable={false}
                                    placeholderMsg={"Enter rate"}
                                    className={""}
                                    value={budgetData.amount}
                                    onBlurEvent={() => { }}
                                    onTextChange={(e) => {
                                        setBudgetData({ ...budgetData, amount: e.target.value })
                                    }}></GidInput>
                            </div>
                        </div>
                        <div className='flex flex-col justify-start'>
                            <div className="mt-0 flex flex-col">
                                <CustomLabel label={`Valid Upto`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                <GidInput
                                    inputType={"date"}
                                    id='to_date'
                                    disable={false}
                                    placeholderMsg={"Enter link"}
                                    className={""}
                                    value={budgetData.valid_upto}
                                    onBlurEvent={() => { }}
                                    onTextChange={(e) => {
                                        setBudgetData({ ...budgetData, valid_upto: e.target.value })
                                    }}></GidInput>
                            </div>
                        </div>
                    </div>


                </div>

                <div className='flex flex-col justify-center mx-5'>
                    <button
                        onClick={OnAddNewBudget}
                        type="button"
                        className={`text-sm font-quicksand font-bold py-2.5 px-10 bg-blue-500 text-white active:bg-blue-600 outline-none focus:outline-none ease-linear transition-all duration-150 hover:shadow-lg hover:bg-blue-600 rounded shadow`}>
                        {data.id ? "Update" : "Add"}
                    </button>
                    <button
                        onClick={() => {
                            setData({})
                            onFormClose()
                        }}
                        type="button"
                        className={`mt-5 text-sm font-quicksand font-bold py-2.5 px-5 bg-gray-400 text-white active:bg-blue-600 outline-none focus:outline-none ease-linear transition-all duration-150 hover:shadow-lg hover:bg-gray-500 rounded shadow`}>
                        Cancel
                    </button>
                </div>




            </form>
        </div>
    )
}
