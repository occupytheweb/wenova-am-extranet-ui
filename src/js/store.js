import { DateTime } from "luxon";


export const keys = {
  token:     "token",
  userInfo:  "user-info",
  loginTime: "login-time",
}


export const saveToken = (token) => {
  localStorage.setItem(
    keys.token,
    token
  );

  localStorage.setItem(
    keys.loginTime,
    DateTime.now().toISOTime()
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



export const clear = () => {
  Object.values(keys)
    .forEach(
      key => localStorage.removeItem(key)
    )
  ;
}
