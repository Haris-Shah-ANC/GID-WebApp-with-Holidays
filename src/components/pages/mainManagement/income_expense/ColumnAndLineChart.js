import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { amountFormatter, formatDate, getTimePeriods, numberWithSuffix, timePeriods } from '../../../../utils/Utils'
import { ChartTitle } from '../../../custom/Elements/ChartLable'
import { getIncomeExpenseChartsData } from '../../../../api/urls'
import GroupButtons from '../../../custom/Elements/buttons/GroupButtons'
import Dropdown from '../../../custom/Dropdown/Dropdown'
import { apiAction } from '../../../../api/api'
import { getWorkspaceInfo } from '../../../../config/cookiesInfo'


export default function ColumnAndLineChart(props) {
    const { project, employee } = props
    const { work_id } = getWorkspaceInfo();
    const [selectedTime, setTimePeriod] = useState(timePeriods[2])
    const [data, setData] = useState([])
    const [chartType, setChartType] = useState("Line Chart")
    let series_expense_amount = data.map((item) => item.expense_amount)
    let series_income_amount = data.map((item) => item.income_amount)

    let options = {
        chart: {
            type: chartType === "Line Chart" ? "line" : "column"
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: data,
            labels: {
                formatter: function () {
                    return this.value.name;
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            min: 0,
            labels: {
                formatter: function () {
                    return numberWithSuffix(this.value)
                }
            },
        },
        tooltip: {
            formatter: function () {
                var tooltip = selectedTime.value == "daily" ? `${formatDate(this.x.working_date, "DD MMM")}`.replace('<br/>', ' ') : selectedTime.value == "weekly" ? `${this.x.name}<br>${formatDate(this.x.from_date, "DD MMM")} - ${formatDate(this.x.to_date, "DD MMM")}` : `${formatDate(this.x.from_date, "DD MMM")} - ${formatDate(this.x.to_date, "DD MMM")}`.replace('<br/>', ' ');
                tooltip += `<br><span style="font-family: 'Noto Sans';"><span style="color:${this.series.color}">${this.series.name} : </span>${amountFormatter(this.y,"INR")}</span>`;
                return tooltip;
            }
        },
        legend: {
            enabled: false
        },

        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {

                        }
                    }
                }
            },
        },
        series: [{ data: series_expense_amount, color: "#ED0F1C", showInLegend: true, name: 'Expense', }, { data: series_income_amount, color: "#049735", showInLegend: true, name: 'Income', }]
    }
    useEffect(() => {
        getIncomeAndExpenseData({
            period: timePeriods[2].value,
            project_id: project ? project.project_id : null,
            employee_id: employee ? employee.id : null,
            workspace_id:work_id
        })
    }, [project, employee])

    const getIncomeAndExpenseData = async (pBody) => {
        let response = await apiAction({ url: getIncomeExpenseChartsData(), method: 'post', data: pBody }, onError)
        if (response) {
            let resultArray = []
            if (response.success) {
                if (response.period === "monthly") {
                    response.result.map((item) => {
                        resultArray.push({ "name": formatDate(item.from_date, "MMM YY"), "from_date": item.from_date, "to_date": item.to_date, "income_amount": parseFloat(item.income_amount), "expense_amount": parseFloat(item.expense_amount) })
                    })
                } else if (response.period === "weekly") {
                    response.result.map((item, index) => {
                        resultArray.push({ "name": `Week ${index + 1}`, "from_date": item.from_date, "to_date": item.to_date, "income_amount": parseFloat(item.income_amount), "expense_amount": parseFloat(item.expense_amount) })
                    })
                } else if (response.period === "daily") {
                    response.result.map((item) => {
                        resultArray.push({ "name": formatDate(item.working_date, "DD MMM"), "working_date": item.working_date, "from_date": item.from_date, "to_date": item.to_date, "income_amount": parseFloat(item.income_amount), "expense_amount": parseFloat(item.expense_amount) })
                    })
                }
            }
            setData(resultArray)
        }
        function onError(err) {
            console.log("UPLOAD ERROR", err)
        }
    }



    return (
        <div className={`justify-center items-center p-10 rounded-md bg-white shadow-md`}>
            <div className=' flex-col '>
                <div className='flex-row flex justify-between'>
                    <ChartTitle title={"Income and Expense"} />
                    <div className='flex flex-row flex-auto  justify-end'>

                        <GroupButtons title1={"Line Chart"} title2={"Column Chart"} chartType={chartType} onClick={(val) => {
                            setChartType(val)
                        }} />

                        <div className='md:w-60 max-w-sm w-32 flex '>
                            <Dropdown options={timePeriods} optionDescLabel={"period"} placeholder={true} optionLabel={'name'} value={selectedTime ? selectedTime : timePeriods[2]} setValue={(value) => {
                                setTimePeriod(value)
                                getIncomeAndExpenseData({ period: value.value, workspace_id: work_id})
                            }} />
                        </div>
                    </div>
                </div>
                <div className='pt-6'>
                    <HighchartsReact highcharts={Highcharts}
                        containerProps={{  }}
                        options={options}
                        
                    />

                </div>
            </div >
        </div>
    )
}
