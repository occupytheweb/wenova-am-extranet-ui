import {
  passwordPassesAllCriteria,
  updatePasswordCriteria,
  updatePasswordFeedback,
  updatePasswordStrengthMeter
} from "../password-strength.js";
import {showErrorNotification, showSuccessAlert} from "../alerts.js";
import {resetForgottenPassword} from "../api-client.js";


const passwordResetForm   = document.getElementById("reset-forgotten-password-form");
const emailInput          = document.getElementById("reset-password-email");
const newPasswordInput    = document.getElementById("reset-password");
const confirmPasswordInput= document.getElementById("confirm-reset-password");
const evaluationContainer = document.getElementById("password-evaluation-report-container");
const warningContainer    = document.getElementById("password-warning");
const suggestionContainer = document.getElementById("password-recommendation");
const strengthMeter       = document.getElementById("password-strength-meter");


const extractIdentifiersFromUrl = () => {
  const urlParams       = new URLSearchParams(window.location.search);
  const base64EncodedId = urlParams.get("id");
  const uriEncodedId    = atob(base64EncodedId);
  const decodedId       = decodeURIComponent(uriEncodedId);

  const idComponents = new URLSearchParams(decodedId);

  const email = idComponents.get("email");
  const otp   = idComponents.get("otp");

  return {
    email,
    otp,
  };
};


document.addEventListener(
  "DOMContentLoaded",
  () => {
    const { email } = extractIdentifiersFromUrl();

    emailInput.value = email;
  }
);


newPasswordInput.addEventListener(
  "input",
  (event) => {
    const password = event.target.value;

    updatePasswordCriteria(password);
    updatePasswordStrengthMeter(
      password,
      strengthMeter
    );
    updatePasswordFeedback(
      password,
      evaluationContainer,
      warningContainer,
      suggestionContainer,
    );
  },
  false
);


const invalidResetLinkId = "Ce lien de réinitialisation de mot de passe est invalide";


passwordResetForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const {
      email,
      otp,
    } = extractIdentifiersFromUrl();

    if (!email) {
      showErrorNotification(invalidResetLinkId);
      return;
    }
    if (!otp) {
      showErrorNotification(invalidResetLinkId);
      return;
    }

    const newPassword          = newPasswordInput.value;
    const passwordConfirmation = confirmPasswordInput.value;

    if (!passwordPassesAllCriteria(newPassword)) {
      showErrorNotification("Ce mot de passe ne répond pas aux critères");
      return;
    }

    if (newPassword !== passwordConfirmation) {
      showErrorNotification("Les mots de passe ne correspondent pas");
      return;
    }

    await resetForgottenPassword(
      email,
      otp,
      newPassword,
    ).then(
      async (res) => {
        console.error(`RESET`, res);
        await showSuccessAlert(
          "Mot de passe changé avec succès",
        ).then(
          () => {
            window.location.href = "/";
          }
        );
      }
    );
  }
);
