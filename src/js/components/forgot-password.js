import $ from 'jquery';

const params = new URLSearchParams(window.location.search);
const hasOtp = params.has("otp");

const containerDetails = {
  email: {
    containerId: "email-otp-form",
    messageId:   "email-message",
  },
  password: {
    containerId: "initial-password-form",
    messageId:   "password-message",
  }
};

$(
  () => {
    const targetContainerDetails = hasOtp
      ? containerDetails.password
      : containerDetails.email
    ;

    const container = document.getElementById(targetContainerDetails.containerId);
    const message   = document.getElementById(targetContainerDetails.messageId);

    container.style.display = "block";
    message.style.display   = "block";
  }
);
