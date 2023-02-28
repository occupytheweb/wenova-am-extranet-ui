// CONSTANTS
const TOKEN = "token";
const BASE_URL = "https://wenova-api.occupytheweb.io";
const ENDPOINTS = {
  SIGN_IN: "/auth/token",
  UPDATE_USER: "/updateUser",
  CHANGE_PASSWORD: "/changepassword",
  UPDATE_BILLING_INFO: "/updateBillingInfo",
  USER_INFO: "/distributors/me",
  SUBSCRIPTION: "/subscriptions",
  PAYMENTS: "/payments",
};
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
            <td>${item.note_id || "--"}</td>
            <td>${item.note_date || "--"}</td>
            <td>${item.periode || "--"} €</td>
            <td>${item.total || "--"}</td>
            <td>${item.note_date || "--"}</td>
            <td><a href="#">${item.urlPdf || "--"}</a></td>
          </tr>`;
}

function createSubscriptionsRows(item) {
  return `
          <tr>
            <td>${item.Investisseur}</td>
            <td>${item.Produit}</td>
            <td>${item.Montant} €</td>
            <td>${item['Date BS']}</td>
            <td>${item['Num ODDO']}</td>
            <td><a href="#">${item['Attestation_ODDO']}</a></td>
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

async function login(data) {
    return fetch(
        BASE_URL + ENDPOINTS.SIGN_IN,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        })
    ;
}


async function me() {
    const token = await getToken();

    return fetch(
        BASE_URL + ENDPOINTS.USER_INFO,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },
    ).then(
        response => response.ok
            ? response.json()
            : (() => {
                if (!/login/.test(window.location.href)) {
                    showToast("Session expired", true);
                    logout();
                }

                return response.json()
                    .then(
                        ({ message }) => Promise.reject(message)
                    )
            })()
    );
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
  const email    = $("#email").val();
  const password = $("#password").val();

  await login(
      JSON.stringify({
          email,
          password
      })
  ).then(
      response => {
          return response.ok
              ? response.json()
                    .then(
                        data => {
                            const { token } = data;
                            saveToken(token);
                            goTo("account.html");

                            return data;
                        }
                    )
              : response.json()
                  .then(
                      data => {
                          const { title: msg } = data;

                          handleToast({ msg });

                          return data;
                      }
                  )
          ;
      }
  )
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
    console.log("Getting user info");
  await me()
    .then(
        user => {
          email_signataire = user.email_signataire;
          $("#firstName").val(user.first_name);
          $("#lastName").val(user.last_name);
          $("#email").val(user.email_signataire);
          $("#address").val(user.address);
          $("#userEmail").val(user.email_signataire);
          $("#billingEmail").val(user.email_signataire);
          $("#iban").val(user.iban);
          $("#userName").html(`${user.first_name} ${user.last_name}`);

          return user;
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


//DOCUEMET ON LOAD ACTIONS
$(document).ready(async () => {
  await getUserInfo();
  if (window.location.pathname.includes("list-of-subscribers.html")) {
    getSubscriptionList();
  }
  if (window.location.pathname.includes("payment-tracking.html")) {
    getPayments();
  }
});
