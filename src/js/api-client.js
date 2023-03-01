import {API_BASE_URL} from './config';
import {showErrorNotification} from "./alerts";
import {logout} from "./auth";
import * as store from './store';


export const apiUrl = (path) => `${API_BASE_URL}${path}`;


const contentTypeHeader = {
  "Content-Type": "application/json"
};

export const getUnauthenticatedRequestHeaders = () => ({
  ...contentTypeHeader
});
export const getAuthenticatedRequestHeaders = () => ({
  ...contentTypeHeader,
  "Authorization": `Bearer ${store.getToken()}`
});


export const redirectToLoginIfRequestRequiresAuthentication = (response) => response.ok
  ? response
  : response.status === 401
    ? (() => {
      if (!/login/.test(window.location.href)) {
        showErrorNotification("Session expired");
        logout();
      }

      return response.json()
        .then(
          ({message}) => Promise.reject(message)
        )
    })()
    : response
;

export const notifyOnApiError = (response) => response.ok
  ? response
  : (() => {
      return response.json()
        .then(
          ({title, message}) => message ?? title
        )
        .then(
          error => {
            showErrorNotification(error);

            return Promise.reject(error);
          }
        )
  })()
;


export const userEmailExists = (email) => {
  return fetch(
    apiUrl(`/distributors/${email}`), {
      method: "HEAD",
      headers: getAuthenticatedRequestHeaders(),
    }
  ).then(response => response.ok)
}


export const updateUser = (patchPayload) => {
  return fetch(
    apiUrl("/distributors/me"), {
      method: "PUT",
      headers: getAuthenticatedRequestHeaders(),
      body: JSON.stringify(patchPayload),
    }
  ).then(notifyOnApiError)
}


export const fetchSubscriptions = () => fetch(
  apiUrl("/subscriptions?page=1&pageSize=1000"), {
    headers: getAuthenticatedRequestHeaders()
  }
).then(notifyOnApiError)
 .then(response => response.json())
;


export const fetchPayments = () => fetch(
    apiUrl("/payments?page=1&pageSize=1000"), {
      headers: getAuthenticatedRequestHeaders()
    }
  ).then(notifyOnApiError)
    .then(response => response.json())
;
