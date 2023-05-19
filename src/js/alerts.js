import * as notie from 'notie';
import Swal from 'sweetalert2';


export const defaultNotificationOptions = {
  position: "bottom",
};



export const showErrorNotification = (message, options = {}) => {
  notie.alert({
    text: message,
    type: "error",
    ...defaultNotificationOptions,
    ...options,
  });
}


export const showOverlay = (message, options = {}) => {
  notie.force({
    text: message,
    type: "error",
    ...defaultNotificationOptions,
    ...options,
  })
}


export const showSuccessAlert = (message, options = {}) => {
  return Swal.fire({
    text: message,
    icon: "success",
    ...options
  });
}
