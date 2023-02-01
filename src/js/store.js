const keys = {
  token:    "token",
  userInfo: "user-info"
}


export const saveToken = (token) => {
  localStorage.setItem(
    keys.token,
    token
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


export const clear = () => {
  Object.keys(keys)
    .forEach(
      key => localStorage.removeItem(key)
    )
  ;
}
