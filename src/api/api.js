import fileDownload from 'js-file-download';
import { getAccessToken, clearCookie } from "../config/cookiesInfo";
import * as Actions from '../state/Actions'
import { isAPISuccess, isBusinessUnauthorized, isUnAuthorized, isUrlNotFound, isInternalServerError, isBadRequest } from '../utils/Utils';

export async function apiAction({ url, method = 'get', data = null, onError = () => { }, dispatch }) {
  // if(dispatch){
    // dispatch(Actions.stateChange("loader", true))
  // }
  // console.log("ACCESS TOKEN",getAccessToken())
  let options = {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}`
    }
  }
  if (method.toLowerCase() === "get") {
    delete options["body"]
  }
  try {
    let response = await fetch(url, options)
    if(!response){
      return {success: false, status: "Something went wrong."}
    }

    let status = response.status
    if (isAPISuccess(status)) {
      // if(dispatch){
      //   dispatch(Actions.stateChange("loader", false))
      // }
      
      let data = await response.json()

      if (isBusinessUnauthorized(data.status)) {
        clearCookie();
        // notifyErrorMessage(data.status);
        return { success: false };
      } else {
        return data
      }
    } else if (isUnAuthorized(status)) {
      clearCookie();
      // notifyErrorMessage(`Your session has expired`)
      return { success: false };
    } else if (isUrlNotFound(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isInternalServerError(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isBadRequest(status)) {
      // notifyErrorMessage(`Please check your internet connection`)
      return { success: false };
    }
  } catch (error) {
    
    onError(error)
  }
}

export async function apiAction_social({ url, method = 'get', data = null, onError = () => { } }) {
  let options = {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  }
  if (method.toLowerCase() === "get") {
    delete options["body"]
  }
  try {
    let response = await fetch(url, options)

    let status = response.status
    if (isAPISuccess(status)) {
      let data = await response.json()

      if (isBusinessUnauthorized(data.status)) {
        clearCookie();
        // notifyErrorMessage(data.status);
        return { success: false };

      } else {
        return data
      }
    } else if (isUnAuthorized(status)) {
      clearCookie();
      // notifyErrorMessage(`Your session has expired`)
      return { success: false };
    } else if (isUrlNotFound(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isInternalServerError(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isBadRequest(status)) {
      // notifyErrorMessage(`Please check your internet connection`)
      return { success: false };
    }
  } catch (error) {
    console.log('api_Action :', error)
    onError(error)
  }
}

export async function apiActionFormData({ url, method = 'post', data }) {
  var formData = new FormData();
  for (var key in data) {
    if (data[key] && data[key].constructor === [].constructor) {
      // eslint-disable-next-line 
      data[key].map(function (id) {
        formData.append(key, id)
        return undefined
      })
    } else {
      formData.append(key, data[key])
    }
  }

  let options = {
    body: formData,
    method: method,
    headers: {
      "Authorization": `Bearer ${getAccessToken()}`
    }
  }

  try {
    let response = await fetch(url, options);

    let status = response.status
    if (isAPISuccess(status)) {
      let data = await response.json()

      if (isBusinessUnauthorized(data.status)) {
        clearCookie();
        // notifyErrorMessage(data.status);
        return { success: false };

      } else {
        return data
      }
    } else if (isUnAuthorized(status)) {
      clearCookie();
      // notifyErrorMessage(`Your session has expired`)
      return { success: false };
    } else if (isUrlNotFound(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isInternalServerError(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isBadRequest(status)) {
      // notifyErrorMessage(`Please check your internet connection`)
      return { success: false };
    }
  } catch (error) {
    console.log("error response",  error.message);

  }
}

export async function apiFormData({ url, method = 'post', data, file_key = "attachment", file_name = 'signature' }) {
  var formData = new FormData();
  if (data[file_key]) {
    if (data[file_key] && typeof (data[file_key]) !== "string") {
      formData.append(file_key, data[file_key])
    }
  }
  if (data[file_name]) {
    if (data[file_name] && typeof (data[file_name]) !== "string") {
      formData.append(file_name, data[file_name])
    }
  }
  data[file_key] = (typeof (data[file_key]) === "string" && data[file_key]) ? data[file_key] : null
  data[file_name] = (typeof (data[file_name]) === "string" && data[file_name]) ? data[file_name] : null
  formData.append("data", JSON.stringify(data))
  formData.append("business_id", data['business_id'])


  let options = {
    body: formData,
    method: method,
    headers: {
      "Authorization": `Bearer ${getAccessToken()}`
    }
  }

  try {
    let response = await fetch(url, options);

    let status = response.status
    if (isAPISuccess(status)) {
      let data = await response.json()

      if (isBusinessUnauthorized(data.status)) {
        clearCookie();
        // notifyErrorMessage(data.status);
        return { success: false };

      } else {
        return data
      }
    } else if (isUnAuthorized(status)) {
      clearCookie();
      // notifyErrorMessage(`Your session has expired`)
      return { success: false };
    } else if (isUrlNotFound(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isInternalServerError(status)) {
      // notifyErrorMessage(`Something went wrong`)
      return { success: false };
    } else if (isBadRequest(status)) {
      // notifyErrorMessage(`Please check your internet connection`)
      return { success: false };
    }
  } catch (error) {
    console.log("error response", error.message);

  }
}

export async function apiBlobResponse({ url, method = 'POST', data, onSuccess }) {
  data['export_type'] = 'pdf';
  data['payment_term_id'] = data.payment_term;
  data['terms_and_conditions_id'] = data.terms_and_conditions;

  fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}`
    }
  })
    .then((response) => response.blob())
    .then((res) => {

      const file = res
      const fileURL = URL.createObjectURL(file);
      onSuccess()
      window.open(fileURL);

    })
    .catch((err) => {
      console.log(err.message);
    });
}


export async function apiHandleDownload({ url, method = 'POST', data, filename, formate = '.pdf', onSuccess }) {
  data['export_type'] = 'pdf';
  data['payment_term_id'] = data.payment_term;
  data['terms_and_conditions_id'] = data.terms_and_conditions;


  let options = {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}`
    }
  }
  if (method.toLowerCase() === "get") {
    delete options["body"]
  }
  try{
    fetch(url, options)
    .then((response) => response.blob())
    .then((res) => {

      const file = res
      fileDownload(file, `${filename}` + formate)
      onSuccess()

    })
    .catch((err) => {
      console.log(err.message);
    });
  }catch(error){
    console.log(error.message);
  }

 
}