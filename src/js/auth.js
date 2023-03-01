import {
  apiUrl,
  getAuthenticatedRequestHeaders,
  getUnauthenticatedRequestHeaders,
  notifyOnApiError,
} from './api-client';
import {showErrorNotification} from './alerts';
import * as store from './store';


const userProfileMapper = (rawUser) => {
  const {
    id_dist: id,
    Raison_sociale: company,
    first_name: firstName,
    last_name: lastName,
    email_signataire: email,
    email_compta: billingEmail,
    address,
    IBAN: iban,
  } = rawUser;

  return {
    ...rawUser,
    id,
    company,
    firstName,
    lastName,
    email,
    billingEmail,
    address,
    iban
  };
};



export const logout = () => {
  store.clear();
  window.location.href = "/login.html";
}


export const authenticate = async (credentials) => {
  const {email, password} = credentials;

  return fetch(
    apiUrl("/auth/token"), {
      method: "post",
      headers: getUnauthenticatedRequestHeaders(),
      body: JSON.stringify({
        email,
        password
      })
    }
  );
};


export const profile = async () => {
  return fetch(
    apiUrl("/distributors/me"), {
      headers: getAuthenticatedRequestHeaders()
    },
  ).then(
    response => response.ok
      ? response.json()
      : (() => {
        if (!/login/.test(window.location.href)) {
          showErrorNotification("Session expired");
          logout();
        }

        return response.json()
          .then(
            ({message}) => Promise.reject(message)
          )
      })()
  ).then(
    userInfo => {
      store.saveUserInfo(
        userProfileMapper(userInfo)
      );

      return userInfo;
    }
  );
}


export const changePassword = async (payload) => {
  const {
    currentPassword,
    newPassword
  } = payload;

  return fetch(
    apiUrl("/users/me"), {
      method: "PUT",
      headers: getAuthenticatedRequestHeaders(),
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    },
  ).then(notifyOnApiError);
}


export const authenticationGuard = async () => profile();
