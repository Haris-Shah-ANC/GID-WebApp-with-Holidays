import moment from 'moment';
import queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currencyData, locale_dict_currency } from './Constant';

export const notifyInfoMessage = (message) => toast.info(message, { autoClose: 2000, hideProgressBar: true, closeButton: false });
export const notifyErrorMessage = (message) => toast.error(message, { autoClose: 2000, hideProgressBar: true, closeButton: false });
export const notifySuccessMessage = (message) => toast.success(message, { autoClose: 2000, hideProgressBar: true, closeButton: false });
export const notifyWarningMessage = (message) => toast.warning(message, { autoClose: 2000, hideProgressBar: true, closeButton: false });


export const cloneData = (data) => {
  return JSON.parse(JSON.stringify(data))
}

export const isAPISuccess = (status) => {
  return (status >= 200) && (status <= 299)
}

export const isUnAuthorized = (status) => {
  return status === 401
}

export const isUrlNotFound = (status) => {
  return status === 404
}

export const isInternalServerError = (status) => {
  return ((status >= 500) && (status <= 599))
}

export const isBadRequest = (statusCode) => {
  return statusCode === 400
}

export const isBusinessUnauthorized = (statusMessage) => {
  return statusMessage === "Unauthorized business access"
}

export function getQueryParams(url) {
  return queryString.parse(url);
}

export function getQueryString(parsed) {
  return queryString.stringify(parsed);
}

export const stateChangeManager = (dispatch, Actions, alert, severity, message) => {
  dispatch(Actions.stateChange('alert', alert))
  dispatch(Actions.stateChange('severity', severity))
  dispatch(Actions.stateChange('message', message))
}

export const setLoader = (dispatch, Actions, loader) => {
  dispatch(Actions.stateChange('loader', loader))
}

export function isEmptyDict(obj) {
  return Object.keys(obj).length === 0;
}

export const verifyPassword = (pass) => {
  const passwordREGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%^&*])(?=.{8,})");

  if (passwordREGEX.test(pass) === false) {
    return false;
  }
  else {
    return true
  }

}

export const isFormValid = (data, validation_data) => {
  let isFormValid = true
  let message = ""
  let key = ""
  for (var i = 0; i < validation_data.length; i++) {
    let item = validation_data[i]
    if (item) {
      if ("validation" in item) {
        if (item.validation) {
          isFormValid = !item.validation
          message = item.message
          key = item.key
          break
        }

      } else {
        if (!data[item.key]) {
          isFormValid = false
          message = item.message
          key = item.key
          break
        }
      }
    }
  }
  return { isValid: isFormValid, message: message, key: key }
}

export const getTimeAgo = (created_at) => {
  var now = moment();
  var createdAt = moment(created_at);
  var diff = moment.duration(now.diff(createdAt));

  var years = diff.years();
  var months = diff.months();
  var days = diff.days();
  var hours = diff.hours();
  var minutes = diff.minutes();
  var seconds = diff.seconds();

  if (years > 0) {
    return years + (years === 1 ? " year" : " years") + " ago";
  } else if (months > 0) {
    return months + (months === 1 ? " month" : " months") + " ago";
  } else if (days > 0) {
    return days + (days === 1 ? " day" : " days") + " ago";
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour" : " hours") + " ago";
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute" : " minutes") + " ago";
  } else if (seconds > 0) {
    return seconds + (seconds === 1 ? " second" : " seconds") + " ago";
  } else {
    return "Just now";
  }
}

export const expiredCheck = (dead_line) => {
  var now = moment();
  var deadline = moment(dead_line);

  if (deadline.isBefore(now)) {
    return true; // Deadline has expired
  } else {
    return false; // Deadline has not expired
  }
}

export const task_status_color = (value) => {
  if (value === "Pending") {
    return "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-500 text-white"
  }
  else if (value === "Completed") {
    return "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-500 text-white"
  }

  else if (value === "In-Progress") {
    return "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-500 text-white"
  }
}

export const formattedDeadline = (dead_line) => moment.utc(moment(dead_line)).format("YYYY-MM-DD HH:mm");

export function validateEmail(input) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input) ? true : false
}

const subtractByMonth = () => {
  return moment().subtract(1, "month")
}

const getStartAndEndOfPreviousMonthDates = (requireFormat) => {
  const startOfPrevMonth = moment(subtractByMonth()).startOf('month').format(requireFormat)
  const endOfPrevMonth = moment(subtractByMonth()).endOf('month').format(requireFormat)
  return `From ${startOfPrevMonth} To ${endOfPrevMonth}`
}

export function formatDate(date, requireFormat) {
  return (date) ? moment(date).format(requireFormat) : null
}

export function formatTime(timeString, timeFormat, requireFormat) {
  return timeString === undefined || "" ? "" : moment(timeString, [timeFormat]).format(requireFormat)
}

export const startOfCurrentMonth = (requireFormat) => { return formatDate(moment().startOf("month"), requireFormat) }

export const endOfCurrentMonth = (requireFormat) => { return formatDate(moment().endOf("month"), requireFormat) }

export const startOfPrevMonth = (requireFormat) => { return moment(subtractByMonth()).startOf('month').format(requireFormat) }

export const endOfPrevMonth = (requireFormat) => { return moment(subtractByMonth()).endOf('month').format(requireFormat) }

export const getDateRange = (type, requireFormat, timeOn) => {
  if (type === "previous month") {
    return timeOn === "start" ? startOfPrevMonth(requireFormat) : endOfPrevMonth(requireFormat)
  } else if (type === "current month") {
    return timeOn === "start" ? startOfCurrentMonth(requireFormat) : endOfCurrentMonth(requireFormat)
  }
}

export const isStartDaySunday = () => {
  return moment().startOf('week').format("dddd") === "Sunday"
}

export const getCurrentWeekDays = (number) => {
  const week = moment().add(number, "week")
  let weekStart = week.startOf("week")
  let days = []

  if (isStartDaySunday()) {
    weekStart = moment(weekStart).add(1, 'days');
  }

  for (let i = 0; i <= 5; i++) {
    days.push({ day: moment(weekStart).add(i, 'days'), tasks: addEmptyTasks(10) });
  }
  return days
}

const addEmptyTasks = (length) => {
  let emptyTaskList = []
  for (let i = 0; i < length; i++) {
    emptyTaskList.push({
      "task_description": "",
    })
  }
  return emptyTaskList
}

export const decodeToken = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload)
}

// export const getNextWeekDays = () => {
//   let weekStart = moment().startOf("week")
//   let days = []

//   if(isStartDaySunday()){
//       weekStart = moment(weekStart).add(1, 'days');
//   }

//   for (let i = 0; i <= 5; i++) {
//     days.push(moment(weekStart).add(i, 'days'));
//   }
//   return days
// }

export function useQuery() {
  const { search } = useLocation();
  // console.log("URL DATA", new URLSearchParams(useLocation().search).get("token"), useMemo(() => new URLSearchParams(search), [search]))
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const socials = [
  { icon: "google", button: { href: "#pablo" } },
  { icon: "facebook", button: { href: "#pablo" } },
]

export const history = {
  navigate: null,
  location: null
};

export const getTimePeriods = () => {
  // const currentYear = getCurrentFinancialYear(financial_year_last_day)
  const previousYear = getPreviousYear()
  const previousWeek = getPreviousWeek()
  const previousMonth = getPreviousMonth()

  return [
    {
      title: `Today`,
      subTitle: "daily",
      period: `(${moment().format("DD MMM")})`,
      dates: {
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
        previousFromDate: getYesterday(),
        previousToDate: getYesterday()
      }
    },
    {
      title: "This Week",
      subTitle: "weekly",
      period: `(${formatDate(getStartOf("week"), "DD MMM")} - ${formatDate(getEndOf("week"), "DD MMM")})`,
      dates: {
        from: getStartOf("week"),
        to: getEndOf("week"),
        previousFromDate: previousWeek.from,
        previousToDate: previousWeek.to
      }
    },
    {
      title: "This Month",
      subTitle: "monthly",
      period: `(${formatDate(getStartOf("month"), "DD MMM")} - ${formatDate(getEndOf("month"), "DD MMM")})`,
      dates: {
        from: getStartOf("month"),
        to: getEndOf("month"),
        previousFromDate: previousMonth.from,
        previousToDate: previousMonth.to
      }
    },
    {
      title: "This Year",
      subTitle: "yearly",
      period: `(${formatDate(getStartOf("year"), "DD MMM YY")} - ${formatDate(getEndOf("year"), "DD MMM YY")})`,
      dates: {
        from: getStartOf("year"),
        to: getEndOf("year"),
        previousFromDate: previousYear.from,
        previousToDate: previousYear.to
      }
    },
    {
      title: "Custom",
      subTitle: "custom",
      period: ``,
      dates: {
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
        previousFromDate: getYesterday(),
        previousToDate: getYesterday()
      }
    },
    // {
    //     title: "Yesterday",
    //     dates: {
    //         from: getYesterday(),
    //         to: getYesterday()
    //     }
    // },
    // {
    //     title: "Previous Week",
    //     dates: {
    //         from: previousWeek.from,
    //         to: previousWeek.to
    //     }
    // },
    // {
    //     title: "Previous Month",
    //     dates: {
    //         from: previousMonth.from,
    //         to: previousMonth.to
    //     }
    // },
    // {
    //     title: "Previous Year",
    //     dates: {
    //         from: previousYear.from,
    //         to: previousYear.to
    //     }
    // },
    // {
    //     title: "Custom",
    //     dates: {
    //         from: null,
    //         to: null
    //     }

    // },
  ]
}
export const timePeriods = [
  { name: "Daily", value: "daily" },
  { name: "Weekly", value: "weekly" },
  { name: "Monthly", value: "monthly" }
]
const getStartOf = (type) => {
  return formatDate(moment().startOf(type), "YYYY-MM-DD")
}

const getEndOf = (type) => {
  return formatDate(moment().endOf(type), "YYYY-MM-DD")
}

const getYesterday = () => {
  return subtractByDays(1)
}

const subtractByDays = (numberOfDays) => {
  return moment().subtract(numberOfDays, "day").format("YYYY-MM-DD")
}

const subtractByWeek = () => {
  return moment().subtract(1, "week")
}

const subtractByYear = () => {
  return moment().subtract(1, "year")
}

const getPreviousWeek = () => {
  const startOfPrevWeek = moment(subtractByWeek()).startOf('week').format("YYYY-MM-DD")
  const endOfPrevWeek = moment(subtractByWeek()).endOf('week').format("YYYY-MM-DD")
  return { from: startOfPrevWeek, to: endOfPrevWeek }
}

const getPreviousMonth = () => {
  const startOfPrevWeek = moment(subtractByMonth()).startOf('month').format("YYYY-MM-DD")
  const endOfPrevWeek = moment(subtractByMonth()).endOf('month').format("YYYY-MM-DD")
  return { from: startOfPrevWeek, to: endOfPrevWeek }
}

const getPreviousYear = () => {
  const startOfPrevWeek = moment(subtractByYear()).startOf('year').format("YYYY-MM-DD")
  const endOfPrevWeek = moment(subtractByYear()).endOf('year').format("YYYY-MM-DD")
  return { from: startOfPrevWeek, to: endOfPrevWeek }
}

export const getCurrentFinancialYear = (financial_year_last_day) => {
  const todaysDate = moment().format("YYYY-MM-DD")
  const financialYearLastDate = financial_year_last_day
  if (moment(todaysDate).isAfter(financialYearLastDate)) {
    return { from: moment(financialYearLastDate).add(1, 'day').format("YYYY-MM-DD"), to: moment(financialYearLastDate).add(12, "months").format("YYYY-MM-DD") }
  } else {
    return { from: getFinancialYearFromDate(financialYearLastDate), to: financialYearLastDate }
  }
}

const getFinancialYearFromDate = (financialYearLastDate) => {
  return moment(subtractByMonths(financialYearLastDate, 12)).add(1, 'day').format("YYYY-MM-DD")
}

const subtractByMonths = (date, numberOfYears) => {
  return moment(date).subtract(numberOfYears, 'months').format("YYYY-MM-DD")
}

export const getLabelColor = (incomeExpenseData, key) => {
  if (!incomeExpenseData) {
    return ""
  }
  const incomePercentageChange = parseInt(incomeExpenseData[key])
  // console.log(incomeExpenseData[key], key)
  return incomePercentageChange > 0 ? "text-green-600" : incomePercentageChange === 0 ? "text-blueGray-600" : "text-red-600"
}


export const getIconStyle = (incomeExpenseData, key) => {
  if (!incomeExpenseData) {
    return ""
  }
  const value = parseFloat(incomeExpenseData[key])

  return value > 0 ? "fill-green-600 rotate-0" : value === 0 ? "fill-black rotate-0" : "fill-red-600 rotate-180"
}

export const numberWithSuffix = (value) => {
  const num = Number(value);
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);
  const index = Math.floor(Math.log10(abs) / 3);
  const scaled = abs / Math.pow(10, index * 3);
  const suffix = suffixes[index];
  const formatted = scaled.toFixed(1).replace(/\.0$/, '');
  return num === 0 ? '0' : sign + formatted + suffix;
}

// export const amountFormatter = (amt) => {
//   let num = parseFloat(amt).toFixed(2)
//   if (isNumeric(num)) {
//     let input = parseFloat(num).toFixed(2);
//     var n1, n2;
//     num = num + '' || '';
//     // works for integer and floating as well
//     n1 = num.split('.');
//     n2 = n1[1] || parseFloat(0).toFixed(2).split(".")[1];
//     n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
//     num = n2 ? n1 + '.' + n2 : n1;
//     return num
//   } else {
//     return 0
//   }
// }
export const isNumeric = (num) => ((typeof (num) === 'number') || ((typeof (num) === "string") && (num.trim() !== ''))) && !isNaN(num);

export const amountFormatter = (amount, currency_code) => {
  let locale_currency_code = locale_dict_currency[currency_code] ? locale_dict_currency[currency_code] : 'en_IN';
  let currencyInfo = currencyData.find((item) => item.currency_code === currency_code)
  let currency_symbol = currencyInfo ? currencyInfo.symbol : ''

  const formatterWithoutSymbol = new Intl.NumberFormat(
    locale_currency_code.replace('_', '-'),
    {
      style: 'currency',
      currencyDisplay: "code",
      currency: currency_code,
    });
  let symbol = Number(amount) < 0 ? currency_symbol + ' ' : currency_symbol
  return symbol + formatterWithoutSymbol.format(amount).replace(currency_code, "")
}