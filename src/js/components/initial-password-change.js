import $ from 'jquery';
import {passwordRequiresChange} from '/js/auth.js';
import {
  updatePasswordCriteria,
  updatePasswordFeedback,
  updatePasswordStrengthMeter
} from "/js/password-strength.js";
import {passwordPassesAllCriteria} from "../password-strength.js";
import {showErrorNotification, showSuccessAlert} from "../alerts.js";
import {logout, setInitialPassword} from "../auth.js";


$(
  () => passwordRequiresChange()
    .then(
      requiresChange => !requiresChange
        ? (_ => {
          showErrorNotification("Mot de passe initial déjà configuré");
          window.location.href = "/";

          return _;
        })()
        : true
    )
);

const newPasswordInput    = document.getElementById("initial-password");
const evaluationContainer = document.getElementById("password-evaluation-report-container");
const warningContainer    = document.getElementById("password-warning");
const suggestionContainer = document.getElementById("password-recommendation");
const strengthMeter       = document.getElementById("password-strength-meter");

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


$("#initial-password-form").on(
  "submit",
  async (event) => {
    event.preventDefault();

    const newPassword          = $("#initial-password").val();
    const passwordConfirmation = $("#confirm-password").val();

    if (!passwordPassesAllCriteria(newPassword)) {
      showErrorNotification("Ce mot de passe ne répond pas aux critères");
      return;
    }

    if (newPassword !== passwordConfirmation) {
      showErrorNotification("Les mots de passe ne correspondent pas");
      return;
    }

    await setInitialPassword({
      initialPassword: newPassword,
    }).then(
      sink => {
        showSuccessAlert("Mot de passe initial configuré")
          .then(
            () => {
              window.location.href = "/";
            }
          )
        ;

        return sink;
      }
    )
  }
);

$("#logout").on(
  "click",
  () => {
    logout();
  }
)
