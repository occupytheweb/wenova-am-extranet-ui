// CONSTANTS
const TOKEN = "token";
const BASE_URL = "http://localhost:4000/";
const ENDPOINTS = {
  SIGN_IN: "login",
  UPDATE_USER: "updateUser",
  CHANGE_PASSWORD: "changepassword",
  UPDATE_BILLING_INFO: "updateBillingInfo",
  USER_INFO: "user",
  SUBSCRIPTION: "subscriptions",
  PAYMENTS: "payments",
};
const EMAIL_VALIDATION_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
let PAYMENTS = [];
let SUBSCRIPTIONS = [];
let email_signataire = null;

//LOCAL STORAGE UTILS FOR TOKEN
function saveToken(token) {
  localStorage.setItem(TOKEN, JSON.stringify(token));
}

function getToken() {
  return JSON.parse(localStorage.getItem(TOKEN));
}

function removeToken() {
  localStorage.removeItem(TOKEN);
}

//FUNCTIONS TO CREATE TABLE ENTRIES
function createPaymentsRows(item) {
  return `
          <tr>
            <td>${item.slip_no || "--"}</td>
            <td>${item.release_date || "--"}</td>
            <td>${item.periode || "--"} €</td>
            <td>${item.total || "--"}</td>
            <td>${item.payment_date || "--"}</td>
            <td><a href="#">${item.urlPdf || "--"}</a></td>
          </tr>`;
}

function createSubscriptionsRows(item) {
  return `
          <tr>
            <td>${item.Investisseur}</td>
            <td>${item.Produit}</td>
            <td>${item.Montant} €</td>
            <td>${item.Date}</td>
            <td>${item.Num_ODDO}</td>
            <td><a href="#">${item.attestation}</a></td>
          </tr>`;
}

//SHOW TOAST
function showToast(message, error){
  if (error)
    $("#liveToast").addClass("bg-danger");
  else
    $("#liveToast").addClass("bg-white");

  $("#toastBody").html(message);
  $("#liveToast").toast("show");
}

function handleToast(data){
  showToast(data.msg, data.statusCode != 200);
}

//CLIENT FOR APIS CALLS
async function client(endpoint, method = "GET", data) {
  const token = await getToken();
  return await fetch(BASE_URL + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}

//MOBILE-MENU
jQuery("button.navbar-toggle").click(function () {
  jQuery("body").toggleClass("nav-open");
  jQuery("html").toggleClass("overflow-hidden");
});

// APIs CALLS
$("#login").submit(async (event) => {
  event.preventDefault();
  const userName = $("#username").val();
  const password = $("#password").val();

  client(
    ENDPOINTS.SIGN_IN,
    "POST",
    JSON.stringify({
      email_signataire: userName,
      password,
    })
  )
    .then((data) => {
      handleToast(data);
      if (data.statusCode == 200) {
        const { accessToken } = data;
        saveToken(accessToken);
        goTo("account.html");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

$("#updateUser").submit(async (event) => {
  event.preventDefault();
  const first_name = $("#firstName").val();
  const last_name = $("#lastName").val();
  const email_signataire_new = $("#email").val();
  const address = $("#address").val();
  client(
    ENDPOINTS.UPDATE_USER,
    "PUT",
    JSON.stringify({
      email_signataire_new,
      last_name,
      first_name,
      address,
    })
  )
    .then((data) => {
      handleToast(data);
      console.log("data", data);
      if (email_signataire_new != email_signataire) logout();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

$("#resetPassword").submit(async (event) => {
  event.preventDefault();
  const old_password = $("#oldPassword").val();
  const new_password = $("#newPassword").val();

  client(
    ENDPOINTS.CHANGE_PASSWORD,
    "POST",
    JSON.stringify({
      old_password,
      new_password,
    })
  )
    .then((data) => {
      handleToast(data);
      console.log("data", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

$("#updateBillingInfo").submit(async (event) => {
  event.preventDefault();
  const iban = $("#iban").val();
  client(
    ENDPOINTS.UPDATE_BILLING_INFO,
    "POST",
    JSON.stringify({
      iban,
    })
  )
    .then((data) => {
      handleToast(data);
      console.log("data", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

//HYDRATIONS OF DATA

async function getUserInfo() {
  client(ENDPOINTS.USER_INFO)
    .then(({ user }) => {
      email_signataire = user.email_signataire;
      $("#firstName").val(user.first_name);
      $("#lastName").val(user.last_name);
      $("#email").val(user.email_signataire);
      $("#address").val(user.address);
      $("#userEmail").val(user.email_signataire);
      $("#billingEmail").val(user.email_signataire);
      $("#iban").val(user.iban);
      $("#userName").html(`${user.first_name} ${user.last_name}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getSubscriptionList() {
  client(ENDPOINTS.SUBSCRIPTION)
    .then(({ data }) => {
      SUBSCRIPTIONS = data;
      $("#subscriptions").html(data?.map(createSubscriptionsRows));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getPayments() {
  client(ENDPOINTS.PAYMENTS)
    .then(({ data }) => {
      PAYMENTS = data;
      $("#payments").html(data?.map(createPaymentsRows));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//FILTERS ON TABLES

function filterPayments(year) {
  if (year == "Select a year" || year == "Sélectionner une année") {
    $("#payments").html(PAYMENTS?.map(createPaymentsRows));
  } else {
    $("#payments").html(
      PAYMENTS?.filter((payment) => payment.periode.includes(year))?.map(
        createPaymentsRows
      )
    );
  }
}

function filterSubscriptions(fund) {
  if (fund == "Select a fund" || fund == "Sélectionner un fonds") {
    $("#subscriptions").html(SUBSCRIPTIONS?.map(createSubscriptionsRows));
  } else {
    $("#subscriptions").html(
      SUBSCRIPTIONS?.filter((subscription) =>
        subscription.Fonds.includes(fund)
      )?.map(createSubscriptionsRows)
    );
  }
}

$("#years-selector").change(function () {
  filterPayments($("#years-selector").val());
});

$("#fund-selector").change(function () {
  filterSubscriptions($("#fund-selector").val());
});

// UTILS

function goTo(href) {
  window.location.href = href;
}
function logout() {
  removeToken();
  goTo("login.html");
}

$("#disconnect").click(logout);

//VALIDATIONS
$("#newPassword, #confirmPassword").on("keyup", function () {
  $("#confirmPassword")
    .get(0)
    .setCustomValidity(
      $("#newPassword").val() != $("#confirmPassword").val()
        ? "Passwords didn't match"
        : ""
    );
});

$("#email").on("keyup", email_validator);
$("#billingEmail").on("keyup", email_validator);

function email_validator(event) {
  $("#" + event.target.id)
    .get(0)
    .setCustomValidity(
      EMAIL_VALIDATION_PATTERN.test($("#" + event.target.id).val())
        ? ""
        : "Invalid Email Address"
    );
}

//DOCUEMET ON LOAD ACTIONS
$(document).ready(function () {
  getUserInfo();
  if (window.location.pathname.includes("list-of-subscribers.html")) {
    getSubscriptionList();
  }
  if (window.location.pathname.includes("payment-tracking.html")) {
    getPayments();
  }
});
