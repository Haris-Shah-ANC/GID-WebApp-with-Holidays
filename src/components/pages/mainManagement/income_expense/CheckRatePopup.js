import React, { useEffect, useState, useContext } from 'react'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import { apiAction } from '../../../../api/api'
import { getBudgetListUrl, getTheAddTaskEffortsUrl, getTheListOfTaskEffortsUrl } from '../../../../api/urls'
import { amountFormatter, formatDate, notifyErrorMessage, notifySuccessMessage } from '../../../../utils/Utils'
import { useNavigate } from 'react-router-dom'
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage'
import { getWorkspaceInfo } from '../../../../config/cookiesInfo'
import * as Actions from '../../../../state/Actions';

export default function CheckRatePopup(props) {
    const navigate = useNavigate()
    const { work_id } = getWorkspaceInfo();
    const { setState, project, employee, onRateChanged, tempBudgetList } = props
    const [listOfBudgets, setListOfBudgets] = useState([])

    const dispatch = Actions.getDispatch(useContext);

    useEffect(() => {
        let pBody = {
            workspace_id: work_id,
            employee_id: employee ? employee.id : null,
            project_id: project ? project.project_id : null
        }
        if (tempBudgetList != null) {
            setListOfBudgets(tempBudgetList)
        } else {
            getBudgetsList(pBody)
        }

    }, [project, employee])

    const getBudgetsList = async (postBody) => {
        let response = await apiAction({
            method: 'post',
            navigate: navigate,
            dispatch: dispatch,
            url: getBudgetListUrl(),
            data: postBody
        }).then((response) => {
            let budgets = response.result

            for (const obj of budgets) {
                obj["new_rate"] = obj.amount;
            }
            setListOfBudgets(budgets)

        })
            .catch(error => {

            })
    }
    const onCheckClick = () => {
        onRateChanged(listOfBudgets)
        setState(false)
    }

    return (
        <>


            <div className="justify-end overflow-auto mt-[22vh] flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none mr-5">
                <div className="overflow-hidden relative my-6 mx-2 w-1/3 overflow-x-auto ">

                    <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none p-5 overflow-auto">
                        <div className="overflow-auto flex items-center justify-between border-solid border-slate-200 rounded-t text-black">
                            <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Check Rate'}</h3>
                            <ButtonWithImage
                                onButtonClick={() => { setState(false) }}
                                title={""}
                                className={"rounded-full  p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                                icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i>}
                            ></ButtonWithImage>
                        </div>

                        <div className=" mx-2 rounded mt-5 overflow-y-scroll h-[50vh]">
                            <table className=" bg-transparent border-collapse table-auto w-full rounded-lg">
                                <thead className='bg-gray-200 px-10 justify-center items-center'>
                                    <tr className='justify-between h-10'>

                                        <th
                                            key={"employee"}
                                            className={`text-sm pl-4 text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                            Employee
                                        </th>
                                        <th
                                            key={"project"}
                                            className={`text-sm  text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                            Project
                                        </th>
                                        <th
                                            key={"rate"}
                                            className={`text-sm text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                            Rate/hr
                                        </th>
                                        <th
                                            key={"valid_upto"}
                                            className={`text-sm  pr-4   text-right text-blueGray-500 font-interVar font-bold w-1/12 font-quicksand font-bold`}>
                                            New Rate
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className=" divide-y divide-gray-200 table-fixed">
                                    {listOfBudgets.map((item, index) => (
                                        <tr key={index} className={`bg-white `} onClick={() => { }}>

                                            <td className="p-4">
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
                                                <p className='text-md text-left font-quicksand'>
                                                    {amountFormatter(item.amount, item.currency.currency_code)}
                                                </p>
                                            </td>
                                            <td className="py-4">
                                                <GidInput
                                                    inputType={"number"}
                                                    id='link_description'
                                                    disable={false}
                                                    placeholderMsg={"HH:MM"}
                                                    className={"w-24"}
                                                    value={item.new_rate}
                                                    onBlurEvent={(e) => {

                                                    }}
                                                    onTextChange={(e) => {
                                                        listOfBudgets[index]["new_rate"] = e.target.value
                                                        setListOfBudgets([...listOfBudgets])

                                                    }}></GidInput>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                        <div className='flex gap-3 mt-5'>
                            <PlainButton onButtonClick={onCheckClick} title={"Apply Changes"} className={"w-full border"}></PlainButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}