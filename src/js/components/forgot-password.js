import $ from 'jquery';
import {showErrorNotification, showSuccessAlert,} from '../alerts.js';
import {sendForgotPasswordEmail, userEmailExists,} from '../api-client.js';


const params = new URLSearchParams(window.location.search);
const hasOtp = params.has("id");

const containerDetails = {
  email: {
    containerId: "email-otp-form",
    messageId:   "email-message",
  },
  password: {
    containerId: "reset-forgotten-password-form",
    messageId:   "password-message",
  },
  checkEmail: {
    containerId: "check-email-text",
    messageId:   "check-email-address",
  },
};
const ids = {
  backButton:          "back-to-reset",
  delayButton:         "delay-button",
  validateEmailButton: "validate-email",
  delayNumber:         "mail-delay-seconds",
};

const validateEmailButton = document.getElementById(ids.validateEmailButton);
const delayButton         = document.getElementById(ids.delayButton);
const delayNumber         = document.getElementById(ids.delayNumber);


$(
  () => {
    document.body.dataset.target = hasOtp
      ? "password"
      : "email"
    ;
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


const stopDelay = (intervalHandle) => {
  window.clearInterval(intervalHandle);

  validateEmailButton.style.display = "inline-block";
  delayButton.style.display         = "none";
  delayNumber.textContent           = "";
};


const showDelay = () => {
  validateEmailButton.style.display = "none";
  delayButton.style.display         = "inline-block";

  let counter = 60;
  const countdownIntervalHandle = setInterval(
    () => {
      delayNumber.textContent = `${counter}`;

      --counter;
      if (counter === 0) {
        stopDelay(countdownIntervalHandle);
      }
    },
    1000
  );
};


const showCheckEmailMessage = (email) => {
  const checkEmailContainer = document.getElementById(containerDetails.checkEmail.containerId);
  const checkEmailMessage   = document.getElementById(containerDetails.checkEmail.messageId);

  checkEmailContainer.style.display = "inline-block";
  checkEmailMessage.innerHTML       = `'${email}'`;
};


const resetEmailSentMessage = `
  Vérifiez votre boite mail pour les instructions de réinitialisation de votre mot de passe.
`;


$(`#${containerDetails.email.containerId}`).on(
  "submit",
  async (event) => {
    event.preventDefault();

    const email        = document.getElementById("email").value;
    const encodedEmail = encodeURIComponent(email);

    await userEmailExists(encodedEmail)
      .then(
        emailExists => emailExists
          ? (
              () => sendForgotPasswordEmail(email)
                .then(
                  async () => {
                    showDelay();
                    showCheckEmailMessage(email);
                    await showSuccessAlert(
                      resetEmailSentMessage,
                      {
                        title: "Email envoyé"
                      }
                    );
                  }
                )
                .catch(
                  async (error) => {
                    await showErrorNotification(
                      "Echec de l'envoi du courriel. Veuillez réessayer plus tard",
                    );

                    console.error(`Email sending failed`, error);
                  }
                )
            )()
          : (
            async () => {
              await showErrorNotification(
                "Cette adresse email est inconnue",
              );
            }
          )()
      )
    ;
  }
);
