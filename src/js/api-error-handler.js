import {showErrorNotification, showOverlay} from "./alerts.js";
import {logout} from "./auth.js";


const responseIsJson = (response) => {
  const contentType = response.headers.get("content-type");

  return contentType && contentType.includes("application/json");
};

const hasSessionExpired = (response) => (
  response.status === 401
  && !/login/.test(window.location.href)
);
const handleExpiredSession = () => {
  showOverlay(
    "Session expired",
    {
      buttonText: "Login",
      callback: () => logout()
    }
  );
}


const errorMappingPipelines = [
  {
    canMapResponse: responseIsJson,
    mapToErrorMessage: (response) => response.json()
      .then(
        ({title, message}) => message ?? title
      )
  },
  {
    canMapResponse: () => true,
    mapToErrorMessage: (response) => response.text()
      .then(
        (errorMessage) => errorMessage
      )
  },
];


const errorNotifyingPipelines = [
  {
    canHandle: hasSessionExpired,
    notify: (errorMessage) => {
      showOverlay(
        "Session expired",
        {
          buttonText: "Login",
          callback: () => logout()
        }
      )
    }
  },
  {
    canHandle: () => true,
    notify: (errorMessage) => {
      showErrorNotification(errorMessage);
    },
  }
];


export const notifyOnApiError = (response) => response.ok
  ? response
  : (() => {

    const errorMapper = errorMappingPipelines
      .find(mapper => !!mapper.canMapResponse(response))
    ;

    return errorMapper.mapToErrorMessage(response)
      .then(
        errorMessage => {
          errorNotifyingPipelines
            .find(notifier => notifier.canHandle(response))
            .notify(errorMessage)
          ;

          return Promise.reject(errorMessage);
        }
      )
  })()
;


export const handleApiConnectionError = (error) => {
  showOverlay(
    "Connection to server failed. Please contact the administrator",
  );

  throw error;
};
