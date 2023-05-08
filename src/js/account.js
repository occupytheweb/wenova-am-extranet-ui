import $ from 'jquery';
import {authenticationGuard, changePassword, profile} from "./auth";
import * as store from './store';
import {updateLayoutUi} from "./layout";
import {updateUser, userEmailExists} from "./api-client";
import {showErrorNotification, showSuccessAlert} from "./alerts";
import {updateAvatarWithDetailsFromStore} from './avatar';
import {passwordPassesAllCriteria} from './password-strength.js';


const updateUiWithUserDetailsFromStore = () => {
  const {
    id,
    company,
    firstName,
    lastName,
    email,
    billingEmail,
    address,
    iban,
  } = store.getUserInfo();

  $("#userId").text(id);
  $("#companyName").text(company);

  $("#firstName").val(firstName);
  $("#lastName").val(lastName);
  $("#email").val(email);
  $("#address").val(address);
  $("#billingEmail").val(billingEmail);
  $("#iban").val(iban);
}


$(
  () => {
    updateLayoutUi('account');

    authenticationGuard()
      .then(
        sink => {
          updateUiWithUserDetailsFromStore()

          return sink;
        }
      )
    ;
  }
);


const rehydrateAfterUpdate = () => profile()
  .then(
    sink => {
      updateLayoutUi('account');
      updateUiWithUserDetailsFromStore();
      updateAvatarWithDetailsFromStore();

      return sink;
    }
  )
;


$("#updateUser").submit(
  async (event) => {
    event.preventDefault();

    const { email: currentEmail } = store.getUserInfo();

    const firstName = $("#firstName").val();
    const lastName  = $("#lastName").val();
    const email     = $("#email").val();
    const address   = $("#address").val();


    const emailCheckTask = () => currentEmail !== email
      ? userEmailExists(email)
        .then(
          exists => exists
            ? (() => {
              showErrorNotification("Cet email appartient à un compte existant");

              return Promise.reject("Cet email n'est pas unique");
            })()
            : Promise.resolve()
        )
      : Promise.resolve()
    ;

    await emailCheckTask()
      .then(
        () => updateUser({
          firstName,
          lastName,
          email,
          address
        })
      )
      .then(
        sink => {
          showSuccessAlert("Profil mis à jour");
          rehydrateAfterUpdate();

          return sink;
        }
      )
  }
);


$("#updateBillingInfo").submit(
  async (event) => {
    event.preventDefault();

    const billingEmail = $("#billingEmail").val();
    const iban         = $("#iban").val();

    await updateUser({
      billingEmail,
      iban,
    }).then(
      sink => {
        showSuccessAlert("Détails des borderaux mis à jour");
        rehydrateAfterUpdate();

        return sink;
      }
    )
  }
);


$("#resetPassword").submit(
  async (event) => {
    event.preventDefault();

    const currentPassword      = $("#oldPassword").val();
    const newPassword          = $("#newPassword").val();
    const passwordConfirmation = $("#confirmPassword").val();

    if (!passwordPassesAllCriteria(newPassword)) {
      showErrorNotification("Ce mot de passe ne répond pas aux critères");
      return;
    }

    if (newPassword !== passwordConfirmation) {
      showErrorNotification("Les mots de passe ne correspondent pas");
      return;
    }

    await changePassword({
      currentPassword,
      newPassword,
    })
    .then(
      sink => {
        showSuccessAlert("Mot de passe mis à jour");

        return sink;
      }
    )
  }
);
