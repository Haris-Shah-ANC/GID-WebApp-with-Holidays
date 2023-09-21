import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import PieChart from "highcharts-react-official";
import { amountFormatter, getTimePeriods } from '../../../../utils/Utils'
import { apiAction } from '../../../../api/api'
import { ChartTitle } from '../../../custom/Elements/ChartLable';
import GroupButtons from '../../../custom/Elements/buttons/GroupButtons';
import { getIncomeExpensePieChartData } from '../../../../api/urls';
import Dropdown from '../../../custom/Dropdown/Dropdown';


export default function PieChartGraph(props) {
    const { project, employee, onFileUpload } = props
    let timePeriodList = getTimePeriods()
    const [data, setData] = useState([])
    const [selectedTime, setTimePeriod] = useState(timePeriodList[2])
    const [isParentClicked, setParentClick] = useState(false)
    const [incomeType, setIncomeType] = useState("Projects")
    const [parentItem, setParentItem] = useState("")

    const handleDrillDown = (parent) => {
        setParentItem(incomeType === "Projects" ? `Project : ${parent.options.name}` : `Employee : ${parent.options.name}`)
        let parentId = incomeType === "Projects" ? parent.options.project_id : parent.options.employee_id
        getIncomeAndExpenseData({
            from_date: selectedTime.dates.from,
            to_date: selectedTime.dates.to,
            project_id: incomeType === "Projects" ? parentId : null,
            employee_id: incomeType === "Employees" ? parentId : null,
            income_by: incomeType === "Projects" ? "project" : "employee"
        }, true)
    }
    const onPieChartBackClick = () => {
        getIncomeAndExpenseData({
            from_date: selectedTime.dates.from,
            to_date: selectedTime.dates.to,
            project_id: null,
            employee_id: null,
            income_by: incomeType === "Projects" ? "project" : "employee"
        })
        setParentClick(false)
        setParentItem("")
    }
    const options = {
        chart: {
            type: "pie"
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: function () {
                return this.point.name + `: <b style="font-family: 'Noto Sans';">` + amountFormatter(this.y) + '</b>';
            }
        },

        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.point.is_parent) {
                            return '<span class="hover-underline-class" style="color: #2464EB; cursor: pointer;"><b style="font-family: \'Noto Sans\';">' + this.point.name + '</b>: ' + this.point.percentage.toFixed(2) + ' %</span>';
                        } else {
                            return this.point.name + ': ' + this.point.percentage.toFixed(2) + ' %';
                        }
                    },
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                point: {
                    events: {
                        click: function () {
                            if (this.is_parent) {
                                handleDrillDown(this);
                            }
                        }
                    },
                    states: {
                        select: {
                            enabled: function () {
                                return this.is_parent;
                            },
                            cursor: 'pointer'
                        }
                    }
                }
            }
        },

        series: [
            {
                data: data,
                showInLegend: false,
            }
        ]
    };

    useEffect(() => {
        getIncomeAndExpenseData({
            from_date: timePeriodList[2].dates.from,
            to_date: timePeriodList[2].dates.to,
            project_id: null,
            employee_id: null,
            income_by: incomeType == "Projects" ? "project" : "employee"
        })
        setParentClick(false)
        setParentItem("")
    }, [incomeType, onFileUpload])

    const getIncomeAndExpenseData = async (pBody, isParentClick = false) => {

        let response = await apiAction({ url: getIncomeExpensePieChartData(), method: 'post', data: pBody }, onError)
        if (response) {
            if (response.success) {
                setApiData(response.result, isParentClick)
            }
        }
        function onError(err) {
            console.log("UPLOAD ERROR", err)
        }
    }
    const setApiData = (data, isParentClick) => {
        let resultArray = []
        if (incomeType == "Projects") {
            if (isParentClick) {
                data.map((item) => {
                    resultArray.push({ "name": item.employee_name, "employee_id": item.employee_id, "y": parseFloat(item.income_amount), "is_parent": false })
                })
                setParentClick(true)
            } else {
                data.map((item) => {
                    resultArray.push({ "name": item.project_name, "project_id": item.project_id, "y": parseFloat(item.income_amount), "is_parent": true })
                })
            }
        } else {
            if (isParentClick) {
                data.map((item) => {
                    resultArray.push({ "name": item.project_name, "project_id": item.project_id, "y": parseFloat(item.income_amount), "is_parent": false })
                })
                setParentClick(true)
            } else {
                data.map((item) => {
                    resultArray.push({ "name": item.employee_name, "employee_id": item.employee_id, "y": parseFloat(item.income_amount), "is_parent": true })
                })

            }
        }
        setData(resultArray)
    }
    return (
        <div className={`justify-center items-center p-10 rounded-md bg-white shadow-md`}>
            <div className={`flex-col`}>
                <div className='flex-row flex justify-between'>
                    <ChartTitle title={"Total Income"} />

                    <div className='flex flex-row justify-end'>
                        <GroupButtons title1={"Projects"} title2={"Employees"} chartType={incomeType} onClick={(val) => {
                            setIncomeType(val)
                        }} />
                        <div className='md:w-60 max-w-sm w-32 flex '>
                            <Dropdown options={getTimePeriods()} placeholder={true} optionLabel={'title'} value={selectedTime ? selectedTime : { title: 'All Project' }} setValue={(value) => {
                                setTimePeriod(value)
                                setParentClick(false)
                                getIncomeAndExpenseData({ from_date: value.dates.from, to_date: value.dates.to, income_by: incomeType == "Projects" ? 'project' : "employees" })
                            }} />
                        </div>
                    </div>
                </div>
                <div className='h-8'>
                    {isParentClicked ?
                        <div className='flex-row flex items-center cursor-pointer' onClick={onPieChartBackClick}>

                            <svg viewBox="0 0 512 512" fill="#120fbf" height="1em" width="1em" className='mr-2 '>
                                <path
                                    fill="none"
                                    stroke="#120fbf"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={48}
                                    d="M328 112L184 256l144 144"
                                />
                            </svg>
                            <span className='text-[#120fbf]'>Back</span>
                        </div>
                        : null}
                </div>
                <div className='capitalize text-center text-gray-500 h-7 '>
                    {parentItem}
                </div>
                <div className=' pt-6'>
                    <PieChart highcharts={Highcharts} options={options} containerProps={{ style: {} }} />
                </div>
                {/* <div className='flex flex-row bg-blue-100 justify-between px-12'>
                <ChartLable style={{}} labelStyle={'text-[#049735]'} amount={20000} label={"Total Income"} />
                <ChartLable style={{}} labelStyle={'text-[#ED0F1C]'} amount={10000} label={"Total Expense"} />

            </div> */}
            </div >
        </div>
    )
}