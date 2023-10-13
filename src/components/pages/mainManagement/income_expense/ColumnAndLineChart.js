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
    const { project, employee, period } = props
    const { work_id } = getWorkspaceInfo();
    const [selectedTime, setTimePeriod] = useState(timePeriods[0])
    const [data, setData] = useState([])
    const [capacityData, setCapacityInAmt] = useState({ capacity: 0, maxIncomeAmount: 0, maxYAxisAmt: null, hours: 0 })
    const [chartType, setChartType] = useState("Line Chart")
    let series_expense_amount = data.map((item) => item.expense_amount)
    let series_income_amount = data.map((item) => item.income_amount)
    let series_capacity_amt = data.map((item) => item.capacity_in_amount)
    let series_capacity_hours = data.map((item) => parseFloat(item.capacity_in_hour))

    const getMaxYAxisData = (capacityAmt, maxIncomeAmt) => {
        if (capacityAmt > maxIncomeAmt) {
            return ((capacityAmt * 20) / 100) + capacityAmt
        } else {
            return ((maxIncomeAmt * 20) / 100) + maxIncomeAmt
        }
    }
    let options = {

        chart: {
            type: chartType === "Line Chart" ? "line" : "column",
            alignThresholds: true,


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
                    return this.value.name.replace(" ", '<br>');
                }
            }
        },
        yAxis: [{
            title: {
                text: null
            },

            endOnTick: false,
            max: capacityData.maxYAxisAmt,
            min: 0,
            labels: {
                formatter: function () {
                    return numberWithSuffix(this.value)
                }
            },
        },
        { //--- Secondary yAxis
            title: {
                text: 'Capacity (hr)'
            },
            opposite: true,
            labels: {
                formatter: function () {
                    return this.value
                }
            },
        }],


        // plotLines: [{
        //     value: capacityData.capacity > 0 ? Number(capacityData.capacity) : 0,
        //     color: '#185eb5',
        //     width: 1.5,
        //     zIndex: 4,
        //     label: { text: capacityData.capacity > 0 ? `Capacity - ${amountFormatter(capacityData.capacity, "INR")} &nbsp &nbsp  Hours - ${parseFloat(capacityData.hours).toFixed(2)}` : "" }
        // }]

        // tooltip: {
        //     shared:true,
        //     split: true,
        //     formatter: function () {

        //         var tooltip = selectedTime.value == "daily" ? `${formatDate(this.x.working_date, "DD MMM")}`.replace('<br/>', ' ') : selectedTime.value == "weekly" ? `${this.x.name}<br>${formatDate(this.x.from_date, "DD MMM")} - ${formatDate(this.x.to_date, "DD MMM")}` : `${formatDate(this.x.from_date, "DD MMM")} - ${formatDate(this.x.to_date, "DD MMM")}`.replace('<br/>', ' ');
        //         tooltip += `<br><span style="font-family: 'Noto Sans';"><span style="color:${this.series.color}">${this.series.name} : </span>${amountFormatter(this.y, "INR")}</span>`;
        //         return tooltip;
        //     }
        // },
        tooltip: {
            crosshairs: true,
            animation: true,
            shared: true,
            useHTML: true,

            formatter: function () {
                var tooltip = selectedTime.value == "daily" ? `${formatDate(this.x.working_date, "DD MMM")}`.replace('<br/>', ' ') : selectedTime.value == "weekly" ? `${this.x.name}<br><b>${formatDate(this.x.from_date, "DD MMM")} - ${formatDate(this.x.to_date, "DD MMM")}</b>` : `${formatDate(this.x.from_date, "DD MMM")} - ${formatDate(this.x.to_date, "DD MMM")}`.replace('<br/>', ' ');
                return tooltip + '<br>'
                    + `<span style="color:${this.points[0].color}">\u25CF ${this.points[0].series.name}  :   <b>${amountFormatter(this.points[0].y, "INR")}</b></span>` + '<br>'
                    + `<span style="color:${this.points[1].color}">\u25CF ${this.points[1].series.name}  :   <b>${amountFormatter(this.points[1].y, "INR")}</b></span>` + '<br>'
                    + `<span style="color:${this.points[2].color}">\u25CF Avg ${this.points[2].series.name}  :   <b>${amountFormatter(this.points[2].y, "INR")}</b></span>` + '<br>'
                    + `<span style="color:${this.points[3].color}">\u25CF Avg ${this.points[3].series.name}  :   <b>${(this.points[3].y)}</b></span>` + '<br>'
                    + `<span style="color:black">\u25CF Total hours   :   <b>${parseFloat(this.points[3].x.working_hours).toFixed(2)}</b></span>` + '<br>'

            }
        },

        // tooltip: {
        //     shared: true,
        //     useHTML: true,
        //     headerFormat: '<table><tr><th colspan="2">{point.x.name}</th></tr>',
        //     pointFormat: '<tr><td style="color: {series.color}">{series.name} </td>' + '<td style="text-align: right"><b>{point.y}</b></td></tr>',
        //     footerFormat: '</table>',
        //     valueDecimals: 2
        // },

        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },

        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            series: {
                cursor: 'pointer',
                marker: { enabled: true, symbol: 'circle' },
                point: {
                    events: {
                        click: function () {

                        }
                    }
                }
            },
        },


        series: [
            {
                data: series_expense_amount, color: "#ED0F1C", showInLegend: true, name: 'Expense', type: chartType === "Line Chart" ? "line" : "column"
            },
            {
                data: series_income_amount, color: "#049735", showInLegend: true, name: 'Income', dashStyle: 'line', type: chartType === "Line Chart" ? "line" : "column",
            },
            {
                yAxis: 0, data: series_capacity_amt, color: '#185eb5', showInLegend: true, name: 'Capacity (amount)', dashStyle: 'line', type: chartType === "Line Chart" ? "line" : "column"
            },
            {
                yAxis: 1, data: series_capacity_hours, color: '#ffa056', showInLegend: true, name: 'Capacity (hours)', dashStyle: 'line', type: chartType === "Line Chart" ? "line" : "column"
            }
        ]

    }
    useEffect(() => {
        let postBody = {
            period: selectedTime.value,
            workspace_id: work_id
        }
        if (employee && employee.id) {
            postBody["employee_id"] = employee ? employee.id : null
        }
        if (project && project.project_id) {
            postBody["project_id"] = project ? project.project_id : null
        }
        getIncomeAndExpenseData(postBody)
    }, [project, employee, selectedTime])

    useEffect(() => {
        if (period.subTitle !== "yearly") {
            setTimePeriod(timePeriods.find((item) => item.value == period.subTitle))
        }
    }, [period])

    const getIncomeAndExpenseData = async (pBody) => {
        let res = await apiAction({ url: getIncomeExpenseChartsData(), method: 'post', data: pBody }, onError)
            .then((response) => {
                if (response) {
                    let resultArray = []
                    if (response.success) {
                        if (response.period === "monthly") {
                            response.result.map((item) => {
                                resultArray.push({ "name": formatDate(item.from_date, "MMM YY"), "from_date": item.from_date, "to_date": item.to_date, "income_amount": parseFloat(item.income_amount), "expense_amount": parseFloat(item.expense_amount), "capacity_in_amount": parseFloat(item.capacity_in_amount), "capacity_in_hour": item.capacity_in_hour, working_hours: item.working_hour })
                            })
                        } else if (response.period === "weekly") {
                            response.result.map((item, index) => {
                                resultArray.push({ "name": `Week ${index + 1}`, "from_date": item.from_date, "to_date": item.to_date, "income_amount": parseFloat(item.income_amount), "expense_amount": parseFloat(item.expense_amount), "capacity_in_amount": parseFloat(item.capacity_in_amount), "capacity_in_hour": item.capacity_in_hour, working_hours: item.working_hour })
                            })
                        } else if (response.period === "daily") {
                            response.result.map((item) => {
                                resultArray.push({ "name": formatDate(item.working_date, "DD MMM"), "working_date": item.working_date, "from_date": item.from_date, "to_date": item.to_date, "income_amount": parseFloat(item.income_amount), "expense_amount": parseFloat(item.expense_amount), "capacity_in_amount": parseFloat(item.capacity_in_amount), "capacity_in_hour": item.capacity_in_hour, working_hours: item.working_hour })
                            })
                        }
                    }
                    setData(resultArray)
                    const resultData = response.result
                    let maxIncomeAmount = resultData.reduce((prev, current) => (prev && Number(prev.income_amount) > Number(current.income_amount)) ? prev : current)
                    let maxCapacityAmount = resultData.reduce((prev, current) => (prev && Number(prev.capacity_in_amount) > Number(current.capacity_in_amount)) ? prev : current)
                    setCapacityInAmt({ capacity: 0, maxIncomeAmount: Number(maxIncomeAmount.income_amount), maxYAxisAmt: getMaxYAxisData(Number(maxCapacityAmount.capacity_in_amount), Number(maxIncomeAmount.income_amount)), hours: 0 })
                }
            }
            )
            .catch((error) => {
                console.log("ERROR", error)
            })

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

                        {/* <div className='md:w-60 max-w-sm w-32 flex '>
                            <Dropdown options={timePeriods} placeholder={true} optionLabel={'name'} value={selectedTime ? selectedTime : timePeriods[2]} setValue={(value) => {
                                setTimePeriod(value)
                            }} />
                        </div> */}
                    </div>
                </div>
                <div className='pt-6'>
                    <HighchartsReact highcharts={Highcharts}

                        containerProps={{}}

                        options={options}



                    />

                </div>
            </div >
        </div>
    )
}
