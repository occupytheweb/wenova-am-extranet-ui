import {API_BASE_URL} from './config';
import * as store from './store';
import {handleApiConnectionError, notifyOnApiError} from "./api-error-handler.js";


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


/**
 * Instrumented {@link fetch} pre-configured to handle API errors.
 *
 * @param {RequestInfo | URL} input      request URL
 * @param {RequestInit}       [init={}]  request properties
 *
 * @return {Promise<Response>}
 */
export const instrumentedFetch = (
  input,
  init = {}
) => fetch(
  input,
  init
)
  .catch(handleApiConnectionError)
  .then(notifyOnApiError)
;


export const userEmailExists = (email) => {
  return instrumentedFetch(
    apiUrl(`/distributors/${email}`), {
      method: "HEAD",
      headers: getAuthenticatedRequestHeaders(),
    }
  ).then(response => response.ok)
}


export const updateUser = (patchPayload) => {
  return instrumentedFetch(
    apiUrl("/distributors/me"), {
      method: "PUT",
      headers: getAuthenticatedRequestHeaders(),
      body: JSON.stringify(patchPayload),
    }
  );
}


export const fetchSubscriptions = () => instrumentedFetch(
  apiUrl("/subscriptions?page=1&pageSize=1000"), {
    headers: getAuthenticatedRequestHeaders()
  }
).then(response => response.json());


export const fetchPayments = () => instrumentedFetch(
  apiUrl("/payments?page=1&pageSize=1000"), {
    headers: getAuthenticatedRequestHeaders()
  }
).then(response => response.json());
