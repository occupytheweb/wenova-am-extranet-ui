import { DateTime } from "luxon";


export const keys = {
  token:     "token",
  userInfo:  "user-info",
  loginTime: "login-time",
  state:     "state",
}


export const saveToken = (token) => {
  localStorage.setItem(
    keys.token,
    token
  );

  localStorage.setItem(
    keys.loginTime,
    DateTime.now().toISO()
  );
}

export const getToken = () => localStorage.getItem(keys.token);


export const saveUserInfo = (userInfo) => {
  localStorage.setItem(
    keys.userInfo,
    JSON.stringify(userInfo)
  )
}

export const getUserInfo = () => JSON
  .parse(
    localStorage.getItem(keys.userInfo) || "{}"
  )
;


export const getLoginTime = () => DateTime
  .fromISO(
    localStorage.getItem(keys.loginTime)
  )
;


export const getState = () => JSON
  .parse(
    localStorage.getItem(keys.state) || "{}"
  )
;


export const setState = (state) => localStorage
  .setItem(
    keys.state,
    JSON.stringify(state)
  )
;


export const clear = () => {
  Object.values(keys)
    .forEach(
      key => localStorage.removeItem(key)
    )
  ;
}
