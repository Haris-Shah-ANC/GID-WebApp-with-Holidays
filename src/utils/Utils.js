import moment from 'moment';
import queryString from 'query-string';
import { toast } from 'react-toastify';

export const notifyInfoMessage = (message) => toast.info(message);
export const notifyErrorMessage = (message) => toast.error(message);
export const notifySuccessMessage = (message) => toast.success(message);
export const notifyWarningMessage = (message) => toast.warning(message);


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


export const startOfCurrentMonth = (requireFormat) => { return formatDate(moment().startOf("month"), requireFormat)}

export const endOfCurrentMonth = (requireFormat) => { return formatDate(moment().endOf("month"), requireFormat) }

export const startOfPrevMonth = (requireFormat) => { return moment(subtractByMonth()).startOf('month').format(requireFormat) }

export const endOfPrevMonth = (requireFormat) => { return moment(subtractByMonth()).endOf('month').format(requireFormat) }

export const getDateRange = (type, requireFormat, timeOn) => {
  console.log(type, requireFormat, timeOn)
  if(type === "previous month"){
    return timeOn==="start" ? startOfPrevMonth(requireFormat) : endOfPrevMonth(requireFormat) 
  }else if(type === "current month"){
    return timeOn==="start" ? startOfCurrentMonth(requireFormat) : endOfCurrentMonth(requireFormat) 
  }
}